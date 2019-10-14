import { Illuminsight } from 'types';
import wtf from 'wtf_wikipedia';

export function getWikiArticle(
  title: string,
  recipe: Illuminsight.WikiRecipe,
): Promise<wtf.Document | null> {
  return wtf.fetch(title, undefined, {
    wikiUrl: recipe.proxy ? process.enve.PROXY_URL + recipe.api : recipe.api,
  });
}
