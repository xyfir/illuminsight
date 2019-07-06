import { testDefinitions, testWikitext, testPub } from 'lib/test/data';
import { ReaderContext, ReaderState } from 'components/reader/Reader';
import { fireEvent, render } from '@testing-library/react';
import { defaultRecipe } from 'lib/reader/recipes';
import { Insights } from 'components/reader/Insights';
import * as React from 'react';
import wtf from 'wtf_wikipedia';

test('<Insights>', async () => {
  // Mock window.open
  const mockOpen = ((window as any).open = jest.fn());

  // Render insights
  const state: ReaderState = {
    insightsIndex: {
      0: [
        { text: 'Cormac McCarthy' },
        {
          definitions: testDefinitions,
          text: 'Blood Meridian',
          wiki: wtf(testWikitext)
        }
      ]
    },
    dispatch: () => undefined,
    recipe: defaultRecipe,
    pub: testPub,
    ast: []
  };
  const { getByLabelText, getAllByText, getByText } = render(
    <ReaderContext.Provider value={state}>
      <Insights index={0} />
    </ReaderContext.Provider>
  );

  // Click "Cormac McCarthy" insight
  fireEvent.click(getByText('Cormac McCarthy'));

  // Expect "Cormac McCarthy" insight to have opened search
  expect(mockOpen).toHaveBeenCalledTimes(1);
  expect(mockOpen).toHaveBeenCalledWith(
    'https://www.google.com/search?q=Cormac%20McCarthy'
  );

  // Click "Blood Meridian" insight
  fireEvent.click(getByText('Blood Meridian'));

  // Expect "Blood Meridian" insight to have opened wiki article
  getByText('novel by American author', { exact: false });

  // Click "Blood Meridian" insight again to close wiki article
  fireEvent.click(getAllByText('Blood Meridian')[0]);

  // Expect wiki article to have closed
  expect(() =>
    getByText('novel by American author', { exact: false })
  ).toThrow();

  // Click secondary action to view all insights of text
  fireEvent.click(getByLabelText('View all insights for "Blood Meridian"'));

  // Expect other insights to be gone
  expect(() => getByText('Cormac McCarthy')).toThrow();

  // Click "Search" insight
  fireEvent.click(getByText('Search'));

  // Expect "Search" insight to have opened Google search
  expect(mockOpen).toHaveBeenCalledTimes(2);
  expect(mockOpen).toHaveBeenCalledWith(
    'https://www.google.com/search?q=Blood%20Meridian'
  );

  // Click "Wikipedia" insight
  fireEvent.click(getByText('Wikipedia'));

  // Expect "Wikipedia" insight to have opened wiki article
  getByText('novel by American author', { exact: false });

  // Expect only top-level insights to be rendered
  // Expect wiki to remain rendered
  expect(getAllByText('Cormac McCarthy')).toBeArrayOfSize(2);
  expect(() => getByText('Wikipedia')).toThrow();

  // Click secondary action to view all insights of text
  fireEvent.click(getByLabelText('View all insights for "Blood Meridian"'));

  // Click back to previous insights
  fireEvent.click(getByLabelText('Back to previous insights'));

  // Click secondary action to view all insights of text
  fireEvent.click(getByLabelText('View all insights for "Blood Meridian"'));

  // Click "Definiton" insight
  fireEvent.click(getByText('Definition'));

  // Validate definition has loaded
  getAllByText('noun');
});
