import { SnackbarProvider } from 'notistack';
import * as localForage from 'localforage';
import { Insightful } from 'types/insightful';
import { Import } from 'components/Import';
import * as JSZip from 'jszip';
import * as React from 'react';
import { api } from 'lib/api';
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
    asFragment,
    getByText
  } = render(
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
  zip.file('images/cover.jpg', 'shhh not actually a cover');
  zip.file('meta.json', JSON.stringify(entity));

  async function testImport(start: (mockPost: jest.Mock) => Promise<void>) {
    // Mock localForage and axios
    const mockSetItem = ((localForage as any).setItem = jest.fn());
    const mockGetItem = ((localForage as any).getItem = jest.fn());
    const mockPost = ((api as any).post = jest.fn());

    // Mock localForage.setItem()
    mockSetItem.mockResolvedValue(undefined);

    // Mock getting entity-list
    mockGetItem.mockResolvedValueOnce([]);

    // Mock getting tag-list
    // Contains one so we can test linking existing tags
    const tags: Insightful.Tag[] = [{ id: Date.now(), name: 'Jane Austen' }];
    mockGetItem.mockResolvedValueOnce(tags);

    // Mock API to convert content
    mockPost.mockResolvedValueOnce({
      data: await zip.generateAsync({ type: 'blob' })
    });

    await start(mockPost);

    // Validate localforage
    await wait(() => expect(mockSetItem).toHaveBeenCalledTimes(4));

    // Validate cover
    expect(mockSetItem.mock.calls[0][0]).toBe(`entity-cover-${entity.id}`);
    expect((mockSetItem.mock.calls[0][1] as Blob).size).toBe(25);

    // Validate file
    // Must have been edited (new tags added) before save
    expect(mockSetItem.mock.calls[1][0]).toBe(`entity-${entity.id}`);
    const _zip = await JSZip.loadAsync(mockSetItem.mock.calls[1][1]);
    const _entity: Insightful.Entity = JSON.parse(
      await _zip.file('meta.json').async('text')
    );
    expect(entity.tags).not.toMatchObject(_entity.tags);
    expect({ ...entity, tags: _entity.tags }).toMatchObject(_entity);

    // Validate tags have been added (two additional)
    expect(mockSetItem.mock.calls[2][0]).toBe('tag-list');
    expect(mockSetItem.mock.calls[2][1]).toBeArrayOfSize(3);

    // Validate entity has been added
    expect(mockSetItem.mock.calls[3][0]).toBe('entity-list');
    expect(mockSetItem.mock.calls[3][1]).toMatchObject([_entity]);
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
