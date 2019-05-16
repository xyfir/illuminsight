import { basename, extname, dirname, resolve } from 'path';
import { Insightful } from 'types/insightful';
import { countWords } from 'lib/count-words';
import { nodeToAST } from 'lib/node-to-ast';
import * as archiver from 'archiver';
import { queryAST } from 'lib/query-ast';
import { Calibre } from 'node-calibre';
import { Extract } from 'unzipper';
import { pandoc } from 'lib/pandoc';
import { JSDOM } from 'jsdom';
import {
  createWriteStream,
  createReadStream,
  ReadStream,
  writeJSON,
  ensureDir,
  writeFile,
  readJSON,
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
  // Create directory we'll work in while converting our files
  const workDirectory = resolve(process.enve.TEMP_DIR, `workdir-${Date.now()}`);

  try {
    // Create work directory
    await mkdir(workDirectory);

    // Move uploaded file to work directory
    if (file) {
      const originalFile = file;
      file = resolve(workDirectory, basename(originalFile));
      await move(originalFile, file);
    }

    // Save to .html file
    // Calibre seems to have issues with just plain .txt files
    else if (text) {
      file = resolve(workDirectory, `${Date.now()}.html`);
      await writeFile(
        file,
        `<pre>${text
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')}</pre>`
      );
      text = undefined;
    }

    // Create EPUB from webpage
    else if (link) {
      // Set file and directory paths we'll use later
      const webpageDirectory = resolve(workDirectory, `webpage-${Date.now()}`);
      const webpageImgDirectory = resolve(webpageDirectory, 'images');
      const markdownFile = resolve(webpageDirectory, 'index.md');
      const htmlFile = resolve(webpageDirectory, 'index.html');

      // Create webpage directory
      await mkdir(webpageDirectory);

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

      // Convert to a proper HTML document so next pandoc call doesn't complain
      await writeFile(
        htmlFile,
        `<!DOCTYPE html><html><head><title>.</title></head>${await readFile(
          htmlFile
        )}</html>`
      );

      // Convert HTML to EPUB
      file = resolve(workDirectory, `${Date.now()}.epub`);
      await pandoc({ output: file, input: htmlFile, from: 'html', to: 'epub' });
    }

    if (!file) throw new Error('Bad or missing input');

    // Convert to EPUB
    // Even if already an EPUB, it will validate and rebuild as we expect it
    file = await calibre.ebookConvert(file, 'epub');

    // Extract files from EPUB
    const epubDirectory = resolve(workDirectory, `unzip-${Date.now()}`);
    await new Promise(resolve =>
      createReadStream(file as string).pipe(
        Extract({ path: epubDirectory }).on('close', resolve)
      )
    );

    // Parse OPF with jsdom
    const opfDom = new JSDOM(
      await readFile(resolve(epubDirectory, 'content.opf')),
      { contentType: 'text/xml' }
    );
    const opfDoc = opfDom.window.document;

    // Create directories for unzipped astpub
    const astpubDirectory = resolve(workDirectory, `astpub-${Date.now()}`);
    await mkdir(astpubDirectory);
    await mkdir(resolve(astpubDirectory, 'ast'));
    await mkdir(resolve(astpubDirectory, 'res'));

    // Hash map for sections and resource: `"x.html"` -> `"n.json"`
    const linkMap: { [href: string]: string } = {};

    // Relative file path/name for cover image
    const covers: { id1?: string; id2?: string; href?: string } = {};
    let cover: Insightful.Entity['cover'];

    // How many resources (images usually) the content has
    let resources = 0;

    // How many sections the content has
    let sections = 0;

    // How many words the sections have
    let words = 0;

    // Loop through package>manifest>item elements
    for (let item of opfDoc.getElementsByTagName('item')) {
      const mediaType = item.getAttribute('media-type');
      const href = item.getAttribute('href');
      const id = item.getAttribute('id');
      if (!mediaType || !href || !id) continue;

      // Move images from EPUB directory to astpub res/ directory
      if (mediaType.startsWith('image/')) {
        // Give resource a numeric name and map from original
        const resource = `res/${resources++}${extname(href)}`;
        linkMap[href] = resource;

        await move(
          resolve(epubDirectory, href),
          resolve(astpubDirectory, resource)
        );

        // Search for href of cover image
        if (!cover) {
          // Guaranteed to be cover image
          const properties = item.getAttribute('properties');
          if (properties == 'cover-image') cover = resource;
          // Most likely the cover but a guaranteed option may still be available
          else if (id == 'cover') covers.id1 = resource;
          else if (id == 'ci') covers.id2 = resource;
          else if (href.startsWith('cover')) covers.href = resource;
        }
      }
      // Convert XHTML to our JSON via jsdom
      if (/xhtml|html|xml/.test(mediaType)) {
        // Read file
        const xhtmlDom = new JSDOM(
          await readFile(resolve(epubDirectory, href)),
          { contentType: 'text/xml' }
        );
        const xhtmlDoc = xhtmlDom.window.document;

        // Check for body element since document could be XML (like toc.ncx)
        if (!xhtmlDoc.body) continue;

        // Convert document starting at body to AST
        const ast = nodeToAST(xhtmlDoc.body);
        if (!ast || typeof ast == 'string' || !ast.c || !ast.c.length) continue;

        // Give section a numeric name and map from original
        const section = `ast/${sections++}.json`;
        linkMap[href] = section;

        // Count words in AST nodes
        for (let node of ast.c) words += countWords(node);

        // Write AST (only body's children) to file
        // File might be nested in other directories
        const xhtmlFile = resolve(astpubDirectory, section);
        await ensureDir(dirname(xhtmlFile));
        await writeJSON(xhtmlFile, ast.c);
      }
    }

    // Loop through sections updating image and section links
    for (let sectionIndex = 0; sectionIndex < sections; sectionIndex++) {
      const section = resolve(astpubDirectory, `ast/${sectionIndex}.json`);
      const ast: Insightful.AST[] = await readJSON(section);

      // Find any node with any attribute: xlink:href, href, src
      const nodes = queryAST(
        node =>
          typeof node == 'string'
            ? false
            : !!node.a &&
              !!(node.a['xlink:href'] || node.a['href'] || node.a['src']),
        ast
      );

      // Update paths using section/resource map
      for (let node of nodes) {
        Object.entries(linkMap).forEach(([oldLink, newLink]) => {
          if (typeof node == 'string' || !node.a) return;
          if (node.a['xlink:href'] && node.a['xlink:href'].includes(oldLink))
            node.a['xlink:href'] = newLink;
          if (node.a['href'] && node.a['href'].includes(oldLink))
            node.a['href'] = newLink;
          if (node.a['src'] && node.a['src'].includes(oldLink))
            node.a['src'] = newLink;
        });
      }

      // Write modified file
      await writeJSON(section, ast);
    }

    // Use fallbacks for cover image if available
    if (!cover) cover = covers.id1 || covers.id2 || covers.href;

    // Populate entity object which will be used for meta.json
    const entity: Insightful.Entity = {
      authors:
        Array.from(opfDoc.getElementsByTagName('dc:creator'))
          .map(creator => creator.textContent)
          .join(', ') || undefined,
      bookmark: { section: 0, block: 0 },
      cover,
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
      sections,
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
    const astpubFile = resolve(workDirectory, `astpub-${Date.now()}.zip`);
    const astpubWriter = createWriteStream(astpubFile);
    const astpubArchive = archiver('zip');
    const astpubPromise = new Promise(r => astpubWriter.on('close', r));
    astpubArchive.pipe(astpubWriter);
    astpubArchive.directory(astpubDirectory, false);
    astpubArchive.finalize();
    await astpubPromise;

    // Create stream to return for astpub file
    const astpubReader = createReadStream(astpubFile);

    // Delete work directory after final file has been consumed
    astpubReader.on('close', () => remove(workDirectory, () => undefined));

    // Return string to astpub file
    return astpubReader;
  } catch (err) {
    // Get rid of all our temp files
    await remove(workDirectory);

    throw err;
  }
}
