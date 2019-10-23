import { BrowserRouter, Redirect, Switch, Route } from 'react-router-dom';
import { createStyles, CssBaseline, makeStyles } from '@material-ui/core';
import { useSelector, Provider } from 'react-redux';
import { SnackbarProvider } from 'notistack';
import { ThemeProvider } from '@material-ui/styles';
import { createStore } from 'redux';
import { AppState } from 'store/types';
import { Library } from 'components/library/Library';
import { reducer } from 'store/reducers';
import { Reader } from 'components/reader/Reader';
import { Import } from 'components/Import';
import { themes } from 'lib/app/theme';
import * as React from 'react';
import { Edit } from 'components/Edit';

const store = createStore(reducer);

store.subscribe(() => (localStorage.theme = store.getState().theme));

const useStyles = makeStyles((theme) =>
  createStyles({
    toolbar: theme.mixins.toolbar,
    main: {
      flexDirection: 'column',
      overflow: 'auto',
      display: 'flex',
      height: '100vh',
    },
  }),
);

const WrappedApp = (): JSX.Element => {
  const classes = useStyles();
  const theme = useSelector((s: AppState) => s.theme);

  return (
    <ThemeProvider theme={themes[theme]}>
      <CssBaseline />
      <SnackbarProvider
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <BrowserRouter>
          <main className={classes.main}>
            <div className={classes.toolbar} />
            <Switch>
              <Route path="/import/:type" component={Import} />
              <Route path="/read/:pubId" component={Reader} />
              <Route path="/edit/:pubId" component={Edit} />
              <Route path="/library" component={Library} />
              <Redirect exact from="/" to="/library" />
            </Switch>
          </main>
        </BrowserRouter>
      </SnackbarProvider>
    </ThemeProvider>
  );
};

export const App = (): JSX.Element => (
  <Provider store={store}>
    <WrappedApp />
  </Provider>
);
