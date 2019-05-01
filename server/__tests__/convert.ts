import 'app-module-path/register';
import { config } from 'dotenv';
config();
import 'enve';

import { Insightful } from 'types/insightful';
import { countWords } from 'lib/count-words';
import { nodeToAst } from 'lib/node-to-ast';
import { convert } from 'lib/convert';
import { resolve } from 'path';
import { pandoc } from 'lib/pandoc';
import { JSDOM } from 'jsdom';
import {
  ensureDir,
  writeFile,
  emptyDir,
  readJSON,
  readFile,
  copy
} from 'fs-extra';
import 'jest-extended';

// Extract environment variables
const { SERVER_DIRECTORY, TEMP_DIR } = process.enve;

// Set paths used in tests
const convertDirectory = resolve(TEMP_DIR, 'convert-test');
const loremHtmlFile = resolve(SERVER_DIRECTORY, 'res/lorem.html');
const loremAstFile = resolve(SERVER_DIRECTORY, 'res/lorem.ast.json');
const loremMdFile = resolve(convertDirectory, 'lorem.md');

// Ensure test directory exists and is empty
beforeEach(async () => {
  await ensureDir(convertDirectory);
  await emptyDir(convertDirectory);
});

test('nodeToAst()', async () => {
  // Parse HTML into DOM
  const dom = new JSDOM(await readFile(loremHtmlFile));

  // Convert document starting at body to AST
  const { c: ast } = nodeToAst(dom.window.document.body) as Insightful.AST;

  // Uncomment to update AST snapshot
  // await writeFile(astFile, JSON.stringify(ast, null, 2));

  // Validate that AST output has not changed from last snapshot
  const snapshot: Array<Insightful.AST | string> = await readJSON(loremAstFile);
  expect(ast).toMatchObject(snapshot);
});

test('countWords()', async () => {
  // Load AST snapshot
  const ast: Array<Insightful.AST | string> = await readJSON(loremAstFile);

  // Count words in AST nodes
  let words = 0;
  for (let node of ast) words += countWords(node);

  // Validate that words counted has not changed since last snapshot
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
