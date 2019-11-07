import { InsightGenerator } from 'components/reader/InsightGenerator';
import { render, wait } from '@testing-library/react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { reducer } from 'store/reducers';
import * as React from 'react';
import axios from 'axios';
import wtf from 'wtf_wikipedia';

test('<InsightGenerator>', async () => {
  // Mock fetching Wikipedia article
  const mockFetch = ((wtf as any).fetch = jest.fn());
  mockFetch.mockResolvedValueOnce(null);

  // Mock fetching Wiktionary article
  const mockGet = ((axios as any).get = jest.fn());
  mockGet.mockResolvedValueOnce({ data: undefined });

  // Wrap <InsightGenerator>
  const store = createStore(reducer);
  function InsightGeneratorConsumer(): JSX.Element {
    return (
      <Provider store={store}>
        <InsightGenerator />
      </Provider>
    );
  }

  // Render <InsightGenerator> inside <InsightGeneratorConsumer>
  render(<InsightGeneratorConsumer />);

  // Mock selection
  const mockGetSelection = ((document as any).getSelection = jest.fn());
  mockGetSelection.mockReturnValueOnce({ toString: () => 'test' });
  document.dispatchEvent(new Event('selectionchange'));

  // Insights were generated
  await wait(() => expect(mockFetch).toHaveBeenCalled());
  expect(mockGet).toHaveBeenCalledWith(
    'https://en.wiktionary.org/api/rest_v1/page/definition/test',
  );
  expect(store.getState().insights).toMatchObject({ text: 'test' });
});
