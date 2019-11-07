import { GeneralToolbar } from 'components/app/GeneralToolbar';
import { MemoryRouter } from 'react-router';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { reducer } from 'store/reducers';
import { render } from '@testing-library/react';
import * as React from 'react';

test('<GeneralToolbar />', () => {
  // Render GeneralToolbar
  const store = createStore(reducer);
  const { getByTitle } = render(
    <Provider store={store}>
      <MemoryRouter>
        <GeneralToolbar />
      </MemoryRouter>
    </Provider>,
    { container: document.getElementById('content')! },
  );

  // Test available controls
  getByTitle('Toggle light/dark theme');
  getByTitle('Import EPUB files into library');
  getByTitle('Search items in library');
  expect(() => getByTitle('Install Illuminsight to home screen')).toThrow();

  // Test beforeinstallprompt event triggering install button
  window.dispatchEvent(new Event('beforeinstallprompt'));
  getByTitle('Install Illuminsight to home screen');
});
