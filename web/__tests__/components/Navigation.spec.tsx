import { StaticRouter } from 'react-router-dom';
import { Navigation } from 'components/Navigation';
import { render } from 'react-testing-library';
import * as React from 'react';

test('<Navigation>', () => {
  const { asFragment } = render(
    <StaticRouter>
      <Navigation />
    </StaticRouter>
  );
  expect(asFragment()).toMatchSnapshot();
});
