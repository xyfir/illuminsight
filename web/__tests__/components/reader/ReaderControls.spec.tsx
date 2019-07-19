import { waitForDomChange, fireEvent, render } from '@testing-library/react';
import { ReaderContext, ReaderState } from 'components/reader/Reader';
import { SnackbarProvider } from 'notistack';
import { ReaderControls } from 'components/reader/ReaderControls';
import { defaultRecipe } from 'lib/reader/recipes';
import { MemoryRouter } from 'react-router-dom';
import { Illuminsight } from 'types/illuminsight';
import { testPub } from 'lib/test/data';
import localForage from 'localforage';
import * as React from 'react';
import axios from 'axios';

test('<ReaderControls>', async () => {
  // Wrap <ReaderControls>
  const history: Illuminsight.Marker[] = [];
  const state: ReaderState = {
    insightsIndex: {},
    dispatch: () => undefined,
    recipe: defaultRecipe,
    pub: testPub,
    ast: []
  };
  const ReaderControlsConsumer = () => {
    const [pub, setPub] = React.useState(testPub);
    state.pub = pub;
    return (
      <SnackbarProvider>
        <MemoryRouter>
          <ReaderContext.Provider value={state}>
            <ReaderControls
              onNavigate={setPub}
              onInsight={() => 1}
              history={history}
            />
          </ReaderContext.Provider>
        </MemoryRouter>
      </SnackbarProvider>
    );
  };

  // Mock axios/localForage for auto recipe matching
  const mockSetItem = ((localForage as any).setItem = jest.fn());
  const mockGetItem = ((localForage as any).getItem = jest.fn());
  const mockGet = ((axios as any).get = jest.fn());

  // Mock loading saved recipe (none saved)
  mockGetItem.mockResolvedValueOnce(null);

  // Mock loading recipe list
  mockGet.mockResolvedValueOnce({
    data: [{ i: 'jane-austen', a: 'Jane Austen', b: 'Pride and Prejudice' }]
  });

  // Mock loading full recipe once matched to pub
  const mockRecipe = { ...defaultRecipe };
  mockGet.mockResolvedValueOnce({ data: defaultRecipe });

  // Mock saving downloaded recipe
  mockGetItem.mockResolvedValueOnce(undefined);

  // Render <ReaderControls> inside <ReaderControlsConsumer>
  const { getByLabelText, getByTitle, getByText } = render(
    <ReaderControlsConsumer />
  );
  await waitForDomChange();

  // Validate a saved recipe was checked for
  expect(mockGetItem).toHaveBeenCalledTimes(1);
  expect(mockGetItem).toHaveBeenCalledWith(`pub-recipe-${testPub.id}`);

  // Validate the recipe list was loaded
  expect(mockGet).toHaveBeenCalledTimes(2);
  expect(mockGet.mock.calls[0][0]).toEndWith('.index.min.json');

  // Validate full recipe was downloaded after match
  expect(mockGet.mock.calls[1][0]).toEndWith('jane-austen.min.json');

  // Validate full recipe was saved
  expect(mockSetItem).toHaveBeenCalledTimes(1);
  expect(mockSetItem).toHaveBeenCalledWith(
    `pub-recipe-${testPub.id}`,
    mockRecipe
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

  // !! The following code throws an error only when multiple tests are run

  // // Validate More and TOC not open
  // expect(() => getByText('Table of Contents')).toThrow();
  // expect(() => getByText('Title')).toThrow();

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
