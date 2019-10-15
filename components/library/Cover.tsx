import { createStyles, makeStyles, Theme } from '@material-ui/core';
import { CropSquare as SquareIcon } from '@material-ui/icons';
import localForage from 'localforage';
import * as React from 'react';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      justifyContent: 'center',
      marginRight: '1em',
      alignItems: 'center',
      minWidth: '6em',
      display: 'flex',
      width: '6em',
      color: theme.palette.grey[500],
    },
    icon: {
      fontSize: '5em',
    },
    img: {
      maxHeight: '100%',
      maxWidth: '100%',
    },
  }),
);

export function Cover({ id }: { id: number }): JSX.Element {
  const [url, setUrl] = React.useState('');
  const classes = useStyles();

  // Load cover from local storage and create object URL from blob
  // Revoke object URL on unmount or id change
  React.useEffect(() => {
    let _url: string;
    localForage
      .getItem(`pub-cover-${id}`)
      .then((cover) => {
        if (cover === null) return;
        _url = URL.createObjectURL(cover as Blob);
        setUrl(_url);
      })
      .catch(() => undefined);

    return (): void => {
      if (_url) URL.revokeObjectURL(_url);
    };
  }, [id]);

  return (
    <div className={classes.root}>
      {url ? (
        <img src={url} className={classes.img} />
      ) : (
        <SquareIcon className={classes.icon} />
      )}
    </div>
  );
}
