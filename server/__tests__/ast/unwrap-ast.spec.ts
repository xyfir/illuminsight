import { Insightful } from 'types/insightful';
import { unwrapAST } from 'lib/ast/unwrap-ast';

test('unwrapAST(body>div>div>p>string)', () => {
  const ast: Insightful.AST = {
    n: 'body',
    c: [
      {
        n: 'div',
        c: [
          {
            n: 'div',
            c: [{ n: 'p', c: ['Hello'] }]
          }
        ]
      }
    ]
  };
  expect(unwrapAST(ast)).toMatchObject([{ n: 'p', c: ['Hello'] }]);
});

test('unwrapAST(string)', () => {
  const ast: Insightful.AST = 'Hello';
  expect(unwrapAST(ast)).toMatchObject([ast]);
});

test('unwrapAST(p>string)', () => {
  const ast: Insightful.AST = { n: 'p', c: ['Hello'] };
  expect(unwrapAST(ast)).toMatchObject([ast]);
});

test('unwrapAST(div>string|hr)', () => {
  const ast: Insightful.AST = { n: 'div', c: ['Hello', { n: 'hr' }] };
  expect(unwrapAST(ast)).toMatchObject([ast]);
});

test('unwrapAST(hr)', () => {
  const ast: Insightful.AST = { n: 'hr' };
  expect(unwrapAST(ast)).toMatchObject([ast]);
});
