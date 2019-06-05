import { Insightful } from 'types/insightful';
import * as React from 'react';
import {
  ExpandMore as ExpandMoreIcon,
  Search as SearchIcon,
  Info as InfoIcon
} from '@material-ui/icons';
import {
  createStyles,
  WithStyles,
  withStyles,
  Typography,
  Button,
  Paper,
  Theme,
  Chip
} from '@material-ui/core';

const styles = (theme: Theme) =>
  createStyles({
    paper: {
      maxHeight: '60vh',
      overflow: 'auto',
      padding: '0.3em',
      margin: '1em 0.3em'
    },
    chip: {
      margin: '0 0.3em'
    }
  });

function _Insights({
  insights,
  classes
}: { insights: Insightful.Insight[] } & WithStyles<typeof styles>) {
  const [showFullArticle, setShowFullArticle] = React.useState(false);
  const [showWiki, setShowWiki] = React.useState(-1);
  const insight = insights[showWiki];

  function onClick(insight: Insightful.Insight, i: number) {
    if (insight.wiki) {
      setShowFullArticle(false);
      setShowWiki(i);
    } else {
      window.open(
        `https://www.google.com/search?q=${encodeURIComponent(insight.text)}`
      );
    }
  }

  function getArticleHTML() {
    return (showFullArticle
      ? insight.wiki!.html()
      : insight.wiki!.sections()[0].html()
    ).replace(
      /<a class="link" href=".\//g,
      '<a class="link" href="https://en.wikipedia.org/wiki/'
    );
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

      {insight ? (
        <React.Fragment>
          <Paper className={classes.paper} elevation={2}>
            <Typography variant="caption">
              Source: (English) Wikipedia.org:{' '}
              <a href={`https://en.wikipedia.org/wiki/${insight.text}`}>
                {insight.text}
              </a>
            </Typography>

            <div dangerouslySetInnerHTML={{ __html: getArticleHTML() }} />

            {showFullArticle ? null : (
              <Button onClick={() => setShowFullArticle(true)} variant="text">
                <ExpandMoreIcon />
                Continue Reading
              </Button>
            )}
          </Paper>
        </React.Fragment>
      ) : null}
    </div>
  );
}

export const Insights = withStyles(styles)(_Insights);
