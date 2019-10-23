import { useSelector, useDispatch } from 'react-redux';
import { DispatchAction } from 'store/types';
import { RecipeManager } from 'components/reader/RecipeManager';
import { Illuminsight } from 'types';
import { toggleTheme } from 'store/actions';
import { AppState } from 'store/types';
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
}): JSX.Element | null {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [dialog, setDialog] = React.useState<DialogView>(false);
  const dispatch = useDispatch<DispatchAction>();
  const classes = useStyles();
  const pub = useSelector((s: AppState) => s.pub);

  function onChangeFontSize(action: '+' | '-'): void {
    let fontSize = +localStorage.getItem('fontSize')! || 125;

    if (action == '+' && fontSize == 200) return;
    if (action == '-' && fontSize == 100) return;

    fontSize = action == '+' ? fontSize + 5 : fontSize - 5;
    localStorage.setItem('fontSize', fontSize.toString());
    document.getElementById('ast')!.style.fontSize = `${fontSize}%`;
  }

  function onMenuItemClick(view: DialogView): void {
    setDialog(view);
    setAnchorEl(null);
  }

  function onSelect(tocMarker: Illuminsight.Pub['toc'][0]): void {
    if (!pub) return;
    history.push(pub.bookmark);
    navigate(tocMarker);
    setDialog(false);
  }

  function onToggleTheme(): void {
    dispatch(toggleTheme());
  }

  if (!pub) return null;

  return (
    <React.Fragment>
      <Tooltip title="View more menu items">
        <IconButton onClick={(e): void => setAnchorEl(e.currentTarget)}>
          <MoreIcon />
        </IconButton>
      </Tooltip>

      <Menu
        id="more"
        open={Boolean(anchorEl)}
        onClose={(): void => setAnchorEl(null)}
        anchorEl={anchorEl}
      >
        <MenuItem onClick={(): void => onMenuItemClick('toc')}>
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
        <MenuItem onClick={(): void => onMenuItemClick('font-size')}>
          <ListItemIcon>
            <FontSizeIcon />
          </ListItemIcon>
          Set Font Size
        </MenuItem>
        <MenuItem onClick={onToggleTheme}>
          <ListItemIcon>
            {localStorage.theme == 'dark' ? <SunIcon /> : <MoonIcon />}
          </ListItemIcon>
          Toggle Theme
        </MenuItem>
        <MenuItem onClick={(): void => onMenuItemClick('recipes')}>
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
        onClose={(): void => setDialog(false)}
        open={!!dialog}
      >
        <DialogContent>
          {dialog == 'font-size' ? (
            <React.Fragment>
              <IconButton
                aria-label="Decrease font size"
                onClick={(): void => onChangeFontSize('-')}
              >
                <DecreaseIcon />
              </IconButton>
              <IconButton
                aria-label="Increase font size"
                onClick={(): void => onChangeFontSize('+')}
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
                <ListItem
                  key={i}
                  button
                  onClick={(): void => onSelect(section)}
                >
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
