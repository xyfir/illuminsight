declare module 'remotestoragejs' {
  export interface Access {
    /** Claim access on a given scope with given mode. */
    claim(
      /**
       * An access scope, such as "contacts" or "calendar" or "*".
       */
      scope: string,
      /**
       * Access mode. Either "r" for read-only or "rw" for read/write.
       */
      mode: 'r' | 'rw'
    ): void;
  }

  export interface BaseClient {
    /**
     * Get a list of child nodes below a given path
     * @returns A promise for an object representing child nodes
     */
    getListing(
      /** The path to query. It MUST end with a forward slash. */
      path: string,
      /** Either false or the maximum age of cached listing in milliseconds */
      maxAge?: false | number
    ): Promise<any>;

    /**
     * Get a JSON object from the given path.
     * @returns A promise, which resolves with the requested object (or null if non-existent)
     */
    getObject(
      /** Relative path from the module root (without leading slash). */
      path: string,
      /** Either false or the maximum age of cached object in milliseconds */
      maxAge?: false | number
    ): Promise<any | null>;

    /**
     * Store object at given path. Triggers synchronization.
     * @returns Resolves with revision on success
     * @throws `ValidationError`
     */
    storeObject(
      /** Unique type of this object within this module */
      type: string,
      /** Path relative to the module root */
      path: string,
      /** A JavaScript object to be stored at the given path. Must be serializable as JSON */
      object: any
    ): Promise<any>;

    /** Get all objects directly below a given path. */
    getAll(
      /** Path to the folder. Must end in a forward slash. */
      path: string,
      /** Either false or the maximum age of cached objects in milliseconds */
      maxAge?: false | number
    ): Promise<any>;

    /**
     * Get the file at the given path. A file is raw data, as opposed to a
     *  JSON object (use `getObject()` for that).
     *
     */
    getFile(
      /** Relative path from the module root (without leading slash). */
      path: string,
      /** Either false or the maximum age of the cached file in milliseconds. */
      maxAge?: false | number
    ): Promise<{
      /** String representing the MIME Type of the document. */
      mimeType: string;
      /** Raw data of the document (either a string or an ArrayBuffer) */
      data: string | ArrayBuffer;
    }>;

    /**
     * Store raw data at a given path.
     * @returns A promise for the created/updated revision (ETag)
     */
    storeFile(
      /** MIME media type of the data being stored */
      mimeType: string,
      /** Path relative to the module root */
      path: string,
      /** Raw data to store */
      body: string | ArrayBuffer | ArrayBufferView
    ): Promise<any>;

    /** Remove node at given path from storage. Triggers synchronization. */
    remove(
      /** Path relative to the module root */
      path: string
    ): Promise<void>;

    /**
     * Using this event, you can stay informed about data changes, both remote
     *  (from other devices or browsers), as well as locally (e.g. other
     *  browser tabs).
     */
    on(
      eventName: 'change',
      handler: (evt: {
        /** Absolute path of the changed node, from the storage root */
        path: string;
        /** Path of the changed node, relative to this baseclient's scope root */
        relativePath: string;
        /**
         * - Events with origin `"local"` are fired conveniently during the page load, so that you can fill your views when the page loads.
         * - Events with origin `"remote"` are fired when remote changes are discovered during sync.
         * - Events with origin `"window"` are fired whenever you change a value by calling a method on the `BaseClient`; these are disabled by default.
         * - Events with origin `"conflict"` are fired when a conflict occurs while pushing out your local changes to the remote store. Adds `lastCommonValue` and `lastCommonContentType` properties.
         */
        origin: 'window' | 'local' | 'remote' | 'conflict';
        /** Old body of the changed node (local version in conflicts; undefined if creation) */
        oldValue?: any;
        /** New body of the changed node (remote version in conflicts; undefined if deletion) */
        newValue?: any;
        /** Old contentType of the changed node (local version for conflicts; undefined if creation) */
        oldContentType?: any;
        /** New contentType of the changed node (remote version for conflicts; undefined if deletion) */
        newContentType?: any;
        /** Most recent known common ancestor body of local and remote */
        lastCommonValue?: any;
        /** Most recent known common ancestor contentType of local and remote */
        lastCommonContentType?: string;
      }) => void
    ): void;

    /**
     * Declare a remoteStorage object type using a JSON schema.
     */
    declareType(
      /** A type alias/shortname */
      alias: string,
      /** JSON-LD URI of the schema */
      uri: string,
      /** A JSON Schema object describing the object type */
      schema: any
    ): void;

    /** Validate an object against the associated schema. */
    validate(
      /**
       * JS object to validate. Must have a `@context` property.
       */
      object: any
    ): any;

    /** Set caching strategy for a given path and its children. */
    cache(path: string, strategy: CachingStrategy): BaseClient;

    flush(path: string): void;

    /**
     * Retrieve full URL of a document. Useful for example for sharing the
     *  public URL of an item in the `/public` folder.
     * @returns The full URL of the item, including the storage origin
     */
    getItemURL(
      /** Path relative to the module root */
      path: string
    ): string;

    /**
     * Instantiate a new client, scoped to a subpath of the current client’s
     *  path.
     * @returns A new client operating on a subpath of the current base path.
     */
    scope(
      /** The path to scope the new client to. */
      path: string
    ): BaseClient;
  }

  export type CachingStrategy = 'ALL' | 'SEEN' | 'FLUSH';

  export interface Caching {
    /**
     * Shortcut for `set(path, 'ALL')`.
     */
    enable(/** Path to enable caching for */ path: string): void;

    /**
     * Shortcut for `set(path, 'FLUSH')`.
     */
    disable(/** Path to disable caching for */ path: string): void;

    /**
     * Configure caching for a given path.
     *  - `'ALL'` means that once all outgoing changes have been pushed, sync will start retrieving nodes to cache pro-actively. If a local copy exists of everything, it will check on each sync whether the ETag of the root folder changed, and retrieve remote changes if they exist.
     *  - `'SEEN'` does this only for documents and folders that have been either read from or written to at least once since connecting to the current remote backend, plus their parent/ancestor folders up to the root (to make tree-based sync possible).
     *  - `'FLUSH'` will only cache outgoing changes, and forget them as soon as they have been saved to remote successfully.
     */
    set(
      /** Path to cache */
      path: string,
      /** Caching strategy */
      strategy: CachingStrategy
    ): void;

    /**
     * Retrieve caching strategy for path or its nearest parent with one set.
     */
    checkPath(
      /** Path to retrieve setting for */ path: string
    ): Promise<CachingStrategy>;

    /**
     * Reset the state of caching by deleting all caching information.
     */
    reset(): void;
  }

  export class RemoteStorage {
    constructor(opt: {
      cordovaRedirectUri?: string;
      changeEvents?: {
        conflict: boolean;
        window: boolean;
        remote: boolean;
        local: boolean;
      };
      logging: boolean;
      modules: [];
      cache: boolean;
    });

    /** For requesting and managing access to modules/folders. */
    access: Access;

    /** For configuring caching for folders. */
    caching: Caching;

    /** Emitted when all features are loaded and the RS instance is ready */
    on(eventName: 'ready', handler: () => void): void;

    /** Emitted when ready, but no storage connected ("anonymous mode") */
    on(eventName: 'not-connected', handler: () => void): void;

    /** Emitted when a remote storage has been connected */
    on(eventName: 'connected', handler: () => void): void;

    /** Emitted after disconnect */
    on(eventName: 'disconnected', handler: () => void): void;

    /** Emitted when an error occurs; receives an error object as argument */
    on(eventName: 'error', handler: (err: Error) => void): void;

    /** Emitted when all features are loaded */
    on(eventName: 'features-loaded', handler: () => void): void;

    /** Emitted before webfinger lookup */
    on(eventName: 'connecting', handler: () => void): void;

    /** Emitted before redirecting to the authing server */
    on(eventName: 'authing', handler: () => void): void;

    /** Emitted when a network request starts */
    on(eventName: 'wire-busy', handler: () => void): void;

    /** Emitted when a network request completes */
    on(eventName: 'wire-done', handler: () => void): void;

    /** Emitted when a single sync request has finished */
    on(eventName: 'sync-req-done', handler: () => void): void;

    /** Emitted when all tasks of a sync have been completed and a new sync is scheduled */
    on(eventName: 'sync-done', handler: () => void): void;

    /**
     * Emitted once when a wire request fails for the first time, and
     *  `remote.online` is set to false
     */
    on(eventName: 'network-offline', handler: () => void): void;

    /**
     * Emitted once when a wire request succeeds for the first time after a
     *  failed one, and `remote.online` is set back to true
     */
    on(eventName: 'network-online', handler: () => void): void;

    /** Emitted when the sync interval changes */
    on(eventName: 'sync-interval-change', handler: () => void): void;

    /**
     * Initiate the OAuth authorization flow. This function is called by custom
     *  storage backend implementations (e.g. Dropbox or Google Drive).
     */
    authorize(options: {
      /** Client identifier (defaults to the origin of the redirectUri) */
      clientId: string;
      /** URL of the authorization endpoint */
      authURL: string;
      /** Access scope */
      scope: string;
    }): void;

    /**
     * Connect to a remoteStorage server.
     *
     * Discovers the WebFinger profile of the given user address and initiates
     *  the OAuth dance.
     *
     * This method must be called after all required access has been claimed.
     *  When using the connect widget, it will call this method itself.
     *
     * Special cases:
     * 1. If a bearer token is supplied as second argument, the OAuth dance will be skipped and the supplied token be used instead. This is useful outside of browser environments, where the token has been acquired in a different way.
     * 2. If the Webfinger profile for the given user address doesn’t contain an auth URL, the library will assume that client and server have established authorization among themselves, which will omit bearer tokens in all requests later on. This is useful for example when using Kerberos and similar protocols.
     */
    connect(
      /** The user address (user@host) to connect to. */
      userAddress: string,
      /** A bearer token acquired beforehand */
      token?: string
    ): void;

    /**
     * "Disconnect" from remote server to terminate current session.
     *
     * This method clears all stored settings and deletes the entire local cache.
     */
    disconnect(): void;

    /** Enable remoteStorage logging. */
    enableLog(): void;

    /** Disable remoteStorage logging. */
    disableLog(): void;

    /**
     * Get the value of the sync interval when application is in the foreground
     * @returns A number of milliseconds
     */
    getSyncInterval(): number;

    /**
     * Set the value of the sync interval when application is in the foreground
     */
    setSyncInterval(
      /** Sync interval in milliseconds (between 1000 and 3600000) */
      interval: number
    ): void;

    /**
     * Get the value of the sync interval when application is in the background
     * @returns A number of milliseconds
     */
    getBackgroundSyncInterval(): number;

    /**
     * Set the value of the sync interval when application is in the background
     */
    setBackgroundSyncInterval(
      /** Sync interval in milliseconds (between 1000 and 3600000) */
      interval: number
    ): void;

    /**
     * Get the value of the current sync interval. Can be background or
     *  foreground, custom or default.
     * @returns A number of milliseconds
     */
    getCurrentSyncInterval(): number;

    /**
     * Get the value of the current network request timeout
     * @returns A number of milliseconds
     */
    getRequestTimeout(): number;

    /**
     * Set the timeout for network requests.
     */
    setRequestTimeout(
      /** Timeout in milliseconds */
      timeout: number
    ): void;

    /**
     * This method enables you to quickly instantiate a BaseClient, which you
     *  can use to directly read and manipulate data in the connected storage
     *  account.
     *
     * Please use this method only for debugging and development, and choose or
     *  create a data module for your app to use.
     * @returns A client with the specified scope (category/base directory)
     */
    scope(
      /**
       * The base directory of the BaseClient that will be returned (with a
       *  leading and a trailing slash)
       */
      path: string
    ): BaseClient;

    /**
     * Set redirect URI to be used for the OAuth redirect within the
     *  in-app-browser window in Cordova apps.
     */
    setCordovaRedirectUri(
      /** A valid HTTP(S) URI */
      uri: string
    ): void;

    /**
     * Start synchronization with remote storage, downloading and uploading any
     *  changes within the cached paths.
     *
     * Please consider: local changes will attempt sync immediately, and remote
     *  changes should also be synced timely when using library defaults. So
     *  this is mostly useful for letting users sync manually, when pressing a
     *  sync button for example. This might feel safer to them sometimes, esp.
     *  when shifting between offline and online a lot.
     * @returns A Promise which resolves when the sync has finished
     */
    startSync(): Promise<void>;

    /** Stop the periodic synchronization. */
    stopSync(): void;

    /**
     * Add a "change" event handler to the given path. Whenever a "change"
     *  happens (as determined by the backend, such as e.g.
     *  <RemoteStorage.IndexedDB>) and the affected path is equal to or below
     *  the given ‘path’, the given handler is called.
     *
     * You should usually not use this method directly, but instead use the
     *  "change" events provided by BaseClient
     */
    onChange(
      /** Absolute path to attach handler to */
      path: string,
      /** Handler function */
      handler: () => void
    ): void;
  }

  export default RemoteStorage;
}
