import { useDispatch, useSelector } from 'react-redux';
import { DispatchAction, AppState } from 'store/types';
import { DefinitionInsight } from 'components/reader/DefinitionInsight';
import { generateInsights } from 'lib/reader/generate-insights';
import { Illuminsight } from 'types';
import { WikiInsight } from 'components/reader/WikiInsight';
import { setInsights } from 'store/actions';
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
import {
  createStyles,
  IconButton,
  makeStyles,
  Paper,
  Chip,
} from '@material-ui/core';

const useStyles = makeStyles(() =>
  createStyles({
    expanded: {},
    root: {},
  }),
);

export function Insights(): JSX.Element | null {
  const { insights, recipe, pub } = useSelector((s: AppState) => s);
  const [expanded, setExpanded] = React.useState(false);
  const dispatch = useDispatch<DispatchAction>();
  const classes = useStyles();

  if (!insights) return null;

  return (
    <Paper
      className={`${classes.root} ${expanded ? classes.expanded : ''}`}
      elevation={1}
    >
      hello
    </Paper>
  );
}
