import { waitForDomChange, render } from 'react-testing-library';
import * as localForage from 'localforage';
import * as React from 'react';
import { Cover } from 'components/library/Cover';

test('<Cover>', async () => {
  const blobUrl = 'blob:/d81d5be1';
  const blob = new Blob();

  // Mock localForage and URL
  const mockRevokeObjectURL = ((URL as any).revokeObjectURL = jest.fn());
  const mockCreateObjectURL = ((URL as any).createObjectURL = jest.fn(
    () => blobUrl
  ));
  const mockGetItem = ((localForage as any).getItem = jest.fn(() =>
    Promise.resolve(blob)
  ));

  // Render cover and expect an icon (image not loaded yet)
  const { container, unmount } = render(<Cover id={1} />);
  const [div]: HTMLCollection = container.children;
  expect(div.tagName).toBe('DIV');
  const [svg]: HTMLCollection = div.children;
  expect(svg.tagName).toBe('svg');

  // Wait for image to load
  await waitForDomChange();
  expect(mockGetItem).toHaveBeenCalledWith('entity-cover-1');
  expect(mockCreateObjectURL).toHaveBeenLastCalledWith(blob);
  const [img]: HTMLCollection = div.children;
  expect(img.tagName).toBe('IMG');
  expect(img.getAttribute('src')).toBe(blobUrl);

  unmount();
  expect(mockRevokeObjectURL).toHaveBeenCalledWith(blobUrl);
});
