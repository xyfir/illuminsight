// @ts-ignore
import { Document } from 'wtf_wikipedia';

export namespace Illuminsight {
  export interface Tag {
    id: number;
    name: string;
  }

  export interface Marker {
    /**
     * Index of section.
     */
    section: number;
    /**
     * Index (`number`) or id (`string`) of element in section.
     * @example 4 | "some-id"
     */
    element: number | string;
  }

  /**
   * A publication of any type: book, news article, etc.
   */
  export interface Pub {
    id: number;
    name: string;
    tags: Tag['id'][];
    link?: string;
    /**
     * Path/name to the cover file relative to zip's root.
     */
    cover?: string;
    /**
     * How many words the pub contains.
     * @example "920" | "20k" | "1.25m"
     */
    words: string;
    toc: Array<Marker & { title: string }>;
    /**
     * Number of sections.
     */
    sections: number;
    /**
     * Schema version
     */
    version: number;
    starred: boolean;
    authors?: string;
    bookmark: Marker;
    /**
     * ISO 639-1 codes ranked from highest to lowest priority.
     * @example ["en", "de", "fr"]
     */
    languages: string[];
    published?: number;
    publisher?: string;
  }

  export type AST =
    | {
        /**
         * Node name
         * @example "div" | "span"
         */
        n: Node['nodeName'];
        /**
         * Child nodes
         */
        c?: AST[];
        /**
         * Attributes
         * @example { href: '/link' }
         */
        a?: { [attribute: string]: string };
      }
    | string;

  export interface DefinitionInsight {
    [language: string]: {
      language: string;
      definitions: {
        examples?: string[];
        definition: string;
        parsedExamples?: { example: string }[];
      }[];
      partOfSpeech:
        | 'Noun'
        | 'Verb'
        | 'Adjective'
        | 'Adverb'
        | 'Determiner'
        | 'Article'
        | 'Preposition'
        | 'Conjunction'
        | 'Proper noun'
        | 'Letter'
        | 'Character'
        | 'Phrase'
        | 'Proverb'
        | 'Idiom'
        | 'Symbol'
        | 'Syllable'
        | 'Numeral'
        | 'Initialism'
        | 'Interjection'
        | 'Definitions'
        | 'Pronoun'
        | 'Romanization';
    }[];
  }

  export interface WikiInsight {
    recipe: WikiRecipe;
    doc: Document;
  }

  export interface Insight {
    definitions?: DefinitionInsight;
    wikis: WikiInsight[];
    text: string;
  }

  export interface InsightsIndex {
    [element: number]: Insight[];
  }

  export type RecipeIndex = {
    id: Recipe['id'];
    books?: string;
    series?: string;
    authors?: string;
  }[];

  export type MinifiedRecipeIndex = {
    i: Recipe['id'];
    b?: RecipeIndex[0]['books'];
    s?: RecipeIndex[0]['series'];
    a?: RecipeIndex[0]['authors'];
  }[];

  export interface SearchRecipe {
    context?: string;
    name: string;
    url: string;
  }

  export interface WikiRecipe {
    name: string;
    url: string;
    api: string;
  }

  // Remember to update the cookbook
  export interface Recipe {
    searches: SearchRecipe[];
    wikis: WikiRecipe[];
    id: string;
  }

  export namespace Env {
    export interface Common {
      /**
       * Node environment.
       */
      NODE_ENV: 'development' | 'production';
      /**
       * Version of ASTPUB format this instance of Illuminsight supports.
       */
      ASTPUB_VERSION: 1;
      /**
       * Absolute path for illuminsight files.
       * @example "/path/to/illuminsight/files"
       */
      FILES_DIRECTORY: string;
    }

    export interface Server extends Illuminsight.Env.Common {
      /**
       * Path to directory which Illuminsight will use for file uploads,
       *  conversions, and downloads.
       */
      TEMP_DIR: string;
      /**
       * The port to host the API server on.
       * @example 2700
       */
      API_PORT: number;
      /**
       * The app's root web client URL.
       * @example "https://example.com"
       */
      WEB_URL: string;
      /**
       * Absolute path for illuminsight-web.
       * @example "/path/to/illuminsight/web"
       */
      WEB_DIRECTORY: string;
    }

    export interface Web extends Illuminsight.Env.Common {
      /**
       * The app's root API URL.
       * @example "https://example.com/api/0"
       */
      API_URL: string;
      /**
       * Port for the Webpack dev server. Only needed for developers.
       * @example 2701
       */
      DEV_SERVER_PORT: number;
    }
  }
}
