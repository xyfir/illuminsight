import { Highlight as InsightIcon } from '@material-ui/icons';
import { generateInsights } from 'lib/reader/generate-insights';
import { ReaderContext } from 'components/reader/Reader';
import { Illuminsight } from 'types';
import * as React from 'react';
import {
  createStyles,
  IconButton,
  makeStyles,
  Tooltip
} from '@material-ui/core';

const useStyles = makeStyles(theme =>
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

let selectionTimeout: NodeJS.Timer | undefined;

export function InsightTool({ insightsIndex, onInsight }: InsightToolProps) {
  const [active, setActive] = React.useState(false);
  const { recipe } = React.useContext(ReaderContext);
  const classes = useStyles();

  function onSelectionChange() {
    if (selectionTimeout) clearTimeout(selectionTimeout);

    selectionTimeout = setTimeout(async () => {
      const selected = document.getSelection()!;
      if (!selected.toString()) return;

      // Get node's ancestor elements to choose block element from
      const elements = [selected.focusNode!.parentElement!];
      while (true) {
        const el = elements[elements.length - 1].parentElement;
        if (!el) break;
        else elements.push(el);
      }
      const element = getElement(elements) as HTMLElement;

      // Generate insights for AST block
      const index = +element.getAttribute('ast')!;
      const insights = await generateInsights({
        highlight: true,
        recipe,
        text: selected.toString().trim()
      });
      insightsIndex[index] = insightsIndex[index]
        ? insightsIndex[index].concat(insights)
        : insights;

      // Send modified insights back to Reader
      onInsight(insightsIndex);
    }, 500);
  }

  /**
   * Get element to attach insights to.
   */
  function getElement(elements: HTMLElement[]): HTMLElement | undefined {
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

    try {
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
        // Get elements to right of tool
        element = getElement(document.elementsFromPoint(
          x + 1,
          y + 50 + i * lineHeight
        ) as HTMLElement[]);
        if (element) break;
      }
      if (!element) return setActive(false);

      // Get index of AST element
      const index = +element.getAttribute('ast')!;

      // Remove insights
      if (insightsIndex[index]) {
        delete insightsIndex[index];
      }
      // Parse insights from element's text
      else {
        insightsIndex[index] = await generateInsights({
          recipe,
          text: element.innerText
        });
      }

      // Send modified insights back to Reader
      onInsight(insightsIndex);
    } catch (err) {
      console.error(err);
    }

    setActive(false);
  }

  // Listen for selection changes
  React.useEffect(() => {
    document.addEventListener('selectionchange', onSelectionChange);
    return () =>
      document.removeEventListener('selectionchange', onSelectionChange);
  }, []);

  return active ? (
    <IconButton className={classes.button} disabled={active}>
      <InsightIcon />
    </IconButton>
  ) : (
    <Tooltip title="Toggle insights for text block below">
      <IconButton
        className={classes.button}
        disabled={active}
        onClick={onClick}
      >
        <InsightIcon />
      </IconButton>
    </Tooltip>
  );
}
