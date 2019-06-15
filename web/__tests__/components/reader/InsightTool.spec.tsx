import { fireEvent, render, wait } from '@testing-library/react';
import { InsightTool } from 'components/reader/InsightTool';
import { Illuminsight } from 'types/illuminsight';
import * as React from 'react';
import * as wtf from 'wtf_wikipedia';

test('<InsightTool>', async () => {
  // Mock final element that insight tool will zero in on
  const mockElement = {
    innerText: 'My name is Illuminsight.',
    getAttribute: jest.fn()
  };
  mockElement.getAttribute.mockReturnValueOnce(2);

  // Add mocks
  const mockGetBoundingClientRect = (HTMLButtonElement.prototype.getBoundingClientRect = jest.fn());
  const mockElementsFromPoint = ((document as any).elementsFromPoint = jest.fn());
  const mockGetComputedStyle = ((window as any).getComputedStyle = jest.fn());

  // Mock fetching Wikipedia article
  const mockFetch = ((wtf as any).fetch = jest.fn());
  mockFetch.mockResolvedValueOnce(null);

  // Mock getting #ast and its rect
  const mockGetElementById = ((document as any).getElementById = jest.fn(
    () => ({ getBoundingClientRect: jest.fn(() => ({ x: 150 })) })
  ));

  function setMockReturns() {
    // Mock position of insight tool
    mockGetBoundingClientRect.mockReturnValueOnce({ y: 0 });

    // Mock getting lineHeight of #ast
    mockGetComputedStyle.mockReturnValueOnce({ lineHeight: '15.05px' });

    // elementsFromPoint() should return a fake div element that should be
    // detected as a container element and so not return
    // [div (container), div#ast, ancestors that don't matter]
    mockElementsFromPoint.mockReturnValueOnce([
      { tagName: 'DIV', innerText: ' '.repeat(10001) },
      { id: 'ast' },
      {},
      {}
    ]);
    mockGetComputedStyle.mockReturnValueOnce({ display: 'block' });

    // Configure mock so an element should be found
    mockElementsFromPoint.mockReturnValueOnce([
      { innerText: ' ' }, // inline
      mockElement, // block (last)
      { innerText: ' ' }, // block
      { innerText: ' ' }, // inline
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
      <InsightTool onChange={setInsightsIndex} insightsIndex={insightsIndex} />
    );
  }

  // Render <InsightTool> inside <InsightToolConsumer>
  const { getByTitle } = render(<InsightToolConsumer />);

  // Click insight tool to generate insights
  setMockReturns();
  fireEvent.click(getByTitle('Insight tool'));

  // Ensure insight tool click handler works
  expect(mockGetElementById).toHaveBeenCalledTimes(1);
  // Remember: we mock two different getBoundingClientRect methods!
  await wait(() => expect(mockGetBoundingClientRect).toHaveBeenCalledTimes(1));

  // First call to getElement() failed because it got the container element
  // On second try it found our mockElement
  expect(mockElementsFromPoint).toHaveBeenCalledTimes(2);

  // All found elements (excluding #ast and parents) had their display checked
  expect(mockGetComputedStyle).toHaveBeenCalledTimes(6);

  // Validate the ast attribute was retrieved from our mock element
  expect(mockElement.getAttribute).toHaveBeenCalledTimes(1);
  expect(mockElement.getAttribute).toHaveBeenCalledWith('ast');

  // Insights were generated and set to correct AST element index
  await wait(() => expect(mockFetch).toHaveBeenCalled());
  expect(_insightsIndex).toMatchObject({ 2: [{ text: 'Illuminsight' }] });

  // Click insight tool again to disable insights
  setMockReturns();
  fireEvent.click(getByTitle('Insight tool'));

  // Validate insights were toggled off for AST element index
  expect(_insightsIndex).toMatchObject({});
});
