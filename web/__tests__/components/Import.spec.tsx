import { SnackbarProvider } from 'notistack';
import * as localForage from 'localforage';
import { MemoryRouter } from 'react-router';
import { Insightful } from 'types/insightful';
import { testPub } from 'lib/test/objects';
import { Import } from 'components/Import';
import * as JSZip from 'jszip';
import * as React from 'react';
import { api } from 'lib/app/api';
import {
  waitForElementToBeRemoved,
  waitForElement,
  fireEvent,
  render,
  wait
} from 'react-testing-library';

test('<Import>', async () => {
  // Render <Import>
  const {
    getByPlaceholderText,
    getAllByLabelText,
    getByLabelText,
    getByText
  } = render(
    <SnackbarProvider>
      <MemoryRouter>
        <Import />
      </MemoryRouter>
    </SnackbarProvider>,
    { container: document.getElementById('content')! }
  );

  // Create zip file
  const zip = new JSZip();
  zip.file('images/cover.jpg', 'shhh not actually a cover');
  zip.file('meta.json', JSON.stringify(testPub));

  async function testImport(start: (mockPost: jest.Mock) => Promise<void>) {
    // Mock localForage and axios
    const mockSetItem = ((localForage as any).setItem = jest.fn());
    const mockGetItem = ((localForage as any).getItem = jest.fn());
    const mockPost = ((api as any).post = jest.fn());

    // Mock localForage.setItem()
    mockSetItem.mockResolvedValue(undefined);

    // Mock getting pub-list
    mockGetItem.mockResolvedValueOnce([]);

    // Mock getting tag-list
    // Contains one so we can test linking existing tags
    const tags: Insightful.Tag[] = [{ id: Date.now(), name: 'jane-austen' }];
    mockGetItem.mockResolvedValueOnce(tags);

    // Mock API to convert content
    mockPost.mockResolvedValueOnce({
      data: await zip.generateAsync({ type: 'blob' })
    });

    await start(mockPost);

    // Validate localforage
    await wait(() => expect(mockSetItem).toHaveBeenCalledTimes(4));

    // Validate cover
    expect(mockSetItem.mock.calls[0][0]).toBe(`pub-cover-${testPub.id}`);
    expect((mockSetItem.mock.calls[0][1] as Blob).size).toBe(25);

    // Validate file
    // Must have been edited (new tags added) before save
    expect(mockSetItem.mock.calls[1][0]).toBe(`pub-${testPub.id}`);
    const _zip = await JSZip.loadAsync(mockSetItem.mock.calls[1][1]);
    const _pub: Insightful.Pub = JSON.parse(
      await _zip.file('meta.json').async('text')
    );
    expect(testPub.tags).not.toMatchObject(_pub.tags);
    expect({ ...testPub, tags: _pub.tags }).toMatchObject(_pub);

    // Validate tags have been added (two additional)
    expect(mockSetItem.mock.calls[2][0]).toBe('tag-list');
    expect(mockSetItem.mock.calls[2][1]).toBeArrayOfSize(2);

    // Validate pub has been added
    expect(mockSetItem.mock.calls[3][0]).toBe('pub-list');
    expect(mockSetItem.mock.calls[3][1]).toMatchObject([_pub]);
  }

  await testImport(async mockPost => {
    // Import from text
    fireEvent.change(getByPlaceholderText('Paste content here...'), {
      target: { value: 'Hello, world.' }
    });
    fireEvent.click(getByText('Import from Text'));
    await waitForElementToBeRemoved(() =>
      getByText('Importing content. This may take a while...')
    );

    // Validate API call
    expect(mockPost).toHaveBeenCalledWith(
      '/convert',
      { text: 'Hello, world.' },
      { responseType: 'arraybuffer' }
    );
  });

  await testImport(async mockPost => {
    // Import from link
    fireEvent.change(getByPlaceholderText('https://example.com/article-123'), {
      target: { value: 'https://example.com/article-123' }
    });
    fireEvent.click(getByText('Import from Link'));
    await waitForElementToBeRemoved(() =>
      getByText('Importing content. This may take a while...')
    );

    // Validate API call
    expect(mockPost).toHaveBeenCalledWith(
      '/convert',
      { link: 'https://example.com/article-123' },
      { responseType: 'arraybuffer' }
    );
  });

  // Add files
  fireEvent.change(getByLabelText('Upload File'), {
    target: { files: [new File([], 'book.epub'), new File([], 'book.pdf')] }
  });
  await waitForElement(() => getByText('book.epub'));

  // Remove first file
  fireEvent.click(getAllByLabelText('Remove')[0]);
  expect(() => getByText('book.epub')).toThrow();

  await testImport(async mockPost => {
    // Import from files
    fireEvent.click(getByText('Import from Files'));
    await waitForElementToBeRemoved(() =>
      getByText('Importing content. This may take a while...')
    );

    // Validate API call
    expect(mockPost.mock.calls[0][0]).toBe('/convert');
    expect(mockPost.mock.calls[0][1]).toBeInstanceOf(FormData);
    expect(mockPost.mock.calls[0][2]).toMatchObject({
      responseType: 'arraybuffer'
    });
  });
});
