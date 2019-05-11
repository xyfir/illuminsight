import { Insightful } from 'types/insightful';
import * as React from 'react';
import {
  NavigateBefore as PreviousIcon,
  NavigateNext as NextIcon
} from '@material-ui/icons';
import {
  createStyles,
  WithStyles,
  withStyles,
  Button,
  Theme
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
      fontSize: '4em',
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
  function onChangeSection(section: Insightful.Entity['bookmark']['section']) {
    const _entity: Insightful.Entity = Object.assign({}, entity);
    _entity.bookmark.section = section;
    onChange(_entity);
  }

  return !entity ? null : (
    <div className={classes.root}>
      {entity.bookmark.section > 0 ? (
        <Button
          className={classes.button}
          onClick={() => onChangeSection(entity.bookmark.section - 1)}
        >
          <div className={classes.buttonContent}>
            <PreviousIcon className={classes.icon} />
            Prev. Section
          </div>
        </Button>
      ) : null}
      {entity.spine.length - 1 > entity.bookmark.section ? (
        <Button
          className={classes.button}
          onClick={() => onChangeSection(entity.bookmark.section + 1)}
        >
          <div className={classes.buttonContent}>
            <NextIcon className={classes.icon} />
            Next Section
          </div>
        </Button>
      ) : null}
    </div>
  );
}

export const SectionNavigation = withStyles(styles)(_SectionNavigation);
