import { createStyles, WithStyles, withStyles, Theme } from '@material-ui/core';
import { getInsightables } from 'lib/reader/get-insightables';
import { Insightful } from 'types/insightful';
import * as React from 'react';

const styles = (theme: Theme) =>
  createStyles({
    tool: {
      backgroundColor: theme.palette.grey[400],
      position: 'absolute',
      height: '3em',
      width: '0.8em',
      top: '50%',
      left: '0%'
    }
  });

function _InsightTool({
  onChange,
  insights,
  classes
}: {
  onChange: (insights: Insightful.Insights) => void;
  insights: Insightful.Insights;
} & WithStyles<typeof styles>) {
  /**
   * Get element to parse insightables from.
   */
  function getElement(x: number, y: number): HTMLElement | undefined {
    // Get elements to right of tool
    let elements = document.elementsFromPoint(x, y) as HTMLElement[];

    // Remove #ast and any ancestors
    elements.splice(elements.findIndex(el => el.id == 'ast'), elements.length);

    // Reverse list so it's [parent,child]
    elements.reverse();

    // Ignore if parent element lacks text content
    if (!elements.length || !elements[0].innerText) return;

    // Get last block element
    let block: HTMLElement | undefined = undefined;
    for (let el of elements) {
      if (getComputedStyle(el).display == 'block') block = el;
    }
    if (!block) return;

    // Element is probably a container
    if (
      block.tagName == 'DIV' &&
      elements.slice(-1)[0] === block &&
      block.innerText.length > 10 * 1000
    )
      return;

    return block;
  }

  /**
   * Handle clicks to insight tool
   * @todo `x + 15` should use actual margin size
   * @todo `y + i * 15` should use actual line height size
   */
  function onClick(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    // Get position of insight tool
    const rect = (event.target as HTMLDivElement).getBoundingClientRect() as DOMRect;

    // Find adjacent element with a bit of guesswork
    let element: HTMLElement | undefined = undefined;
    for (let i = 0; i < 3; i++) {
      element = getElement(rect.x + 15, rect.y + i * 15);
      if (element) break;
    }
    if (!element) return;

    // Get index of AST element
    const elements = document.querySelectorAll('#ast *[ast]');
    let index = -1;
    for (let i = 0; i < elements.length; i++) {
      if (element === elements[i]) index = i;
    }

    // Remove insights
    if (insights[index]) delete insights[index];
    // Parse insights from element's text
    else insights[index] = getInsightables(element.innerText);

    // Send modified insights back to Reader
    onChange(insights);
  }

  return (
    <div title="Insight tool" onClick={onClick} className={classes.tool} />
  );
}

export const InsightTool = withStyles(styles)(_InsightTool);
