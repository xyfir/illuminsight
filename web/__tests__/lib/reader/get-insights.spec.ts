import { getInsights } from 'lib/reader/get-insights';
import * as wtf from 'wtf_wikipedia';

test('getInsights()', async () => {
  // Mock wtf_wikipedia
  const mockFetch = ((wtf as any).fetch = jest.fn());
  mockFetch.mockResolvedValue(null);

  // Get insights
  const insights = await getInsights(
    'What is so special about Illuminsight? The second largest city in California is San Diego. In July of 1958, NASA was created while President Eisenhower was in office.'
  );
  const items = [
    'Illuminsight',
    'California',
    'San Diego',
    'July',
    'NASA',
    'President Eisenhower'
  ];

  // Validate insights
  expect(mockFetch).toHaveBeenCalledTimes(6);
  expect(insights).toBeArrayOfSize;
  for (let i = 0; i < 6; i++) {
    expect(mockFetch).toHaveBeenNthCalledWith(i + 1, items[i]);
    expect(insights[i]).toMatchObject({ text: items[i], wiki: undefined });
  }
});
