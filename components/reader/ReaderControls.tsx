import { getRecipes, downloadRecipe, getRecipeName } from 'lib/reader/recipes';
import { useDispatch, useSelector } from 'react-redux';
import { DispatchAction, AppState } from 'store/types';
import { ExtendedReaderControls } from 'components/reader/ExtendedReaderControls';
import { IconButton, Tooltip } from '@material-ui/core';
import { InsightGenerator } from 'components/reader/InsightGenerator';
import { Illuminsight } from 'types';
import { useSnackbar } from 'notistack';
import { setRecipe } from 'store/actions';
import { Insights } from 'components/reader/Insights';
import { Toolbar } from 'components/app/Toolbar';
import localForage from 'localforage';
import * as React from 'react';
import { Link } from 'react-router-dom';
import Fuse from 'fuse.js';
import {
  NavigateBefore as PreviousIcon,
  NavigateNext as NextIcon,
  Replay as BackIcon,
  Home as HomeIcon,
} from '@material-ui/icons';

export function ReaderControls({
  onNavigate,
  history,
}: {
  onNavigate: (pub: Illuminsight.Pub) => void;
  history: Illuminsight.Marker[];
}): JSX.Element | null {
  const { enqueueSnackbar } = useSnackbar();
  const { insights, pub } = useSelector((s: AppState) => s);
  const dispatch = useDispatch<DispatchAction>();

  /** Attempt to match pub to recipe in cookbook */
  async function findRecipe(): Promise<void> {
    // Abort if a recipe is already set
    const recipe = await localForage.getItem(`pub-recipe-${pub!.id}`);
    if (recipe) return;

    // Load recipes
    const recipes = await getRecipes();

    // Search by pub title
    // @ts-ignore Fuse types break with includeScore
    const matches: {
      score: number;
      item: Illuminsight.RecipeIndex[0];
    }[] = new Fuse(recipes, {
      includeScore: true,
      threshold: 0.3,
      keys: ['id', 'books'],
    }).search(pub!.name);

    // Search by pub series
    if (pub!.series) {
      matches.push(
        // @ts-ignore
        ...new Fuse(recipes, {
          includeScore: true,
          threshold: 0.4,
          keys: ['id', 'series'],
        }).search(pub!.series),
      );
    }

    // Search by pub authors
    if (pub!.authors) {
      matches.push(
        // @ts-ignore
        ...new Fuse(recipes, {
          includeScore: true,
          threshold: 0.4,
          keys: ['id', 'authors'],
        }).search(pub!.authors),
      );
    }

    // Subtract and sort by scores (smaller = better)
    const [match] = matches
      .reduce((reduced, match) => {
        const _match = reduced.find((m) => m.item.id == match.item.id);
        if (_match) _match.score -= match.score;
        else reduced.push(match);
        return reduced;
      }, [] as typeof matches)
      .sort((a, b) => a.score - b.score)
      .filter((match, i, arr) => {
        // Remove if 0.5 or over
        if (match.score >= 0.5) return false;

        // Remove if other have same score
        if (arr.filter((m) => m.score == match.score).length > 1) return false;

        return true;
      });

    // Choose recipe with lowest (best) score that passes threshold
    if (match && match.score < 0.5) {
      const recipe = await downloadRecipe(match.item.id, pub!.id);
      dispatch(setRecipe(recipe));
      enqueueSnackbar(`"${getRecipeName(recipe.id)}" recipe loaded`);
    }
  }

  /** Navigate by updating pub bookmark */
  function navigate(marker: Illuminsight.Marker): void {
    const _pub = { ...pub! };
    _pub.bookmark = marker;
    onNavigate(_pub);
  }

  // Attempt to match pub to recipe
  React.useEffect(() => {
    if (pub) findRecipe();
  }, [pub && pub.id]);

  if (!pub) return null;

  return (
    <Toolbar>
      {/* Home button */}
      <Tooltip title="Return home">
        <Link to="/">
          <IconButton>
            <HomeIcon />
          </IconButton>
        </Link>
      </Tooltip>

      {/* Previous section */}
      {pub.bookmark.section > 0 ? (
        <Tooltip title="Go to previous section">
          <IconButton
            disabled={pub.bookmark.section == 0}
            onClick={(): void =>
              navigate({ section: pub.bookmark.section - 1, element: 0 })
            }
          >
            <PreviousIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <IconButton disabled>
          <PreviousIcon />
        </IconButton>
      )}

      {/* Back (history) */}
      {history.length ? (
        <Tooltip title="Go back">
          <IconButton onClick={(): void => navigate(history.pop()!)}>
            <BackIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <IconButton disabled>
          <BackIcon />
        </IconButton>
      )}

      {/* Next section */}
      {pub.sections - 1 > pub.bookmark.section ? (
        <Tooltip title="Go to next section">
          <IconButton
            onClick={(): void =>
              navigate({ section: pub.bookmark.section + 1, element: 0 })
            }
          >
            <NextIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <IconButton disabled>
          <NextIcon />
        </IconButton>
      )}

      {/* More menu items */}
      <ExtendedReaderControls navigate={navigate} history={history} />

      {/* Insights (not rendered to toolbar) */}
      <InsightGenerator />
      <Insights key={insights && insights.text} />
    </Toolbar>
  );
}
