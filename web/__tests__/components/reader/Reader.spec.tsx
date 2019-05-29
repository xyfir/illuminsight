import { MemoryRouter, Switch, Route } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';
import * as localForage from 'localforage';
import { readFileSync } from 'fs';
import { Insightful } from 'types/insightful';
import { resolve } from 'path';
import { Reader } from 'components/reader/Reader';
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
  // jsdom does not implement scrollIntoView()
  const mockHTMLHeadingElementScrollIntoView = (HTMLHeadingElement.prototype.scrollIntoView = jest.fn());
  const mockSVGElementScrollIntoView = (SVGElement.prototype.scrollIntoView = jest.fn());

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
  let pub: Insightful.Pub = JSON.parse(
    await zip.file('meta.json').async('text')
  );

  // Set bookmark so we can test that it navigates to it
  pub.bookmark.element = 1;
  zip.file('meta.json', JSON.stringify(pub));

  // Mock loading file from localForage
  mockGetItem.mockResolvedValueOnce(await zip.generateAsync({ type: 'blob' }));

  // Mock creating image blob url
  const blobUrl = 'blob:/d81d5be1';
  mockCreateObjectURL.mockReturnValue(blobUrl);

  // Render <Reader>
  const { getAllByText, getByTestId, getByText, container } = render(
    <SnackbarProvider>
      <MemoryRouter initialEntries={[`/read/${pub.id}`]}>
        <Switch>
          <Route path="/read/:pubId" component={Reader} />
        </Switch>
      </MemoryRouter>
    </SnackbarProvider>,
    { container: document.getElementById('content')! }
  );

  // Validate mock loading file from localForage
  await wait(() => expect(mockGetItem).toHaveBeenCalledTimes(1));
  expect(mockGetItem).toHaveBeenCalledWith(`pub-${pub.id}`);

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
    expect(mockSVGElementScrollIntoView).toHaveBeenCalledTimes(1)
  );

  // Go to next section
  fireEvent.click(getAllByText('Next')[0]);
  await waitForDomChange();

  // Validate image urls have been revoked
  expect(mockRevokeObjectURL).toHaveBeenCalledWith(blobUrl);

  // Validate content has changed
  expect(getByText('A TALE OF TWO CITIES').tagName).toBe('H1');

  // Validate mock setItem() receives zip with updated meta.json
  expect(mockSetItem).toHaveBeenCalledTimes(1);
  expect(mockSetItem.mock.calls[0][0]).toBe(`pub-${pub.id}`);
  zip = await JSZip.loadAsync(mockSetItem.mock.calls[0][1]);
  pub = JSON.parse(await zip.file('meta.json').async('text'));
  expect(pub.bookmark).toMatchObject({
    section: 1,
    element: 0
  } as Insightful.Pub['bookmark']);

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
  pub = JSON.parse(await zip.file('meta.json').async('text'));
  expect(pub.bookmark).toMatchObject({
    section: 1,
    element: 2
  } as Insightful.Pub['bookmark']);

  // Validate onScroll() throttles itself
  fireEvent.scroll(getByTestId('reader'), { target: { scrollTop: 200 } });
  expect(mockQuerySelectorAll).toHaveBeenCalledTimes(1);
  document.querySelectorAll = querySelectorAll;

  // Skip two sections
  fireEvent.click(getAllByText('Next')[0]);
  await waitForDomChange();
  fireEvent.click(getAllByText('Next')[0]);
  await waitForDomChange();

  // Click link to another section and validate history works
  expect(() => getAllByText('Back')).toThrow();
  fireEvent.click(getAllByText('I.')[0]);
  await waitForDomChange();
  expect(getAllByText('Back')).toBeArrayOfSize(2);

  // Validate clicking link changes section
  zip = await JSZip.loadAsync(mockSetItem.mock.calls[4][1]);
  pub = JSON.parse(await zip.file('meta.json').async('text'));
  expect(pub.bookmark).toMatchObject({
    section: 4,
    element: 'link2H_4_0002'
  } as Insightful.Pub['bookmark']);
});
