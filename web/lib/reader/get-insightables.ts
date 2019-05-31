const stopwords: { [language: string]: string } = require('stopword');

const regex = /(?:[^.\s!?])\s+((?:[A-Z][-A-Za-z']*(?: *[A-Z][-A-Za-z']*)*))|(?:[^.\s!?])\s+([A-Z][-A-Za-z']*)/gm;

export function getInsightables(content: string, language: string): string[] {
  return Array.from(
    // Removes duplicates
    new Set(
      // Grab anything that looks like a proper noun (English mainly)
      (content.match(regex) || [])
        .map(item => item.substr(2))
        // Remove any items that are contained in stopwords array
        .filter(item => !stopwords[language].includes(item.toLowerCase()))
        // Trim whitespace
        .map(item => item.trim())
    )
  );
}
