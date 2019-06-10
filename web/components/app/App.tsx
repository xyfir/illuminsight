import { BrowserRouter, Redirect, Switch, Route } from 'react-router-dom';
import { createStyles, CssBaseline, makeStyles } from '@material-ui/core';
import { SnackbarProvider } from 'notistack';
import { ThemeProvider } from '@material-ui/styles';
import { Library } from 'components/library/Library';
import { Import } from 'components/Import';
import { Reader } from 'components/reader/Reader';
import * as React from 'react';
import { theme } from 'lib/app/theme';
import { Edit } from 'components/Edit';

const useStyles = makeStyles(theme =>
  createStyles({
    toolbar: theme.mixins.toolbar,
    main: {
      flexDirection: 'column',
      overflow: 'auto',
      display: 'flex',
      height: '100vh'
    }
  })
);

export const App = () => {
  const classes = useStyles();
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SnackbarProvider
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <BrowserRouter>
          <main className={classes.main}>
            <div className={classes.toolbar} />
            <Switch>
              <Route path="/read/:pubId" component={Reader} />
              <Route path="/edit/:pubId" component={Edit} />
              <Route path="/library" component={Library} />
              <Route path="/import" component={Import} />
              <Redirect exact from="/" to="/library" />
            </Switch>
          </main>
        </BrowserRouter>
      </SnackbarProvider>
    </ThemeProvider>
  );
};
