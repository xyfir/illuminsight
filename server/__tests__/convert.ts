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
const { SERVER_DIRECTORY } = process.enve;

// Set file paths used in some tests
const loremHtmlFile = resolve(SERVER_DIRECTORY, 'res/lorem.html');
const loremAstFile = resolve(SERVER_DIRECTORY, 'res/lorem.ast.json');

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

  expect(words).toBe(449);
});
