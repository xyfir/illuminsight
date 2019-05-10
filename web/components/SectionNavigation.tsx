import { Insightful } from 'types/insightful';
import * as React from 'react';
import {
  createStyles,
  WithStyles,
  withStyles,
  Button,
  Theme
} from '@material-ui/core';

const styles = (theme: Theme) => createStyles({});

function _SectionNavigation({
  onChange,
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
    <div>
      {entity.bookmark.section > 0 ? (
        <Button onClick={() => onChangeSection(entity.bookmark.section - 1)}>
          Previous Section
        </Button>
      ) : null}
      {entity.spine.length - 1 > entity.bookmark.section ? (
        <Button onClick={() => onChangeSection(entity.bookmark.section + 1)}>
          Next Section
        </Button>
      ) : null}
    </div>
  );
}

export const SectionNavigation = withStyles(styles)(_SectionNavigation);
