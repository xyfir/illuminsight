import { getInsights } from 'lib/reader/get-insights';

test('getInsights()', () => {
  const insights = getInsights(
    'What is so special about Insightful? The second largest city in California is San Diego. In July of 1958, NASA was created under President Eisenhower.'
  );
  expect(insights).toMatchObject([
    'Insightful',
    'California',
    'San Diego',
    'July',
    'NASA',
    'President Eisenhower'
  ]);
});
