import { countWords } from 'lib/ast/count-words';
import { Insightful } from 'types/insightful';
import { readJSON } from 'fs-extra';
import { resolve } from 'path';

test('countWords()', async () => {
  // Load AST
  const ast: Insightful.AST[] = await readJSON(
    resolve(process.enve.SERVER_DIRECTORY, 'res/lorem.ast.json')
  );

  // Count words in AST nodes
  let words = 0;
  for (let node of ast) words += countWords(node);

  // Validate that words counted has not changed
  expect(words).toBe(449);
});
