import { getWiktionary } from 'lib/reader/get-wiktionary';
import wtf from 'wtf_wikipedia';

test('getWiktionary()', async () => {
  // Mock wtf_wikipedia
  const mockFetch = ((wtf as any).fetch = jest.fn());
  mockFetch.mockResolvedValue(null);

  // Generate insights from text block
  const doc = await getWiktionary('test');
  expect(doc).toBe(null);

  // Validate fetch was called
  expect(mockFetch).toHaveBeenCalledTimes(1);
  expect(mockFetch).toHaveBeenCalledWith('test', undefined, {
    wikiUrl: 'https://en.wiktionary.org/w/api.php'
  });
});
