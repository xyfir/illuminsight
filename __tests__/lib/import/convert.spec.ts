import { Illuminsight } from 'types';
import { readFileSync } from 'fs';
import { nodeToAST } from 'lib/import/node-to-ast';
import { convert } from 'lib/import/convert';
import { resolve } from 'path';
import JSZip from 'jszip';

// Extract environment variables
const { FILES_DIRECTORY, ASTPUB_VERSION } = process.enve;

test('nodeToAST()', () => {
  const dom = new DOMParser().parseFromString(
    readFileSync(resolve(FILES_DIRECTORY, 'lorem.html'), 'utf8'),
    'text/html'
  );
  expect(nodeToAST(dom.body)).toMatchSnapshot();
});

test('convert()', async () => {
  // Convert content to ASTPUB
  const epub = await JSZip.loadAsync(
    readFileSync(resolve(FILES_DIRECTORY, 'ebook.epub'))
  );
  const epubBlob = await epub.generateAsync({ type: 'blob' });
  const astpubBlob = await convert(epubBlob);
  const astpub = await JSZip.loadAsync(astpubBlob);

  // Validate meta.json
  const pub: Illuminsight.Pub = JSON.parse(
    await astpub.file('meta.json').async('text')
  );
  const _pub: Illuminsight.Pub = {
    ...pub,
    authors: 'Charles Dickens',
    bookmark: { section: 0, element: 0 },
    series: 'Test Series',
    cover: 'res/0.jpg',
    name: 'A Tale of Two Cities',
    languages: ['en'],
    sections: 54,
    starred: false,
    tags: [],
    version: ASTPUB_VERSION,
    words: '140k'
  };
  expect(pub).toMatchObject(_pub);

  expect(pub.toc).toBeArrayOfSize(50);
  expect(pub.toc.slice(0, 2)).toMatchObject([
    { element: 'pgepubid00000', section: 1, title: 'A TALE OF TWO CITIES' },
    { element: 0, section: 2, title: 'A STORY OF THE FRENCH REVOLUTION' }
  ] as Illuminsight.Pub['toc']);

  // Validate cover
  expect(astpub.file('res/0.jpg')).not.toBeNull();

  // Validate AST
  const ast: Illuminsight.AST[] = JSON.parse(
    await astpub.file('ast/5.json').async('text')
  );
  expect(ast).toMatchSnapshot();
});
