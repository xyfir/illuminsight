import { DefinitionInsight } from 'components/reader/DefinitionInsight';
import { fireEvent, render } from '@testing-library/react';
import { testDefinitions } from 'lib/test/data';
import * as React from 'react';

test('<DefinitionInsight>', async () => {
  const { getAllByText, getByText, container } = render(
    <DefinitionInsight definitions={testDefinitions} />
  );

  // Validate there's no links
  expect(Array.from(container.getElementsByTagName('a'))).toBeArrayOfSize(0);

  // Validate there's no images
  expect(Array.from(container.getElementsByTagName('img'))).toBeArrayOfSize(0);

  // Validate parts of speech headings
  getAllByText('noun');
  getAllByText('verb');

  // Validate definitions
  getByText('trial');
  getByText('refine');

  // Validate example
  getByText('Two sea urchin tests');

  // Validate "English" heading not rendered
  expect(() => getByText('English')).toThrow();

  // Render all definitions
  fireEvent.click(getByText('All Definitions'));
  getByText('English');
  getByText('French');
});
