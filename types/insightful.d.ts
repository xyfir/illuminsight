export namespace Insightful {
  export interface Tag {
    id: number;
    name: string;
  }

  export interface Entity {
    id: number;
    name: string;
    tags: Tag['id'][];
    link?: string;
    /**
     * Name of the cover file within the zip's `resources` directory.
     */
    cover?: string;
    /**
     * How many words the entity contains.
     * @example "920" | "20k" | "1.25m"
     */
    words: string;
    spine: string[];
    /**
     * Schema version
     */
    version: number;
    starred: boolean;
    authors?: string;
    bookmark: {
      /**
       * Index of section.
       */
      section: number;
      /**
       * Index of element in section. Used as fallback for `line`.
       */
      element: number;
      /**
       * Screen width at last bookmark update.
       */
      width: number;
      /**
       * Index of line in section. Discarded if `width` has changed.
       */
      line: number;
    };
    published: number | undefined;
    publisher: string | undefined;
  }

  export interface AST {
    /**
     * Node name
     * @example "div" | "span"
     */
    n: Node['nodeName'];
    /**
     * Children
     */
    c: Array<AST | string>;
    /**
     * Attributes
     * @example { href: '/link' }
     */
    a?: { [attribute: string]: string };
  }

  export namespace Env {
    export interface Common {
      /**
       * Node environment.
       */
      NODE_ENV: 'development' | 'production';
    }

    export interface Server extends Insightful.Env.Common {
      /**
       * Path to directory which Insightful will use for file uploads,
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
       * Absolute path for insightful-web.
       * @example "/path/to/insightful/web"
       */
      WEB_DIRECTORY: string;
    }

    export interface Web extends Insightful.Env.Common {
      /**
       * Port for the Webpack dev server. Only needed for developers.
       * @example 2701
       */
      DEV_SERVER_PORT: number;
    }
  }
}
