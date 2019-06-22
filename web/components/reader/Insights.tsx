import { createStyles, IconButton, makeStyles, Chip } from '@material-ui/core';
import { FreestyleInsights } from 'components/reader/FreestyleInsights';
import { Illuminsight } from 'types/illuminsight';
import { WikiInsight } from 'components/reader/WikiInsight';
import * as React from 'react';
import {
  CloseOutlined as CloseIcon,
  ChevronLeft as BackIcon,
  ExpandMore as ExpandMoreIcon,
  CropFree as FreestyleIcon,
  Search as SearchIcon,
  Info as InfoIcon
} from '@material-ui/icons';

const useStyles = makeStyles(() =>
  createStyles({
    chip: {
      marginBottom: '0.3em',
      marginRight: '0.3em'
    }
  })
);

export function Insights({
  onDisableFreestyle,
  insights,
  index
}: {
  onDisableFreestyle?: () => void;
  insights: Illuminsight.Insight[];
  index: number;
}) {
  const [freestyle, setFreestyle] = React.useState(false);
  const [showWiki, setShowWiki] = React.useState(-1);
  const [expand, setExpand] = React.useState(-1);
  const classes = useStyles();

  /** Toggle freestyle mode */
  function onToggleFreestyle() {
    // Freestyle enabled and <Insights> is a child of <FreestyleInsights>
    if (onDisableFreestyle) onDisableFreestyle();
    // <Insights> is a parent of <FreestyleInsights>
    else setFreestyle(!freestyle);
  }

  /** Handle an insight chip being clicked */
  function onClick(i: number, type: 'search' | 'wiki') {
    const { [i]: insight } = insights;

    // Open or close wiki article
    if (type == 'wiki') setShowWiki(showWiki == i ? -1 : i);
    // Search Google
    else if (type == 'search')
      window.open(
        `https://www.google.com/search?q=${encodeURIComponent(insight.text)}`
      );
  }

  return freestyle ? (
    // Render <FreestyleInsights> from top level <Insights>
    <FreestyleInsights onDisable={onToggleFreestyle} index={index} />
  ) : (
    // Render normal insights or any generated from parent <FreestyleInsights>
    <div>
      {/* Insight list (top level | expanded) */}
      {expand == -1 ? (
        insights
          .map((insight, i) => (
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
              onClick={() => onClick(i, insight.wiki ? 'wiki' : 'search')}
              // onDelete/deleteIcon are repurposed for expanding insights
              onDelete={insight.wiki ? () => setExpand(i) : undefined}
              className={classes.chip}
              deleteIcon={
                insight.wiki ? (
                  <ExpandMoreIcon
                    aria-label={`View all insights for "${insight.text}"`}
                  />
                ) : (
                  undefined
                )
              }
            />
          ))
          .concat(
            <Chip
              key="freestyle"
              icon={onDisableFreestyle ? <CloseIcon /> : <FreestyleIcon />}
              label="Freestyle"
              onClick={onToggleFreestyle}
              className={classes.chip}
            />
          )
      ) : (
        <React.Fragment>
          <IconButton
            aria-label="Back to previous insights"
            onClick={() => setExpand(-1)}
          >
            <BackIcon />
          </IconButton>

          <Chip
            icon={<InfoIcon />}
            label="Wikipedia"
            onClick={() => onClick(expand, 'wiki')}
            className={classes.chip}
          />
          <Chip
            icon={<SearchIcon />}
            label="Google"
            onClick={() => onClick(expand, 'search')}
            className={classes.chip}
          />
        </React.Fragment>
      )}

      {/* Selected Wikipedia insight */}
      {insights[showWiki] ? (
        <WikiInsight
          insight={insights[showWiki] as Required<Illuminsight.Insight>}
          key={showWiki}
        />
      ) : null}
    </div>
  );
}
