import { getDefinitions } from 'lib/reader/get-definitions';
import { Illuminsight } from 'types/illuminsight';
import { stopwords } from 'lib/reader/stopwords';
import wtf from 'wtf_wikipedia';

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
  const insights: Illuminsight.Insight[] = highlight
    ? [{ wikis: [], text }]
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
        insight => ({ wikis: [], text: insight })
      );

  for (let insight of insights) {
    // Get definitions from English Wiktionary
    try {
      insight.definitions = await getDefinitions(insight.text);
    } catch (err) {}

    // Get wiki articles
    for (let wikiRecipe of recipe.wikis) {
      const doc = await wtf.fetch(insight.text, undefined, {
        wikiUrl: wikiRecipe.api
      });
      if (doc) insight.wikis.push({ recipe: wikiRecipe, doc });
    }
  }

  return insights;
}
