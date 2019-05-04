import { waitForDomChange, fireEvent, render } from 'react-testing-library';
import { SnackbarProvider } from 'notistack';
import * as localForage from 'localforage';
import { Insightful } from 'types/insightful';
import { Import } from 'components/Import';
import * as JSZip from 'jszip';
import * as React from 'react';
import axios from 'axios';

test('<Import>', async () => {
  // Render <Import>
  const { getByPlaceholderText, asFragment, getByText } = render(
    <SnackbarProvider>
      <Import />
    </SnackbarProvider>
  );
  expect(asFragment()).toMatchSnapshot();

  // Create zip file
  const entity: Insightful.Entity = {
    authors: 'Jane Austen',
    bookmark: { element: 0, section: 0, width: 0, line: 0 },
    id: Date.now(),
    name: 'Pride and Prejudice',
    cover: 'images/cover.jpg',
    published: -4952074022000,
    spine: [],
    starred: false,
    tags: [],
    version: process.enve.ASTPUB_VERSION,
    words: '123'
  };
  const zip = new JSZip();
  zip.file('images/cover.jpg', 'shhh 🤫 not actually a cover');
  zip.file('meta.json', JSON.stringify(entity));

  // Mock localForage and axios
  const mockSetItem = ((localForage as any).setItem = jest.fn());
  const mockGetItem = ((localForage as any).getItem = jest.fn());
  const mockPost = ((axios as any).post = jest.fn());

  // Mock localForage.setItem()
  mockSetItem.mockResolvedValue(undefined);

  // Mock getting entity-list
  mockGetItem.mockResolvedValueOnce([]);

  // Mock getting tag-list
  // Contains one so we can test linking existing tags
  const tags: Insightful.Tag[] = [{ id: Date.now(), name: 'Jane Austen' }];
  mockGetItem.mockResolvedValueOnce(tags);

  // Mock API to convert content
  mockPost.mockResolvedValueOnce(await zip.generateAsync({ type: 'blob' }));

  // Import from text
  fireEvent.change(getByPlaceholderText('Paste content here...'), {
    target: { value: 'Hello, world.' }
  });
  fireEvent.click(getByText('Import from link'));
  await waitForDomChange();

  // Validate API call
  expect(mockPost).toHaveBeenCalledWith(
    '/convert',
    { text: 'Hello, world.' },
    { responseType: 'arraybuffer' }
  );

  // Validate localforage
  expect(mockSetItem).toHaveBeenCalledTimes(4);
  expect(mockSetItem).toHaveBeenNthCalledWith(0, `entity-cover-${entity.id}`);
  expect(mockSetItem).toHaveBeenNthCalledWith(1, `entity-${entity.id}`);
  expect(mockSetItem).toHaveBeenNthCalledWith(2, 'tag-list');
  expect(mockSetItem).toHaveBeenNthCalledWith(3, 'entity-list');

  // Validate cover

  // Validate file has been edited (new tags added) before save
  const _zip = await JSZip.loadAsync(mockSetItem.mock.calls[1][1]);
  const _entity: Insightful.Entity = JSON.parse(
    await _zip.file('meta.json').async('text')
  );
  expect(entity.tags).not.toMatchObject(_entity.tags);
  expect({ ...entity, tags: _entity.tags }).toMatchObject(_entity);

  // Validate tags have been added
  // Use tags and _entity.tags
  expect(mockSetItem.mock.calls[2][1]).toMatchObject([]);

  // Validate entity has been added
  expect(mockSetItem.mock.calls[3][1]).toMatchObject([_entity]);

  // Add link
  // Import from link
  // ---
  // Add files
  // Remove file
  // Import from files
});
