import { Illuminsight } from 'types/illuminsight';
import * as React from 'react';
import wtf from 'wtf_wikipedia';
import {
  ChevronLeft as BackIcon,
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
      marginBottom: '0.3em',
      alignItems: 'center',
      display: 'flex'
    },
    iconButton: {
      marginRight: '0.1em'
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
  doc
}: {
  doc: Exclude<Illuminsight.Insight['wiki'], undefined>;
}) {
  const [sectionKey, setSectionKey] = React.useState<SectionKey>('main');
  const [articleKey, setArticleKey] = React.useState(0);
  const [articles, setArticles] = React.useState([doc]);
  const article = articles[articleKey];
  const classes = useStyles();

  /** Go back to previous article in history */
  function onPreviousArticle() {
    setSectionKey('main');
    setArticleKey(articleKey - 1);
  }

  /**
   * Triggered whenever an element in article is clicked. Handles wiki links,
   *  ignores everything else.
   */
  async function onLinkClick(event: React.MouseEvent) {
    const a = event.target as HTMLAnchorElement;

    // If not a link, bubble up
    if (a.tagName != 'A' && a.parentElement!.tagName != 'DIV') {
      event.target = a.parentElement!;
      onLinkClick(event);
      return;
    }
    if (!a.href) return;

    // If not a link to another wikipedia article, let Reader handler it
    if (a.classList.contains('external')) return;

    event.preventDefault();
    event.stopPropagation();

    // Load wiki article into viewer
    const article = await wtf.fetch(a.getAttribute('href')!.substr(2));
    if (article) {
      setArticles(articles.slice(0, articleKey + 1).concat(article));
      setSectionKey('main');
      setArticleKey(articleKey + 1);
    }
  }

  /** Build HTML to display for section */
  function getSectionHTML() {
    let html = '';

    // Get html for main section, full article, or specified section
    if (typeof sectionKey == 'number')
      html = article.sections()[sectionKey].html();
    else if (sectionKey == 'all') html = article.html();
    else html = article.sections()[0].html();

    // Get infobox HTML
    if (sectionKey == 'main+stats') {
      html += article
        .infoboxes()
        .map(i => i.html())
        .join('\n');
    }

    return html;
  }

  /** Get all ancestors of wiki section */
  function getSectionAncestors(section: wtf.Section): wtf.Section[] {
    const ancestors: wtf.Section[] = [];
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
    sections: wtf.Section[];
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
                    article.sections().findIndex(s => s === section)
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
        {/* Previous article button */}
        {articleKey ? (
          <IconButton
            aria-label="Go back to previous article"
            className={classes.iconButton}
            onClick={onPreviousArticle}
          >
            <BackIcon />
          </IconButton>
        ) : null}

        {/* Table of contents button */}
        {article.sections().length > 2 ? (
          <IconButton
            aria-label="Wiki article table of contents"
            className={classes.iconButton}
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
              label={article.title()}
              icon={<HomeIcon />}
              size="small"
            />

            {/* Intermediate sections */}
            {getSectionAncestors(article.sections()[sectionKey]).map(
              section => (
                <Chip
                  onClick={() =>
                    setSectionKey(
                      article.sections().findIndex(s => s === section)
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
            <Chip label={article.sections()[sectionKey].title()} size="small" />
          </Breadcrumbs>
        ) : (
          <Typography variant="caption">
            Source: (English) Wikipedia.org:{' '}
            <a href={`https://en.wikipedia.org/wiki/${article.title()}`}>
              {article.title()}
            </a>
          </Typography>
        )}
      </header>

      {/* Section content */}
      {sectionKey == 'toc' ? (
        <WikiTOC sections={article.sections().slice(1)} depth={0} />
      ) : (
        <React.Fragment>
          <div
            dangerouslySetInnerHTML={{ __html: getSectionHTML() }}
            onClick={onLinkClick}
          />

          {sectionKey == 'main' || sectionKey == 'main+stats' ? (
            <Button onClick={() => setSectionKey('all')} variant="text">
              <ExpandMoreIcon />
              Continue Reading
            </Button>
          ) : null}

          {sectionKey == 'main' && article.infoboxes().length ? (
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
