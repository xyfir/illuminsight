import { getWikiArticle } from 'lib/reader/get-wiki-article';
import { defaultRecipe } from 'lib/reader/recipes';
import { Illuminsight } from 'types';
import wtf from 'wtf_wikipedia';

test('getWikiArticle()', async () => {
  // Mock wtf_wikipedia
  const mockFetch = ((wtf as any).fetch = jest.fn());
  mockFetch.mockResolvedValue(null);

  // Get article from Wikipedia
  const [recipe] = defaultRecipe.wikis;
  expect(await getWikiArticle('test', recipe)).toBe(null);

  /// Validate request
  expect(mockFetch).toHaveBeenCalledWith('test', undefined, {
    wikiUrl: 'https://en.wikipedia.org/w/api.php',
  });

  // Get article from custom proxied wiki
  const _recipe: Illuminsight.WikiRecipe = JSON.parse(JSON.stringify(recipe));
  _recipe.api = 'http://example.com';
  _recipe.proxy = true;
  expect(await getWikiArticle('test2', _recipe)).toBe(null);

  /// Validate request
  expect(mockFetch).toHaveBeenCalledWith('test2', undefined, {
    wikiUrl: process.enve.PROXY_URL + 'http://example.com',
  });
});
