import { getByAttributeName } from 'lib/import/get-by-attribute-name';
import { Illuminsight } from 'types';
import { countWords } from 'lib/import/count-words';
import { nodeToAST } from 'lib/import/node-to-ast';
import JSZip from 'jszip';

const LINK_ATTRIBUTES = ['href', 'src'];

export async function convert(File: File): Promise<Blob> {
  // Create empty zip for ASTPUB
  // Unzip EPUB

  // Parse OPF with jsdom
  const opfDom = new JSDOM(
    await readFile(resolve(epubDirectory, 'content.opf')),
    { contentType: 'text/xml' }
  );
  const opfDoc = opfDom.window.document;

  // Hash map for old section and resource links to new
  const linkMap: { [href: string]: string } = {};

  // Relative file path/name for cover image
  const covers: { id1?: string; id2?: string; href?: string } = {};
  let cover: Illuminsight.Pub['cover'];

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
      const xhtmlDom = new JSDOM(await readFile(resolve(epubDirectory, href)), {
        contentType: 'text/xml'
      });
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

      // Write AST of <body>'s children to file
      await writeJSON(resolve(astpubDirectory, section), ast.c);
    }
  }

  // Loop through sections updating image and section links
  for (let sectionIndex = 0; sectionIndex < sections; sectionIndex++) {
    const section = `ast/${sectionIndex}.json`;
    const ast: Illuminsight.AST[] = await readJSON(
      resolve(astpubDirectory, section)
    );

    // Loop through all attributes we need to convert
    for (let attr of LINK_ATTRIBUTES) {
      // Find nodes with attribute
      const nodes = getByAttributeName(attr, ast);

      // Loop through nodes with attribute that needs conversion
      for (let node of nodes) {
        for (let [oldLink, newLink] of Object.entries(linkMap)) {
          if (typeof node == 'string' || !node.a) continue;

          // Check if attribute contains the old link
          const attribute = node.a[attr];
          if (!attribute.includes(oldLink)) continue;

          // Retain #hashes
          if (attribute.includes('#') && !attribute.endsWith('#')) {
            const [, hash] = attribute.match(/#(.+)/) as RegExpMatchArray;

            // Check if link contains hash for current section
            // Replace new link with the hash
            if (newLink == section) newLink = `#${hash}`;
            // Append old hash to new link
            else newLink += `#${hash}`;
          }

          // Update attribute's value with proper link
          node.a[attr] = newLink;
        }
      }
    }

    // Write modified file
    await writeJSON(resolve(astpubDirectory, section), ast);
  }

  // Use fallbacks for cover image if available
  if (!cover) cover = covers.id1 || covers.id2 || covers.href;

  // Load toc.ncx
  const tocDom = new JSDOM(await readFile(resolve(epubDirectory, 'toc.ncx')), {
    contentType: 'text/xml'
  });
  const tocDoc = tocDom.window.document;

  // Load elements from Table of Contents
  let navPoints = Array.from(tocDoc.querySelectorAll('navMap > navPoint'));

  // Sort nav elements
  if (navPoints.length && navPoints[0].getAttribute('playOrder')) {
    navPoints = navPoints.sort(
      (a, b) =>
        Number(a.getAttribute('playOrder')) -
        Number(b.getAttribute('playorder'))
    );
  }

  // Build Table of Contents
  const toc: Illuminsight.Pub['toc'] = [];
  for (let navPoint of navPoints) {
    const title = navPoint.querySelector('navLabel > text') as Element;
    const src = navPoint.querySelector('content') as Element;

    const match = (src.getAttribute('src') as string).match(
      /^([^#]+)(#(.*))?$/
    ) as RegExpMatchArray;
    toc.push({
      // old link -> new link -> index
      section: +linkMap[decodeURIComponent(match[1])]
        .split('/')[1]
        .split('.')[0],
      element: match[3] || 0,
      title: (title.textContent as string).trim()
    });
  }

  // Populate pub object which will be used for meta.json
  const pub: Illuminsight.Pub = {
    id: Date.now(),
    toc,
    tags: [],
    name: opfDoc.getElementsByTagName('dc:title')[0].textContent || '',
    cover,
    words:
      words > 999999
        ? `${(words / 1000000).toFixed(2)}m`
        : words > 999
        ? `${Math.round(words / 1000)}k`
        : words.toString(),
    // series: '',
    starred: false,
    version: process.enve.ASTPUB_VERSION,
    authors:
      Array.from(opfDoc.getElementsByTagName('dc:creator'))
        .map(creator => creator.textContent)
        .join(', ') || undefined,
    sections,
    bookmark: { section: 0, element: 0 },
    published: (() => {
      const date = opfDoc.getElementsByTagName('dc:date')[0];
      if (date) return new Date(date.textContent as string).getTime();
    })(),
    publisher: (() => {
      const pub = opfDoc.getElementsByTagName('dc:publisher')[0];
      if (pub) return pub.textContent as string;
    })(),
    languages: Array.from(opfDoc.getElementsByTagName('dc:language'))
      .map(lang => lang.textContent!.trim().split('-')[0])
      .filter(lang => lang != 'und')
  };
  pub.languages = pub.languages.length ? pub.languages : ['en'];

  // Write meta.json
  await writeJSON(resolve(astpubDirectory, 'meta.json'), pub);
}
