import { Insightful } from 'types/insightful';
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
  createStyles,
  ListItemText,
  WithStyles,
  withStyles,
  ListItem,
  Dialog,
  Button,
  Theme,
  List
} from '@material-ui/core';

const styles = (theme: Theme) =>
  createStyles({
    buttonContent: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    },
    button: {
      opacity: 0.4,
      flex: 1
    },
    root: {
      justifyContent: 'center',
      display: 'flex'
    },
    icon: {
      fontSize: '3em',
      display: 'block'
    }
  });

function _SectionNavigation({
  onChange,
  classes,
  history,
  pub
}: {
  onChange: (pub: Insightful.Pub) => void;
  history: Insightful.Marker[];
  pub?: Insightful.Pub;
} & WithStyles<typeof styles>) {
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
    <div className={classes.root}>
      {/* Previous Section */}
      {pub.bookmark.section > 0 ? (
        <Button
          className={classes.button}
          onClick={() =>
            onNavigate({ section: pub.bookmark.section - 1, element: 0 })
          }
        >
          <div className={classes.buttonContent}>
            <PreviousIcon className={classes.icon} />
            Prev
          </div>
        </Button>
      ) : null}

      {/* Back (history) */}
      {history.length ? (
        <Button
          className={classes.button}
          onClick={() => onNavigate(history.pop() as Insightful.Marker)}
        >
          <div className={classes.buttonContent}>
            <BackIcon className={classes.icon} />
            Back
          </div>
        </Button>
      ) : null}

      {/* Table of Contents */}
      {pub.toc.length > 1 ? (
        <React.Fragment>
          <Button className={classes.button} onClick={() => setShowTOC(true)}>
            <div className={classes.buttonContent}>
              <TOCIcon className={classes.icon} />
              TOC
            </div>
          </Button>

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
      ) : null}

      {/* Next Section */}
      {pub.sections - 1 > pub.bookmark.section ? (
        <Button
          className={classes.button}
          onClick={() =>
            onNavigate({ section: pub.bookmark.section + 1, element: 0 })
          }
        >
          <div className={classes.buttonContent}>
            <NextIcon className={classes.icon} />
            Next
          </div>
        </Button>
      ) : null}
    </div>
  );
}

export const SectionNavigation = withStyles(styles)(_SectionNavigation);
