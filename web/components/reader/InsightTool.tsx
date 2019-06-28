import { Highlight as InsightIcon } from '@material-ui/icons';
import { generateInsights } from 'lib/reader/generate-insights';
import { Illuminsight } from 'types/illuminsight';
import * as React from 'react';
import {
  createStyles,
  IconButton,
  makeStyles,
  Tooltip
} from '@material-ui/core';

const useStyles = makeStyles(() =>
  createStyles({
    button: {
      transform: 'rotate(180deg)'
    }
  })
);

export type InsightToolProps = {
  insightsIndex: Illuminsight.InsightsIndex;
  onInsight: (insights: Illuminsight.InsightsIndex) => void;
};

export function InsightTool({ insightsIndex, onInsight }: InsightToolProps) {
  // Capture Selection properties on mobile before tap deselects the text
  // Cannot just save Selection object because it's mutated in place
  let selectionText: string;
  let selectionNode: Node;

  const [active, setActive] = React.useState(false);
  const classes = useStyles();

  /**
   * Get element to parse insights from.
   */
  function getElement(x: number, y: number): HTMLElement | undefined {
    // Get elements to right of tool
    let elements = document.elementsFromPoint(x, y) as HTMLElement[];

    // Remove #ast and any ancestors
    elements.splice(elements.findIndex(el => el.id == 'ast'), elements.length);

    // Remove non-ast elements
    elements = elements.filter(el => el.getAttribute('ast') !== null);

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
   */
  async function onClick(event: React.MouseEvent) {
    if (active) return;
    setActive(true);

    if (selectionText === undefined) saveSelection();

    // Generate insights from selected text
    if (selectionText) {
      const rect = selectionNode.parentElement!.getBoundingClientRect() as DOMRect;
      const element = getElement(rect.x, rect.y) as HTMLElement;

      // Get index of AST element
      const index = +element.getAttribute('ast')!;

      // Generate insights for AST block
      const insights = await generateInsights(selectionText.trim(), true);
      insightsIndex[index] = insightsIndex[index]
        ? insightsIndex[index].concat(insights)
        : insights;
    }
    // Generate insights from element's text
    else {
      // Get elements
      const tool = event.target as HTMLButtonElement;
      const ast = document.getElementById('ast')!;

      // Get needed coordinates
      const { x, y } = tool.getBoundingClientRect() as DOMRect;

      // Get line height of AST container
      const lineHeight = +getComputedStyle(ast)!.lineHeight!.split('px')[0];

      // Find adjacent element with a bit of guesswork
      let element: HTMLElement | undefined = undefined;
      for (let i = 0; i < 3; i++) {
        element = getElement(x + 1, y + 50 + i * lineHeight);
        if (element) break;
      }
      if (!element) return setActive(false);

      // Get index of AST element
      const index = +element.getAttribute('ast')!;

      // Remove insights
      if (insightsIndex[index]) delete insightsIndex[index];
      // Parse insights from element's text
      else insightsIndex[index] = await generateInsights(element.innerText);
    }

    // Send modified insights back to Reader
    onInsight(insightsIndex);
    setActive(false);
  }

  function saveSelection() {
    const selection = window.getSelection()!;
    selectionText = selection.toString();
    selectionNode = selection.focusNode!;
  }

  return active ? (
    <IconButton className={classes.button} disabled={active}>
      <InsightIcon />
    </IconButton>
  ) : (
    <Tooltip title="Toggle insights for text block below">
      <IconButton
        onTouchStart={saveSelection}
        className={classes.button}
        disabled={active}
        onClick={onClick}
      >
        <InsightIcon />
      </IconButton>
    </Tooltip>
  );
}
