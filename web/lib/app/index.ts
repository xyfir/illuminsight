import * as localForage from 'localforage';
import { Insightful } from 'types/insightful';
import { render } from 'react-dom';
import * as React from 'react';
import * as wtf from 'wtf_wikipedia';
import { hot } from 'react-hot-loader/root';
import { App } from 'components/app/App';
import 'typeface-roboto';

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

localForage.config({ driver: localForage.INDEXEDDB, name: 'insightful' });

// Expose globals for debugging/testing purposes
window.localForage = localForage;
window.wtf = wtf;

render(React.createElement(hot(App)), document.getElementById('content'));
