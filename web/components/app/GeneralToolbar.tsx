import { IconButton, Tooltip } from '@material-ui/core';
import { ToggleThemeContext } from 'lib/app/theme';
import { Toolbar } from 'components/app/Toolbar';
import * as React from 'react';
import { Link } from 'react-router-dom';
import {
  LibraryBooks as LibraryIcon,
  Brightness2 as MoonIcon,
  LibraryAdd as ImportIcon,
  WbSunny as SunIcon,
  GetApp as InstallIcon
} from '@material-ui/icons';

// Types don't yet exist for BeforeInstallPromptEvent
let beforeInstallPromptEvent: any = null;

export function GeneralToolbar() {
  const [install, setInstall] = React.useState(!!beforeInstallPromptEvent);
  const toggleTheme = React.useContext(ToggleThemeContext);

  /** Listen for beforeinstallprompt event */
  function onBeforeInstallPrompt(event: any) {
    beforeInstallPromptEvent = event;
    setInstall(true);
  }

  /** Begin PWA installation */
  function onInstall() {
    beforeInstallPromptEvent.prompt();
    beforeInstallPromptEvent = null;
    setInstall(false);
  }

  // Listen for beforeinstallprompt event
  React.useEffect(() => {
    window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt);
    return () =>
      window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt);
  }, []);

  return (
    <Toolbar>
      <Tooltip title="Toggle light/dark theme">
        <IconButton onClick={toggleTheme}>
          {localStorage.theme == 'dark' ? <SunIcon /> : <MoonIcon />}
        </IconButton>
      </Tooltip>

      <Tooltip title="Search items in library">
        <Link to="/library">
          <IconButton>
            <LibraryIcon />
          </IconButton>
        </Link>
      </Tooltip>

      <Tooltip title="Import content into library">
        <Link to="/import">
          <IconButton>
            <ImportIcon />
          </IconButton>
        </Link>
      </Tooltip>

      {install ? (
        <Tooltip title="Install Insightful to home screen">
          <IconButton onClick={onInstall}>
            <InstallIcon />
          </IconButton>
        </Tooltip>
      ) : null}
    </Toolbar>
  );
}
