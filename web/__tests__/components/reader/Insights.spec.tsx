import { fireEvent, render } from 'react-testing-library';
import { Insights } from 'components/reader/Insights';
import * as React from 'react';

test('<Insights>', async () => {
  // Mock window.open
  const mockOpen = ((window as any).open = jest.fn());

  // Render insights
  const { getByText } = render(<Insights insights={['Hello', 'World']} />);

  // Click "Hello" insight
  fireEvent.click(getByText('Hello'));

  // Expect "Hello" insight to have opened Google search
  expect(mockOpen).toHaveBeenCalledTimes(1);
  expect(mockOpen).toHaveBeenCalledWith(
    'https://www.google.com/search?q=Hello'
  );

  // Click "World" insight
  fireEvent.click(getByText('World'));

  // Expect "World" insight to have opened Google search
  expect(mockOpen).toHaveBeenCalledTimes(2);
  expect(mockOpen).toHaveBeenCalledWith(
    'https://www.google.com/search?q=World'
  );
});
