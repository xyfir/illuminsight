import { Indexer } from 'lib/reader/Indexer';

test('Indexer', () => {
  for (let i = 0; i < 5; i++) {
    expect(Indexer.index).toBe(i);
  }
  Indexer.reset();
  expect(Indexer.index).toBe(0);
});
