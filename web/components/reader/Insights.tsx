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

type InsightType = 'definition' | 'search' | 'wiki';
type ExpandedInsight = { subIndex: number; index: number; type?: InsightType };

const resetExpanded = (): ExpandedInsight => ({ subIndex: -1, index: -1 });

export function Insights({ index }: { index: number }) {
  const { insightsIndex, pub } = React.useContext(ReaderContext);
  const [expand, setExpand] = React.useState(resetExpanded());
  const classes = useStyles();

  const insights = insightsIndex[index];
  if (!insights) return null;
  const expanded = insights[expand.index];

  return (
    <div>
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
            onClick={() =>
              expand.index == i
                ? setExpand(resetExpanded())
                : insight.wikis.length || insight.definitions
                ? setExpand({
                    subIndex: 0,
                    index: i,
                    type: insight.wikis.length ? 'wiki' : 'definition'
                  })
                : window.open(insight.searches[0].url)
            }
            // onDelete/deleteIcon are repurposed for expanding insights
            onDelete={() => setExpand({ subIndex: -1, index: i })}
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
            onClick={() => setExpand(resetExpanded())}
          >
            <BackIcon />
          </IconButton>

          {/* Wiki insights */}
          {expanded.wikis.map((wiki, i) => (
            <Chip
              icon={<WikiIcon />}
              label={wiki.recipe.name}
              onClick={() =>
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
              onClick={() => setExpand({ ...expand, type: 'definition' })}
              className={classes.chip}
            />
          ) : null}

          {/* Search insights */}
          {expanded.searches.map(search => (
            <Chip
              icon={search.context ? <SearchContextIcon /> : <SearchIcon />}
              label={search.name}
              onClick={() => window.open(search.url)}
              className={classes.chip}
            />
          ))}
        </React.Fragment>
      )}

      {expand.type == 'wiki' ? (
        // Selected Wikipedia insight
        <WikiInsight
          insight={expanded.wikis[expand.subIndex!]}
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
