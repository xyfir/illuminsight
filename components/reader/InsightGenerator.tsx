import { useDispatch, useSelector } from 'react-redux';
import { DispatchAction, AppState } from 'store/types';
import { generateInsights } from 'lib/reader/generate-insights';
import { setInsights } from 'store/actions';
import * as React from 'react';

let selectionTimeout: NodeJS.Timer | undefined;

/** Listen for selection changes and generate insights. Does not render.  */
export function InsightGenerator(): null {
  const { recipe } = useSelector((s: AppState) => s);
  const dispatch = useDispatch<DispatchAction>();

  // Generate insights from text selection
  function onSelectionChange(): void {
    if (selectionTimeout) clearTimeout(selectionTimeout);

    async function onTimeout(): Promise<void> {
      const text = document
        .getSelection()!
        .toString()
        .trim();
      if (text) dispatch(setInsights(await generateInsights({ recipe, text })));
    }

    selectionTimeout = setTimeout(() => {
      onTimeout();
    }, 500);
  }

  // Listen for selection changes
  React.useEffect(() => {
    document.addEventListener('selectionchange', onSelectionChange);
    return (): void => {
      if (selectionTimeout) clearTimeout(selectionTimeout);
      document.removeEventListener('selectionchange', onSelectionChange);
      selectionTimeout = undefined;
    };
  }, []);

  return null;
}
