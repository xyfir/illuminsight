import { BrowserRouter, Redirect, Switch, Route } from 'react-router-dom';
import { createStyles, CssBaseline, makeStyles } from '@material-ui/core';
import { ThemeTypeContext, ThemeType, themes } from 'lib/app/theme';
import { SnackbarProvider } from 'notistack';
import { ThemeProvider } from '@material-ui/styles';
import { Library } from 'components/library/Library';
import { Import } from 'components/Import';
import { Reader } from 'components/reader/Reader';
import * as React from 'react';
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
  const [themeType, setThemeType] = React.useState<ThemeType>(
    localStorage.theme || 'light'
  );
  const classes = useStyles();

  function onSetThemeType(type: ThemeType) {
    localStorage.theme = type;
    setThemeType(type);
  }

  return (
    <ThemeTypeContext.Provider
      value={{ type: themeType, setType: onSetThemeType }}
    >
      <ThemeProvider theme={themes[themeType]}>
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
    </ThemeTypeContext.Provider>
  );
};
