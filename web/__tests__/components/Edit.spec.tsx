import { MemoryRouter, Switch, Route } from 'react-router-dom';
import { fireEvent, render, wait } from '@testing-library/react';
import { SnackbarProvider } from 'notistack';
import { readFileSync } from 'fs';
import { Illuminsight } from 'types/illuminsight';
import { testTags } from 'lib/test/data';
import localForage from 'localforage';
import { resolve } from 'path';
import * as React from 'react';
import { Edit } from 'components/Edit';
import JSZip from 'jszip';

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
  let pub: Illuminsight.Pub = JSON.parse(
    await zip.file('meta.json').async('text')
  );

  // Fake bookmark so we can test reset function
  pub.bookmark.element = 990;
  // Fake tags
  pub.tags = [testTags[0].id, testTags[2].id];
  zip.file('meta.json', JSON.stringify(pub));

  // Mock loading file from localForage
  mockGetItem.mockResolvedValueOnce(await zip.generateAsync({ type: 'blob' }));

  // Mock creating image blob url
  const blobUrl = 'blob:/d81d5be1';
  mockCreateObjectURL.mockReturnValue(blobUrl);

  // Mock loading tag-list from localForage
  mockGetItem.mockResolvedValueOnce(testTags);

  // Render <Edit>
  const { getByLabelText, getByText, container } = render(
    <SnackbarProvider>
      <MemoryRouter initialEntries={[`/edit/${pub.id}`]}>
        <Switch>
          <Route path="/edit/:pubId" component={Edit} />
        </Switch>
      </MemoryRouter>
    </SnackbarProvider>,
    { container: document.getElementById('content')! }
  );

  // Validate mock loading file from localForage
  await wait(() => expect(mockGetItem).toHaveBeenCalledTimes(2));
  expect(mockGetItem).toHaveBeenCalledWith(`pub-${pub.id}`);

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

  // Validate bookmark
  getByText('bookmark at section', { exact: false });
  getByText('#1');
  getByText('#990');

  // Remove bookmark
  fireEvent.click(getByText('Remove'));

  // Validate bookmark gone
  expect(() => getByText('Remove')).toThrow();

  // Set cover
  expect(mockRevokeObjectURL).toHaveBeenCalledTimes(0);
  fireEvent.change(getByLabelText('Set Cover'), {
    target: { files: [new File([], 'cover.png')] }
  });

  // Validate old cover url was revoked and new generated
  expect(mockRevokeObjectURL).toHaveBeenCalledWith(blobUrl);
  expect(mockCreateObjectURL).toHaveBeenCalledTimes(2);

  // Mock loading pub-list from localForage
  mockGetItem.mockResolvedValueOnce([pub]);

  // Add new tag
  fireEvent.change(getByLabelText('Tag'), { target: { value: 'echo' } });
  fireEvent.click(getByLabelText('Add tag'));

  // Link existing tag
  fireEvent.change(getByLabelText('Tag'), { target: { value: 'bravo' } });
  fireEvent.click(getByLabelText('Add tag'));

  // Delete tag charlie: [alpha, charlie, echo, bravo]
  fireEvent.click(
    container.querySelectorAll(
      'div[role="button"] > svg[role="presentation"]'
    )[1]
  );

  // Add new language: French
  fireEvent.change(getByLabelText('Language'), { target: { value: 'french' } });
  fireEvent.click(getByLabelText('Add language'));

  // Delete language: English
  fireEvent.click(
    container.querySelectorAll(
      'div[role="button"] > svg[role="presentation"]'
    )[3]
  );

  // Click save
  fireEvent.click(getByText('Update'));

  // Wait for setItem()
  await wait(() => expect(mockSetItem).toHaveBeenCalledTimes(4));

  // Validate the file was saved
  expect(mockSetItem.mock.calls[0][0]).toBe(`pub-${pub.id}`);
  zip = await JSZip.loadAsync(mockSetItem.mock.calls[0][1]);
  pub = JSON.parse(await zip.file('meta.json').async('text'));

  // Validate meta.json
  const _pub: Illuminsight.Pub = {
    ...pub,
    name: 'Name',
    link: 'https://example.com',
    authors: 'Some Author',
    languages: ['fr'],
    // published: 1595203200000,
    publisher: 'Publisher',
    cover: 'res/cover.png',
    bookmark: { element: 0, section: 0 }
  };
  expect(pub).toMatchObject(_pub);

  // Validate tags
  expect(pub.tags).toBeArrayOfSize(3); // alpha, echo, bravo
  expect(pub.tags[0]).toBe(testTags[0].id); // alpha remains
  expect(pub.tags[2]).toBe(testTags[1].id); // bravo linked
  expect(pub.tags).not.toContain(testTags[2].id); // charlie deleted

  // Validate cover was extracted
  expect(mockSetItem.mock.calls[1][0]).toBe(`pub-cover-${pub.id}`);
  expect(mockSetItem.mock.calls[1][1]).toStrictEqual(imgBlob);

  // Validate pub-list was updated
  expect(mockSetItem.mock.calls[2][0]).toBe('pub-list');
  expect(mockSetItem.mock.calls[2][1]).toMatchObject([_pub]);

  // Validate tag-list was updated
  // charlie deleted (orphaned), echo added
  expect(mockSetItem.mock.calls[3][0]).toBe('tag-list');
  const newTags: Illuminsight.Tag[] = mockSetItem.mock.calls[3][1];
  expect(newTags).toBeArrayOfSize(3);
  expect(newTags[0]).toMatchObject(testTags[0]); // alpha
  expect(newTags[1]).toMatchObject(testTags[1]); // bravo
  expect(newTags[2].name).toBe('echo');

  // Mock loading pub-list from localForage
  mockGetItem.mockResolvedValueOnce([pub]);

  // Click delete button
  fireEvent.click(getByText('Delete'));

  // Validate file and cover was removed
  await wait(() => expect(mockRemoveItem).toHaveBeenCalledTimes(2));
  expect(mockRemoveItem).toHaveBeenCalledWith(`pub-${pub.id}`);
  expect(mockRemoveItem).toHaveBeenCalledWith(`pub-cover-${pub.id}`);

  // Validate pub-list was updated
  expect(mockSetItem).toHaveBeenCalledTimes(6);
  expect(mockSetItem.mock.calls[4][0]).toBe('pub-list');
  expect(mockSetItem.mock.calls[4][1]).toMatchObject([]);

  // Validate tag-list was updated (orphans [all] removed)
  expect(mockSetItem.mock.calls[5][0]).toBe('tag-list');
  expect(mockSetItem.mock.calls[5][1]).toMatchObject([]);

  // Validate cover was revoked on unmount
  expect(mockRevokeObjectURL).toHaveBeenCalledTimes(2);
});
