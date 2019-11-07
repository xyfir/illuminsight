import { waitForDomChange, fireEvent, render } from '@testing-library/react';
import { StaticRouter } from 'react-router-dom';
import { Illuminsight } from 'types';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { Library } from 'components/library/Library';
import { reducer } from 'store/reducers';
import localForage from 'localforage';
import * as React from 'react';

test('<Library>', async () => {
  let id = 1556915133437;
  // eslint-disable-next-line @typescript-eslint/unbound-method
  Date.prototype.getTime = (): number => id + 1000;

  // Mock localForage.getItem()
  const mockGetItem = ((localForage as any).getItem = jest.fn());

  // Get tag-list
  const tags: Illuminsight.Tag[] = [
    { id: id++, name: 'tag-0' },
    { id: id++, name: 'tag-1' },
    { id: id++, name: 'tag-2' },
  ];
  mockGetItem.mockResolvedValueOnce(tags);

  // Get pub-list
  const pubs: Illuminsight.Pub[] = [
    {
      authors: 'Jane Austen',
      bookmark: { section: 0, element: 0 },
      id: id++,
      name: 'Pride and Prejudice',
      published: -4952074022000,
      languages: ['en'],
      toc: [],
      sections: 0,
      starred: false,
      tags: [tags[0].id],
      version: process.enve.ASTPUB_VERSION,
      words: '123',
    },
    {
      authors: 'Charles Dickens',
      bookmark: { section: 0, element: 0 },
      id: id++,
      name: 'A Tale of Two Cities',
      published: -3502828800000,
      languages: ['en'],
      toc: [],
      sections: 0,
      starred: true,
      tags: [tags[0].id, tags[1].id],
      version: process.enve.ASTPUB_VERSION,
      words: '123k',
    },
    {
      authors: 'Herman Melville',
      bookmark: { section: 0, element: 0 },
      id: id++,
      name: 'Moby Dick; Or, The Whale',
      published: -3730233600000,
      languages: ['en'],
      toc: [],
      sections: 0,
      starred: false,
      tags: [tags[2].id],
      version: process.enve.ASTPUB_VERSION,
      words: '1.23m',
    },
  ];
  mockGetItem.mockResolvedValueOnce(pubs);

  // Mock <Cover>'s localForage.getItem() calls
  mockGetItem.mockResolvedValue(null);

  // Render <Library>
  const store = createStore(reducer);
  const { getByPlaceholderText, getByText } = render(
    <StaticRouter>
      <Provider store={store}>
        <Library />
      </Provider>
    </StaticRouter>,
    { container: document.getElementById('content')! },
  );
  await waitForDomChange();

  // All should be rendered
  getByText('A Tale of Two Cities');
  getByText('Pride and Prejudice');
  getByText('Moby Dick; Or, The Whale');

  getByText('tag-0');
  getByText('tag-1');
  getByText('tag-2');

  // Filter by tag
  fireEvent.click(getByText('tag-0'));
  getByText('A Tale of Two Cities');
  getByText('Pride and Prejudice');
  expect(() => getByText('Moby Dick; Or, The Whale')).toThrow();

  // Filter by multiple tags
  fireEvent.click(getByText('tag-1'));
  getByText('A Tale of Two Cities');
  expect(() => getByText('Pride and Prejudice')).toThrow();
  expect(() => getByText('Moby Dick; Or, The Whale')).toThrow();

  // Disable tags
  fireEvent.click(getByText('tag-0'));
  fireEvent.click(getByText('tag-1'));
  getByText('A Tale of Two Cities');
  getByText('Pride and Prejudice');
  getByText('Moby Dick; Or, The Whale');

  // Filter by search
  fireEvent.change(getByPlaceholderText('A Tale of Two Cities'), {
    target: { value: 'moby dick' },
  });
  getByText('Moby Dick; Or, The Whale');
  expect(() => getByText('Pride and Prejudice')).toThrow();
  expect(() => getByText('A Tale of Two Cities')).toThrow();
});
