import { createStyles, IconButton, makeStyles, Chip } from '@material-ui/core';
import { DefinitionInsight } from 'components/reader/DefinitionInsight';
import { generateInsights } from 'lib/reader/generate-insights';
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
  Info as WikiIcon,
} from '@material-ui/icons';
import { Illuminsight } from 'types';

const useStyles = makeStyles(() =>
  createStyles({
    button: {
      marginRight: '0.3em',
    },
    chip: {
      marginBottom: '0.3em !important',
      marginRight: '0.3em !important',
    },
  }),
);

type InsightType = 'definition' | 'search' | 'wiki';
type ExpandedInsight = { subIndex: number; index: number; type?: InsightType };

const resetExpanded = (): ExpandedInsight => ({ subIndex: -1, index: -1 });

export function Insights({ index }: { index: number }): JSX.Element | null {
  const { insightsIndex, dispatch, recipe, pub } = React.useContext(
    ReaderContext,
  );
  const [expand, setExpand] = React.useState(resetExpanded());
  const classes = useStyles();

  const insights = insightsIndex[index];
  if (!insights) return null;
  const expanded = insights[expand.index];

  /** Generate all insights and expand to show list */
  async function onExpandAll(i: number): Promise<void> {
    setExpand({ subIndex: -1, index: i });

    // Generate all insights
    if (!insights[0].all) {
      dispatch({
        insightsIndex: {
          ...insightsIndex,
          [index]: await generateInsights({ insights, recipe, all: true }),
        },
      });
    }
  }

  function onClick(insight: Illuminsight.Insight, i: number): void {
    if (expand.index == i) {
      setExpand(resetExpanded());
    } else if (insight.wikis.length || insight.definitions) {
      setExpand({
        subIndex: 0,
        index: i,
        type: insight.wikis.length ? 'wiki' : 'definition',
      });
    } else {
      window.open(insight.searches[0].url);
    }
  }

  function onClose(): void {
    delete insightsIndex[index];
    dispatch({ insightsIndex });
  }

  return (
    <div>
      <IconButton
        aria-label="Close insights"
        className={classes.button}
        onClick={onClose}
        size="small"
      >
        <CloseIcon />
      </IconButton>

      {/* Insight list (suggested | expanded) */}
      {expand.index == -1 || expand.type ? (
        insights.map((insight, i) => (
          <Chip
            key={insight.text}
            icon={
              expand.index == i ? (
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
            onClick={(): void => onClick(insight, i)}
            // onDelete/deleteIcon are repurposed for expanding all insights
            onDelete={(): Promise<void> => onExpandAll(i)}
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
          {/* Collapse insights */}
          <IconButton
            aria-label="Back to previous insights"
            className={classes.button}
            onClick={(): void => setExpand(resetExpanded())}
            size="small"
          >
            <BackIcon />
          </IconButton>

          {/* Wiki insights */}
          {expanded.wikis.map((wiki, i) => (
            <Chip
              key={i}
              icon={<WikiIcon />}
              label={wiki.recipe.name}
              onClick={(): void =>
                setExpand({ ...expand, type: 'wiki', subIndex: i })
              }
              className={classes.chip}
            />
          ))}

          {/* Definition */}
          {expanded.definitions ? (
            <Chip
              icon={<DefinitionIcon />}
              label="Definition"
              onClick={(): void => setExpand({ ...expand, type: 'definition' })}
              className={classes.chip}
            />
          ) : null}

          {/* Search insights */}
          {expanded.searches.map((search) => (
            <Chip
              key={search.name}
              icon={search.context ? <SearchContextIcon /> : <SearchIcon />}
              label={search.name}
              onClick={(): Window | null => window.open(search.url)}
              className={classes.chip}
            />
          ))}
        </React.Fragment>
      )}

      {expand.type == 'wiki' ? (
        // Selected Wikipedia insight
        <WikiInsight
          insight={expanded.wikis[expand.subIndex]}
          key={expand.index}
        />
      ) : expand.type == 'definition' ? (
        // Selected Wiktionary insight
        <DefinitionInsight
          definitions={expanded.definitions!}
          languages={pub!.languages}
          key={expand.index}
        />
      ) : null}
    </div>
  );
}
