import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import { MuiThemeProvider, CssBaseline } from '@material-ui/core';
import * as React from 'react';
import { theme } from 'constants/theme';

export class App extends React.Component {
  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <Switch>
            <Route path="/info" render={() => <div />} />
            <Redirect exact from="/" to="/info" />
          </Switch>
        </BrowserRouter>
      </MuiThemeProvider>
    );
  }
}
