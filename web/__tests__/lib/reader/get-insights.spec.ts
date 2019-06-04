import { getInsights } from 'lib/reader/get-insights';

test('getInsights()', async () => {
  const insights = await getInsights(
    'What is so special about Insightful? The second largest city in California is San Diego. In July of 1958, NASA was created while President Eisenhower was in office.'
  );
  expect(insights).toBeArrayOfSize(6);
  expect(insights[0]).toMatchObject({ text: 'Insightful', wiki: null });
  expect(insights[1].text).toBe('California');
  expect(insights[1].wiki.title()).toBe('California');
  expect(insights[2].text).toBe('San Diego');
  expect(insights[2].wiki.title()).toBe('San Diego');
  expect(insights[3].text).toBe('July');
  expect(insights[3].wiki.title()).toBe('July');
  expect(insights[4].text).toBe('NASA');
  expect(insights[4].wiki.title()).toBe('NASA');
  expect(insights[5].text).toBe('President Eisenhower');
  expect(insights[5].wiki.title()).toBe('Dwight D. Eisenhower');
});
