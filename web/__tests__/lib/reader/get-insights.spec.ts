import { generateInsights } from 'lib/reader/generate-insights';
import wtf from 'wtf_wikipedia';

test('generateInsights()', async () => {
  // Mock wtf_wikipedia
  const mockFetch = ((wtf as any).fetch = jest.fn());
  mockFetch.mockResolvedValue(null);

  // Generate insights from text block
  let insights = await generateInsights(
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

  // Validate insights from text block
  expect(mockFetch).toHaveBeenCalledTimes(6);
  expect(insights).toBeArrayOfSize;
  for (let i = 0; i < 6; i++) {
    expect(mockFetch).toHaveBeenNthCalledWith(i + 1, items[i]);
    expect(insights[i]).toMatchObject({ text: items[i], wiki: undefined });
  }

  // Generate insights from highlighted text
  insights = await generateInsights('hello world', true);

  /// Validate insights from highlight
  expect(mockFetch).toHaveBeenCalledTimes(7);
  expect(mockFetch).toHaveBeenNthCalledWith(7, 'hello world');
  expect(insights[0]).toMatchObject({ text: 'hello world', wiki: undefined });
});
