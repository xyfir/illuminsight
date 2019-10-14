import { ToggleThemeContext } from 'lib/app/theme';
import { RecipeManager } from 'components/reader/RecipeManager';
import { ReaderContext } from 'components/reader/Reader';
import { Illuminsight } from 'types';
import * as React from 'react';
import { Link } from 'react-router-dom';
import {
  RemoveCircleOutline as DecreaseIcon,
  AddCircleOutline as IncreaseIcon,
  Brightness2 as MoonIcon,
  FormatSize as FontSizeIcon,
  Restaurant as RecipeIcon,
  MoreVert as MoreIcon,
  WbSunny as SunIcon,
  Edit as EditIcon,
  Toc as TOCIcon,
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
  List,
} from '@material-ui/core';

const useStyles = makeStyles((theme) =>
  createStyles({
    linkMenuItem: {
      textDecoration: 'none',
      color: theme.palette.getContrastText(theme.palette.background.paper),
    },
  }),
);

type DialogView = false | 'toc' | 'recipes' | 'font-size';

export function ExtendedReaderControls({
  navigate,
  history,
}: {
  navigate: (marker: Illuminsight.Pub['toc'][0]) => void;
  history: Illuminsight.Marker[];
}) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [dialog, setDialog] = React.useState<DialogView>(false);
  const toggleTheme = React.useContext(ToggleThemeContext);
  const { pub } = React.useContext(ReaderContext);
  const classes = useStyles();

  function onChangeFontSize(action: '+' | '-') {
    let fontSize = +localStorage.getItem('fontSize')! || 125;

    if (action == '+' && fontSize == 200) return;
    if (action == '-' && fontSize == 100) return;

    fontSize = action == '+' ? fontSize + 5 : fontSize - 5;
    localStorage.setItem('fontSize', fontSize.toString());
    document.getElementById('ast')!.style.fontSize = `${fontSize}%`;
  }

  function onMenuItemClick(view: DialogView) {
    setDialog(view);
    setAnchorEl(null);
  }

  function onSelect(tocMarker: Illuminsight.Pub['toc'][0]) {
    if (!pub) return;
    history.push(pub.bookmark);
    navigate(tocMarker);
    setDialog(false);
  }

  if (!pub) return null;

  return (
    <React.Fragment>
      <Tooltip title="View more menu items">
        <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
          <MoreIcon />
        </IconButton>
      </Tooltip>

      <Menu
        id="more"
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        anchorEl={anchorEl}
      >
        <MenuItem onClick={() => onMenuItemClick('toc')}>
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
        <MenuItem onClick={() => onMenuItemClick('font-size')}>
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
        <MenuItem onClick={() => onMenuItemClick('recipes')}>
          <ListItemIcon>
            <RecipeIcon />
          </ListItemIcon>
          Recipes
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
          ) : dialog == 'recipes' ? (
            <RecipeManager />
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
    </React.Fragment>
  );
}
