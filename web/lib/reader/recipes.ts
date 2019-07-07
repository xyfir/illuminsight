import { Illuminsight } from 'types/illuminsight';

export const defaultRecipe: Illuminsight.Recipe = {
  searches: [
    {
      name: 'Google',
      url: 'https://www.google.com/search?q='
    }
  ],
  wikis: [
    {
      name: 'Wikipedia',
      api: 'https://en.wikipedia.org/w/api.php',
      url: 'https://en.wikipedia.org/wiki/'
    }
  ],
  id: 'illuminsight-default'
};
