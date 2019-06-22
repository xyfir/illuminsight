import { createStyles, IconButton, makeStyles, Chip } from '@material-ui/core';
import { MoreHoriz as ConnectIcon } from '@material-ui/icons';
import { Illuminsight } from 'types/illuminsight';
import { Insights } from 'components/reader/Insights';
import * as React from 'react';

const useStyles = makeStyles(() =>
  createStyles({
    connector: {
      marginBottom: '0.3em',
      marginLeft: '-0.3em'
    },
    selector: {
      marginBottom: '0.5em'
    },
    chip: {
      marginBottom: '0.3em',
      marginRight: '0.3em'
    }
  })
);

export function FreestyleInsights({
  onDisable,
  index
}: {
  onDisable: () => void;
  index: number;
}) {
  const [connectors, setConnectors] = React.useState<number[]>([]);
  const [insights, setInsights] = React.useState<Illuminsight.Insight[]>([]);
  const [selected, setSelected] = React.useState<number[]>([]);
  const [words, setWords] = React.useState<string[]>([]);
  const classes = useStyles();

  // Get text content from AST element on first load
  React.useEffect(() => {
    setWords(
      (document.querySelector(`*[ast="${index}"]`) as HTMLElement).innerText
        // Split text content by whitespace or em dash
        .split(/—|\s+/)
        // Strip tailing punctuation
        .map(word => {
          const match = word.match(/[,.?!]+$/);
          if (match) return word.substr(0, match.index);
          else return word;
        })
    );
  }, []);

  /** Connect a selected word to its following selected neighbor */
  function onConnect(wordIndex: number) {
    // Disconnect
    if (connectors.includes(wordIndex)) {
      setConnectors(connectors.filter(c => c != wordIndex));
      // Split previously connected insight
    }
    // Connect
    else {
      setConnectors(connectors.concat(wordIndex));
      // Coinjoin previously disconnected insight
    }

    // ** Update insights
  }

  /** Freestyle word has been selected */
  function onSelect(wordIndex: number) {
    const { [wordIndex]: word } = words;

    // Deselect word
    if (selected.includes(wordIndex)) {
      setConnectors(
        connectors.filter(s => s != wordIndex && s != wordIndex - 1)
      );
      setSelected(selected.filter(s => s != wordIndex));
      setInsights(insights.filter(i => i.text != word));
    }
    // Select word
    else {
      setInsights(insights.concat({ text: word }));
      setSelected(selected.concat(wordIndex));
    }
  }

  return (
    <div>
      {/* Content selector */}
      <div className={classes.selector}>
        {words.map((word, i) => (
          <React.Fragment key={i}>
            <Chip
              size="small"
              label={word}
              variant={selected.includes(i) ? 'default' : 'outlined'}
              onClick={() => onSelect(i)}
              className={classes.chip}
            />
            {selected.includes(i) && selected.includes(i + 1) ? (
              <IconButton
                className={classes.connector}
                onClick={() => onConnect(i)}
                color={connectors.includes(i) ? 'primary' : 'default'}
                size="small"
              >
                <ConnectIcon />
              </IconButton>
            ) : null}
          </React.Fragment>
        ))}
      </div>

      {/* Freestyle-generated insights */}
      <Insights
        onDisableFreestyle={onDisable}
        insights={insights}
        index={index}
      />
    </div>
  );
}
