import { MemoryRouter, Switch, Route } from 'react-router';
import { SnackbarProvider } from 'notistack';
import { Illuminsight } from 'types';
import { createStore } from 'redux';
import * as convert from 'lib/import/convert';
import { Provider } from 'react-redux';
import { reducer } from 'store/reducers';
import { testPub } from 'lib/test/data';
import localForage from 'localforage';
import { Import } from 'components/Import';
import * as React from 'react';
import JSZip from 'jszip';
import axios from 'axios';
import {
  waitForElementToBeRemoved,
  waitForElement,
  fireEvent,
  render,
  wait,
} from '@testing-library/react';

test('<Import> epub', async () => {
  // Render <Import>
  const store = createStore(reducer);
  const { getAllByLabelText, getByLabelText, getByText } = render(
    <SnackbarProvider>
      <Provider store={store}>
        <MemoryRouter initialEntries={['/import/epub']}>
          <Switch>
            <Route path="/import/:type" component={Import} />
          </Switch>
        </MemoryRouter>
      </Provider>
    </SnackbarProvider>,
    { container: document.getElementById('content')! },
  );

  // Create zip file
  const zip = new JSZip();
  zip.file('images/cover.jpg', 'shhh not actually a cover');
  zip.file('meta.json', JSON.stringify(testPub));

  // Add files
  fireEvent.change(getByLabelText('Upload EPUB'), {
    target: { files: [new File([], 'book.epub'), new File([], 'book2.epub')] },
  });
  await waitForElement(() => getByText('book.epub'));

  // Remove first file
  fireEvent.click(getAllByLabelText('Remove')[0]);
  expect(() => getByText('book.epub')).toThrow();

  // Mocks
  const mockSetItem = ((localForage as any).setItem = jest.fn());
  const mockGetItem = ((localForage as any).getItem = jest.fn());
  const mockConvert = ((convert as any).convert = jest.fn());

  // Mock convert
  mockConvert.mockResolvedValueOnce(await zip.generateAsync({ type: 'blob' }));

  // Mock localForage.setItem()
  mockSetItem.mockResolvedValue(undefined);

  // Mock getting pub-list
  mockGetItem.mockResolvedValueOnce([]);

  // Mock getting tag-list
  // Contains one so we can test linking existing tags
  const tags: Illuminsight.Tag[] = [{ id: Date.now(), name: 'jane-austen' }];
  mockGetItem.mockResolvedValueOnce(tags);

  // Import from files
  fireEvent.click(getByText('Import from Files'));
  await waitForElementToBeRemoved(() =>
    getByText('Importing content. This may take a while...'),
  );

  // Validate localforage
  await wait(() => expect(mockSetItem).toHaveBeenCalledTimes(4));

  // Validate cover
  expect(mockSetItem.mock.calls[0][0]).toBe(`pub-cover-${testPub.id}`);
  expect((mockSetItem.mock.calls[0][1] as Blob).size).toBe(25);

  // Validate file
  // Must have been edited (new tags added) before save
  expect(mockSetItem.mock.calls[1][0]).toBe(`pub-${testPub.id}`);
  const _zip = await JSZip.loadAsync(mockSetItem.mock.calls[1][1]);
  const _pub: Illuminsight.Pub = JSON.parse(
    await _zip.file('meta.json').async('text'),
  );
  expect(testPub.tags).not.toMatchObject(_pub.tags);
  expect({ ...testPub, tags: _pub.tags }).toMatchObject(_pub);

  // Validate tags have been added (two additional)
  expect(mockSetItem.mock.calls[2][0]).toBe('tag-list');
  expect(mockSetItem.mock.calls[2][1]).toBeArrayOfSize(2);

  // Validate pub has been added
  expect(mockSetItem.mock.calls[3][0]).toBe('pub-list');
  expect(mockSetItem.mock.calls[3][1]).toMatchObject([_pub]);
});

test('<Import> sample', async () => {
  // Mock downloading
  const mockGet = ((axios as any).get = jest.fn());
  mockGet.mockResolvedValue({ data: new Buffer([]) });

  // Render <Import>
  const store = createStore(reducer);
  const { getByText } = render(
    <SnackbarProvider>
      <Provider store={store}>
        <MemoryRouter initialEntries={['/import/sample']}>
          <Switch>
            <Route path="/import/:type" component={Import} />
          </Switch>
        </MemoryRouter>
      </Provider>
    </SnackbarProvider>,
    { container: document.getElementById('content')! },
  );

  // Validate downloads/uploads
  await wait(() => expect(mockGet).toHaveBeenCalledTimes(4));
  getByText('Tale_of_Two_Cities.epub');
});
