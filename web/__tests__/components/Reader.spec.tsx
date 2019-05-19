import { MemoryRouter, Switch, Route } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';
import * as localForage from 'localforage';
import { readFileSync } from 'fs';
import { Insightful } from 'types/insightful';
import { resolve } from 'path';
import { Reader } from 'components/Reader';
import * as React from 'react';
import * as JSZip from 'jszip';
import {
  waitForDomChange,
  fireEvent,
  render,
  wait
} from 'react-testing-library';

test('<Reader>', async () => {
  // Mock scrolling to bookmarked element
  const mockHTMLDivElementScrollIntoView = (HTMLDivElement.prototype.scrollIntoView = jest.fn());

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

  // Mock loading file from localForage
  mockGetItem.mockResolvedValueOnce(await zip.generateAsync({ type: 'blob' }));

  // Mock creating image blob url
  const blobUrl = 'blob:/d81d5be1';
  mockCreateObjectURL.mockReturnValue(blobUrl);

  // Render <Reader>
  const { getAllByText, getByTestId, getByText, container } = render(
    <SnackbarProvider>
      <MemoryRouter initialEntries={[`/read/${entity.id}`]}>
        <Switch>
          <Route path="/read/:entityId" component={Reader} />
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

  // Validate image rendered with blob url
  // An in-depth test of AST rendering is done elsewhere in <AST>'s spec
  const imageElement = container.querySelector('image') as SVGImageElement;
  expect(imageElement).not.toBeNull();
  expect(imageElement.getAttribute('href')).toBe(blobUrl);

  // Validate image urls have not yet been revoked
  expect(mockRevokeObjectURL).toHaveBeenCalledTimes(0);

  // Validate bookmarked element was scrolled to (default element 0)
  await wait(() =>
    expect(mockHTMLDivElementScrollIntoView).toHaveBeenCalledTimes(1)
  );

  // Go to next section
  fireEvent.click(getAllByText('Next Section')[0]);
  await waitForDomChange();

  // Validate image urls have been revoked
  expect(mockRevokeObjectURL).toHaveBeenCalledWith(blobUrl);

  // Validate content has changed
  expect(getByText('A TALE OF TWO CITIES').tagName).toBe('H1');

  // Validate mock setItem() receives zip with updated meta.json
  expect(mockSetItem).toHaveBeenCalledTimes(1);
  expect(mockSetItem.mock.calls[0][0]).toBe(`entity-${entity.id}`);
  zip = await JSZip.loadAsync(mockSetItem.mock.calls[0][1]);
  entity = JSON.parse(await zip.file('meta.json').async('text'));
  expect(entity.bookmark).toMatchObject({
    section: 1,
    element: 0
  } as Insightful.Entity['bookmark']);

  // Mock document.querySelectorAll()
  const querySelectorAll = document.querySelectorAll;
  const mockQuerySelectorAll = ((document as any).querySelectorAll = jest.fn(
    () => [
      { offsetTop: 0 },
      { offsetTop: 50 },
      { offsetTop: 100 },
      { offsetTop: 150 },
      { offsetTop: 200 }
    ]
  ));

  // Scroll through reader content
  fireEvent.scroll(getByTestId('reader'), { target: { scrollTop: 100 } });

  // Validate mock setItem() receives zip with updated meta.json
  await wait(() => expect(mockSetItem).toHaveBeenCalledTimes(2));
  zip = await JSZip.loadAsync(mockSetItem.mock.calls[1][1]);
  entity = JSON.parse(await zip.file('meta.json').async('text'));
  expect(entity.bookmark).toMatchObject({
    section: 1,
    element: 2
  } as Insightful.Entity['bookmark']);

  // Validate onScroll() throttles itself
  fireEvent.scroll(getByTestId('reader'), { target: { scrollTop: 200 } });
  expect(mockQuerySelectorAll).toHaveBeenCalledTimes(1);
  document.querySelectorAll = querySelectorAll;

  // Skip two sections
  fireEvent.click(getAllByText('Next Section')[0]);
  await waitForDomChange();
  fireEvent.click(getAllByText('Next Section')[0]);
  await waitForDomChange();

  // Click link to another section
  fireEvent.click(getAllByText('I.')[0]);
  await waitForDomChange();

  // Validate clicking link changes section
  zip = await JSZip.loadAsync(mockSetItem.mock.calls[4][1]);
  entity = JSON.parse(await zip.file('meta.json').async('text'));
  expect(entity.bookmark).toMatchObject({
    section: 4,
    element: 'link2H_4_0002'
  } as Insightful.Entity['bookmark']);
});
