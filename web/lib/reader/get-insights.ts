import { Insightful } from 'types/insightful';
import { stopwords } from 'lib/reader/stopwords';

const regex = /(?:[^.\s!?])\s+((?:[A-Z][-A-Za-z']*(?: *[A-Z][-A-Za-z']*)*))|(?:[^.\s!?])\s+([A-Z][-A-Za-z']*)/gm;

/**
 * Generate insights from provided text content.
 */
export function getInsights(text: string): Insightful.Insight[] {
  return Array.from(
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
}
