import { GeneralToolbar } from 'components/app/GeneralToolbar';
import { MemoryRouter } from 'react-router';
import { render } from '@testing-library/react';
import * as React from 'react';

test('<GeneralToolbar />', async () => {
  // Render GeneralToolbar
  const { getByTitle } = render(
    <MemoryRouter>
      <GeneralToolbar />
    </MemoryRouter>,
    { container: document.getElementById('content')! }
  );

  // Test available controls
  getByTitle('Toggle light/dark theme');
  getByTitle('Import content into library');
  getByTitle('Search items in library');
  expect(() => getByTitle('Install Illuminsight to home screen')).toThrow();

  // Test beforeinstallprompt event triggering install button
  window.dispatchEvent(new Event('beforeinstallprompt'));
  getByTitle('Install Illuminsight to home screen');
});
