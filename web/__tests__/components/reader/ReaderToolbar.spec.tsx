import { waitForDomChange, fireEvent, render } from 'react-testing-library';
import { ReaderToolbar } from 'components/reader/ReaderToolbar';
import { Insightful } from 'types/insightful';
import { testPub } from 'lib/test/objects';
import * as React from 'react';

test('<ReaderToolbar>', async () => {
  // Wrap <ReaderToolbar>
  const history: Insightful.Marker[] = [];
  function ReaderToolbarConsumer() {
    const [pub, setPub] = React.useState(testPub);
    return <ReaderToolbar onChange={setPub} history={history} pub={pub} />;
  }

  // Render <ReaderToolbar> inside <ReaderToolbarConsumer>
  const { getByTitle, getByText } = render(<ReaderToolbarConsumer />);

  // Validate controls
  expect(() => getByTitle('Go to previous section')).toThrow();
  expect(() => getByTitle('Go back')).toThrow();

  // Go to next section (middle)
  fireEvent.click(getByTitle('Go to next section'));

  // Validate controls
  getByTitle('Go to previous section');
  expect(() => getByTitle('Go back')).toThrow();

  // Go to next section (last)
  fireEvent.click(getByTitle('Go to next section'));

  // Validate controls
  getByTitle('Go to previous section');
  expect(() => getByTitle('Go back')).toThrow();
  expect(() => getByTitle('Go to next section')).toThrow();

  // Validate TOC not open
  expect(() => getByText('Title')).toThrow();

  // Open TOC and change section (middle)
  fireEvent.click(getByTitle('Table of Contents'));
  fireEvent.click(getByText('Pride and Prejudice'));
  await waitForDomChange();

  // Validate controls
  getByTitle('Go to previous section');
  getByTitle('Go back');
  getByTitle('Go to next section');

  // Validate TOC not open
  expect(() => getByText('Title')).toThrow();

  // Go to previous section (first)
  fireEvent.click(getByTitle('Go to previous section'));

  // Validate controls
  expect(() => getByTitle('Go to previous section')).toThrow();

  // Go back (to last)
  fireEvent.click(getByTitle('Go back'));

  // Validate controls
  getByTitle('Go to previous section');
  expect(() => getByTitle('Go back')).toThrow();
  expect(() => getByTitle('Go to next section')).toThrow();
});
