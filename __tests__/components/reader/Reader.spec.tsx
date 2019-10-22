/* eslint-disable @typescript-eslint/unbound-method */
import { MemoryRouter, Switch, Route } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';
import { readFileSync } from 'fs';
import { Illuminsight } from 'types';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { reducer } from 'store/reducers';
import localForage from 'localforage';
import { resolve } from 'path';
import { Reader } from 'components/reader/Reader';
import * as React from 'react';
import JSZip from 'jszip';
import {
  waitForDomChange,
  fireEvent,
  render,
  wait,
} from '@testing-library/react';

test(
  '<Reader>',
  async () => {
    // Mock scrolling to elements
    // jsdom does not implement scrollIntoView()
    HTMLHeadingElement.prototype.scrollIntoView = jest.fn();
    HTMLAnchorElement.prototype.scrollIntoView = jest.fn();
    HTMLDivElement.prototype.scrollIntoView = jest.fn();
    const mockSVGElementScrollIntoView = (SVGElement.prototype.scrollIntoView = jest.fn());

    // Mock localForage and URL
    const mockRevokeObjectURL = ((URL as any).revokeObjectURL = jest.fn());
    const mockCreateObjectURL = ((URL as any).createObjectURL = jest.fn());
    const mockSetItem = ((localForage as any).setItem = jest.fn());
    const mockGetItem = ((localForage as any).getItem = jest.fn());
    const imgBlob = new Blob();

    // Load ASTPub
    let zip = await JSZip.loadAsync(
      readFileSync(resolve(process.enve.FILES_DIRECTORY, 'ebook.astpub')),
    );
    let pub: Illuminsight.Pub = JSON.parse(
      await zip.file('meta.json').async('text'),
    );

    // Set bookmark so we can test that it navigates to it
    pub.bookmark.element = 1;
    zip.file('meta.json', JSON.stringify(pub));

    // Mock loading recipe from localForage
    mockGetItem.mockResolvedValueOnce(null);

    // Mock loading file from localForage
    mockGetItem.mockResolvedValueOnce(
      await zip.generateAsync({ type: 'blob' }),
    );

    // Mock creating image blob url
    const blobUrl = 'blob:/d81d5be1';
    mockCreateObjectURL.mockReturnValue(blobUrl);

    // Render <Reader>
    const store = createStore(reducer);
    const {
      getAllByText,
      getByTestId,
      getByTitle,
      getByText,
      container,
    } = render(
      <Provider store={store}>
        <SnackbarProvider>
          <MemoryRouter initialEntries={[`/read/${pub.id}`]}>
            <Switch>
              <Route path="/read/:pubId" component={Reader} />
            </Switch>
          </MemoryRouter>
        </SnackbarProvider>
      </Provider>,
      { container: document.getElementById('content')! },
    );

    // Validate mock loading file from localForage
    await wait(() => expect(mockGetItem).toHaveBeenCalledTimes(2));
    expect(mockGetItem).toHaveBeenCalledWith(`pub-recipe-${pub.id}`);
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
      expect(mockSVGElementScrollIntoView).toHaveBeenCalledTimes(1),
    );
    console.log('fuck');

    // Go to next section
    fireEvent.click(getByTitle('Go to next section'));
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
      element: 0,
    } as Illuminsight.Pub['bookmark']);

    // Mock document.querySelectorAll()
    const querySelectorAll = document.querySelectorAll;
    const mockQuerySelectorAll = ((document as any).querySelectorAll = jest.fn(
      () => [
        { offsetTop: 0 },
        { offsetTop: 50 },
        { offsetTop: 100, getAttribute: jest.fn(() => 2) },
        { offsetTop: 150 },
        { offsetTop: 200 },
      ],
    ));

    // Scroll through reader content
    fireEvent.scroll(getByTestId('reader'), { target: { scrollTop: 100 } });

    // Validate mock setItem() receives zip with updated meta.json
    await wait(() => expect(mockSetItem).toHaveBeenCalledTimes(2));
    zip = await JSZip.loadAsync(mockSetItem.mock.calls[1][1]);
    pub = JSON.parse(await zip.file('meta.json').async('text'));
    expect(pub.bookmark).toMatchObject({
      section: 1,
      element: 2,
    } as Illuminsight.Pub['bookmark']);

    // Validate onScroll() throttles itself
    fireEvent.scroll(getByTestId('reader'), { target: { scrollTop: 200 } });
    expect(mockQuerySelectorAll).toHaveBeenCalledTimes(1);
    // eslint-disable-next-line require-atomic-updates
    document.querySelectorAll = querySelectorAll;

    // Skip two sections
    fireEvent.click(getByTitle('Go to next section'));
    await waitForDomChange();
    fireEvent.click(getByTitle('Go to next section'));
    await waitForDomChange();

    // Click link to another section and validate history works
    expect(() => getByTitle('Go back')).toThrow();
    fireEvent.click(getAllByText('I.')[0]);
    await waitForDomChange();
    getByTitle('Go back');

    // Validate clicking link changes section
    zip = await JSZip.loadAsync(mockSetItem.mock.calls[4][1]);
    pub = JSON.parse(await zip.file('meta.json').async('text'));
    expect(pub.bookmark).toMatchObject({
      section: 4,
      element: 'link2H_4_0002',
    } as Illuminsight.Pub['bookmark']);
  },
  10 * 1000,
);
