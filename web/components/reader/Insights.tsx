import { Insightful } from 'types/insightful';
import { Section } from 'wtf_wikipedia';
import * as React from 'react';
import {
  ExpandMore as ExpandMoreIcon,
  ListAlt as StatisticsIcon,
  Search as SearchIcon,
  Info as InfoIcon,
  Home as HomeIcon,
  Toc as TOCIcon
} from '@material-ui/icons';
import {
  createStyles,
  Breadcrumbs,
  Typography,
  IconButton,
  makeStyles,
  Button,
  Paper,
  Chip
} from '@material-ui/core';

const useStyles = makeStyles(() =>
  createStyles({
    paperHeader: {
      alignItems: 'center',
      display: 'flex'
    },
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
  })
);

type SectionKey = 'all' | 'toc' | 'main' | 'main+stats' | number;

export function Insights({ insights }: { insights: Insightful.Insight[] }) {
  const [sectionKey, setSectionKey] = React.useState<SectionKey>('main');
  const [showWiki, setShowWiki] = React.useState(-1);
  const insight = insights[showWiki];
  const classes = useStyles();

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
        .map(i => i.html())
        .join('\n');
    }

    // Update links so they're not local
    return html.replace(
      /<a class="link" href=".\//g,
      '<a class="link" href="https://en.wikipedia.org/wiki/'
    );
  }

  function WikiTOC({
    sections,
    depth
  }: {
    sections: Section[];
    depth: number;
  }) {
    return (
      <ul>
        {sections
          .filter(section => section.depth == depth)
          .map(section => (
            <li key={section.title()}>
              <a
                className={classes.tocLink}
                onClick={() =>
                  setSectionKey(
                    insight.wiki!.sections().findIndex(s => s === section)
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
          <header className={classes.paperHeader}>
            {/* Table of Contents */}
            {insight.wiki!.sections().length > 2 ? (
              <IconButton
                className={classes.tocButton}
                onClick={() => setSectionKey('toc')}
              >
                <TOCIcon />
              </IconButton>
            ) : null}

            {/* Section breadcrumbs | attribution */}
            {typeof sectionKey == 'number' ? (
              <Breadcrumbs aria-label="Breadcrumb" maxItems={3}>
                {/* Root section */}
                <Chip
                  onClick={() => setSectionKey('main')}
                  variant="outlined"
                  icon={<HomeIcon />}
                  label={
                    insight.wiki!.title().length < insight.text.length
                      ? insight.wiki!.title()
                      : insight.text
                  }
                  size="small"
                />

                {/* Current section */}
                <Chip
                  label={insight.wiki!.sections()[sectionKey].title()}
                  variant="outlined"
                  size="small"
                />
              </Breadcrumbs>
            ) : (
              <Typography variant="caption">
                Source: (English) Wikipedia.org:{' '}
                <a href={`https://en.wikipedia.org/wiki/${insight.text}`}>
                  {insight.text}
                </a>
              </Typography>
            )}
          </header>

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
