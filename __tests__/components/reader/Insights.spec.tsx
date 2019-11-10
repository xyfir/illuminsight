import { testDefinitions, testWikitext, testPub } from 'lib/test/data';
import { fireEvent, render } from '@testing-library/react';
import { defaultRecipe } from 'lib/reader/recipes';
import { createStore } from 'redux';
import { Insights } from 'components/reader/Insights';
import { Provider } from 'react-redux';
import { reducer } from 'store/reducers';
import * as React from 'react';
import wtf from 'wtf_wikipedia';

test('<Insights>', () => {
  expect(true).toBe(true);

  const store = createStore(reducer, {
    insights: {
      definitions: testDefinitions,
      searches: [
        {
          name: 'Google',
          url: 'https://www.google.com/search?q=Blood%20Meridian',
        },
      ],
      wikis: [
        {
          recipe: defaultRecipe.wikis[0],
          doc: wtf(testWikitext),
        },
      ],
      text: 'Blood Meridian',
    },
    recipe: defaultRecipe,
    pub: testPub,
    ast: [],
  });
  const { getAllByText, getByTitle, getByText } = render(
    <Provider store={store}>
      <Insights />
    </Provider>,
  );

  // Expect insight to have opened definitions
  getAllByText('noun');

  // Click "Google" insight
  const mockOpen = ((window as any).open = jest.fn());
  fireEvent.click(getByText('Google'));

  // Expect "Search" insight to have opened Google search
  expect(mockOpen).toHaveBeenCalledTimes(1);
  expect(mockOpen).toHaveBeenCalledWith(
    'https://www.google.com/search?q=Blood%20Meridian',
  );

  // Click "Wikipedia" insight
  fireEvent.click(getByText('Wikipedia'));

  // Expect definitions to have closed
  expect(() => getAllByText('noun')).toThrow();

  // Expect "Wikipedia" insight to have opened wiki article
  getByText('novel by American author', { exact: false });

  // Click "Definiton" insight
  fireEvent.click(getByText('Definition'));

  // Validate definition has loaded
  getAllByText('noun');

  // Validate panel is not expanded
  getByTitle('Expand insights panel');
  expect(() => getByTitle('Restore insights panel size')).toThrow();

  // Expand panel
  fireEvent.click(getByTitle('Expand insights panel'));
  getByTitle('Restore insights panel size');

  // Close panel
  fireEvent.click(getByTitle('Close insights panel'));
  expect(() => getByTitle('Close insights panel')).toThrow();
});
