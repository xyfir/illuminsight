import { Insightful } from 'types/insightful';
import * as React from 'react';
import {
  NavigateBefore as PreviousIcon,
  NavigateNext as NextIcon,
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
  entity
}: {
  onChange: (entity: Insightful.Entity) => void;
  entity?: Insightful.Entity;
} & WithStyles<typeof styles>) {
  const [showTOC, setShowTOC] = React.useState(false);

  /** Navigate by updating entity bookmark */
  function onNavigate(
    section: Insightful.Entity['bookmark']['section'],
    element: Insightful.Entity['bookmark']['element']
  ) {
    const _entity: Insightful.Entity = Object.assign({}, entity);
    _entity.bookmark = { section, element };
    onChange(_entity);
  }

  /** Navigate to Table of Contents selection */
  function onSelect(section: Insightful.Entity['toc'][0]) {
    onNavigate(section.section, section.element);
    setShowTOC(false);
  }

  return !entity ? null : (
    <div className={classes.root}>
      {/* Prev. Section */}
      {entity.bookmark.section > 0 ? (
        <Button
          className={classes.button}
          onClick={() => onNavigate(entity.bookmark.section - 1, 0)}
        >
          <div className={classes.buttonContent}>
            <PreviousIcon className={classes.icon} />
            Prev
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
          onClick={() => onNavigate(entity.bookmark.section + 1, 0)}
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
