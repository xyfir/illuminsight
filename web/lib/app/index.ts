import * as localForage from 'localforage';
import { Insightful } from 'types/insightful';
import { render } from 'react-dom';
import * as React from 'react';
import { hot } from 'react-hot-loader/root';
import { App } from 'components/app/App';
import 'typeface-roboto';

declare global {
  interface Window {
    localForage: LocalForage;
  }
  namespace NodeJS {
    interface Process {
      enve: Insightful.Env.Web;
    }
  }
}

localForage.config({ driver: localForage.INDEXEDDB, name: 'insightful' });
window.localForage = localForage;

render(React.createElement(hot(App)), document.getElementById('content'));
