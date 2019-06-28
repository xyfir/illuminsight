import { Illuminsight } from 'types/illuminsight';
import { setConfig } from 'react-hot-loader';
import localForage from 'localforage';
import { render } from 'react-dom';
import * as React from 'react';
import { hot } from 'react-hot-loader/root';
import { App } from 'components/app/App';
import wtf from 'wtf_wikipedia';
import 'typeface-roboto';

// Expose globals for debugging/testing purposes
window.localForage = localForage;
window.wtf = wtf;

declare global {
  interface Window {
    localForage: LocalForage;
    wtf: typeof wtf;
  }
  namespace NodeJS {
    interface Process {
      enve: Illuminsight.Env.Web;
    }
  }
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () =>
    navigator.serviceWorker
      .register('/sw.js')
      .then(r => console.log('SW', r))
      .catch(e => console.error('SW', e))
  );
}

/** @todo remove -- https://github.com/gaearon/react-hot-loader/issues/1262 */
setConfig({ reloadHooks: false });

localForage.config({ driver: localForage.INDEXEDDB, name: 'illuminsight' });

render(React.createElement(hot(App)), document.getElementById('content'));
