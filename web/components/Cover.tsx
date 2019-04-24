import { createStyles, WithStyles, withStyles, Theme } from '@material-ui/core';
import { CropSquare as SquareIcon } from '@material-ui/icons';
import * as localForage from 'localforage';
import * as React from 'react';

const styles = (theme: Theme) =>
  createStyles({
    root: {
      width: '5em',
      height: '5em',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: theme.palette.grey[500]
    },
    icon: {
      fontSize: '5em'
    }
  });

function _Cover({ classes, id }: WithStyles<typeof styles> & { id: number }) {
  const [url, setUrl] = React.useState('');

  // Load cover from local storage and create object URL from blob
  // Revoke object URL on unmount or id change
  React.useEffect(() => {
    let _url: string;
    localForage
      .getItem(`entity-cover-${id}`)
      .then(cover => {
        if (cover === null) return;
        _url = URL.createObjectURL(cover as Blob);
        setUrl(_url);
      })
      .catch(() => undefined);

    return () => {
      if (_url) URL.revokeObjectURL(_url);
    };
  }, [id]);

  return (
    <div className={classes.root}>
      {url ? <img src={url} /> : <SquareIcon className={classes.icon} />}
    </div>
  );
}

export const Cover = withStyles(styles)(_Cover);
