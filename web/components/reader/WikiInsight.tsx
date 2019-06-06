import { Insightful } from 'types/insightful';
import { Section } from 'wtf_wikipedia';
import * as React from 'react';
import {
  ExpandMore as ExpandMoreIcon,
  ListAlt as StatisticsIcon,
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
    }
  })
);

type SectionKey = 'all' | 'toc' | 'main' | 'main+stats' | number;

export function WikiInsight({
  insight
}: {
  insight: Required<Insightful.Insight>;
}) {
  const [sectionKey, setSectionKey] = React.useState<SectionKey>('main');
  const classes = useStyles();

  /** Build HTML to display for section */
  function getSectionHTML() {
    let html = '';

    // Get html for main section, full article, or specified section
    if (typeof sectionKey == 'number')
      html = insight.wiki.sections()[sectionKey].html();
    else if (sectionKey == 'all') html = insight.wiki.html();
    else html = insight.wiki.sections()[0].html();

    // Get infobox HTML
    if (sectionKey == 'main+stats') {
      html += insight.wiki
        .infoboxes()
        .map(i => i.html())
        .join('\n');
    }

    // Update links so they're not local
    return html.replace(
      /<a class="link" href=".\//g,
      '<a class="link" href="https://en.wikipedia.org/wiki/'
    );
  }

  /** Get all ancestors of wiki section */
  function getSectionAncestors(section: Section): Section[] {
    const ancestors: Section[] = [];
    let parent = section.parent();
    while (parent !== null) {
      ancestors.push(parent);
      parent = parent.parent();
    }
    return ancestors.reverse();
  }

  /** Render a wiki article's table of contents */
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
          .filter(section => section.indentation() == depth)
          .map(section => (
            <li key={section.title()}>
              <a
                className={classes.tocLink}
                onClick={() =>
                  setSectionKey(
                    insight.wiki.sections().findIndex(s => s === section)
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
    <Paper className={classes.paper} elevation={2}>
      <header className={classes.paperHeader}>
        {/* Table of Contents */}
        {insight.wiki.sections().length > 2 ? (
          <IconButton
            aria-label="Wiki article table of contents"
            className={classes.tocButton}
            onClick={() => setSectionKey('toc')}
          >
            <TOCIcon />
          </IconButton>
        ) : null}

        {/* Section breadcrumbs | attribution */}
        {typeof sectionKey == 'number' ? (
          <Breadcrumbs aria-label="Breadcrumb" maxItems={4}>
            {/* Root section */}
            <Chip
              onClick={() => setSectionKey('main')}
              variant="outlined"
              icon={<HomeIcon />}
              label={
                insight.wiki.title().length < insight.text.length
                  ? insight.wiki.title()
                  : insight.text
              }
              size="small"
            />

            {/* Intermediate sections */}
            {getSectionAncestors(insight.wiki.sections()[sectionKey]).map(
              section => (
                <Chip
                  onClick={() =>
                    setSectionKey(
                      insight.wiki.sections().findIndex(s => s === section)
                    )
                  }
                  variant="outlined"
                  label={section.title()}
                  size="small"
                  key={section.title()}
                />
              )
            )}

            {/* Current section */}
            <Chip
              label={insight.wiki.sections()[sectionKey].title()}
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
        <WikiTOC sections={insight.wiki.sections().slice(1)} depth={0} />
      ) : (
        <React.Fragment>
          <div dangerouslySetInnerHTML={{ __html: getSectionHTML() }} />

          {sectionKey == 'main' || sectionKey == 'main+stats' ? (
            <Button onClick={() => setSectionKey('all')} variant="text">
              <ExpandMoreIcon />
              Continue Reading
            </Button>
          ) : null}

          {sectionKey == 'main' && insight.wiki.infoboxes().length ? (
            <Button onClick={() => setSectionKey('main+stats')} variant="text">
              <StatisticsIcon />
              Show Statistics
            </Button>
          ) : null}
        </React.Fragment>
      )}
    </Paper>
  );
}
