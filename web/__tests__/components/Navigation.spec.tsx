import { MemoryRouter } from 'react-router-dom';
import { Navigation } from 'components/Navigation';
import { render } from 'react-testing-library';
import * as React from 'react';

test('<Navigation> /', () => {
  const { getByTitle } = render(
    <MemoryRouter>
      <Navigation />
    </MemoryRouter>
  );
  getByTitle('Toggle light/dark theme');
  getByTitle('Import content into library');
  getByTitle('Search items in library');
  expect(() => getByTitle('Edit metadata')).toThrow();
});

test('<Navigation> /read/123', () => {
  const { getByTitle } = render(
    <MemoryRouter initialEntries={['/read/1234567890123']}>
      <Navigation />
    </MemoryRouter>
  );
  getByTitle('Toggle light/dark theme');
  getByTitle('Import content into library');
  getByTitle('Search items in library');
  getByTitle('Edit metadata');
});
