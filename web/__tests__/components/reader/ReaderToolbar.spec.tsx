import { waitForDomChange, fireEvent, render } from '@testing-library/react';
import { ReaderContext, ReaderState } from 'components/reader/Reader';
import { ReaderToolbar } from 'components/reader/ReaderToolbar';
import { defaultRecipe } from 'lib/reader/recipes';
import { MemoryRouter } from 'react-router-dom';
import { Illuminsight } from 'types/illuminsight';
import { testPub } from 'lib/test/data';
import * as React from 'react';

test('<ReaderToolbar>', async () => {
  // Wrap <ReaderToolbar>
  const history: Illuminsight.Marker[] = [];
  const state: ReaderState = {
    insightsIndex: {},
    dispatch: () => undefined,
    recipe: defaultRecipe,
    pub: testPub,
    ast: []
  };
  const ReaderToolbarConsumer = () => {
    const [pub, setPub] = React.useState(testPub);
    state.pub = pub;
    return (
      <MemoryRouter>
        <ReaderContext.Provider value={state}>
          <ReaderToolbar
            onNavigate={setPub}
            onInsight={() => 1}
            history={history}
          />
        </ReaderContext.Provider>
      </MemoryRouter>
    );
  };

  // Render <ReaderToolbar> inside <ReaderToolbarConsumer>
  const { getByLabelText, getByTitle, getByText } = render(
    <ReaderToolbarConsumer />
  );

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

  // !! For some reason the following code will not work when multiple tests run
  // at once thanks to jsdom/jest/mui not working together
  // !! Uncomment when running a test for <ReaderToolbar> specifically...

  // // Open More and validate items
  // fireEvent.click(getByTitle('View more menu items'));
  // getByText('Toggle Theme');
  // getByText('Recipes');

  // // TOC, and change section (middle)
  // fireEvent.click(getByText('Table of Contents'));
  // fireEvent.click(getByText('Pride and Prejudice'));
  // await waitForDomChange();
  // await waitForDomChange();

  // // Open More, FontSize
  // fireEvent.click(getByTitle('View more menu items'));
  // fireEvent.click(getByText('Set Font Size'));
  // await waitForDomChange();

  // // Mock methods used by onChangeFontSize()
  // const mockGetElementById = ((document as any).getElementById = jest.fn());
  // const mockElement = { style: { fontSize: '125%' } };
  // mockGetElementById.mockReturnValue(mockElement);

  // // Increase font size
  // fireEvent.click(getByLabelText('Increase font size'));
  // expect(mockGetElementById).toHaveBeenCalledTimes(1);
  // expect(mockElement.style.fontSize).toBe('130%');

  // // Decrease font size
  // fireEvent.click(getByLabelText('Decrease font size'));
  // expect(mockGetElementById).toHaveBeenCalledTimes(2);
  // expect(mockElement.style.fontSize).toBe('125%');

  // // Validate controls
  // getByTitle('Go to previous section');
  // getByTitle('Go back');
  // getByTitle('Go to next section');

  // // Validate More and TOC not open
  // expect(() => getByText('Table of Contents')).toThrow();
  // expect(() => getByText('Title')).toThrow();

  // // Go to previous section (first)
  // fireEvent.click(getByTitle('Go to previous section'));

  // // Validate controls
  // expect(() => getByTitle('Go to previous section')).toThrow();

  // // Go back (to last)
  // fireEvent.click(getByTitle('Go back'));

  // // Validate controls
  // getByTitle('Go to previous section');
  // expect(() => getByTitle('Go back')).toThrow();
  // expect(() => getByTitle('Go to next section')).toThrow();
});
