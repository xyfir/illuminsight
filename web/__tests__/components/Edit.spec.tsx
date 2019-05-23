import { MemoryRouter, Switch, Route } from 'react-router-dom';
import { fireEvent, render, wait } from 'react-testing-library';
import { SnackbarProvider } from 'notistack';
import * as localForage from 'localforage';
import { readFileSync } from 'fs';
import { Insightful } from 'types/insightful';
import { testTags } from 'lib/test/objects';
import { resolve } from 'path';
import * as React from 'react';
import * as JSZip from 'jszip';
import { Edit } from 'components/Edit';

test('<Edit>', async () => {
  // Mock localForage and URL
  const mockRevokeObjectURL = ((URL as any).revokeObjectURL = jest.fn());
  const mockCreateObjectURL = ((URL as any).createObjectURL = jest.fn());
  const mockRemoveItem = ((localForage as any).removeItem = jest.fn());
  const mockSetItem = ((localForage as any).setItem = jest.fn());
  const mockGetItem = ((localForage as any).getItem = jest.fn());
  const imgBlob = new Blob();

  // Load ASTPub
  let zip = await JSZip.loadAsync(
    readFileSync(resolve(process.enve.FILES_DIRECTORY, 'ebook.astpub'))
  );
  let entity: Insightful.Entity = JSON.parse(
    await zip.file('meta.json').async('text')
  );

  // Fake bookmark so we can test reset function
  entity.bookmark.element = 990;
  // Fake tags
  entity.tags = [testTags[0].id, testTags[2].id];
  zip.file('meta.json', JSON.stringify(entity));

  // Mock loading file from localForage
  mockGetItem.mockResolvedValueOnce(await zip.generateAsync({ type: 'blob' }));

  // Mock creating image blob url
  const blobUrl = 'blob:/d81d5be1';
  mockCreateObjectURL.mockReturnValue(blobUrl);

  // Render <Edit>
  const { getByLabelText, getByText, unmount } = render(
    <SnackbarProvider>
      <MemoryRouter initialEntries={[`/edit/${entity.id}`]}>
        <Switch>
          <Route path="/edit/:entityId" component={Edit} />
        </Switch>
      </MemoryRouter>
    </SnackbarProvider>
  );

  // Validate mock loading file from localForage
  await wait(() => expect(mockGetItem).toHaveBeenCalledTimes(1));
  expect(mockGetItem).toHaveBeenCalledWith(`entity-${entity.id}`);

  // Validate mock creating image blob url
  await wait(() => expect(mockCreateObjectURL).toHaveBeenCalledTimes(1));
  expect(mockCreateObjectURL).toHaveBeenCalledWith(imgBlob);

  // Set new data
  fireEvent.change(getByLabelText('Name'), { target: { value: 'Name' } });
  fireEvent.change(getByLabelText('Link'), {
    target: { value: 'https://example.com' }
  });
  fireEvent.change(getByLabelText('Author(s)'), {
    target: { value: 'Some Author' }
  });
  // fireEvent.change(getByLabelText('Published'), {
  //   target: { value: '2020-07-20' }
  // });
  fireEvent.change(getByLabelText('Publisher'), {
    target: { value: 'Publisher' }
  });

  // Reset bookmark
  fireEvent.click(getByText('Reset Bookmark'));

  // Set cover
  expect(mockRevokeObjectURL).toHaveBeenCalledTimes(0);
  fireEvent.change(getByLabelText('Set Cover'), {
    target: { files: [new File([], 'cover.png')] }
  });

  // Validate old cover url was revoked and new generated
  expect(mockRevokeObjectURL).toHaveBeenCalledWith(blobUrl);
  expect(mockCreateObjectURL).toHaveBeenCalledTimes(2);

  // Mock loading entity-list from localForage
  mockGetItem.mockResolvedValueOnce([entity]);

  // Click save
  fireEvent.click(getByText('Save'));

  // Wait for setItem()
  await wait(() => expect(mockSetItem).toHaveBeenCalledTimes(3));

  // Validate the file was saved
  expect(mockSetItem.mock.calls[0][0]).toBe(`entity-${entity.id}`);
  zip = await JSZip.loadAsync(mockSetItem.mock.calls[0][1]);
  entity = JSON.parse(await zip.file('meta.json').async('text'));

  // Validate meta.json
  const _entity: Insightful.Entity = {
    ...entity,
    name: 'Name',
    link: 'https://example.com',
    authors: 'Some Author',
    // published: 1595203200000,
    publisher: 'Publisher',
    cover: 'res/cover.png',
    bookmark: { element: 0, section: 0 }
  };
  expect(entity).toMatchObject(_entity);

  // Validate cover was extracted
  expect(mockSetItem.mock.calls[1][0]).toBe(`entity-cover-${entity.id}`);
  expect(mockSetItem.mock.calls[1][1]).toStrictEqual(imgBlob);

  // Validate entity-list was updated
  expect(mockSetItem.mock.calls[2][0]).toBe('entity-list');
  expect(mockSetItem.mock.calls[2][1]).toMatchObject([_entity]);

  // Mock loading entity-list and tag-list from localForage
  mockGetItem.mockResolvedValueOnce([entity]);
  mockGetItem.mockResolvedValueOnce(testTags);

  // Click delete button
  fireEvent.click(getByText('Delete'));

  // Validate file and cover was removed
  await wait(() => expect(mockRemoveItem).toHaveBeenCalledTimes(2));
  expect(mockRemoveItem).toHaveBeenCalledWith(`entity-${entity.id}`);
  expect(mockRemoveItem).toHaveBeenCalledWith(`entity-cover-${entity.id}`);

  // Validate entity-list was updated
  expect(mockSetItem).toHaveBeenCalledTimes(5);
  expect(mockSetItem.mock.calls[3][0]).toBe('entity-list');
  expect(mockSetItem.mock.calls[3][1]).toMatchObject([]);

  // Validate tag-list was updated (orphans removed)
  expect(mockSetItem.mock.calls[4][0]).toBe('tag-list');
  expect(mockSetItem.mock.calls[4][1]).toMatchObject([
    testTags[1],
    testTags[3]
  ]);

  // Validate cover was revoked on unmount
  expect(mockRevokeObjectURL).toHaveBeenCalledTimes(2);
});
