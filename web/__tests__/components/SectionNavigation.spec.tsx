import { waitForDomChange, fireEvent, render } from 'react-testing-library';
import { SectionNavigation } from 'components/SectionNavigation';
import { testEntity } from 'lib/test/objects';
import * as React from 'react';

test('<SectionNavigation>', async () => {
  // Wrap <SectionNavigation>
  function SectionNavigationConsumer() {
    const [entity, setEntity] = React.useState(testEntity);
    return <SectionNavigation onChange={setEntity} entity={entity} />;
  }

  // Render <SectionNavigation> inside <SectionNavigationConsumer>
  const { getByText } = render(<SectionNavigationConsumer />);

  // Validate controls
  expect(() => getByText('Prev. Section')).toThrow();

  // Go to next section (middle)
  fireEvent.click(getByText('Next Section'));

  // Validate controls
  getByText('Prev. Section');

  // Go to next section (last)
  fireEvent.click(getByText('Next Section'));

  // Validate controls
  expect(() => getByText('Next Section')).toThrow();
  getByText('Prev. Section');

  // Validate TOC not open
  expect(() => getByText('Title')).toThrow();

  // Open TOC and change section (middle)
  fireEvent.click(getByText('Table of Contents'));
  fireEvent.click(getByText('Pride and Prejudice'));
  await waitForDomChange();

  // Validate controls
  getByText('Prev. Section');
  getByText('Next Section');

  // Validate TOC not open
  expect(() => getByText('Title')).toThrow();

  // Go to previous section (first)
  fireEvent.click(getByText('Prev. Section'));

  // Validate controls
  expect(() => getByText('Prev. Section')).toThrow();
  getByText('Next Section');
});
