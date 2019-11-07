import { generateInsights } from 'lib/reader/generate-insights';
import { defaultRecipe } from 'lib/reader/recipes';
import { Illuminsight } from 'types';
import axios from 'axios';
import wtf from 'wtf_wikipedia';

test('generateInsights()', async () => {
  // Mock wtf_wikipedia
  const mockFetch = ((wtf as any).fetch = jest.fn());
  mockFetch.mockResolvedValue(null);

  // Mock axios (for getting definition)
  const mockDefinition = {};
  const mockGet = ((axios as any).get = jest.fn());
  mockGet.mockResolvedValueOnce({ data: mockDefinition });

  // Generate insights from highlighted text
  const insights = await generateInsights({
    recipe: defaultRecipe,
    text: 'hello world',
  });

  /// Validate insights from highlight
  expect(mockFetch).toHaveBeenCalledTimes(1);
  expect(mockGet).toHaveBeenCalledTimes(1);
  const _insights: Illuminsight.Insights = {
    definitions: mockDefinition,
    searches: [
      {
        name: 'Google',
        url: 'https://www.google.com/search?q=hello%20world',
      },
    ],
    wikis: [],
    text: 'hello world',
  };
  expect(insights).toMatchObject(_insights);
  expect(insights.definitions).toBe(mockDefinition);
});
