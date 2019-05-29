import { IconButton, Tooltip } from '@material-ui/core';
import { Toolbar } from 'components/app/Toolbar';
import * as React from 'react';
import { Link } from 'react-router-dom';
import {
  LibraryBooks as LibraryIcon,
  LibraryAdd as ImportIcon,
  Brightness2 as MoonIcon,
  WbSunny as SunIcon
} from '@material-ui/icons';

export function GeneralToolbar() {
  function onTheme(dark: boolean) {
    localStorage.theme = dark ? 'dark' : 'light';
    location.reload();
  }

  return (
    <Toolbar>
      <Tooltip title="Toggle light/dark theme">
        <IconButton onClick={() => onTheme(localStorage.theme != 'dark')}>
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
    </Toolbar>
  );
}
