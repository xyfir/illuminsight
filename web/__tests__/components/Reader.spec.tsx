import { MemoryRouter, Switch, Route } from 'react-router-dom';
import { waitForDomChange, render } from 'react-testing-library';
import { testEntity, testAST } from 'lib/test/objects';
import { SnackbarProvider } from 'notistack';
import * as localForage from 'localforage';
import { Reader } from 'components/Reader';
import * as React from 'react';
import * as JSZip from 'jszip';

test('<Reader>', async () => {
  // Mock localForage and URL
  const mockRevokeObjectURL = ((URL as any).revokeObjectURL = jest.fn());
  const mockCreateObjectURL = ((URL as any).createObjectURL = jest.fn());
  const mockGetItem = ((localForage as any).getItem = jest.fn());

  // Used for mocks
  const fileBlob = new Blob();
  const imgBlob = new Blob();

  // Mock loading file from localForage
  mockGetItem.mockResolvedValueOnce(fileBlob);

  // Mock loading blob into JSZip
  const mockAsync = jest.fn();
  const mockFile = jest.fn(file => ({ async: mockAsync }));
  const mockLoadAsync = ((JSZip as any).loadAsync = jest.fn(blob => ({
    file: mockFile
  })));

  // Mock loading meta.json from zip
  mockAsync.mockReturnValueOnce(JSON.stringify(testEntity));

  // Mock loading AST from zip
  mockAsync.mockReturnValueOnce(JSON.stringify(testAST));

  // Mock loading image from zip
  mockAsync.mockReturnValueOnce(imgBlob);

  // Mock creating image blob url
  const blobUrl = 'blob:/d81d5be1';
  mockCreateObjectURL.mockReturnValueOnce(blobUrl);

  // Render <Reader>
  const { getByAltText, unmount } = render(
    <SnackbarProvider>
      <MemoryRouter initialEntries={['/read/1556915133437']}>
        <Switch>
          <Route path="/read/:entityId" component={Reader} />
        </Switch>
      </MemoryRouter>
    </SnackbarProvider>
  );

  // Await DOM change
  await waitForDomChange();

  // Validate mock loading file from localForage
  expect(mockGetItem).toHaveBeenCalledTimes(1);
  expect(mockGetItem).toHaveBeenCalledWith('entity-1556915133437');

  // Validate mock loading blob into JSZip
  expect(mockLoadAsync).toHaveBeenCalledTimes(1);
  expect(mockLoadAsync).toHaveBeenCalledWith(fileBlob);

  // Validate JSZip mocks
  expect(mockFile).toHaveBeenCalledTimes(3);
  expect(mockAsync).toHaveBeenCalledTimes(3);

  // Validate mock loading meta.json from zip
  expect(mockFile.mock.calls[0][0]).toBe('meta.json');
  expect(mockAsync.mock.calls[0][0]).toBe('text');

  // Validate mock loading AST from zip
  expect(mockFile.mock.calls[1][0]).toBe('sections/1.json');
  expect(mockAsync.mock.calls[1][0]).toBe('text');

  // Validate mock loading image from zip
  expect(mockFile.mock.calls[2][0]).toBe('images/1.png');
  expect(mockAsync.mock.calls[2][0]).toBe('blob');

  // Validate mock creating image blob url
  expect(mockCreateObjectURL).toHaveBeenCalledTimes(1);
  expect(mockCreateObjectURL).toHaveBeenCalledWith(imgBlob);

  // Validate image rendered with blob url
  // An in-depth test of AST rendering is done elsewhere in <AST>'s spec
  const el = getByAltText('A picture of ...');
  expect(el.tagName).toBe('IMG');
  expect((el as HTMLImageElement).src).toBe(blobUrl);

  // Validate image blob url was revoked after unmount
  expect(mockRevokeObjectURL).toHaveBeenCalledTimes(0);
  unmount();
  expect(mockRevokeObjectURL).toHaveBeenCalledWith(blobUrl);
});
