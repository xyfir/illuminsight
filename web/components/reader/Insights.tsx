import { createStyles, makeStyles, Chip } from '@material-ui/core';
import { WikiInsight } from 'components/reader/WikiInsight';
import { Insightful } from 'types/insightful';
import * as React from 'react';
import {
  CloseOutlined as CloseIcon,
  Search as SearchIcon,
  Info as InfoIcon
} from '@material-ui/icons';

const useStyles = makeStyles(() =>
  createStyles({
    chip: {
      margin: '0 0.3em'
    }
  })
);

export function Insights({ insights }: { insights: Insightful.Insight[] }) {
  const [showWiki, setShowWiki] = React.useState(-1);
  const classes = useStyles();

  /** Handle an insight chip being clicked */
  function onClick(insight: Insightful.Insight, i: number) {
    // Open or close wiki article
    if (insight.wiki) return setShowWiki(showWiki == i ? -1 : i);

    window.open(
      `https://www.google.com/search?q=${encodeURIComponent(insight.text)}`
    );
  }

  return (
    <div>
      {/* Insight list */}
      {insights.map((insight, i) => (
        <Chip
          key={insight.text}
          icon={
            showWiki == i ? (
              <CloseIcon />
            ) : insight.wiki ? (
              <InfoIcon />
            ) : (
              <SearchIcon />
            )
          }
          label={insight.text}
          onClick={() => onClick(insight, i)}
          className={classes.chip}
        />
      ))}

      {/* Selected Wikipedia insight */}
      {insights[showWiki] ? (
        <WikiInsight
          insight={insights[showWiki] as Required<Insightful.Insight>}
          key={showWiki}
        />
      ) : null}
    </div>
  );
}
