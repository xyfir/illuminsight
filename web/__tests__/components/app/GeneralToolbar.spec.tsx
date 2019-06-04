import { GeneralToolbar } from 'components/app/GeneralToolbar';
import { MemoryRouter } from 'react-router';
import { render } from '@testing-library/react';
import * as React from 'react';

test('<GeneralToolbar />', () => {
  const { getByTitle } = render(
    <MemoryRouter>
      <GeneralToolbar />
    </MemoryRouter>,
    { container: document.getElementById('content')! }
  );
  getByTitle('Toggle light/dark theme');
  getByTitle('Import content into library');
  getByTitle('Search items in library');
});
