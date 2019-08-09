import { Illuminsight } from 'types';
import { nodeToAST } from 'lib/import/node-to-ast';
import { convert } from 'lib/import/convert';

// Extract environment variables
const { FILES_DIRECTORY, ASTPUB_VERSION } = process.enve;

test('nodeToAST()', async () => {
  const loremHtmlFile = resolve(FILES_DIRECTORY, 'lorem.html');
  const dom = new JSDOM(await readFile(loremHtmlFile));
  expect(nodeToAST(dom.window.document.body)).toMatchSnapshot();
});

test('convert({file})', async () => {
  // Move test ebook to temp_dir
  const file = resolve(TEMP_DIR, `${Date.now()}.epub`);
  await copy(resolve(FILES_DIRECTORY, 'ebook.epub'), file);

  // Convert content to astpub format then extract
  const readStream = await convert({ file });
  await new Promise(resolve =>
    readStream.pipe(Extract({ path: astpubDirectory }).on('close', resolve))
  );

  // Validate meta.json
  const pub: Illuminsight.Pub = await readJSON(astpubMetaFile);
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
  await access(resolve(astpubDirectory, 'res/0.jpg'), FS.F_OK);

  // Validate AST
  const ast: Illuminsight.AST[] = await readJSON(
    resolve(astpubDirectory, 'ast/5.json')
  );
  expect(ast).toMatchSnapshot();
});
