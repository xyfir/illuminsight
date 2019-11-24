import React from 'react';
import {
  createStyles,
  makeStyles,
  Typography,
  Button,
  Grid,
} from '@material-ui/core';

const REPO = 'https://github.com/xyfir/illuminsight';
const DOCS = `${REPO}/tree/master/docs`;

const useStyles = makeStyles((theme) =>
  createStyles({
    footerSection: {
      padding: '1em',
      width: '100%',
    },
    xyfirNetwork: {
      marginBottom: '2em',
      fontWeight: 'bold',
      textAlign: 'center',
      width: '100%',
    },
    section: {
      padding: '1em',
    },
    button: {
      minWidth: '8em',
      margin: '0.5em',
    },
    root: {
      textAlign: 'center',
    },
    h1: {
      marginBottom: '0.2em',
      fontSize: '200%',
      color: theme.palette.primary.main,
    },
    h2: {
      marginBottom: '0.2em',
      fontSize: '180%',
      color: theme.palette.secondary.main,
    },
    h3: {
      marginBottom: '0.2em',
      fontSize: '150%',
    },
    ul: {
      lineHeight: '2em',
      listStyle: 'none',
      padding: 0,
      margin: 0,
    },
    p: {
      fontSize: '110%',
    },
    a: {
      textDecoration: 'none',
      color: theme.palette.primary.main,
    },
  }),
);

export function Home(): JSX.Element {
  const classes = useStyles();

  React.useEffect(() => {
    const s = document.createElement('script');
    s.src = 'https://platform.twitter.com/widgets.js';
    document.head.appendChild(s);
  }, []);

  return (
    <div className={classes.root}>
      <section className={classes.section}>
        <Typography variant="h1" className={classes.h1}>
          illuminsight
        </Typography>
        <Typography className={classes.p}>read smarter</Typography>
      </section>

      <section className={classes.section}>
        <Typography variant="h2" className={classes.h2}>
          get it free
        </Typography>
        <Typography className={classes.p}>
          available on all your devices
        </Typography>

        <div>
          <Button
            href="https://apps.apple.com/us/app/illuminsight/id1487389063"
            variant="outlined"
            className={classes.button}
          >
            Apple
          </Button>

          <Button
            href="https://app.illuminsight.com"
            color="primary"
            variant="outlined"
            className={classes.button}
          >
            Web
          </Button>

          <Button
            href="https://play.google.com/store/apps/details?id=com.xyfir.illuminsight"
            variant="outlined"
            className={classes.button}
          >
            Android
          </Button>
        </div>
      </section>

      <section className={classes.section}>
        <a
          data-link-color="#1976d2"
          data-height="700"
          data-width="500"
          className={`twitter-timeline ${classes.a}`}
          href="https://twitter.com/illuminsight?ref_src=twsrc%5Etfw"
        >
          tweets by illuminsight
        </a>
      </section>

      <Grid container component="footer">
        <Grid className={classes.footerSection} item md={4}>
          <Typography variant="h3" className={classes.h3}>
            community and support
          </Typography>
          <ul className={classes.ul}>
            <li>
              <a href="https://twitter.com/illuminsight" className={classes.a}>
                twitter
              </a>
            </li>
            <li>
              <a href="https://discord.gg/3T2gztb" className={classes.a}>
                discord
              </a>
            </li>
            <li>
              <a href={''} className={classes.a}>
                github
              </a>
            </li>
          </ul>
        </Grid>

        <Grid className={classes.footerSection} item md={4}>
          <Typography variant="h3" className={classes.h3}>
            resources
          </Typography>
          <ul className={classes.ul}>
            <li>
              <a href={`${DOCS}/privacy-policy.md`} className={classes.a}>
                privacy policy
              </a>
            </li>
            <li>
              <a href={`${DOCS}/self-host.md`} className={classes.a}>
                self-hosting
              </a>
            </li>
            <li>
              <a href={`${DOCS}/astpub.md`} className={classes.a}>
                astpub
              </a>
            </li>
          </ul>
        </Grid>

        <Grid className={classes.footerSection} item md={4}>
          <Typography variant="h3" className={classes.h3}>
            spread the word
          </Typography>
          <ul className={classes.ul}>
            <li>
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                  'read smarter with @illuminsight #ereader https://www.illuminsight.com',
                )}`}
                className={classes.a}
              >
                share on twitter
              </a>
            </li>
            <li>
              <a href={REPO} className={classes.a}>
                star on github
              </a>
            </li>
            <li>
              <a
                href="https://alternativeto.net/software/illuminsight/"
                className={classes.a}
              >
                like on alternativeto
              </a>
            </li>
          </ul>
        </Grid>

        <Typography className={classes.xyfirNetwork}>
          illuminsight is part of the{' '}
          <a href="https://www.xyfir.com" className={classes.a}>
            xyfir network
          </a>
        </Typography>
      </Grid>
    </div>
  );
}
