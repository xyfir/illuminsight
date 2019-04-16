export namespace Insightful {
  export namespace Env {
    export interface Common {
      /**
       * Node environment.
       */
      NODE_ENV: 'development' | 'production';
    }

    export interface Server extends Insightful.Env.Common {
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
