import { Illuminsight } from 'types';
import localForage from 'localforage';
import axios from 'axios';

export const defaultRecipe: Illuminsight.Recipe = {
  searches: [
    {
      name: 'Google',
      url: 'https://www.google.com/search?q=',
    },
  ],
  wikis: [
    {
      name: 'Wikipedia',
      api: 'https://en.wikipedia.org/w/api.php',
      url: 'https://en.wikipedia.org/wiki/',
    },
  ],
  id: 'illuminsight-default',
};

export async function downloadRecipe(
  recipeId: Illuminsight.Recipe['id'],
  pubId: Illuminsight.Pub['id'],
): Promise<Illuminsight.Recipe> {
  // Download recipe
  const res = await axios.get(
    `https://raw.githubusercontent.com/xyfir/illuminsight-cookbook/master/dist/recipes/${recipeId}.min.json`,
  );
  const recipe: Illuminsight.Recipe = res.data;

  // Save to storage
  await localForage.setItem(`pub-recipe-${pubId}`, recipe);

  return recipe;
}

export async function getRecipes(): Promise<Illuminsight.RecipeIndex> {
  const res = await axios.get(
    'https://raw.githubusercontent.com/xyfir/illuminsight-cookbook/master/dist/recipes/.index.min.json',
  );

  // Expand minified recipes
  const minified: Illuminsight.MinifiedRecipeIndex = res.data;
  return minified.map((m) => ({
    id: m.i,
    books: m.b,
    series: m.s,
    authors: m.a,
  }));
}

/** Convert recipe id to text to display to user */
export function getRecipeName(id: Illuminsight.Recipe['id']): string {
  return id.replace(/-/g, ' ');
}
