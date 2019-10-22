import { removeInsights, addInsights } from 'store/actions';
import { Highlight as InsightIcon } from '@material-ui/icons';
import { useDispatch, useSelector } from 'react-redux';
import { DispatchAction, AppState } from 'store/types';
import { generateInsights } from 'lib/reader/generate-insights';
import * as React from 'react';
import {
  createStyles,
  IconButton,
  makeStyles,
  Tooltip,
} from '@material-ui/core';

const useStyles = makeStyles(() =>
  createStyles({
    button: {
      transform: 'rotate(180deg)',
    },
  }),
);

let selectionTimeout: NodeJS.Timer | undefined;

export function InsightTool(): JSX.Element {
  const { insightsIndex, recipe } = useSelector((s: AppState) => s);
  const [active, setActive] = React.useState(false);
  const dispatch = useDispatch<DispatchAction>();
  const classes = useStyles();

  /**
   * Get element to attach insights to.
   */
  function getElement(elements: HTMLElement[]): HTMLElement | undefined {
    // Remove #ast and any ancestors
    elements.splice(
      elements.findIndex((el) => el.id == 'ast'),
      elements.length,
    );

    // Remove non-ast elements
    elements = elements.filter((el) => el.getAttribute('ast') !== null);

    // Reverse list so it's [parent,child]
    elements.reverse();

    // Ignore if parent element lacks text content
    if (!elements.length || !elements[0].innerText) return;

    // Get last block element
    let block: HTMLElement | undefined = undefined;
    for (const el of elements) {
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

  function onSelectionChange(): void {
    if (selectionTimeout) clearTimeout(selectionTimeout);

    async function afterTimeout(): Promise<void> {
      const selected = document.getSelection()!;
      if (!selected.toString()) return;

      // Get node's ancestor elements to choose block element from
      const elements = [selected.focusNode!.parentElement!];
      let el: HTMLElement | null;
      do {
        el = elements[elements.length - 1].parentElement;
        if (el) elements.push(el);
      } while (el);
      const element = getElement(elements) as HTMLElement;

      // Generate insights for AST block
      dispatch(
        addInsights(
          +element.getAttribute('ast')!,
          await generateInsights({
            highlight: true,
            recipe,
            text: selected.toString().trim(),
          }),
        ),
      );
    }

    selectionTimeout = setTimeout(() => {
      afterTimeout();
    }, 500);
  }

  /**
   * Handle clicks to insight tool
   */
  async function onClick(event: React.MouseEvent): Promise<void> {
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
          y + 50 + i * lineHeight,
        ) as HTMLElement[]);
        if (element) break;
      }
      if (!element) return setActive(false);

      // Get index of AST element
      const index = +element.getAttribute('ast')!;

      // Remove insights
      if (insightsIndex[index]) {
        dispatch(removeInsights(index));
      }
      // Parse insights from element's text
      else {
        dispatch(
          addInsights(
            index,
            await generateInsights({
              recipe,
              text: element.innerText,
            }),
          ),
        );
      }
    } catch (err) {
      console.error(err);
    }

    setActive(false);
  }

  // Listen for selection changes
  React.useEffect(() => {
    document.addEventListener('selectionchange', onSelectionChange);
    return (): void =>
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
