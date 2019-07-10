import { Illuminsight } from 'types/illuminsight';
import wtf from 'wtf_wikipedia';

export function getWikiArticle(
  title: string,
  recipe: Illuminsight.WikiRecipe
): ReturnType<typeof wtf.fetch> {
  return wtf.fetch(title, undefined, {
    wikiUrl: recipe.proxy
      ? `${process.enve.PROXY_URL}/${recipe.api}`
      : recipe.api
  });
}
