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
  entity
}: {
  onChange: (entity: Insightful.Entity) => void;
  history: Insightful.Marker[];
  entity?: Insightful.Entity;
} & WithStyles<typeof styles>) {
  const [showTOC, setShowTOC] = React.useState(false);

  if (!entity) return null;

  /** Navigate by updating entity bookmark */
  function onNavigate(marker: Insightful.Marker) {
    const _entity: Insightful.Entity = Object.assign({}, entity);
    _entity.bookmark = marker;
    onChange(_entity);
  }

  /** Navigate to Table of Contents selection */
  function onSelect(tocMarker: Insightful.Entity['toc'][0]) {
    if (!entity) return;
    history.push(entity.bookmark);
    onNavigate(tocMarker);
    setShowTOC(false);
  }

  return (
    <div className={classes.root}>
      {/* Previous Section */}
      {entity.bookmark.section > 0 ? (
        <Button
          className={classes.button}
          onClick={() =>
            onNavigate({ section: entity.bookmark.section - 1, element: 0 })
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
      {entity.toc.length > 1 ? (
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
                {entity.toc.map((section, i) => (
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
      {entity.sections - 1 > entity.bookmark.section ? (
        <Button
          className={classes.button}
          onClick={() =>
            onNavigate({ section: entity.bookmark.section + 1, element: 0 })
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
