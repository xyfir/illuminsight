import { Insightful } from 'types/insightful';
import { stopwords } from 'lib/reader/stopwords';
// @ts-ignore
import * as wtf from 'wtf_wikipedia';

// @ts-ignore
window.wtf = wtf;

const regex = /(?:[^.\s!?])\s+((?:[A-Z][-A-Za-z']*(?: *[A-Z][-A-Za-z']*)*))|(?:[^.\s!?])\s+([A-Z][-A-Za-z']*)/gm;

/**
 * Generate insights from provided text content.
 */
export async function getInsights(text: string): Promise<Insightful.Insight[]> {
  const insights: Insightful.Insight[] = Array.from(
    // Removes duplicates
    new Set(
      // Grab anything that looks like a proper noun (English mainly)
      (text.match(regex) || [])
        .map(item => item.substr(2))
        // Remove any items that are contained in stopwords array
        .filter(item => !stopwords.includes(item.toLowerCase()))
        // Trim whitespace
        .map(item => item.trim())
    ),
    insight => ({ text: insight })
  );

  for (let insight of insights) {
    insight.wiki = await wtf.fetch(insight.text);
  }

  return insights;
}
