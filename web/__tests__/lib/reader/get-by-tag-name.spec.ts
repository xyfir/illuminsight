import { getByTagName } from 'lib/reader/get-by-tag-name';
import { Illuminsight } from 'types/illuminsight';

test('getByTagName()', () => {
  const ast: Illuminsight.AST[] = [
    {
      n: 'div',
      c: [
        {
          n: 'div',
          c: ['Hello', { n: 'hr' }]
        },
        'Hello 2',
        {
          n: 'div',
          c: [{ n: 'hr' }]
        }
      ]
    }
  ];
  expect(getByTagName('hr', ast)).toMatchObject([{ n: 'hr' }, { n: 'hr' }]);
});
