import { fireEvent, render, wait } from '@testing-library/react';
import { Illuminsight } from 'types';
import { InsightTool } from 'components/reader/InsightTool';
import * as React from 'react';
import axios from 'axios';
import wtf from 'wtf_wikipedia';

test('<InsightTool>', async () => {
  // Mock final element that insight tool will zero in on
  const mockElement = {
    innerText: 'My name is Illuminsight.',
    getAttribute: jest.fn(() => '2')
  };

  // Add mocks
  const mockGetBoundingClientRect = (HTMLButtonElement.prototype.getBoundingClientRect = jest.fn());
  const mockElementsFromPoint = ((document as any).elementsFromPoint = jest.fn());
  const mockGetComputedStyle = ((window as any).getComputedStyle = jest.fn());
  const mockGetSelection = ((document as any).getSelection = jest.fn());
  const mockGetAttribute = jest.fn(() => '0');

  // Mock fetching Wikipedia article
  const mockFetch = ((wtf as any).fetch = jest.fn());
  mockFetch.mockResolvedValueOnce(null);

  // Mock fetching Wiktionary article
  const mockGet = ((axios as any).get = jest.fn());
  mockGet.mockResolvedValueOnce({ data: undefined });

  // Mock first time getting selection
  mockGetSelection.mockReturnValue({ toString: () => '' });

  // Mock getting #ast
  const mockGetElementById = ((document as any).getElementById = jest.fn());

  function setMockReturnsForBlock() {
    // Mock position of insight tool
    mockGetBoundingClientRect.mockReturnValueOnce({ x: 0, y: 0 });

    // Mock getting lineHeight of #ast
    mockGetComputedStyle.mockReturnValueOnce({ lineHeight: '15.05px' });

    // elementsFromPoint() should return a fake div element that should be
    // detected as a container element and so not return
    // [div (container), div#ast, ancestors that don't matter]
    mockElementsFromPoint.mockReturnValueOnce([
      {
        tagName: 'DIV',
        innerText: ' '.repeat(10001),
        getAttribute: mockGetAttribute
      },
      { id: 'ast' },
      {},
      {}
    ]);
    mockGetComputedStyle.mockReturnValueOnce({ display: 'block' });

    // Configure mock so an element should be found
    mockElementsFromPoint.mockReturnValueOnce([
      { innerText: ' ', getAttribute: mockGetAttribute }, // inline
      { innerText: ' ', getAttribute: jest.fn(() => null) }, // non-ast filtered out
      mockElement, // block (last)
      { innerText: ' ', getAttribute: mockGetAttribute }, // block
      { innerText: ' ', getAttribute: mockGetAttribute }, // inline
      { id: 'ast' }
    ]);
    mockGetComputedStyle.mockReturnValueOnce({ display: 'inline' });
    mockGetComputedStyle.mockReturnValueOnce({ display: 'block' });
    mockGetComputedStyle.mockReturnValueOnce({ display: 'block' });
    mockGetComputedStyle.mockReturnValueOnce({ display: 'inline' });
  }

  // Wrap <InsightTool>
  let _insightsIndex: Illuminsight.InsightsIndex = {};
  function InsightToolConsumer() {
    const [insightsIndex, setInsightsIndex] = React.useState(_insightsIndex);
    _insightsIndex = insightsIndex;
    return (
      <InsightTool onInsight={setInsightsIndex} insightsIndex={insightsIndex} />
    );
  }

  // Render <InsightTool> inside <InsightToolConsumer>
  const { getByTitle } = render(<InsightToolConsumer />);

  // Click insight tool to generate insights
  setMockReturnsForBlock();
  fireEvent.click(getByTitle('Toggle insights for text block below'));

  // Ensure insight tool click handler works
  expect(mockGetElementById).toHaveBeenCalledTimes(1);
  await wait(() => expect(mockGetBoundingClientRect).toHaveBeenCalledTimes(1));

  // Validate that all #ast children were checked for ast attribute
  expect(mockGetAttribute).toHaveBeenCalledTimes(4);
  expect(mockGetAttribute).toHaveBeenCalledWith('ast');

  // First call to getElement() failed because it got the container element
  // On second try it found our mockElement
  expect(mockElementsFromPoint).toHaveBeenCalledTimes(2);

  // All found elements (excluding #ast and parents) had their display checked
  expect(mockGetComputedStyle).toHaveBeenCalledTimes(6);

  // Validate the ast attribute was retrieved from our mock element
  // First time to filter out non-ast elements and second for final selection
  expect(mockElement.getAttribute).toHaveBeenCalledTimes(2);
  expect(mockElement.getAttribute).toHaveBeenNthCalledWith(1, 'ast');
  expect(mockElement.getAttribute).toHaveBeenNthCalledWith(2, 'ast');

  // Insights were generated and set to correct AST element index
  await wait(() => expect(mockFetch).toHaveBeenCalled());
  expect(_insightsIndex).toMatchObject({ 2: [{ text: 'Illuminsight' }] });

  // Mock selection
  mockGetSelection.mockReturnValueOnce({
    toString: () => 'hello world',
    focusNode: {
      parentElement: { getBoundingClientRect: () => ({ x: 0, y: 0 }) }
    }
  });
  document.dispatchEvent(new Event('selectionchange'));

  // Mock functions for getting text block from selection node
  mockElementsFromPoint.mockReturnValueOnce([
    { getAttribute: jest.fn(() => '3'), innerText: ' ' },
    { id: 'ast' }
  ]);
  mockGetComputedStyle.mockReturnValueOnce({ display: 'block' });

  // Click insight tool with highlighted text
  fireEvent.click(getByTitle('Toggle insights for text block below'));

  // Validate insight was generated from selection and added to previous
  await wait(() => expect(Object.keys(_insightsIndex)).toBeArrayOfSize(2));
  expect(_insightsIndex[3]).toMatchObject([{ wikis: [], text: 'hello world' }]);

  // Mock empty selection
  mockGetSelection.mockReturnValueOnce({ toString: () => '' });
  document.dispatchEvent(new Event('selectionchange'));

  // Click insight tool again to disable insights
  setMockReturnsForBlock();
  fireEvent.click(getByTitle('Toggle insights for text block below'));

  // Validate insights were toggled off for AST element index
  expect(_insightsIndex).toMatchObject({});
});
