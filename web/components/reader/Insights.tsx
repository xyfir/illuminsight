import { Insightful } from 'types/insightful';
import * as React from 'react';
import {
  ExpandMore as ExpandMoreIcon,
  ListAlt as StatisticsIcon,
  Search as SearchIcon,
  Info as InfoIcon,
  Toc as TOCIcon
} from '@material-ui/icons';
import {
  createStyles,
  WithStyles,
  withStyles,
  Typography,
  IconButton,
  Button,
  Paper,
  Theme,
  Chip
} from '@material-ui/core';

const styles = (theme: Theme) =>
  createStyles({
    tocButton: {
      marginRight: '0.3em'
    },
    tocLink: {
      cursor: 'pointer'
    },
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

type SectionKey = 'all' | 'toc' | 'main' | 'main+stats' | number;

function _Insights({
  insights,
  classes
}: { insights: Insightful.Insight[] } & WithStyles<typeof styles>) {
  const [sectionKey, setSectionKey] = React.useState<SectionKey>('main');
  const [showWiki, setShowWiki] = React.useState(-1);
  const insight = insights[showWiki];

  function onClick(insight: Insightful.Insight, i: number) {
    if (insight.wiki) {
      setSectionKey('main');
      setShowWiki(i);
    } else {
      window.open(
        `https://www.google.com/search?q=${encodeURIComponent(insight.text)}`
      );
    }
  }

  function getSectionHTML() {
    let html = '';

    // Get html for main section, full article, or specified section
    if (typeof sectionKey == 'number')
      html = insight.wiki!.sections()[sectionKey].html();
    else if (sectionKey == 'all') html = insight.wiki!.html();
    else html = insight.wiki!.sections()[0].html();

    // Get infobox HTML
    if (sectionKey == 'main+stats') {
      html += insight
        .wiki!.infoboxes()
        .map((i: any) => i.html())
        .join('\n');
    }

    // Update links so they're not local
    return html.replace(
      /<a class="link" href=".\//g,
      '<a class="link" href="https://en.wikipedia.org/wiki/'
    );
  }

  function WikiTOC({ sections, depth }: { sections: any[]; depth: number }) {
    return (
      <ul>
        {sections
          .filter(section => section.depth == depth)
          .map((section: any) => (
            <li key={section.title()}>
              <a
                className={classes.tocLink}
                onClick={() =>
                  setSectionKey(
                    insight
                      .wiki!.sections()
                      .findIndex((s: any) => s === section)
                  )
                }
              >
                {section.title()}
              </a>

              {/* Nested children */}
              {section.children().length ? (
                <WikiTOC sections={section.children()} depth={depth + 1} />
              ) : null}
            </li>
          ))}
      </ul>
    );
  }

  return (
    <div>
      {/* Insight list */}
      {insights.map((insight, i) => (
        <Chip
          key={insight.text}
          icon={insight.wiki ? <InfoIcon /> : <SearchIcon />}
          label={insight.text}
          onClick={() => onClick(insight, i)}
          className={classes.chip}
        />
      ))}

      {/* Selected Wikipedia insight */}
      {insight ? (
        <Paper className={classes.paper} elevation={2}>
          {/* Table of Contents */}
          {insight.wiki!.sections().length > 2 ? (
            <IconButton
              className={classes.tocButton}
              onClick={() => setSectionKey('toc')}
            >
              <TOCIcon />
            </IconButton>
          ) : null}

          {/* Attribution */}
          <Typography variant="caption">
            Source: (English) Wikipedia.org:{' '}
            <a href={`https://en.wikipedia.org/wiki/${insight.text}`}>
              {insight.text}
            </a>
          </Typography>

          {sectionKey == 'toc' ? (
            <WikiTOC sections={insight.wiki!.sections().slice(1)} depth={0} />
          ) : (
            <React.Fragment>
              <div dangerouslySetInnerHTML={{ __html: getSectionHTML() }} />

              {sectionKey == 'main' || sectionKey == 'main+stats' ? (
                <Button onClick={() => setSectionKey('all')} variant="text">
                  <ExpandMoreIcon />
                  Continue Reading
                </Button>
              ) : null}

              {sectionKey == 'main' && insight.wiki!.infoboxes().length ? (
                <Button
                  onClick={() => setSectionKey('main+stats')}
                  variant="text"
                >
                  <StatisticsIcon />
                  Show Statistics
                </Button>
              ) : null}
            </React.Fragment>
          )}
        </Paper>
      ) : null}
    </div>
  );
}

export const Insights = withStyles(styles)(_Insights);
