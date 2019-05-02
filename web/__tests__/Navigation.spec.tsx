import { StaticRouter } from 'react-router-dom';
import { Navigation } from 'components/Navigation';
import { create } from 'react-test-renderer';
import * as React from 'react';

test('<Navigation>', () => {
  expect(
    create(
      <StaticRouter>
        <Navigation />
      </StaticRouter>
    ).toJSON()
  ).toMatchSnapshot();
});
