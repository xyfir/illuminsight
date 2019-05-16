import { Insightful } from 'types/insightful';
import { queryAST } from 'lib/query-ast';
import { testAST } from 'lib/test/objects';

test('queryAST()', () => {
  // li
  let matches = queryAST(
    ast => (typeof ast == 'string' ? false : ast.n == 'li'),
    testAST
  );
  expect(matches).toMatchObject([
    { n: 'li', c: ['UL item #1'] },
    { n: 'li', c: ['UL item #2'] },
    { n: 'li', c: ['OL item #1'] },
    { n: 'li', c: ['OL item #2'] }
  ] as Insightful.AST[]);

  // /item/
  matches = queryAST(ast => /item/.test(ast.toString()), testAST);
  expect(matches).toMatchObject([
    'UL item #1',
    'UL item #2',
    'OL item #1',
    'OL item #2'
  ] as Insightful.AST[]);

  // h1 "Heading 1"
  matches = queryAST(
    ast =>
      typeof ast == 'string'
        ? false
        : ast.n == 'h1' && !!ast.c && ast.c[0] == 'Heading 1',
    testAST
  );
  expect(matches).toMatchObject([
    { n: 'h1', c: ['Heading 1'] }
  ] as Insightful.AST[]);
});
