import { getDefinitions } from 'lib/reader/get-definitions';
import axios from 'axios';

test('getDefinitions()', async () => {
  // Mock axios
  const mockData = {};
  const mockGet = ((axios as any).get = jest.fn());
  mockGet.mockResolvedValue({ data: mockData });

  // Generate insights from text block
  const definitions = await getDefinitions('test');
  expect(definitions).toBe(mockData);

  // Validate axios.get() was called
  expect(mockGet).toHaveBeenCalledWith(
    'https://en.wiktionary.org/api/rest_v1/page/definition/test',
  );
});
