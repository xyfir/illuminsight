import { getByAttributeName } from 'lib/import/get-by-attribute-name';
import { Illuminsight } from 'types';

test('getByAttributeName()', () => {
  const ast: Illuminsight.AST[] = [
    {
      n: 'div',
      c: [
        {
          n: 'div',
          c: [
            'Hello',
            {
              n: 'a',
              a: { href: 'href1' },
            },
          ],
        },
        'Hello 2',
        {
          n: 'div',
          c: [
            {
              n: 'a',
              a: { href: 'href2' },
            },
          ],
          a: { wrong: 'wrong' },
        },
      ],
    },
  ];

  expect(getByAttributeName('href', ast)).toMatchObject([
    { n: 'a', a: { href: 'href1' } },
    { n: 'a', a: { href: 'href2' } },
  ]);
});
