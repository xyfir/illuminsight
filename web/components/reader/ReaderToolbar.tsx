import { ToggleThemeContext } from 'lib/app/theme';
import { Illuminsight } from 'types/illuminsight';
import { Toolbar } from 'components/app/Toolbar';
import * as React from 'react';
import { Link } from 'react-router-dom';
import {
  RemoveCircleOutline as DecreaseIcon,
  AddCircleOutline as IncreaseIcon,
  NavigateBefore as PreviousIcon,
  NavigateNext as NextIcon,
  Brightness2 as MoonIcon,
  FormatSize as FontSizeIcon,
  MoreVert as MoreIcon,
  WbSunny as SunIcon,
  Replay as BackIcon,
  Home as HomeIcon,
  Edit as EditIcon,
  Toc as TOCIcon
} from '@material-ui/icons';
import {
  ListSubheader,
  DialogContent,
  ListItemText,
  ListItemIcon,
  createStyles,
  IconButton,
  makeStyles,
  ListItem,
  MenuItem,
  Tooltip,
  Dialog,
  Menu,
  List
} from '@material-ui/core';

const useStyles = makeStyles(theme =>
  createStyles({
    linkMenuItem: {
      textDecoration: 'none',
      color: theme.palette.getContrastText(theme.palette.background.paper)
    }
  })
);

type DialogView = false | 'toc' | 'font-size';

export function ReaderToolbar({
  onNavigate,
  history,
  pub
}: {
  onNavigate: (pub: Illuminsight.Pub) => void;
  history: Illuminsight.Marker[];
  pub?: Illuminsight.Pub;
}) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [dialog, setDialog] = React.useState<DialogView>(false);
  const toggleTheme = React.useContext(ToggleThemeContext);
  const classes = useStyles();

  if (!pub) return null;

  /** Increase or decrease #ast font size */
  function onChangeFontSize(action: '+' | '-') {
    let fontSize = +localStorage.getItem('fontSize')! || 125;

    if (action == '+' && fontSize == 200) return;
    if (action == '-' && fontSize == 100) return;

    fontSize = action == '+' ? fontSize + 5 : fontSize - 5;
    localStorage.setItem('fontSize', fontSize.toString());
    document.getElementById('ast')!.style.fontSize = `${fontSize}%`;
  }

  /** Navigate to Table of Contents selection */
  function onSelect(tocMarker: Illuminsight.Pub['toc'][0]) {
    if (!pub) return;
    history.push(pub.bookmark);
    navigate(tocMarker);
    setDialog(false);
  }

  /** Navigate by updating pub bookmark */
  function navigate(marker: Illuminsight.Marker) {
    const _pub: Illuminsight.Pub = Object.assign({}, pub);
    _pub.bookmark = marker;
    onNavigate(_pub);
  }

  return (
    <Toolbar>
      {/* Home button */}
      <Tooltip title="Return home">
        <Link to="/">
          <IconButton>
            <HomeIcon />
          </IconButton>
        </Link>
      </Tooltip>

      {/* Previous Section */}
      {pub.bookmark.section > 0 ? (
        <Tooltip title="Go to previous section">
          <IconButton
            disabled={pub.bookmark.section == 0}
            onClick={() =>
              navigate({ section: pub.bookmark.section - 1, element: 0 })
            }
          >
            <PreviousIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <IconButton disabled>
          <PreviousIcon />
        </IconButton>
      )}

      {/* Back (history) */}
      {history.length ? (
        <Tooltip title="Go back">
          <IconButton onClick={() => navigate(history.pop()!)}>
            <BackIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <IconButton disabled>
          <BackIcon />
        </IconButton>
      )}

      {/* Next Section */}
      {pub.sections - 1 > pub.bookmark.section ? (
        <Tooltip title="Go to next section">
          <IconButton
            onClick={() =>
              navigate({ section: pub.bookmark.section + 1, element: 0 })
            }
          >
            <NextIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <IconButton disabled>
          <NextIcon />
        </IconButton>
      )}

      {/* More menu items */}
      <Tooltip title="View more menu items">
        <IconButton onClick={e => setAnchorEl(e.currentTarget)}>
          <MoreIcon />
        </IconButton>
      </Tooltip>

      <Menu
        id="more"
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        anchorEl={anchorEl}
      >
        <MenuItem onClick={() => (setDialog('toc'), setAnchorEl(null))}>
          <ListItemIcon>
            <TOCIcon />
          </ListItemIcon>
          Table of Contents
        </MenuItem>
        <Link to={`/edit/${pub.id}`} className={classes.linkMenuItem}>
          <MenuItem>
            <ListItemIcon>
              <EditIcon />
            </ListItemIcon>
            Edit Metadata
          </MenuItem>
        </Link>
        <MenuItem onClick={() => (setDialog('font-size'), setAnchorEl(null))}>
          <ListItemIcon>
            <FontSizeIcon />
          </ListItemIcon>
          Set Font Size
        </MenuItem>
        <MenuItem onClick={toggleTheme}>
          <ListItemIcon>
            {localStorage.theme == 'dark' ? <SunIcon /> : <MoonIcon />}
          </ListItemIcon>
          Toggle Theme
        </MenuItem>
      </Menu>

      {/* Configure font size | table of contents */}
      <Dialog
        aria-labelledby="dialog"
        maxWidth={false}
        onClose={() => setDialog(false)}
        open={!!dialog}
      >
        <DialogContent>
          {dialog == 'font-size' ? (
            <React.Fragment>
              <IconButton
                aria-label="Decrease font size"
                onClick={() => onChangeFontSize('-')}
              >
                <DecreaseIcon />
              </IconButton>
              <IconButton
                aria-label="Increase font size"
                onClick={() => onChangeFontSize('+')}
              >
                <IncreaseIcon />
              </IconButton>
            </React.Fragment>
          ) : dialog == 'toc' ? (
            <List>
              <ListSubheader disableSticky={true}>
                Table of Contents
              </ListSubheader>
              {pub.toc.map((section, i) => (
                <ListItem key={i} button onClick={() => onSelect(section)}>
                  <ListItemText primary={section.title} />
                </ListItem>
              ))}
            </List>
          ) : null}
        </DialogContent>
      </Dialog>
    </Toolbar>
  );
}
