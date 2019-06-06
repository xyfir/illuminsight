import { fireEvent, render } from '@testing-library/react';
import { testWikitext } from 'lib/test/data';
import { Insightful } from 'types/insightful';
import { Insights } from 'components/reader/Insights';
import * as React from 'react';
import * as wtf from 'wtf_wikipedia';

test('<Insights>', async () => {
  // Mock window.open
  const mockOpen = ((window as any).open = jest.fn());

  // Render insights
  const insights: Insightful.Insight[] = [
    { text: 'Cormac McCarthy' },
    { text: 'Blood Meridian', wiki: wtf(testWikitext) }
  ];
  const { getByText } = render(<Insights insights={insights} />);

  // Click "Cormac McCarthy" insight
  fireEvent.click(getByText('Cormac McCarthy'));

  // Expect "Cormac McCarthy" insight to have opened Google search
  expect(mockOpen).toHaveBeenCalledTimes(1);
  expect(mockOpen).toHaveBeenCalledWith(
    'https://www.google.com/search?q=Cormac%20McCarthy'
  );

  // Click "Blood Meridian" insight
  fireEvent.click(getByText('Blood Meridian'));

  // Expect "Blood Meridian" insight to have opened wiki article
  getByText('novel by American author', { exact: false });
});
