import { getByAttributeName } from 'lib/import/get-by-attribute-name';
import { Illuminsight } from 'types';
import { countWords } from 'lib/import/count-words';
import { nodeToAST } from 'lib/import/node-to-ast';
import JSZip from 'jszip';

const LINK_ATTRIBUTES = ['href', 'src'];
const parser = new DOMParser();

export async function convert(file: Blob): Promise<Blob> {
  // Prepare zip files
  const astpub = new JSZip();
  const epub = await JSZip.loadAsync(file);

  // Parse OPF
  const [opfFile] = epub.file(/\bcontent\.opf$/);
  const opfDoc = parser.parseFromString(
    await opfFile.async('text'),
    'application/xhtml+xml',
  );

  // Change root dir of EPUB zip to be OPF's containing folder
  if (opfFile.name.includes('/')) {
    const rootDir = opfFile.name
      .split('/')
      .slice(0, -1)
      .join('/');

    for (const file of Object.keys(epub.files)) {
      // Remove those not in rootDir
      if (!file.startsWith(rootDir)) {
        epub.remove(file);
      }
      // Update names of those in rootDir
      else {
        epub.file(
          file.substr(rootDir.length + 1),
          await epub.file(file).async('blob'),
        );
        epub.remove(file);
      }
    }
  }

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
  for (const item of opfDoc.getElementsByTagName('item')) {
    const mediaType = item.getAttribute('media-type');
    const href = item.getAttribute('href');
    const id = item.getAttribute('id');
    if (!mediaType || !href || !id) continue;

    // Move images from EPUB directory to astpub res/ directory
    if (mediaType.startsWith('image/')) {
      // Give resource a numeric name and map from original
      const resource = `res/${resources++}.${href.split('.').slice(-1)}`;
      linkMap[href] = resource;

      // Cut href from EPUB to resource in ASTPUB
      astpub.file(resource, await epub.file(href).async('blob'));
      epub.remove(href);

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
    // Convert XHTML to AST
    if (/xhtml|html|xml/.test(mediaType)) {
      // Read file
      const xhtmlFile = epub.file(href);
      const xhtmlDoc = parser.parseFromString(
        await xhtmlFile.async('text'),
        'application/xhtml+xml',
      );

      // Check for body element since document could be XML (like toc.ncx)
      if (!xhtmlDoc.body) continue;

      // Convert document starting at body to AST
      const ast = nodeToAST(xhtmlDoc.body);
      if (!ast || typeof ast == 'string' || !ast.c || !ast.c.length) continue;

      // Give section a numeric name and map from original
      const section = `ast/${sections++}.json`;
      linkMap[href] = section;

      // Count words in AST nodes
      for (const node of ast.c) words += countWords(node);

      // Write AST of <body>'s children to file and delete original
      astpub.file(section, JSON.stringify(ast.c));
      epub.remove(href);
    }
  }

  // Loop through sections updating image and section links
  for (let sectionIndex = 0; sectionIndex < sections; sectionIndex++) {
    // Read section's AST
    const section = `ast/${sectionIndex}.json`;
    const ast: Illuminsight.AST[] = JSON.parse(
      await astpub.file(section).async('text'),
    );

    // Loop through all attributes we need to convert
    for (const attr of LINK_ATTRIBUTES) {
      // Find nodes with attribute
      const nodes = getByAttributeName(attr, ast);

      // Loop through nodes with attribute that needs conversion
      for (const node of nodes) {
        for (const entry of Object.entries(linkMap)) {
          if (typeof node == 'string' || !node.a) continue;

          const oldLink = entry[0];
          let newLink = entry[1];

          // Check if attribute contains the old link
          const attribute = node.a[attr];
          if (!attribute.includes(oldLink)) continue;

          // Retain #hashes
          if (attribute.includes('#') && !attribute.endsWith('#')) {
            const [, hash] = /#(.+)/.exec(attribute) as RegExpExecArray;

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

    // Write modified section
    astpub.file(section, JSON.stringify(ast));
  }

  // Use fallbacks for cover image if available
  if (!cover) cover = covers.id1 || covers.id2 || covers.href;

  // Load toc.ncx
  const [tocFile] = epub.file(/\btoc\.ncx$/);
  const tocDoc = parser.parseFromString(
    await tocFile.async('text'),
    'application/xhtml+xml',
  );

  // Load elements from Table of Contents
  let navPoints = Array.from(tocDoc.querySelectorAll('navMap > navPoint'));

  // Sort nav elements
  if (navPoints.length && navPoints[0].getAttribute('playOrder')) {
    navPoints = navPoints.sort(
      (a, b) =>
        Number(a.getAttribute('playOrder')) -
        Number(b.getAttribute('playorder')),
    );
  }

  // Build Table of Contents
  const toc: Illuminsight.Pub['toc'] = [];
  for (const navPoint of navPoints) {
    const title = navPoint.querySelector('navLabel > text') as Element;
    const src = navPoint.querySelector('content') as Element;

    const match = /^([^#]+)(#(.*))?$/.exec(src.getAttribute(
      'src',
    ) as string) as RegExpExecArray;
    toc.push({
      // old link -> new link -> index
      section: +linkMap[decodeURIComponent(match[1])]
        .split('/')[1]
        .split('.')[0],
      element: match[3] || 0,
      title: (title.textContent as string).trim(),
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
        .map((creator) => creator.textContent)
        .join(', ') || undefined,
    sections,
    bookmark: { section: 0, element: 0 },
    published: ((): number | undefined => {
      const date = opfDoc.getElementsByTagName('dc:date')[0];
      if (date) return new Date(date.textContent as string).getTime();
    })(),
    publisher: ((): string | undefined => {
      const pub = opfDoc.getElementsByTagName('dc:publisher')[0];
      if (pub) return pub.textContent as string;
    })(),
    languages: Array.from(opfDoc.getElementsByTagName('dc:language'))
      .map((lang) => lang.textContent!.trim().split('-')[0])
      .filter((lang) => lang != 'und'),
  };
  pub.languages = pub.languages.length ? pub.languages : ['en'];

  // Write meta.json
  astpub.file('meta.json', JSON.stringify(pub));

  // Return compressed blob
  return await astpub.generateAsync({
    compressionOptions: { level: 9 },
    type: 'blob',
  });
}
