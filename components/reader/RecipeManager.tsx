import { RouteComponentProps, withRouter } from 'react-router';
import { ReaderContext } from 'components/reader/Reader';
import { Illuminsight } from 'types';
import localForage from 'localforage';
import * as React from 'react';
import Fuse from 'fuse.js';
import {
  downloadRecipe,
  defaultRecipe,
  getRecipeName,
  getRecipes,
} from 'lib/reader/recipes';
import {
  InputAdornment,
  createStyles,
  ListItemText,
  makeStyles,
  TextField,
  ListItem,
  List,
  ListItemIcon,
} from '@material-ui/core';
import {
  Remove as RemoveIcon,
  Search as SearchIcon,
  Add as AddIcon,
} from '@material-ui/icons';

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      height: '36em',
    },
  }),
);

function _RecipeManager({ match }: RouteComponentProps): JSX.Element {
  const [recipes, setRecipes] = React.useState<Illuminsight.RecipeIndex>([]);
  const { dispatch, recipe } = React.useContext(ReaderContext);
  const [active, setActive] = React.useState<Illuminsight.Recipe | null>(null);
  const [search, setSearch] = React.useState('');
  const { pubId } = match.params as { pubId: number };
  const classes = useStyles();
  let matches: Illuminsight.RecipeIndex = recipes.slice();

  // Load data on mount
  React.useEffect(() => {
    // Set active recipe if it's not the default recipe
    if (defaultRecipe !== recipe) setActive(recipe);

    // Load recipes
    getRecipes()
      .then(setRecipes)
      .catch((e) => console.error(e));
  }, []);

  async function onRemove(): Promise<void> {
    // Replace with default recipe
    // Better than removing it because we know the user has _chosen_ the default
    await localForage.setItem(`pub-recipe-${pubId}`, defaultRecipe);

    // Update state
    setActive(null);
    dispatch({ recipe: defaultRecipe });
  }

  async function onSet(id: Illuminsight.Recipe['id']): Promise<void> {
    const _recipe = await downloadRecipe(id, pubId);
    setActive(_recipe);
    dispatch({ recipe: _recipe });
  }

  // Filter by search
  if (search) {
    const fuse = new Fuse(recipes, {
      shouldSort: true,
      threshold: 0.4,
      keys: ['id', 'books', 'series', 'authors'],
    });
    matches = fuse.search(search);
  }

  return (
    <div className={classes.root}>
      {/* Active recipe */}
      {active ? (
        <List dense>
          <ListItem button onClick={onRemove}>
            <ListItemIcon>
              <RemoveIcon />
            </ListItemIcon>
            <ListItemText primary={getRecipeName(active.id)} />
          </ListItem>
        </List>
      ) : null}

      {/* Search field */}
      <TextField
        id="search"
        label="Search"
        value={search}
        margin="normal"
        variant="outlined"
        onChange={(e): void => setSearch(e.target.value)}
        fullWidth
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
        placeholder="The Lord of the Rings"
      />

      {/* Recipe search matches */}
      <List dense>
        {matches.slice(0, 10).map((r) => (
          <ListItem button onClick={(): void => onSet(r.id)} key={r.id}>
            <ListItemIcon>
              <AddIcon />
            </ListItemIcon>
            <ListItemText primary={getRecipeName(r.id)} />
          </ListItem>
        ))}
      </List>
    </div>
  );
}

export const RecipeManager = withRouter(_RecipeManager);
