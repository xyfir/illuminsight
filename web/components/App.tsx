import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';
import { Navigation } from 'components/Navigation';
import { Library } from 'components/Library';
import { Import } from 'components/Import';
import * as React from 'react';
import { theme } from 'constants/theme';
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
    root: {
      display: 'flex'
    },
    toolbar: theme.mixins.toolbar,
    content: {
      flexGrow: 1,
      padding: theme.spacing.unit * 3
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
        <Switch>
          <div className={classes.root}>
            <Navigation />
            <main className={classes.content}>
              <div className={classes.toolbar} />
              <Route path="/library" render={() => <Library />} />
              <Route path="/import" render={() => <Import />} />
            </main>
          </div>
        </Switch>
      </BrowserRouter>
    </SnackbarProvider>
  </MuiThemeProvider>
);

export const App = withStyles(styles)(_App);
