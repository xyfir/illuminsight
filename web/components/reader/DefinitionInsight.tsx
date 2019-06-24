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
    // We'll use this unattached container for manipulating HTML
    const div = document.createElement('div');
    div.innerHTML = doc
      .sections()
      .filter(
        // Allow top-level language sections and parts of speech sections
        s => !s.indentation() || SECTIONS.includes(s.title().toLowerCase())
      )
      .map(s => s.html())
      .join('\n');

    // Remove "English" heading if it's the first one in the document
    // User should already assume definition is in English by default
    const [h1] = div.getElementsByTagName('h1');
    if (h1 && h1.innerText == 'English') h1.remove();

    // Remove links (Array.from() required!)
    const links = Array.from(div.getElementsByTagName('a'));
    for (let a of links) {
      const span = document.createElement('span');
      span.innerHTML = a.innerHTML;
      a.replaceWith(span);
    }

    return div.innerHTML;
  }

  return wikiView ? (
    <WikiInsight wiktionary doc={doc} />
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
