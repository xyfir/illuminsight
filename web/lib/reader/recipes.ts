import { Illuminsight } from 'types/illuminsight';

export const defaultRecipe: Illuminsight.Recipe = {
  searches: [
    {
      name: 'Google',
      url: 'https://www.google.com/search?q='
    }
  ],
  wiki: {
    name: '(English) Wikipedia.org',
    api: 'https://en.wikipedia.org/w/api.php',
    url: 'https://en.wikipedia.org/wiki/'
  }
};
