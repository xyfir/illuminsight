import { generateInsights } from 'lib/reader/generate-insights';
import { defaultRecipe } from 'lib/reader/recipes';
import { Illuminsight } from 'types/illuminsight';
import axios from 'axios';
import wtf from 'wtf_wikipedia';

test('generateInsights()', async () => {
  // Mock wtf_wikipedia
  const mockFetch = ((wtf as any).fetch = jest.fn());
  const mockWiki = {};
  mockFetch.mockResolvedValueOnce(mockWiki);
  mockFetch.mockResolvedValue(null);

  // Mock axios (for getting definition)
  const mockDefinition = {};
  const mockGet = ((axios as any).get = jest.fn());
  mockGet.mockResolvedValueOnce({ data: mockDefinition });
  mockGet.mockResolvedValue({ data: undefined });

  // Generate suggested insights from text block
  let insights = await generateInsights({
    recipe: defaultRecipe,
    text:
      'What is so special about Illuminsight? The second largest city in California is San Diego. In July of 1958, NASA was created while President Eisenhower was in office.'
  });
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
  expect(mockGet).toHaveBeenCalledTimes(5);
  expect(insights).toBeArrayOfSize(6);
  for (let i = 0; i < 6; i++) {
    expect(insights[i].text).toBe(items[i]);

    switch (i) {
      // First found a wiki article so didn't generate definitions or searches
      case 0:
        expect(insights[i].wikis).toMatchObject([
          { doc: {}, recipe: defaultRecipe.wikis[0] }
        ]);
        expect(insights[i].searches).toBeArrayOfSize(0);
        expect(insights[i].definitions).toBeUndefined();
        break;
      // Second found definition so didn't generate searches
      case 1:
        expect(insights[i].definitions).toBe(mockDefinition);
        expect(insights[i].searches).toBeArrayOfSize(0);
        expect(insights[i].wikis).toBeArrayOfSize(0);
        break;
      // Third+ could only generate searches
      default:
        expect(insights[i].searches).toMatchObject([
          {
            name: 'Google',
            url: `https://www.google.com/search?q=${encodeURIComponent(
              items[i]
            )}`
          }
        ]);
        expect(insights[i].wikis).toBeArrayOfSize(0);
        expect(insights[i].definitions).toBeUndefined();
    }
  }

  // Generate insights from highlighted text
  const insights2 = await generateInsights({
    highlight: true,
    recipe: defaultRecipe,
    text: 'hello world'
  });

  /// Validate insights from highlight
  expect(mockFetch).toHaveBeenCalledTimes(7);
  expect(mockGet).toHaveBeenCalledTimes(6);
  const _insight: Illuminsight.Insight = {
    definitions: undefined,
    searches: [
      {
        name: 'Google',
        url: 'https://www.google.com/search?q=hello%20world'
      }
    ],
    wikis: [],
    text: 'hello world'
  };
  expect(insights2[0]).toMatchObject(_insight);
});
