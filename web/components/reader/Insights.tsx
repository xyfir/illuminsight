import { Search as SearchIcon, Info as InfoIcon } from '@material-ui/icons';
import { Insightful } from 'types/insightful';
import * as React from 'react';
import {
  createStyles,
  WithStyles,
  withStyles,
  Theme,
  Chip
} from '@material-ui/core';

const styles = (theme: Theme) =>
  createStyles({
    chip: {
      margin: '0 0.3em'
    }
  });

function _Insights({
  insights,
  classes
}: { insights: Insightful.Insight[] } & WithStyles<typeof styles>) {
  const [showWiki, setShowWiki] = React.useState(-1);

  function onClick(insight: Insightful.Insight, i: number) {
    if (insight.wiki) {
      setShowWiki(i);
    } else {
      window.open(
        `https://www.google.com/search?q=${encodeURIComponent(insight.text)}`
      );
    }
  }

  return (
    <div>
      {insights.map((insight, i) => (
        <Chip
          key={insight.text}
          icon={insight.wiki ? <InfoIcon /> : <SearchIcon />}
          label={insight.text}
          onClick={() => onClick(insight, i)}
          className={classes.chip}
        />
      ))}

      {showWiki > -1 ? (
        <div
          dangerouslySetInnerHTML={{
            __html: insights[showWiki]
              .wiki!.html()
              .replace(
                /<a class="link" href=".\//g,
                '<a class="link" href="https://en.wikipedia.org/wiki/'
              )
          }}
        />
      ) : null}
    </div>
  );
}

export const Insights = withStyles(styles)(_Insights);
