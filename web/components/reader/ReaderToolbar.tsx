import { Insightful } from 'types/insightful';
import { Toolbar } from 'components/app/Toolbar';
import * as React from 'react';
import {
  NavigateBefore as PreviousIcon,
  NavigateNext as NextIcon,
  Replay as BackIcon,
  Toc as TOCIcon
} from '@material-ui/icons';
import {
  ListSubheader,
  DialogContent,
  ListItemText,
  IconButton,
  ListItem,
  Tooltip,
  Dialog,
  List
} from '@material-ui/core';

export function ReaderToolbar({
  onChange,
  history,
  pub
}: {
  onChange: (pub: Insightful.Pub) => void;
  history: Insightful.Marker[];
  pub?: Insightful.Pub;
}) {
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

      {/* Table of Contents */}
      {pub.toc.length > 1 ? (
        <React.Fragment>
          <Tooltip title="Table of Contents">
            <IconButton onClick={() => setShowTOC(true)}>
              <TOCIcon />
            </IconButton>
          </Tooltip>
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
        </React.Fragment>
      ) : (
        <IconButton disabled>
          <TOCIcon />
        </IconButton>
      )}

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
    </Toolbar>
  );
}
