import * as React from 'react';
import {
  InputAdornment,
  ListItemText,
  createStyles,
  IconButton,
  WithStyles,
  withStyles,
  TextField,
  ListItem,
  Button,
  List
} from '@material-ui/core';
import {
  InsertDriveFile as FileIcon,
  RemoveCircle as RemoveIcon,
  TextFields as TextIcon,
  Link as LinkIcon,
  Add as AddIcon
} from '@material-ui/icons';

const styles = createStyles({
  fileInput: {
    display: 'none'
  },
  fieldset: {
    marginBottom: '1.5em',
    padding: '0',
    border: 'none',
    margin: '0'
  }
});

function _Import({ classes }: WithStyles<typeof styles>) {
  const [files, setFiles] = React.useState<File[]>([]);
  const [link, setLink] = React.useState('');
  const [text, setText] = React.useState('');

  function onImportFiles() {}

  function onImportLink() {}

  function onImportText() {}

  return (
    <form onSubmit={e => e.preventDefault()}>
      <fieldset className={classes.fieldset}>
        <input
          id="file-input"
          type="file"
          multiple
          onChange={e =>
            setFiles(
              files.concat(
                [...(e.target.files as FileList)].filter(
                  f => files.findIndex(_f => f.name == _f.name) == -1
                )
              )
            )
          }
          className={classes.fileInput}
        />
        <label htmlFor="file-input">
          <Button variant="text" component="span" color="secondary">
            <FileIcon />
            Upload File
          </Button>
        </label>

        {files.length ? (
          <List dense>
            {files.map(f => (
              <ListItem key={f.name}>
                <IconButton
                  aria-label="Remove"
                  onClick={() =>
                    setFiles(files.filter(_f => _f.name != f.name))
                  }
                >
                  <RemoveIcon />
                </IconButton>
                <ListItemText primary={f.name} secondary={`${f.size} bytes`} />
              </ListItem>
            ))}
          </List>
        ) : null}

        <Button
          disabled={!files.length}
          onClick={onImportFiles}
          variant="text"
          color="primary"
        >
          <AddIcon />
          Import from Files
        </Button>
      </fieldset>

      <fieldset className={classes.fieldset}>
        <TextField
          id="link"
          label="Link"
          value={link}
          margin="normal"
          variant="outlined"
          onChange={e => setLink(e.target.value)}
          fullWidth
          onKeyDown={e => (e.key == 'Enter' ? onImportLink() : null)}
          helperText="Import article content from a web page"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LinkIcon />
              </InputAdornment>
            )
          }}
          placeholder="https://example.com/article-123"
        />
        <Button
          disabled={!link}
          onClick={onImportLink}
          variant="text"
          color="primary"
        >
          <AddIcon />
          Import from Link
        </Button>
      </fieldset>

      <fieldset className={classes.fieldset}>
        <TextField
          id="text"
          label="Text"
          value={text}
          margin="normal"
          rowsMax={5}
          variant="outlined"
          onChange={e => setText(e.target.value)}
          fullWidth
          multiline
          onKeyDown={e => (e.key == 'Enter' ? onImportText() : null)}
          helperText="Paste text content"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <TextIcon />
              </InputAdornment>
            )
          }}
          placeholder="Paste content here..."
        />
        <Button
          disabled={!text}
          onClick={onImportText}
          variant="text"
          color="primary"
        >
          <AddIcon />
          Import from Text
        </Button>
      </fieldset>
    </form>
  );
}

export const Import = withStyles(styles)(_Import);
