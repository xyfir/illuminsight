import { getByAttributeName } from 'lib/ast/get-by-attribute-name';
import { Insightful } from 'types/insightful';

test('getByAttributeName()', () => {
  const ast: Insightful.AST[] = [
    {
      n: 'div',
      c: [
        {
          n: 'div',
          c: [
            'Hello',
            {
              n: 'a',
              a: { href: 'href1' }
            }
          ]
        },
        'Hello 2',
        {
          n: 'div',
          c: [
            {
              n: 'a',
              a: { href: 'href2' }
            }
          ],
          a: { wrong: 'wrong' }
        }
      ]
    }
  ];

  expect(getByAttributeName('href', ast)).toMatchObject([
    { n: 'a', a: { href: 'href1' } },
    { n: 'a', a: { href: 'href2' } }
  ]);
});
