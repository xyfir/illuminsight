import { getWikiArticle } from 'lib/reader/get-wiki-article';
import { getDefinitions } from 'lib/reader/get-definitions';
import { Illuminsight } from 'types/illuminsight';
import { stopwords } from 'lib/reader/stopwords';

const REGEX = /(?:[^.\s!?])\s+((?:[A-Z][-A-Za-z']*(?: *[A-Z][-A-Za-z']*)*))|(?:[^.\s!?])\s+([A-Z][-A-Za-z']*)/gm;

/**
 * Generate insights from provided text content.
 */
export async function generateInsights(
  text: string,
  recipe: Illuminsight.Recipe,
  /**
   * Was `text` sourced from a user highlight?
   */
  highlight: boolean = false
): Promise<Illuminsight.Insight[]> {
  const insightGenerator = (text: string): Illuminsight.Insight => ({
    searches: [],
    wikis: [],
    text
  });
  const insights: Illuminsight.Insight[] = highlight
    ? [insightGenerator(text)]
    : Array.from(
        // Removes duplicates
        new Set(
          // Grab anything that looks like a proper noun (English mainly)
          (text.match(REGEX) || [])
            .map(item => item.substr(2))
            // Remove any items that are contained in stopwords array
            .filter(item => !stopwords.includes(item.toLowerCase()))
            // Trim whitespace
            .map(item => item.trim())
        ),
        insight => insightGenerator(insight)
      );

  for (let insight of insights) {
    // Get definitions from English Wiktionary
    try {
      insight.definitions = await getDefinitions(insight.text);
    } catch {}

    // Build search insights
    for (let searchRecipe of recipe.searches) {
      // With context
      if (searchRecipe.context) {
        insight.searches.push({
          context: true,
          name: `${searchRecipe.name} + Context`,
          url:
            searchRecipe.url +
            encodeURIComponent(`${searchRecipe.context} ${insight.text}`)
        });
      }

      // Without context
      insight.searches.push({
        name: searchRecipe.name,
        url: searchRecipe.url + encodeURIComponent(insight.text)
      });
    }

    // Get wiki articles
    for (let wikiRecipe of recipe.wikis) {
      const doc = await getWikiArticle(insight.text, wikiRecipe);
      if (doc) insight.wikis.push({ recipe: wikiRecipe, doc });
    }
  }

  return insights;
}
