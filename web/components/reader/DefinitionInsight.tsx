import { createStyles, makeStyles, Paper } from '@material-ui/core';
import { Illuminsight } from 'types/illuminsight';
import * as React from 'react';

// Source: https://github.com/Suyash458/WiktionaryParser/blob/master/wiktionaryparser.py
const SECTIONS = [
  'noun',
  'verb',
  'adjective',
  'adverb',
  'determiner',
  'article',
  'preposition',
  'conjunction',
  'proper noun',
  'letter',
  'character',
  'phrase',
  'proverb',
  'idiom',
  'symbol',
  'syllable',
  'numeral',
  'initialism',
  'interjection',
  'definitions',
  'pronoun'
];

const useStyles = makeStyles(() =>
  createStyles({
    paper: {
      maxHeight: '60vh',
      overflow: 'auto',
      padding: '0.3em',
      margin: '1em 0.3em'
    }
  })
);

export function DefinitionInsight({
  definition
}: {
  definition: Exclude<Illuminsight.Insight['definition'], undefined>;
}) {
  const classes = useStyles();

  function generateHTML() {
    return definition
      .sections()
      .filter(
        // Allow top-level language sections and parts of speech sections
        s => !s.indentation() || SECTIONS.includes(s.title().toLowerCase())
      )
      .map(s => s.html())
      .join('\n');
  }

  return (
    <Paper className={classes.paper} elevation={2}>
      <div dangerouslySetInnerHTML={{ __html: generateHTML() }} />
    </Paper>
  );
}
