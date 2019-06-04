import { Toolbar } from 'components/app/Toolbar';
import { render } from '@testing-library/react';
import * as React from 'react';

test('<Toolbar>', async () => {
  const { baseElement } = render(
    <Toolbar>
      <p>Hello world</p>
    </Toolbar>,
    { container: document.getElementById('content')! }
  );
  expect(baseElement.querySelector('#toolbar p')!.textContent).toBe(
    'Hello world'
  );
});
