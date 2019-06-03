import { Insightful } from 'types/insightful';
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
}: { insights: Insightful.Insight[] } & WithStyles<typeof styles>) {
  return (
    <div>
      {insights.map(insight => (
        <Chip
          key={insight.text}
          label={insight.text}
          onClick={() =>
            window.open(
              `https://www.google.com/search?q=${encodeURIComponent(
                insight.text
              )}`
            )
          }
        />
      ))}
    </div>
  );
}

export const Insights = withStyles(styles)(_Insights);
