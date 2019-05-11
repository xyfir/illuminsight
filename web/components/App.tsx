import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';
import { Navigation } from 'components/Navigation';
import { Library } from 'components/Library';
import { Import } from 'components/Import';
import { Reader } from 'components/Reader';
import * as React from 'react';
import { theme } from 'lib/theme';
import {
  MuiThemeProvider,
  createStyles,
  CssBaseline,
  WithStyles,
  withStyles,
  Button,
  Theme
} from '@material-ui/core';

const styles = (theme: Theme) =>
  createStyles({
    toolbar: theme.mixins.toolbar,
    main: {
      flexDirection: 'column',
      overflow: 'auto',
      display: 'flex',
      height: '100vh'
    }
  });

const _App = ({ classes }: WithStyles<typeof styles>) => (
  <MuiThemeProvider theme={theme}>
    <CssBaseline />
    <SnackbarProvider
      action={[
        <Button color="primary" size="small">
          Dismiss
        </Button>
      ]}
      maxSnack={2}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <BrowserRouter>
        <div>
          <Navigation />
          <main className={classes.main}>
            <div className={classes.toolbar} />
            <Switch>
              <Route path="/read/:entityId" component={Reader} />
              <Route path="/library" component={Library} />
              <Route path="/import" component={Import} />
            </Switch>
          </main>
        </div>
      </BrowserRouter>
    </SnackbarProvider>
  </MuiThemeProvider>
);

export const App = withStyles(styles)(_App);
