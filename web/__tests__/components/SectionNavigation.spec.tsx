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
  expect(() => getByText('Prev')).toThrow();

  // Go to next section (middle)
  fireEvent.click(getByText('Next'));

  // Validate controls
  getByText('Prev');

  // Go to next section (last)
  fireEvent.click(getByText('Next'));

  // Validate controls
  expect(() => getByText('Next')).toThrow();
  getByText('Prev');

  // Validate TOC not open
  expect(() => getByText('Title')).toThrow();

  // Open TOC and change section (middle)
  fireEvent.click(getByText('TOC'));
  fireEvent.click(getByText('Pride and Prejudice'));
  await waitForDomChange();

  // Validate controls
  getByText('Prev');
  getByText('Next');

  // Validate TOC not open
  expect(() => getByText('Title')).toThrow();

  // Go to previous section (first)
  fireEvent.click(getByText('Prev'));

  // Validate controls
  expect(() => getByText('Prev')).toThrow();
  getByText('Next');
});
