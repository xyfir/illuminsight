import { useDispatch, useSelector } from 'react-redux';
import { DispatchAction, AppState } from 'store/types';
import { DefinitionInsight } from 'components/reader/DefinitionInsight';
import { WikiInsight } from 'components/reader/WikiInsight';
import { setInsights } from 'store/actions';
import * as React from 'react';
import {
  YoutubeSearchedFor as SearchContextIcon,
  CloseOutlined as CloseIcon,
  TextFormat as DefinitionIcon,
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon,
  Search as SearchIcon,
  Info as WikiIcon,
} from '@material-ui/icons';
import {
  createStyles,
  Typography,
  makeStyles,
  IconButton,
  Paper,
  Chip,
} from '@material-ui/core';

type InsightViewer = {
  definitions?: boolean;
  index?: number;
  wiki?: boolean;
  auto?: boolean;
};

const useStyles = makeStyles(() =>
  createStyles({
    expanded: {
      top: '0% !important',
    },
    header: {
      marginBottom: '1em',
      display: 'flex',
    },
    title: {
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      overflowX: 'hidden',
      fontSize: '150%',
      flex: '1',
    },
    body: {
      overflow: 'auto',
    },
    root: {
      flexDirection: 'column',
      position: 'fixed',
      display: 'flex',
      padding: '1em',
      zIndex: 99,
      bottom: '0%',
      right: '0%',
      left: '0%',
      top: '60%',
    },
    chip: {
      marginRight: '0.3em',
    },
  }),
);

export function Insights(): JSX.Element | null {
  const [expanded, setExpanded] = React.useState(false);
  const [viewer, setViewer] = React.useState<InsightViewer>({ auto: true });
  const { insights, pub } = useSelector((s: AppState) => s);
  const dispatch = useDispatch<DispatchAction>();
  const classes = useStyles();

  if (!insights) return null;

  function onClose(): void {
    dispatch(setInsights(undefined));
  }

  return (
    <Paper
      className={`${classes.root} ${expanded ? classes.expanded : ''}`}
      elevation={1}
      square
    >
      <header className={classes.header}>
        {/* Title */}
        <Typography variant="h3" className={classes.title}>
          {insights.text}
        </Typography>

        <div>
          {/* Expand / restore */}
          {expanded ? (
            <IconButton
              onClick={(): void => setExpanded(false)}
              title="Restore insights panel size"
              size="small"
            >
              <ExpandMoreIcon />
            </IconButton>
          ) : (
            <IconButton
              onClick={(): void => setExpanded(true)}
              title="Expand insights panel"
              size="small"
            >
              <ExpandLessIcon />
            </IconButton>
          )}

          {/* Close */}
          <IconButton
            onClick={onClose}
            title="Close insights panel"
            size="small"
          >
            <CloseIcon />
          </IconButton>
        </div>
      </header>

      <div className={classes.body}>
        <nav>
          {/* Definition */}
          {insights.definitions ? (
            <Chip
              icon={<DefinitionIcon />}
              label="Definition"
              onClick={(): void => setViewer({ definitions: true })}
              className={classes.chip}
            />
          ) : null}

          {/* Wiki insights */}
          {insights.wikis.map((wiki, i) => (
            <Chip
              key={i}
              icon={<WikiIcon />}
              label={wiki.recipe.name}
              onClick={(): void => setViewer({ wiki: true, index: i })}
              className={classes.chip}
            />
          ))}

          {/* Search insights */}
          {insights.searches.map((search, i) => (
            <Chip
              key={i}
              icon={search.context ? <SearchContextIcon /> : <SearchIcon />}
              label={search.name}
              onClick={(): void => {
                window.open(search.url);
              }}
              className={classes.chip}
            />
          ))}
        </nav>

        {/* Insight viewer */}
        {viewer.definitions || (viewer.auto && insights.definitions) ? (
          // Selected Wiktionary insight
          <DefinitionInsight
            definitions={insights.definitions!}
            languages={pub!.languages}
          />
        ) : viewer.wiki || (viewer.auto && insights.wikis.length) ? (
          // Selected Wikipedia insight
          <WikiInsight
            insight={insights.wikis[viewer.wiki ? viewer.index! : 0]}
          />
        ) : null}
      </div>
    </Paper>
  );
}
