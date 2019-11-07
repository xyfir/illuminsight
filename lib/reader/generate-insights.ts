import { getWikiArticle } from 'lib/reader/get-wiki-article';
import { getDefinitions } from 'lib/reader/get-definitions';
import { Illuminsight } from 'types';

/** Generate insights from provided data. */
export async function generateInsights({
  recipe,
  text,
}: {
  recipe: Illuminsight.Recipe;
  text: string;
}): Promise<Illuminsight.Insights> {
  const insights: Illuminsight.Insights = { searches: [], wikis: [], text };

  // Get wiki articles
  for (const wikiRecipe of recipe.wikis) {
    const doc = await getWikiArticle(insights.text, wikiRecipe);
    if (doc) {
      insights.wikis.push({ recipe: wikiRecipe, doc });
    }
  }

  // Get definitions from English Wiktionary
  insights.definitions = await getDefinitions(insights.text);

  // Build search insights
  for (const searchRecipe of recipe.searches) {
    // With context
    if (searchRecipe.context) {
      insights.searches.push({
        context: true,
        name: `${searchRecipe.name} + Context`,
        url:
          searchRecipe.url +
          encodeURIComponent(`${searchRecipe.context} ${insights.text}`),
      });
    }

    // Without context
    insights.searches.push({
      name: searchRecipe.name,
      url: searchRecipe.url + encodeURIComponent(insights.text),
    });
  }

  return insights;
}
