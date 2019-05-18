import { waitForDomChange, fireEvent, render } from 'react-testing-library';
import { StaticRouter } from 'react-router-dom';
import * as localForage from 'localforage';
import { Insightful } from 'types/insightful';
import { Library } from 'components/Library';
import * as React from 'react';

test('<Library>', async () => {
  let id = 1556915133437;
  Date.prototype.getTime = () => id + 1000;

  // Mock localForage.getItem()
  const mockGetItem = ((localForage as any).getItem = jest.fn());

  // Get tag-list
  const tags: Insightful.Tag[] = [
    { id: id++, name: 'tag-0' },
    { id: id++, name: 'tag-1' },
    { id: id++, name: 'tag-2' }
  ];
  mockGetItem.mockResolvedValueOnce(tags);

  // Get entity-list
  const entities: Insightful.Entity[] = [
    {
      authors: 'Jane Austen',
      bookmark: { section: 0, element: 0 },
      id: id++,
      name: 'Pride and Prejudice',
      published: -4952074022000,
      sections: 0,
      starred: false,
      tags: [tags[0].id],
      version: process.enve.ASTPUB_VERSION,
      words: '123'
    },
    {
      authors: 'Charles Dickens',
      bookmark: { section: 0, element: 0 },
      id: id++,
      name: 'A Tale of Two Cities',
      published: -3502828800000,
      sections: 0,
      starred: true,
      tags: [tags[0].id, tags[1].id],
      version: process.enve.ASTPUB_VERSION,
      words: '123k'
    },
    {
      authors: 'Herman Melville',
      bookmark: { section: 0, element: 0 },
      id: id++,
      name: 'Moby Dick; Or, The Whale',
      published: -3730233600000,
      sections: 0,
      starred: false,
      tags: [tags[2].id],
      version: process.enve.ASTPUB_VERSION,
      words: '1.23m'
    }
  ];
  mockGetItem.mockResolvedValueOnce(entities);

  // Mock <Cover>'s localForage.getItem() calls
  mockGetItem.mockResolvedValue(null);

  // Render <Library>
  const { getByPlaceholderText, asFragment, getByText } = render(
    <StaticRouter>
      <Library />
    </StaticRouter>
  );

  // Validate all tags and entities rendered, with starred at top
  await waitForDomChange();
  expect(asFragment()).toMatchSnapshot();

  // Filter by tag
  fireEvent.click(getByText('tag-0'));
  expect(asFragment()).toMatchSnapshot();

  // Filter by multiple tags
  fireEvent.click(getByText('tag-1'));
  expect(asFragment()).toMatchSnapshot();

  // Disable tags
  fireEvent.click(getByText('tag-0'));
  fireEvent.click(getByText('tag-1'));
  expect(asFragment()).toMatchSnapshot();

  // Filter by search
  fireEvent.change(getByPlaceholderText('A Tale of Two Cities'), {
    target: { value: 'moby dick' }
  });
  expect(asFragment()).toMatchSnapshot();
});
