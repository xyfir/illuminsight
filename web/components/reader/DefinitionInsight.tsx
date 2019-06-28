import { createStyles, makeStyles, Typography, Paper } from '@material-ui/core';
import { Illuminsight } from 'types/illuminsight';
import * as React from 'react';

const useStyles = makeStyles(() =>
  createStyles({
    partOfSpeech: {
      fontSize: '100%'
    },
    root: {
      maxHeight: '40vh',
      overflow: 'auto',
      padding: '0.5em',
      margin: '1em 0.3em'
    }
  })
);

export function DefinitionInsight({
  definitions
}: {
  definitions: Illuminsight.Definitions;
}) {
  const classes = useStyles();

  function cleanHTML(html: string): string {
    // We'll use this unattached container for manipulating HTML
    const div = document.createElement('div');
    div.innerHTML = html;

    // Remove images (Array.from() required!)
    const imgs = Array.from(div.getElementsByTagName('img'));
    for (let img of imgs) img.remove();

    // Remove links (Array.from() required!)
    const links = Array.from(div.getElementsByTagName('a'));
    for (let a of links) {
      const span = document.createElement('span');
      span.innerHTML = a.innerHTML;
      a.replaceWith(span);
    }

    return div.innerHTML;
  }

  return (
    // Part of speech -> definition -> example
    <Paper className={classes.root} elevation={2}>
      {definitions.en.map((d, i) => (
        <div key={i}>
          <Typography variant="h2" className={classes.partOfSpeech}>
            {d.partOfSpeech.toLowerCase()}
          </Typography>
          <ul>
            {d.definitions.map((dd, j) => (
              <li key={j}>
                <Typography
                  dangerouslySetInnerHTML={{ __html: cleanHTML(dd.definition) }}
                />
                <ul>
                  {dd.examples &&
                    dd.examples.map((e, k) => (
                      <Typography
                        key={k}
                        dangerouslySetInnerHTML={{ __html: cleanHTML(e) }}
                      />
                    ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </Paper>
  );
}
