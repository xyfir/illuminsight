import { Route, Link } from 'react-router-dom';
import * as React from 'react';
import {
  createStyles,
  WithStyles,
  withStyles,
  IconButton,
  Typography,
  Tooltip,
  Toolbar,
  AppBar
} from '@material-ui/core';
import {
  LibraryBooks as LibraryIcon,
  LibraryAdd as ImportIcon,
  Brightness2 as MoonIcon,
  WbSunny as SunIcon,
  Edit as EditIcon
} from '@material-ui/icons';

const styles = createStyles({ title: { flexGrow: 1 } });

class _Navigation extends React.Component<WithStyles<typeof styles>> {
  onTheme(dark: boolean) {
    localStorage.theme = dark ? 'dark' : 'light';
    location.reload();
  }

  render() {
    const { classes } = this.props;
    return (
      <AppBar position="fixed" color="default">
        <Toolbar>
          <Typography
            className={classes.title}
            variant="h6"
            noWrap
            color="inherit"
          >
            Insightful
          </Typography>

          <Tooltip title="Toggle light/dark theme">
            <IconButton
              onClick={() => this.onTheme(localStorage.theme != 'dark')}
            >
              {localStorage.theme == 'dark' ? <SunIcon /> : <MoonIcon />}
            </IconButton>
          </Tooltip>
          <Tooltip title="Import content into library">
            <Link to="/import">
              <IconButton>
                <ImportIcon />
              </IconButton>
            </Link>
          </Tooltip>
          <Tooltip title="Search items in library">
            <Link to="/library">
              <IconButton>
                <LibraryIcon />
              </IconButton>
            </Link>
          </Tooltip>
          <Route
            path="/read/:pub"
            render={props => (
              <Tooltip title="Edit metadata">
                <Link to={`/edit/${props.match.params.pub}`}>
                  <IconButton>
                    <EditIcon />
                  </IconButton>
                </Link>
              </Tooltip>
            )}
          />
        </Toolbar>
      </AppBar>
    );
  }
}

export const Navigation = withStyles(styles)(_Navigation);
