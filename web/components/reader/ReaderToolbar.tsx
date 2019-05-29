import { Insightful } from 'types/insightful';
import { Toolbar } from 'components/app/Toolbar';
import * as React from 'react';
import { Link } from 'react-router-dom';
import {
  NavigateBefore as PreviousIcon,
  NavigateNext as NextIcon,
  MoreVert as MoreIcon,
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
  WithStyles,
  withStyles,
  ListItem,
  MenuItem,
  Tooltip,
  Dialog,
  Theme,
  Menu,
  List
} from '@material-ui/core';

const styles = (theme: Theme) =>
  createStyles({
    linkMenuItem: {
      textDecoration: 'none',
      color: theme.palette.getContrastText(theme.palette.background.paper)
    }
  });

function _ReaderToolbar({
  onChange,
  history,
  classes,
  pub
}: {
  onChange: (pub: Insightful.Pub) => void;
  history: Insightful.Marker[];
  pub?: Insightful.Pub;
} & WithStyles<typeof styles>) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [showTOC, setShowTOC] = React.useState(false);

  if (!pub) return null;

  /** Navigate by updating pub bookmark */
  function onNavigate(marker: Insightful.Marker) {
    const _pub: Insightful.Pub = Object.assign({}, pub);
    _pub.bookmark = marker;
    onChange(_pub);
  }

  /** Navigate to Table of Contents selection */
  function onSelect(tocMarker: Insightful.Pub['toc'][0]) {
    if (!pub) return;
    history.push(pub.bookmark);
    onNavigate(tocMarker);
    setShowTOC(false);
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
              onNavigate({ section: pub.bookmark.section - 1, element: 0 })
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
          <IconButton onClick={() => onNavigate(history.pop()!)}>
            <BackIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <IconButton disabled>
          <BackIcon />
        </IconButton>
      )}

      {/* Table of Contents dialog */}
      {pub.toc.length > 1 ? (
        <Dialog
          aria-labelledby="toc-dialog"
          maxWidth={false}
          onClose={() => setShowTOC(false)}
          open={showTOC}
        >
          <DialogContent>
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
          </DialogContent>
        </Dialog>
      ) : null}

      {/* Next Section */}
      {pub.sections - 1 > pub.bookmark.section ? (
        <Tooltip title="Go to next section">
          <IconButton
            onClick={() =>
              onNavigate({ section: pub.bookmark.section + 1, element: 0 })
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
        <MenuItem onClick={() => (setShowTOC(true), setAnchorEl(null))}>
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
      </Menu>
    </Toolbar>
  );
}

export const ReaderToolbar = withStyles(styles)(_ReaderToolbar);
