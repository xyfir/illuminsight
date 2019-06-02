import { fireEvent, render } from 'react-testing-library';
import { InsightTool } from 'components/reader/InsightTool';
import { Insightful } from 'types/insightful';
import * as React from 'react';

test('<InsightTool>', async () => {
  // Mock final element that insight tool will zero in on
  const mockElement = {
    innerText: 'My name is Insightful.',
    getAttribute: jest.fn()
  };
  mockElement.getAttribute.mockReturnValueOnce(2);

  // Add mocks
  const mockGetBoundingClientRect = (HTMLDivElement.prototype.getBoundingClientRect = jest.fn());
  const mockElementsFromPoint = ((document as any).elementsFromPoint = jest.fn());
  const mockGetComputedStyle = ((window as any).getComputedStyle = jest.fn());

  function setMockReturns() {
    // Mock position of insight tool
    mockGetBoundingClientRect.mockReturnValueOnce({ x: 0, y: 0 });

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
  let _insights: Insightful.Insights = {};
  function InsightToolConsumer() {
    const [insights, setInsights] = React.useState(_insights);
    _insights = insights;
    return <InsightTool onChange={setInsights} insights={insights} />;
  }

  // Render <InsightTool> inside <InsightToolConsumer>
  const { getByTitle } = render(<InsightToolConsumer />);

  // Click insight tool to generate insights
  setMockReturns();
  fireEvent.click(getByTitle('Insight tool'));

  // Ensure insight tool click handler works
  expect(mockGetBoundingClientRect).toHaveBeenCalledTimes(1);

  // First call to getElement() failed because it got the container element
  // On second try it found our mockElement
  expect(mockElementsFromPoint).toHaveBeenCalledTimes(2);

  // All found elements (excluding #ast and parents) had their display checked
  expect(mockGetComputedStyle).toHaveBeenCalledTimes(5);

  // Validate the ast attribute was retrieved from our mock element
  expect(mockElement.getAttribute).toHaveBeenCalledTimes(1);
  expect(mockElement.getAttribute).toHaveBeenCalledWith('ast');

  // Insights were generated and set to correct AST element index
  expect(_insights).toMatchObject({ 2: ['Insightful'] });

  // Click insight tool again to disabled insights
  setMockReturns();
  fireEvent.click(getByTitle('Insight tool'));

  // Validate insights were toggled off for AST element index
  expect(_insights).toMatchObject({});
});
