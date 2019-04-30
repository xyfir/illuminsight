import { Insightful } from 'types/insightful';
import { countWords } from 'lib/count-words';
import { nodeToAst } from 'lib/node-to-ast';
import * as archiver from 'archiver';
import { Calibre } from 'node-calibre';
import { resolve } from 'path';
import { Extract } from 'unzipper';
import { pandoc } from 'lib/pandoc';
import { JSDOM } from 'jsdom';
import {
  createWriteStream,
  createReadStream,
  ReadStream,
  writeJSON,
  writeFile,
  readFile,
  remove,
  mkdir,
  move
} from 'fs-extra';

const calibre = new Calibre({ log: process.enve.NODE_ENV == 'development' });

export async function convert({
  file,
  link,
  text
}: {
  file?: string;
  link?: string;
  text?: string;
}): Promise<ReadStream> {
  // Save to .txt file
  if (text) {
    file = resolve(process.enve.TEMP_DIR, `${Date.now()}.txt`);
    await writeFile(file, text);
    text = undefined;
  }

  // Create EPUB from webpage
  if (link) {
    // Set file and directory paths we'll use later
    const webpageDirectory = resolve(
      process.enve.TEMP_DIR,
      `webpage-${Date.now()}`
    );
    const webpageImgDirectory = resolve(webpageDirectory, 'images');
    const markdownFile = resolve(webpageDirectory, 'index.md');
    const htmlFile = resolve(webpageDirectory, 'index.html');

    // Pandoc converts page to CommonMark-raw_html to discard unwanted elements
    await pandoc({
      'extract-media': webpageImgDirectory,
      output: markdownFile,
      input: link,
      from: 'html',
      to: 'commonmark-raw_html'
    });

    // Convert Markdown back to HTML
    await pandoc({
      output: htmlFile,
      input: markdownFile,
      from: 'commonmark',
      to: 'html'
    });

    // Convert HTML to EPUB
    file = resolve(process.enve.TEMP_DIR, `${Date.now()}.epub`);
    await pandoc({ output: file, input: htmlFile, from: 'html', to: 'epub' });

    // Delete webpage directory
    await remove(webpageDirectory);
  }

  if (!file) throw new Error('Bad or missing input');

  // Convert to EPUB
  // Even if already an EPUB, it will validate and rebuild as we expect it
  const originalFile = file;
  file = await calibre.ebookConvert(file, 'epub');

  // Extract files from EPUB
  const epubDirectory = resolve(process.enve.TEMP_DIR, `unzip-${Date.now()}`);
  await new Promise(resolve =>
    createReadStream(file as string).pipe(
      Extract({ path: epubDirectory }).on('close', resolve)
    )
  );

  // Delete converted EPUB file and original source
  await remove(originalFile);
  await remove(file);

  // Parse OPF with jsdom
  const opfDom = new JSDOM(
    await readFile(resolve(epubDirectory, 'content.opf')),
    { contentType: 'text/xml' }
  );
  const opfDoc = opfDom.window.document;

  // Create directories for unzipped astpub
  const astpubDirectory = resolve(
    process.enve.TEMP_DIR,
    `astpub-${Date.now()}`
  );
  const astpubImgDirectory = resolve(astpubDirectory, 'images');
  await mkdir(astpubDirectory);
  await mkdir(astpubImgDirectory);

  // Hash map for item id->href
  const idToHref: { [id: string]: string } = {};

  // Relative file path/name for cover image
  const covers: { id1?: string; id2?: string; href?: string } = {};
  let cover: Insightful.Entity['cover'];

  // How many words are in the content
  let words = 0;

  // Loop through package>manifest>item elements
  for (let item of opfDoc.getElementsByTagName('item')) {
    const mediaType = item.getAttribute('media-type');
    const href = item.getAttribute('href');
    const id = item.getAttribute('id');
    if (!mediaType || !href || !id) continue;

    idToHref[id] = href;

    // Move images from EPUB directory to astpub directory
    if (mediaType.startsWith('image/')) {
      await move(
        resolve(epubDirectory, href),
        resolve(astpubImgDirectory, href)
      );

      // Search for href of cover image
      if (!cover) {
        // Guaranteed to be cover image
        const properties = item.getAttribute('properties');
        if (properties == 'cover-image') cover = href;
        // Most likely the cover but a guaranteed option may still be available
        else if (id == 'cover') covers.id1 = href;
        else if (id == 'ci') covers.id2 = href;
        else if (href.startsWith('cover')) covers.href = href;
      }
    }
    // Convert XHTML to our JSON via jsdom
    if (/xhtml|html|xml/.test(mediaType)) {
      // Read file
      const xhtmlDom = new JSDOM(await readFile(resolve(epubDirectory, href)), {
        contentType: 'text/xml'
      });
      const xhtmlDoc = xhtmlDom.window.document;

      // Check for body element since document could be XML (like toc.ncx)
      if (!xhtmlDoc.body) continue;

      // Convert document starting at body to AST
      const ast = nodeToAst(xhtmlDoc.body) as Insightful.AST;

      // Count words in tree
      words += countWords(ast);

      // Write AST to file
      await writeJSON(resolve(astpubDirectory, `${href}.json`), ast);
    }
  }

  // Use fallbacks for cover image if available
  if (!cover) cover = covers.id1 || covers.id2 || covers.href;

  // Delete extracted epub directory
  await remove(epubDirectory);

  // Populate entity object which will be used for meta.json
  const entity: Insightful.Entity = {
    authors:
      Array.from(opfDoc.getElementsByTagName('dc:creator'))
        .map(creator => creator.textContent)
        .join(', ') || undefined,
    bookmark: { element: 0, section: 0, width: 0, line: 0 },
    cover: `images/${cover}`,
    id: Date.now(),
    link,
    name: opfDoc.getElementsByTagName('dc:title')[0].textContent || '',
    published: (() => {
      const date = opfDoc.getElementsByTagName('dc:date')[0];
      if (date) return new Date(date.textContent as string).getTime();
    })(),
    publisher: (() => {
      const pub = opfDoc.getElementsByTagName('dc:publisher')[0];
      if (pub) return pub.textContent as string;
    })(),
    // Order content items for spine
    spine: Array.from(opfDoc.getElementsByTagName('itemref')).map(
      ref => idToHref[ref.getAttribute('idref') as string]
    ),
    starred: false,
    tags: [],
    version: process.enve.ASTPUB_VERSION,
    words:
      words > 999999
        ? `${(words / 1000000).toFixed(2)}m`
        : words > 999
        ? `${Math.round(words / 1000)}k`
        : words.toString()
  };

  // Write meta.json
  await writeJSON(resolve(astpubDirectory, 'meta.json'), entity);

  // Zip directory
  const astpubFile = resolve(process.enve.TEMP_DIR, `astpub-${Date.now()}.zip`);
  const astpubWriter = createWriteStream(astpubFile);
  const astpubArchive = archiver('zip');
  const astpubPromise = new Promise(r => astpubWriter.on('close', r));
  astpubArchive.pipe(astpubWriter);
  astpubArchive.directory(astpubDirectory, false);
  astpubArchive.finalize();
  await astpubPromise;

  // Delete unzipped astpub directory
  await remove(astpubDirectory);

  // Create stream to return for astpub file
  const astpubReader = createReadStream(astpubFile);

  // Delete file after it's been consumed
  astpubReader.on('close', () => remove(astpubFile, () => undefined));

  // Return string to astpub file
  return astpubReader;
}
