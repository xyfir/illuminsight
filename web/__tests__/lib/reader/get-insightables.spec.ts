import { getInsightables } from 'lib/reader/get-insightables';

test('getInsightables()', () => {
  const insightables = getInsightables(
    'What is so special about Insightful? The second largest city in California is San Diego. In July of 1958, NASA was created under President Eisenhower.'
  );
  expect(insightables).toMatchObject([
    'Insightful',
    'California',
    'San Diego',
    'July',
    'NASA',
    'President Eisenhower'
  ]);
});
