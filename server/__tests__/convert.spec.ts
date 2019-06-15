import { Illuminsight } from 'types/illuminsight';
import { nodeToAST } from 'lib/ast/node-to-ast';
import { convert } from 'lib/convert';
import { Extract } from 'unzipper';
import { resolve } from 'path';
import { pandoc } from 'lib/pandoc';
import { JSDOM } from 'jsdom';
import {
  constants as FS,
  ensureDir,
  emptyDir,
  readJSON,
  readFile,
  access,
  copy
} from 'fs-extra';
import 'jest-extended';

// Extract environment variables
const { FILES_DIRECTORY, TEMP_DIR } = process.enve;

// Set paths used in tests
const convertDirectory = resolve(TEMP_DIR, 'convert-test');
const astpubDirectory = resolve(convertDirectory, 'astpub');
const astpubMetaFile = resolve(astpubDirectory, 'meta.json');
const loremHtmlFile = resolve(FILES_DIRECTORY, 'lorem.html');
const loremMdFile = resolve(convertDirectory, 'lorem.md');

// Ensure test directory exists and is empty
beforeEach(async () => {
  await ensureDir(convertDirectory);
  await emptyDir(convertDirectory);
});

test('nodeToAST()', async () => {
  const dom = new JSDOM(await readFile(loremHtmlFile));
  expect(nodeToAST(dom.window.document.body)).toMatchSnapshot();
});

test('pandoc()', async () => {
  // Convert HTML to CommonMark
  await pandoc({
    output: loremMdFile,
    input: loremHtmlFile,
    from: 'html',
    to: 'commonmark-raw_html'
  });

  // Read Markdown content
  const markdown = await readFile(loremMdFile, 'utf8');

  // Validate content was converted properly
  expect(markdown).toMatch(/^# Lorem Ipsum/m);
  expect(markdown).toMatch(/^#### "Neque porro/m);
  expect(markdown).toMatch(/^Lorem ipsum dolor/m);
});

test('convert({text})', async () => {
  // Convert content to astpub format then extract
  const readStream = await convert({ text: ' Hello \n  World! How are you? ' });
  await new Promise(resolve =>
    readStream.pipe(Extract({ path: astpubDirectory }).on('close', resolve))
  );

  // Validate meta.json
  const pub: Illuminsight.Pub = await readJSON(astpubMetaFile);
  const _pub: Illuminsight.Pub = {
    authors: 'Unknown',
    bookmark: { section: 0, element: 0 },
    cover: 'res/0.jpg',
    id: pub.id,
    name: 'Hello...',
    toc: [{ section: 0, element: 0, title: 'Start' }],
    sections: 2,
    starred: false,
    tags: [],
    version: 1,
    words: '5'
  };
  expect(pub).toMatchObject(_pub);

  // Validate cover
  await access(resolve(astpubDirectory, 'res/0.jpg'), FS.F_OK);

  // Validate AST
  const ast: Illuminsight.AST[] = await readJSON(
    resolve(astpubDirectory, 'ast/1.json')
  );
  const _ast: Illuminsight.AST[] = [
    { n: 'p', c: ['Hello'] },
    { n: 'p', c: ['World! How are you?'] }
  ];
  expect(ast).toMatchObject(_ast);
});

test(
  'convert({link})',
  async () => {
    // Convert content to astpub format then extract
    const readStream = await convert({
      link:
        'https://www.nytimes.com/2019/05/01/magazine/ehren-tool-war-cups-smithsonian.html'
    });
    await new Promise(resolve =>
      readStream.pipe(Extract({ path: astpubDirectory }).on('close', resolve))
    );

    // Validate meta.json
    const pub: Illuminsight.Pub = await readJSON(astpubMetaFile);
    const _pub: Illuminsight.Pub = {
      ...pub,
      authors: 'Unknown',
      bookmark: { section: 0, element: 0 },
      cover: 'res/0.jpg',
      link:
        'https://www.nytimes.com/2019/05/01/magazine/ehren-tool-war-cups-smithsonian.html',
      name:
        'The Price of This Artist’s Work? A Conversation About the Horrors of War - The New York Times',
      toc: [
        {
          section: 2,
          element: 0,
          title:
            'The Price of This Artist’s Work? A Conversation About the Horrors of War - The New York Times'
        }
      ],
      sections: 4,
      starred: false,
      tags: [],
      version: 1,
      words: '3k'
    };
    expect(pub).toMatchObject(_pub);

    // Validate cover
    await access(resolve(astpubDirectory, 'res/0.jpg'), FS.F_OK);

    // Validate AST
    const ast: Illuminsight.AST[] = await readJSON(
      resolve(astpubDirectory, 'ast/3.json')
    );
    expect(ast).toMatchSnapshot();
  },
  30 * 1000
);

test(
  'convert({file})',
  async () => {
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
      cover: 'res/0.jpg',
      name: 'A Tale of Two Cities',
      published: 757411200000,
      sections: 54,
      starred: false,
      tags: [],
      version: 1,
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
  },
  30 * 1000
);
