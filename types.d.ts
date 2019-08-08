import wtf from 'wtf_wikipedia';

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
    toc: Array<Marker & { title: string }>;
    name: string;
    tags: Tag['id'][];
    link?: string;
    /**
     * How many words the pub contains.
     * @example "920" | "20k" | "1.25m"
     */
    words: string;
    /** Path/name to the cover file relative to zip's root. */
    cover?: string;
    series?: string;
    /** Number of sections. */
    sections: number;
    /** Schema version */
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
      partOfSpeech: string;
    }[];
  }

  export interface SearchInsight {
    context?: boolean;
    name: string;
    url: string;
  }

  export interface WikiInsight {
    recipe: WikiRecipe;
    doc: wtf.Document;
  }

  export interface Insight {
    definitions?: DefinitionInsight;
    searches: SearchInsight[];
    wikis: WikiInsight[];
    text: string;
    /** Does insight contain all possible insights? */
    all?: boolean;
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
    proxy?: boolean;
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

  export interface Env {
    /**
     * Node environment.
     */
    NODE_ENV: 'development' | 'production';
    /**
     * The port to host the server on.
     * @example 2700
     */
    SERVER_PORT: number;
    /**
     * Version of ASTPUB format this instance of Illuminsight supports.
     */
    ASTPUB_VERSION: 4;
    /**
     * Absolute path for illuminsight files.
     * @example "/path/to/illuminsight/files"
     */
    FILES_DIRECTORY: string;
    /**
     * The app's root web client URL.
     * @example "https://example.com"
     */
    WEB_URL: string;
    /**
     * The port to host the proxy server on.
     * @example 2702
     */
    PROXY_PORT: number;
    /**
     * The app's root proxy URL.
     * @example "https://example.com/proxy"
     */
    PROXY_URL: string;
    /**
     * Port for the Webpack dev server. Only needed for developers.
     * @example 2701
     */
    DEV_SERVER_PORT: number;
  }
}
