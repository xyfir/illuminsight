import { SectionNavigation } from 'components/SectionNavigation';
import { fireEvent, render } from 'react-testing-library';
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

  // Validate previous section doesn't to exist
  expect(() => getByText('Previous Section')).toThrow();

  // Go to next section
  fireEvent.click(getByText('Next Section'));

  // Validate previous section exists
  getByText('Previous Section');

  // Go to next section
  fireEvent.click(getByText('Next Section'));

  // Validate next section doesn't exist
  expect(() => getByText('Next Section')).toThrow();

  // Go to previous section
  fireEvent.click(getByText('Previous Section'));
});
