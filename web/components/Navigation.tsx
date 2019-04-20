import { withSnackbar, withSnackbarProps } from 'notistack';
import * as React from 'react';
import { Link } from 'react-router-dom';
import {
  createStyles,
  WithStyles,
  withStyles,
  IconButton,
  Typography,
  Tooltip,
  Toolbar,
  AppBar,
  Theme
} from '@material-ui/core';
import {
  LibraryBooks as LibraryIcon,
  LibraryAdd as ImportIcon,
  Brightness2 as MoonIcon,
  WbSunny as SunIcon
} from '@material-ui/icons';

const styles = (theme: Theme) =>
  createStyles({
    title: {
      flexGrow: 1
    },
    button: {
      color: theme.palette.getContrastText(theme.palette.primary.main)
    }
  });

class _Navigation extends React.Component<
  WithStyles<typeof styles> & withSnackbarProps
> {
  onTheme(dark: boolean) {
    localStorage.theme = dark ? 'dark' : 'light';
    location.reload();
  }

  render() {
    const { classes } = this.props;
    return (
      <AppBar position="fixed">
        <Toolbar>
          <Typography
            className={classes.title}
            variant="h6"
            noWrap
            color="inherit"
          >
            Insightful
          </Typography>
          <Tooltip title="Toggle light/dark theme" color="inherit">
            <IconButton
              onClick={() => this.onTheme(localStorage.theme != 'dark')}
            >
              {localStorage.theme == 'dark' ? <SunIcon /> : <MoonIcon />}
            </IconButton>
          </Tooltip>
          <Tooltip title="Import content into library" color="inherit">
            <Link to="/import">
              <IconButton className={classes.button}>
                <ImportIcon />
              </IconButton>
            </Link>
          </Tooltip>
          <Tooltip title="Search items in library" color="inherit">
            <Link to="/library">
              <IconButton className={classes.button}>
                <LibraryIcon />
              </IconButton>
            </Link>
          </Tooltip>
        </Toolbar>
      </AppBar>
    );
  }
}

export const Navigation = withSnackbar(withStyles(styles)(_Navigation));
