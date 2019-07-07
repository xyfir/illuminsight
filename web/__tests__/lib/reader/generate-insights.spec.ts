import { generateInsights } from 'lib/reader/generate-insights';
import { defaultRecipe } from 'lib/reader/recipes';
import { Illuminsight } from 'types/illuminsight';
import axios from 'axios';
import wtf from 'wtf_wikipedia';

test('generateInsights()', async () => {
  // Mock wtf_wikipedia
  const mockFetch = ((wtf as any).fetch = jest.fn());
  mockFetch.mockResolvedValue(null);

  // Mock axios (for getting definition)
  const mockData = {};
  const mockGet = ((axios as any).get = jest.fn());
  mockGet.mockResolvedValue({ data: mockData });

  // Generate insights from text block
  let insights = await generateInsights(
    'What is so special about Illuminsight? The second largest city in California is San Diego. In July of 1958, NASA was created while President Eisenhower was in office.',
    defaultRecipe
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
    const insight: Illuminsight.Insight = {
      definitions: {},
      wikis: [],
      text: items[i]
    };
    expect(insights[i]).toMatchObject(insight);
  }

  // Generate insights from highlighted text
  insights = await generateInsights('hello world', defaultRecipe, true);

  /// Validate insights from highlight
  expect(mockFetch).toHaveBeenCalledTimes(7);
  expect(mockFetch).toHaveBeenNthCalledWith(7, 'hello world', undefined, {
    wikiUrl: 'https://en.wikipedia.org/w/api.php'
  });
  expect(insights[0]).toMatchObject({
    definitions: {},
    wikis: [],
    text: 'hello world'
  });
});
