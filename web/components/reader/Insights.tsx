import * as React from 'react';
import {
  createStyles,
  WithStyles,
  withStyles,
  Theme,
  Chip
} from '@material-ui/core';

const styles = (theme: Theme) => createStyles({});

function _Insights({
  insights
}: { insights: string[] } & WithStyles<typeof styles>) {
  return (
    <div>
      {insights.map(insight => (
        <Chip
          key={insight}
          label={insight}
          onClick={() =>
            window.open(
              `https://www.google.com/search?q=${encodeURIComponent(insight)}`
            )
          }
        />
      ))}
    </div>
  );
}

export const Insights = withStyles(styles)(_Insights);
