import { waitForDomChange, fireEvent, render } from 'react-testing-library';
import { ReaderToolbar } from 'components/reader/ReaderToolbar';
import { MemoryRouter } from 'react-router-dom';
import { Insightful } from 'types/insightful';
import { testPub } from 'lib/test/objects';
import * as React from 'react';

test('<ReaderToolbar>', async () => {
  // Wrap <ReaderToolbar>
  const history: Insightful.Marker[] = [];
  function ReaderToolbarConsumer() {
    const [pub, setPub] = React.useState(testPub);
    return (
      <MemoryRouter>
        <ReaderToolbar onChange={setPub} history={history} pub={pub} />
      </MemoryRouter>
    );
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

  // Validate More and TOC not open
  expect(() => getByText('Table of Contents')).toThrow();
  expect(() => getByText('Title')).toThrow();

  // Open More, TOC, and change section (middle)
  fireEvent.click(getByTitle('View more menu items'));
  fireEvent.click(getByText('Table of Contents'));
  fireEvent.click(getByText('Pride and Prejudice'));
  await waitForDomChange();
  await waitForDomChange();

  // Validate controls
  getByTitle('Go to previous section');
  getByTitle('Go back');
  getByTitle('Go to next section');

  // Validate More and TOC not open
  expect(() => getByText('Table of Contents')).toThrow();
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
