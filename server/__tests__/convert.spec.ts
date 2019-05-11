import { Insightful } from 'types/insightful';
import { countWords } from 'lib/count-words';
import { nodeToAST } from 'lib/node-to-ast';
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
const { SERVER_DIRECTORY, TEMP_DIR } = process.enve;

// Set paths used in tests
const convertDirectory = resolve(TEMP_DIR, 'convert-test');
const astpubDirectory = resolve(convertDirectory, 'astpub');
const astpubMetaFile = resolve(astpubDirectory, 'meta.json');
const loremHtmlFile = resolve(SERVER_DIRECTORY, 'res/lorem.html');
const loremAstFile = resolve(SERVER_DIRECTORY, 'res/lorem.ast.json');
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

test('countWords()', async () => {
  // Load AST
  const ast: Insightful.AST[] = await readJSON(loremAstFile);

  // Count words in AST nodes
  let words = 0;
  for (let node of ast) words += countWords(node);

  // Validate that words counted has not changed
  expect(words).toBe(449);
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
  const readStream = await convert({ text: 'Hello World' });
  await new Promise(resolve =>
    readStream.pipe(Extract({ path: astpubDirectory }).on('close', resolve))
  );

  // Validate meta.json
  const entity: Insightful.Entity = await readJSON(astpubMetaFile);
  const _entity: Insightful.Entity = {
    authors: 'Unknown',
    bookmark: { section: 0, block: 0 },
    cover: 'images/cover_image.jpg',
    id: entity.id,
    name: entity.name,
    spine: ['titlepage.xhtml.json', 'index-1.html.json'],
    starred: false,
    tags: [],
    version: 1,
    words: '2'
  };
  expect(entity).toMatchObject(_entity);

  // Validate cover
  await access(resolve(astpubDirectory, 'images/cover_image.jpg'), FS.F_OK);

  // Validate AST
  const ast: Insightful.AST[] = await readJSON(
    resolve(astpubDirectory, 'index-1.html.json')
  );
  const _ast: Insightful.AST[] = [{ c: ['Hello World'], n: 'p' }];
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
    const entity: Insightful.Entity = await readJSON(astpubMetaFile);
    const _entity: Insightful.Entity = {
      ...entity,
      authors: 'Unknown',
      bookmark: { section: 0, block: 0 },
      cover: 'images/cover_image.jpg',
      link:
        'https://www.nytimes.com/2019/05/01/magazine/ehren-tool-war-cups-smithsonian.html',
      name: '.',
      spine: [
        'titlepage.xhtml.json',
        'EPUB/text/title_page.xhtml.json',
        'EPUB/text/ch001.xhtml.json',
        'EPUB/text/ch002.xhtml.json'
      ],
      starred: false,
      tags: [],
      version: 1,
      words: '3k'
    };
    expect(entity).toMatchObject(_entity);

    // Validate cover
    await access(resolve(astpubDirectory, 'images/cover_image.jpg'), FS.F_OK);

    // Validate AST
    const ast: Insightful.AST[] = await readJSON(
      resolve(astpubDirectory, 'EPUB/text/ch002.xhtml.json')
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
    await copy(resolve(SERVER_DIRECTORY, 'res/ebook.epub'), file);

    // Convert content to astpub format then extract
    const readStream = await convert({ file });
    await new Promise(resolve =>
      readStream.pipe(Extract({ path: astpubDirectory }).on('close', resolve))
    );

    // Validate meta.json
    const entity: Insightful.Entity = await readJSON(astpubMetaFile);
    const _entity: Insightful.Entity = {
      ...entity,
      authors: 'Charles Dickens',
      bookmark: { section: 0, block: 0 },
      cover: 'images/cover_image.jpg',
      name: 'A Tale of Two Cities',
      published: 757411200000,
      spine: [
        'titlepage.xhtml.json',
        'OEBPS/@public@vhost@g@gutenberg@html@files@98@98-h@98-h-0.htm_split_000.html.json',
        'OEBPS/@public@vhost@g@gutenberg@html@files@98@98-h@98-h-0.htm_split_001.html.json',
        'OEBPS/@public@vhost@g@gutenberg@html@files@98@98-h@98-h-0.htm_split_002.html.json',
        'OEBPS/@public@vhost@g@gutenberg@html@files@98@98-h@98-h-0.htm_split_003.html.json',
        'OEBPS/@public@vhost@g@gutenberg@html@files@98@98-h@98-h-0.htm_split_004.html.json',
        'OEBPS/@public@vhost@g@gutenberg@html@files@98@98-h@98-h-0.htm_split_005.html.json',
        'OEBPS/@public@vhost@g@gutenberg@html@files@98@98-h@98-h-0.htm_split_006.html.json',
        'OEBPS/@public@vhost@g@gutenberg@html@files@98@98-h@98-h-0.htm_split_007.html.json',
        'OEBPS/@public@vhost@g@gutenberg@html@files@98@98-h@98-h-1.htm_split_000.html.json',
        'OEBPS/@public@vhost@g@gutenberg@html@files@98@98-h@98-h-1.htm_split_001.html.json',
        'OEBPS/@public@vhost@g@gutenberg@html@files@98@98-h@98-h-2.htm_split_000.html.json',
        'OEBPS/@public@vhost@g@gutenberg@html@files@98@98-h@98-h-2.htm_split_001.html.json',
        'OEBPS/@public@vhost@g@gutenberg@html@files@98@98-h@98-h-2.htm_split_002.html.json',
        'OEBPS/@public@vhost@g@gutenberg@html@files@98@98-h@98-h-2.htm_split_003.html.json',
        'OEBPS/@public@vhost@g@gutenberg@html@files@98@98-h@98-h-3.htm_split_000.html.json',
        'OEBPS/@public@vhost@g@gutenberg@html@files@98@98-h@98-h-3.htm_split_001.html.json',
        'OEBPS/@public@vhost@g@gutenberg@html@files@98@98-h@98-h-3.htm_split_002.html.json',
        'OEBPS/@public@vhost@g@gutenberg@html@files@98@98-h@98-h-3.htm_split_003.html.json',
        'OEBPS/@public@vhost@g@gutenberg@html@files@98@98-h@98-h-4.htm_split_000.html.json',
        'OEBPS/@public@vhost@g@gutenberg@html@files@98@98-h@98-h-4.htm_split_001.html.json',
        'OEBPS/@public@vhost@g@gutenberg@html@files@98@98-h@98-h-4.htm_split_002.html.json',
        'OEBPS/@public@vhost@g@gutenberg@html@files@98@98-h@98-h-5.htm_split_000.html.json',
        'OEBPS/@public@vhost@g@gutenberg@html@files@98@98-h@98-h-5.htm_split_001.html.json',
        'OEBPS/@public@vhost@g@gutenberg@html@files@98@98-h@98-h-5.htm_split_002.html.json',
        'OEBPS/@public@vhost@g@gutenberg@html@files@98@98-h@98-h-5.htm_split_003.html.json',
        'OEBPS/@public@vhost@g@gutenberg@html@files@98@98-h@98-h-6.htm_split_000.html.json',
        'OEBPS/@public@vhost@g@gutenberg@html@files@98@98-h@98-h-6.htm_split_001.html.json',
        'OEBPS/@public@vhost@g@gutenberg@html@files@98@98-h@98-h-7.htm_split_000.html.json',
        'OEBPS/@public@vhost@g@gutenberg@html@files@98@98-h@98-h-7.htm_split_001.html.json',
        'OEBPS/@public@vhost@g@gutenberg@html@files@98@98-h@98-h-7.htm_split_002.html.json',
        'OEBPS/@public@vhost@g@gutenberg@html@files@98@98-h@98-h-8.htm_split_000.html.json',
        'OEBPS/@public@vhost@g@gutenberg@html@files@98@98-h@98-h-8.htm_split_001.html.json',
        'OEBPS/@public@vhost@g@gutenberg@html@files@98@98-h@98-h-8.htm_split_002.html.json',
        'OEBPS/@public@vhost@g@gutenberg@html@files@98@98-h@98-h-9.htm_split_000.html.json',
        'OEBPS/@public@vhost@g@gutenberg@html@files@98@98-h@98-h-9.htm_split_001.html.json',
        'OEBPS/@public@vhost@g@gutenberg@html@files@98@98-h@98-h-9.htm_split_002.html.json',
        'OEBPS/@public@vhost@g@gutenberg@html@files@98@98-h@98-h-10.htm_split_000.html.json',
        'OEBPS/@public@vhost@g@gutenberg@html@files@98@98-h@98-h-10.htm_split_001.html.json',
        'OEBPS/@public@vhost@g@gutenberg@html@files@98@98-h@98-h-10.htm_split_002.html.json',
        'OEBPS/@public@vhost@g@gutenberg@html@files@98@98-h@98-h-10.htm_split_003.html.json',
        'OEBPS/@public@vhost@g@gutenberg@html@files@98@98-h@98-h-11.htm_split_000.html.json',
        'OEBPS/@public@vhost@g@gutenberg@html@files@98@98-h@98-h-11.htm_split_001.html.json',
        'OEBPS/@public@vhost@g@gutenberg@html@files@98@98-h@98-h-11.htm_split_002.html.json',
        'OEBPS/@public@vhost@g@gutenberg@html@files@98@98-h@98-h-11.htm_split_003.html.json',
        'OEBPS/@public@vhost@g@gutenberg@html@files@98@98-h@98-h-12.htm_split_000.html.json',
        'OEBPS/@public@vhost@g@gutenberg@html@files@98@98-h@98-h-12.htm_split_001.html.json',
        'OEBPS/@public@vhost@g@gutenberg@html@files@98@98-h@98-h-12.htm_split_002.html.json',
        'OEBPS/@public@vhost@g@gutenberg@html@files@98@98-h@98-h-13.htm_split_000.html.json',
        'OEBPS/@public@vhost@g@gutenberg@html@files@98@98-h@98-h-13.htm_split_001.html.json',
        'OEBPS/@public@vhost@g@gutenberg@html@files@98@98-h@98-h-13.htm_split_002.html.json',
        'OEBPS/@public@vhost@g@gutenberg@html@files@98@98-h@98-h-14.htm_split_000.html.json',
        'OEBPS/@public@vhost@g@gutenberg@html@files@98@98-h@98-h-14.htm_split_001.html.json',
        'OEBPS/@public@vhost@g@gutenberg@html@files@98@98-h@98-h-15.htm.html.json'
      ],
      starred: false,
      tags: [],
      version: 1,
      words: '140k'
    };
    expect(entity).toMatchObject(_entity);

    // Validate cover
    await access(resolve(astpubDirectory, 'images/cover_image.jpg'), FS.F_OK);

    // Validate AST
    const ast: Insightful.AST[] = await readJSON(
      resolve(
        astpubDirectory,
        'OEBPS/@public@vhost@g@gutenberg@html@files@98@98-h@98-h-0.htm_split_004.html.json'
      )
    );
    expect(ast).toMatchSnapshot();
  },
  30 * 1000
);
