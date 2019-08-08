import { createPortal } from 'react-dom';
import * as React from 'react';
import {
  createStyles,
  makeStyles,
  Toolbar as MUIToolbar,
  AppBar
} from '@material-ui/core';

const useStyles = makeStyles(() =>
  createStyles({
    toolbar: {
      justifyContent: 'space-between'
    }
  })
);

let toolbar: HTMLDivElement;

export function Toolbar({ children }: { children: React.ReactNode }) {
  const classes = useStyles();

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
