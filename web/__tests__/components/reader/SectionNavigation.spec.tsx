import { waitForDomChange, fireEvent, render } from 'react-testing-library';
import { SectionNavigation } from 'components/reader/SectionNavigation';
import { Insightful } from 'types/insightful';
import { testPub } from 'lib/test/objects';
import * as React from 'react';

test('<SectionNavigation>', async () => {
  // Wrap <SectionNavigation>
  const history: Insightful.Marker[] = [];
  function SectionNavigationConsumer() {
    const [pub, setPub] = React.useState(testPub);
    return <SectionNavigation onChange={setPub} history={history} pub={pub} />;
  }

  // Render <SectionNavigation> inside <SectionNavigationConsumer>
  const { getByText } = render(<SectionNavigationConsumer />);

  // Validate controls
  expect(() => getByText('Prev')).toThrow();
  expect(() => getByText('Back')).toThrow();

  // Go to next section (middle)
  fireEvent.click(getByText('Next'));

  // Validate controls
  getByText('Prev');
  expect(() => getByText('Back')).toThrow();

  // Go to next section (last)
  fireEvent.click(getByText('Next'));

  // Validate controls
  getByText('Prev');
  expect(() => getByText('Back')).toThrow();
  expect(() => getByText('Next')).toThrow();

  // Validate TOC not open
  expect(() => getByText('Title')).toThrow();

  // Open TOC and change section (middle)
  fireEvent.click(getByText('TOC'));
  fireEvent.click(getByText('Pride and Prejudice'));
  await waitForDomChange();

  // Validate controls
  getByText('Prev');
  getByText('Back');
  getByText('Next');

  // Validate TOC not open
  expect(() => getByText('Title')).toThrow();

  // Go to previous section (first)
  fireEvent.click(getByText('Prev'));

  // Validate controls
  expect(() => getByText('Prev')).toThrow();

  // Go back (to last)
  fireEvent.click(getByText('Back'));

  // Validate controls
  getByText('Prev');
  expect(() => getByText('Back')).toThrow();
  expect(() => getByText('Next')).toThrow();
});
