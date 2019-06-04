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
  const [showWiki, setShowWiki] = React.useState<string[]>([]);

  function onClick(insight: Insightful.Insight) {
    if (insight.wiki) {
      setShowWiki(showWiki.concat(insight.text));
    } else {
      window.open(
        `https://www.google.com/search?q=${encodeURIComponent(insight.text)}`
      );
    }
  }

  return (
    <div>
      {insights.map(insight => (
        <React.Fragment key={insight.text}>
          <Chip
            icon={insight.wiki ? <InfoIcon /> : <SearchIcon />}
            label={insight.text}
            onClick={() => onClick(insight)}
            className={classes.chip}
          />
          {showWiki.includes(insight.text) ? (
            <div dangerouslySetInnerHTML={{ __html: insight.wiki!.html() }} />
          ) : null}
        </React.Fragment>
      ))}
    </div>
  );
}

export const Insights = withStyles(styles)(_Insights);
