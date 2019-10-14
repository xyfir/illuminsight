import { getWikiArticle } from 'lib/reader/get-wiki-article';
import { getDefinitions } from 'lib/reader/get-definitions';
import { Illuminsight } from 'types';
import { stopwords } from 'lib/reader/stopwords';

const REGEX = /(?:[^.\s!?])\s+((?:[A-Z][-A-Za-z']*(?: *[A-Z][-A-Za-z']*)*))|(?:[^.\s!?])\s+([A-Z][-A-Za-z']*)/gm;

const textToInsight = (text: string): Illuminsight.Insight => ({
  searches: [],
  wikis: [],
  text,
});

/** Generate insights from provided data. */
export async function generateInsights({
  highlight,
  insights,
  recipe,
  text,
  all,
}: {
  /**
   * Was `text` sourced from a user highlight?
   */
  highlight?: boolean;
  /** Partial insights to fill */
  insights?: Illuminsight.Insight[];
  recipe: Illuminsight.Recipe;
  /** Text to generate insights from */
  text?: string;
  /** Should all insights be generated or just the suggested? */
  all?: boolean;
}): Promise<Illuminsight.Insight[]> {
  // Convert text to insights array
  if (text) {
    insights = highlight
      ? [textToInsight(text)]
      : Array.from(
          // Removes duplicates
          new Set(
            // Grab anything that looks like a proper noun (English mainly)
            (text.match(REGEX) || [])
              .map((item) => item.substr(2))
              // Remove any items that are contained in stopwords array
              .filter((item) => !stopwords.includes(item.toLowerCase()))
              // Trim whitespace
              .map((item) => item.trim()),
          ),
          (insight) => textToInsight(insight),
        );
  }
  // Clean the insights array
  else if (insights) {
    insights = insights.map((i) => ({
      definitions: undefined,
      searches: [],
      wikis: [],
      text: i.text,
    }));
  }

  if (!insights) return [];
  insightloop: for (let insight of insights) {
    // Set all
    insight.all = all;

    // Get wiki articles
    for (let wikiRecipe of recipe.wikis) {
      const doc = await getWikiArticle(insight.text, wikiRecipe);
      if (doc) {
        insight.wikis.push({ recipe: wikiRecipe, doc });
        if (!all) continue insightloop;
      }
    }

    // Get definitions from English Wiktionary
    insight.definitions = await getDefinitions(insight.text);
    if (insight.definitions && !all) continue;

    // Build search insights
    for (let searchRecipe of recipe.searches) {
      // With context
      if (searchRecipe.context) {
        insight.searches.push({
          context: true,
          name: `${searchRecipe.name} + Context`,
          url:
            searchRecipe.url +
            encodeURIComponent(`${searchRecipe.context} ${insight.text}`),
        });
      }

      // Without context
      insight.searches.push({
        name: searchRecipe.name,
        url: searchRecipe.url + encodeURIComponent(insight.text),
      });
    }
  }

  return insights;
}
