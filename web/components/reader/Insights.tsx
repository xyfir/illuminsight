import { createStyles, IconButton, makeStyles, Chip } from '@material-ui/core';
import { DefinitionInsight } from 'components/reader/DefinitionInsight';
import { ReaderContext } from 'components/reader/Reader';
import { WikiInsight } from 'components/reader/WikiInsight';
import * as React from 'react';
import {
  YoutubeSearchedFor as SearchContextIcon,
  CloseOutlined as CloseIcon,
  ChevronRight as ExpandMoreIcon,
  ChevronLeft as BackIcon,
  TextFormat as DefinitionIcon,
  Search as SearchIcon,
  Info as WikiIcon
} from '@material-ui/icons';

const useStyles = makeStyles(() =>
  createStyles({
    chip: {
      marginBottom: '0.3em',
      marginRight: '0.3em'
    }
  })
);

type InsightType = 'definition' | 'search+' | 'search' | 'wiki';
type ExpandedInsight = { insight: number; recipe?: number; type?: InsightType };

export function Insights({ index }: { index: number }) {
  const { insightsIndex, recipe, pub } = React.useContext(ReaderContext);
  const [expand, setExpand] = React.useState<ExpandedInsight>({ insight: -1 });
  const classes = useStyles();

  const insights = insightsIndex[index];
  if (!insights) return null;
  const expanded = insights[expand.insight];

  /** Handle an insight chip being clicked */
  function onClick(
    insightIndex: number,
    type: InsightType,
    recipeIndex: number = 0
  ) {
    const { [insightIndex]: insight } = insights;

    switch (type) {
      // Open or close definition
      case 'definition':
        setExpand({ insight: insightIndex, type: 'definition' });
        break;
      // Web search with context
      case 'search+':
        window.open(
          recipe.searches[recipeIndex].url +
            encodeURIComponent(
              `${recipe.searches[recipeIndex].context} ${insight.text}`
            )
        );
        break;
      // Web search
      case 'search':
        window.open(
          recipe.searches[recipeIndex].url + encodeURIComponent(insight.text)
        );
        break;
      // Open or close wiki article
      case 'wiki':
        setExpand({ insight: insightIndex, recipe: recipeIndex, type: 'wiki' });
        break;
    }
  }

  return (
    <div>
      {/* Insight list (suggested | expanded) */}
      {expand.insight == -1 || expand.type ? (
        insights.map((insight, i) => (
          <Chip
            key={insight.text}
            icon={
              expand.insight == i ? (
                <CloseIcon />
              ) : insight.wikis.length ? (
                <WikiIcon />
              ) : insight.definitions ? (
                <DefinitionIcon />
              ) : (
                <SearchIcon />
              )
            }
            label={insight.text}
            onClick={() =>
              expand.insight == i
                ? setExpand({ insight: -1 })
                : onClick(
                    i,
                    insight.wikis.length
                      ? 'wiki'
                      : insight.definitions
                      ? 'definition'
                      : recipe.searches[0].context
                      ? 'search+'
                      : 'search'
                  )
            }
            // onDelete/deleteIcon are repurposed for expanding insights
            onDelete={() => setExpand({ insight: i })}
            className={classes.chip}
            deleteIcon={
              <ExpandMoreIcon
                aria-label={`View all insights for "${insight.text}"`}
              />
            }
          />
        ))
      ) : (
        <React.Fragment>
          <IconButton
            aria-label="Back to previous insights"
            onClick={() => setExpand({ insight: -1 })}
          >
            <BackIcon />
          </IconButton>

          {expanded.wikis.map((wiki, i) => (
            <Chip
              icon={<WikiIcon />}
              label={wiki.recipe.name}
              onClick={() => onClick(expand.insight, 'wiki', i)}
              className={classes.chip}
            />
          ))}

          {expanded.definitions ? (
            <Chip
              icon={<DefinitionIcon />}
              label="Definition"
              onClick={() => onClick(expand.insight, 'definition')}
              className={classes.chip}
            />
          ) : null}

          {recipe.searches.map((search, i) => (
            <React.Fragment>
              <Chip
                icon={<SearchIcon />}
                label={search.name}
                onClick={() => onClick(expand.insight, 'search', i)}
                className={classes.chip}
              />

              {search.context ? (
                <Chip
                  icon={<SearchContextIcon />}
                  label={`${search.name} + Context`}
                  onClick={() => onClick(expand.insight, 'search+', i)}
                  className={classes.chip}
                />
              ) : null}
            </React.Fragment>
          ))}
        </React.Fragment>
      )}

      {expand.type == 'wiki' ? (
        // Selected Wikipedia insight
        <WikiInsight
          insight={expanded.wikis[expand.recipe!]}
          key={expand.insight}
        />
      ) : expand.type == 'definition' ? (
        // Selected Wiktionary insight
        <DefinitionInsight
          definitions={expanded.definitions!}
          languages={pub!.languages}
          key={expand.insight}
        />
      ) : null}
    </div>
  );
}
