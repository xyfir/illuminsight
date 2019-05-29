import { createPortal } from 'react-dom';
import * as React from 'react';
import {
  createStyles,
  WithStyles,
  withStyles,
  Toolbar as MUIToolbar,
  AppBar
} from '@material-ui/core';

const styles = createStyles({
  toolbar: {
    justifyContent: 'space-between'
  }
});

let toolbar: HTMLDivElement;

function _Toolbar({
  children,
  classes
}: WithStyles<typeof styles> & { children: React.ReactNode }) {
  if (!toolbar) {
    toolbar = document.createElement('div');
    toolbar.id = 'toolbar';
    document.getElementById('content')!.prepend(toolbar);
  }

  return createPortal(
    <AppBar position="fixed" color="default">
      <MUIToolbar className={classes.toolbar}>{children}</MUIToolbar>
    </AppBar>,
    toolbar
  );
}

export const Toolbar = withStyles(styles)(_Toolbar);
