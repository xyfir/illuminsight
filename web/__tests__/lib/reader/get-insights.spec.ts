import { getInsights } from 'lib/reader/get-insights';

test('getInsights()', () => {
  const insights = getInsights(
    'What is so special about Insightful? The second largest city in California is San Diego. In July of 1958, NASA was created while President Eisenhower was in office.'
  );
  expect(insights).toMatchObject([
    { text: 'Insightful' },
    { text: 'California' },
    { text: 'San Diego' },
    { text: 'July' },
    { text: 'NASA' },
    { text: 'President Eisenhower' }
  ]);
});
