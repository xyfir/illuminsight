import { getByTagName } from 'lib/reader/get-by-tag-name';
import { Insightful } from 'types/insightful';

test('getByTagName()', () => {
  const ast: Insightful.AST[] = [
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
