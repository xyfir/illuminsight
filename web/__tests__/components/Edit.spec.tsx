import { MemoryRouter, Switch, Route } from 'react-router-dom';
import { fireEvent, render, wait } from 'react-testing-library';
import { SnackbarProvider } from 'notistack';
import * as localForage from 'localforage';
import { readFileSync } from 'fs';
import { Insightful } from 'types/insightful';
import { resolve } from 'path';
import * as React from 'react';
import * as JSZip from 'jszip';
import { Edit } from 'components/Edit';

test('<Edit>', async () => {
  // Mock localForage and URL
  const mockRevokeObjectURL = ((URL as any).revokeObjectURL = jest.fn());
  const mockCreateObjectURL = ((URL as any).createObjectURL = jest.fn());
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
  zip.file('meta.json', JSON.stringify(entity));

  // Mock loading file from localForage
  mockGetItem.mockResolvedValueOnce(await zip.generateAsync({ type: 'blob' }));

  // Mock creating image blob url
  const blobUrl = 'blob:/d81d5be1';
  mockCreateObjectURL.mockReturnValue(blobUrl);

  // Render <Edit>
  const { getByLabelText, getByText } = render(
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

  // Validate image urls have not yet been revoked
  expect(mockRevokeObjectURL).toHaveBeenCalledTimes(0);

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
  fireEvent.change(getByLabelText('Set Cover'), {
    target: { files: [new File([], 'cover.png')] }
  });

  // Click save
  fireEvent.click(getByText('Save'));

  // Wait for setItem()
  await wait(() => expect(mockSetItem).toHaveBeenCalledTimes(1));
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
});
