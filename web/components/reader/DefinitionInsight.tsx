import { createStyles, makeStyles, Button, Paper } from '@material-ui/core';
import { ExpandMore as ExpandMoreIcon } from '@material-ui/icons';
import { Illuminsight } from 'types/illuminsight';
import { WikiInsight } from 'components/reader/WikiInsight';
import * as React from 'react';

// http://github.com/Suyash458/WiktionaryParser/blob/master/wiktionaryparser.py
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
  doc
}: {
  doc: Exclude<Illuminsight.Insight['definition'], undefined>;
}) {
  const [wikiView, setWikiView] = React.useState(false);
  const classes = useStyles();

  function generateHTML() {
    return doc
      .sections()
      .filter(
        // Allow top-level language sections and parts of speech sections
        s => !s.indentation() || SECTIONS.includes(s.title().toLowerCase())
      )
      .map(s => s.html())
      .join('\n');
  }

  return wikiView ? (
    <WikiInsight doc={doc} />
  ) : (
    <Paper className={classes.paper} elevation={2}>
      <div dangerouslySetInnerHTML={{ __html: generateHTML() }} />

      <Button onClick={() => setWikiView(true)} variant="text">
        <ExpandMoreIcon />
        Full Definition
      </Button>
    </Paper>
  );
}
