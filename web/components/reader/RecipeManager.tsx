import { RouteComponentProps, withRouter } from 'react-router';
import { ReaderContext } from 'components/reader/Reader';
import { defaultRecipe } from 'lib/reader/recipes';
import { Illuminsight } from 'types/illuminsight';
import localForage from 'localforage';
import * as React from 'react';
import axios from 'axios';
import Fuse from 'fuse.js';
import {
  InputAdornment,
  createStyles,
  ListItemText,
  makeStyles,
  TextField,
  ListItem,
  List,
  ListItemIcon
} from '@material-ui/core';
import {
  Remove as RemoveIcon,
  Search as SearchIcon,
  Add as AddIcon
} from '@material-ui/icons';

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      height: '36em'
    }
  })
);

function _RecipeManager({ match }: RouteComponentProps) {
  const [recipes, setRecipes] = React.useState<Illuminsight.RecipeIndex>([]);
  const [active, setActive] = React.useState<Illuminsight.Recipe | null>(null);
  const [search, setSearch] = React.useState('');
  const { dispatch } = React.useContext(ReaderContext);
  const { pubId } = match.params as { pubId: number };
  const classes = useStyles();
  let matches: Illuminsight.RecipeIndex = recipes.slice();

  // Load data on mount
  React.useEffect(() => {
    // Load recipes
    axios
      .get(
        'https://raw.githubusercontent.com/xyfir/illuminsight-cookbook/master/recipes.min.json'
      )
      .then(res => {
        // Expand minified recipes
        const minified: Illuminsight.MinifiedRecipeIndex = res.data;
        setRecipes(
          minified.map(m => ({
            id: m.i,
            books: m.b,
            series: m.s,
            authors: m.a
          }))
        );

        // Get active recipe for pub
        return localForage.getItem(`pub-recipe-${pubId}`);
      })
      .then(recipe => recipe && setActive(recipe as Illuminsight.Recipe))
      .catch(err => undefined);
  }, []);

  /** Remove active recipe */
  async function onRemove() {
    // Delete from storage
    await localForage.removeItem(`pub-recipe-${pubId}`);

    // Update state
    setActive(null);
    dispatch({ recipe: defaultRecipe });
  }

  /** Download and set recipe */
  async function onSet(id: Illuminsight.RecipeIndex[0]['id']) {
    // Download recipe
    const res = await axios.get(
      `https://raw.githubusercontent.com/xyfir/illuminsight-cookbook/master/recipes/${id}.json`
    );
    const _recipe: Illuminsight.Recipe = res.data;
    _recipe.id = id;

    // Save to storage
    await localForage.setItem(`pub-recipe-${pubId}`, _recipe);

    // Update state
    setActive(_recipe);
    dispatch({ recipe: _recipe });
  }

  /** Convert recipe id to text to display to user */
  function displayId(id: Illuminsight.RecipeIndex[0]['id']) {
    return id.replace(/-/g, ' ');
  }

  // Filter by search
  if (search) {
    const fuse = new Fuse(recipes, {
      shouldSort: true,
      threshold: 0.4,
      keys: ['id', 'books', 'series', 'authors']
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
            <ListItemText primary={displayId(active.id!)} />
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
        onChange={e => setSearch(e.target.value)}
        fullWidth
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          )
        }}
        placeholder="The Lord of the Rings"
      />

      {/* Recipe search matches */}
      <List dense>
        {matches.slice(0, 10).map(r => (
          <ListItem button onClick={() => onSet(r.id)} key={r.id}>
            <ListItemIcon>
              <AddIcon />
            </ListItemIcon>
            <ListItemText primary={displayId(r.id)} />
          </ListItem>
        ))}
      </List>
    </div>
  );
}

export const RecipeManager = withRouter(_RecipeManager);
