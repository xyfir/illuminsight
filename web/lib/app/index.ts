import * as localForage from 'localforage';
import { Insightful } from 'types/insightful';
import { setConfig } from 'react-hot-loader';
import { render } from 'react-dom';
import * as React from 'react';
import * as wtf from 'wtf_wikipedia';
import { hot } from 'react-hot-loader/root';
import { App } from 'components/app/App';
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
      enve: Insightful.Env.Web;
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

localForage.config({ driver: localForage.INDEXEDDB, name: 'insightful' });

render(React.createElement(hot(App)), document.getElementById('content'));
