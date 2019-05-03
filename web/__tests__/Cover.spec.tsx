import { waitForDomChange, render } from 'react-testing-library';
import * as localForage from 'localforage';
import * as React from 'react';
import { Cover } from 'components/Cover';

test('<Cover>', async () => {
  // Mock localForage.getItem() and URL.createObjectURL()
  (localForage as any).getItem = jest.fn(() => Promise.resolve(new Blob()));
  (URL as any).createObjectURL = jest.fn(() => 'blob:/d81d5be1');

  // Render cover and expect an icon (image not loaded yet)
  const { container } = render(<Cover id={1} />);
  const [div]: HTMLCollection = container.children;
  expect(div.tagName).toBe('DIV');
  const [svg]: HTMLCollection = div.children;
  expect(svg.tagName).toBe('svg');

  // Wait for image to load
  await waitForDomChange();
  expect(localForage.getItem).toHaveBeenCalledWith('entity-cover-1');
  const [img]: HTMLCollection = div.children;
  expect(img.tagName).toBe('IMG');
  expect(img.getAttribute('src')).toBe('blob:/d81d5be1');
});
