import { BrowserRouter, Redirect, Switch, Route } from 'react-router-dom';
import { createStyles, CssBaseline, makeStyles } from '@material-ui/core';
import { ToggleThemeContext, ThemeType, themes } from 'lib/app/theme';
import { SnackbarProvider } from 'notistack';
import { ThemeProvider } from '@material-ui/styles';
import { Library } from 'components/library/Library';
import { Import } from 'components/Import';
import { Reader } from 'components/reader/Reader';
import * as React from 'react';
import { Edit } from 'components/Edit';

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

export const App = (): JSX.Element => {
  const [themeType, setThemeType] = React.useState<ThemeType>(
    localStorage.theme || 'light',
  );
  const classes = useStyles();

  function toggleTheme(): void {
    const type = themeType == 'dark' ? 'light' : 'dark';
    localStorage.theme = type;
    setThemeType(type);
  }

  return (
    <ToggleThemeContext.Provider value={toggleTheme}>
      <ThemeProvider theme={themes[themeType]}>
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
    </ToggleThemeContext.Provider>
  );
};
