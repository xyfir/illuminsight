import { ExpandMore as ExpandMoreIcon } from '@material-ui/icons';
import { Illuminsight } from 'types';
import * as React from 'react';
import {
  createStyles,
  makeStyles,
  Typography,
  Button,
} from '@material-ui/core';

const useStyles = makeStyles(() =>
  createStyles({
    partOfSpeech: {
      fontSize: '100%',
    },
    language: {
      marginBottom: '1em',
      fontSize: '120%',
    },
    root: {
      margin: '1em 0.3em',
    },
  }),
);

export function DefinitionInsight({
  definitions,
  languages,
}: {
  definitions: Illuminsight.DefinitionInsight;
  languages: Illuminsight.Pub['languages'];
}): JSX.Element {
  // Find highest priority language with available definitions
  let language = '';
  for (const lang of languages) {
    if (definitions[lang]) {
      language = lang;
      break;
    }
  }

  const [expand, setExpand] = React.useState(!language);
  const classes = useStyles();

  function cleanHTML(html: string): string {
    // We'll use this unattached container for manipulating HTML
    const div = document.createElement('div');
    div.innerHTML = html;

    // Remove images (Array.from() required!)
    const imgs = Array.from(div.getElementsByTagName('img'));
    for (const img of imgs) img.remove();

    // Remove links (Array.from() required!)
    const links = Array.from(div.getElementsByTagName('a'));
    for (const a of links) {
      const span = document.createElement('span');
      span.innerHTML = a.innerHTML;
      a.replaceWith(span);
    }

    return div.innerHTML;
  }

  return (
    <div className={classes.root}>
      {/* Languages */}
      {Object.keys(definitions)
        .filter((lang) => (expand ? true : lang == language))
        .map((lang) => (
          <div key={lang}>
            {/* Language */}
            {expand || lang != language ? (
              <Typography variant="h1" className={classes.language}>
                {definitions[lang][0].language}
              </Typography>
            ) : null}

            {/* Per-language definitions */}
            {definitions[lang].map((d, i) => (
              <div key={i}>
                {/* Part of speech */}
                <Typography variant="h2" className={classes.partOfSpeech}>
                  {d.partOfSpeech.toLowerCase()}
                </Typography>

                {/* Definitions */}
                <ul>
                  {d.definitions.map((dd, j) => (
                    <li key={j}>
                      <Typography
                        dangerouslySetInnerHTML={{
                          __html: cleanHTML(dd.definition),
                        }}
                      />

                      {/* Examples */}
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
          </div>
        ))}

      {/* Expand all definitions */}
      {expand || Object.keys(definitions).length == 1 ? null : (
        <Button variant="text" onClick={(): void => setExpand(true)}>
          <ExpandMoreIcon />
          All Definitions
        </Button>
      )}
    </div>
  );
}
