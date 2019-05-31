import { GeneralToolbar } from 'components/app/GeneralToolbar';
import * as localForage from 'localforage';
import { useSnackbar } from 'notistack';
import { Insightful } from 'types/insightful';
import { getYear } from 'date-fns';
import * as JSZip from 'jszip';
import * as React from 'react';
import { api } from 'lib/app/api';
import {
  LinearProgress,
  InputAdornment,
  ListItemText,
  createStyles,
  IconButton,
  Typography,
  WithStyles,
  withStyles,
  TextField,
  ListItem,
  Button,
  Theme,
  List
} from '@material-ui/core';
import {
  InsertDriveFile as FileIcon,
  RemoveCircle as RemoveIcon,
  TextFields as TextIcon,
  Link as LinkIcon,
  Add as AddIcon
} from '@material-ui/icons';

const styles = (theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(3)
    },
    fileInput: {
      display: 'none'
    },
    fieldset: {
      marginBottom: '1.5em',
      padding: '0',
      border: 'none',
      margin: '0'
    },
    importingText: {
      fontWeight: 'bold',
      marginBottom: '1em',
      fontSize: '125%'
    },
    importingContainer: {
      marginBottom: '2em'
    }
  });

function _Import({ classes }: WithStyles<typeof styles>) {
  const { enqueueSnackbar } = useSnackbar();
  const [files, setFiles] = React.useState<File[]>([]);
  const [link, setLink] = React.useState('');
  const [text, setText] = React.useState('');
  const [busy, setBusy] = React.useState(false);

  async function onImportFiles() {
    setBusy(true);
    for (let file of files) {
      await onImportFile(file);
    }
    setBusy(false);
  }

  async function onImportFile(file: File) {
    const data = new FormData();
    data.append('file', file);

    return api
      .post('/convert', data, { responseType: 'arraybuffer' })
      .then(res => {
        saveFile(res.data);
        setFiles(files.filter(_f => _f.name != file.name));
      })
      .catch(err => {
        err.response && enqueueSnackbar(err.response.data.error);
      });
  }

  async function onImportLink() {
    setBusy(true);
    await api
      .post('/convert', { link }, { responseType: 'arraybuffer' })
      .then(res => {
        saveFile(res.data);
        setLink('');
      })
      .catch(err => err.response && enqueueSnackbar(err.response.data.error));
    setBusy(false);
  }

  async function onImportText() {
    setBusy(true);
    await api
      .post('/convert', { text }, { responseType: 'arraybuffer' })
      .then(res => {
        saveFile(res.data);
        setText('');
      })
      .catch(err => err.response && enqueueSnackbar(err.response.data.error));
    setBusy(false);
  }

  async function saveFile(file: Blob) {
    // Parse zip file
    const zip = await JSZip.loadAsync(file);

    // Extract meta.json
    const pub: Insightful.Pub = JSON.parse(
      await zip.file('meta.json').async('text')
    );

    // Ensure we can handle the returned file
    if (pub.version != process.enve.ASTPUB_VERSION)
      return enqueueSnackbar('Client/server ASTPub version mismatch');

    // Extract cover if available and save copy outside of zip
    if (pub.cover) {
      await localForage.setItem(
        `pub-cover-${pub.id}`,
        await zip.file(pub.cover).async('blob')
      );
    }

    // Get indexes from local storage which we'll use and update
    const pubs: Insightful.Pub[] =
      (await localForage.getItem('pub-list')) || [];
    const tags: Insightful.Tag[] =
      (await localForage.getItem('tag-list')) || [];

    // Automatically infer tags from meta.json
    let inferredTags: string[] = [];

    // Create tags from authors
    if (pub.authors) {
      // Use entire author string as a tag
      inferredTags.push(pub.authors);

      // Use individual authors as tags
      const authors = pub.authors.split(' & ');
      if (authors.length > 1) inferredTags = inferredTags.concat(authors);
    }

    // Create tag from publisher
    if (pub.publisher) inferredTags.push(pub.publisher);

    // Create tag from published date (year)
    if (pub.published) inferredTags.push(getYear(pub.published).toString());

    // Create tag from link (domain)
    if (pub.link) {
      const a = document.createElement('a');
      a.href = pub.link;
      inferredTags.push(a.hostname);
    }

    // Force lowercase
    // Replace spaces with hyphens
    // Remove duplicates
    inferredTags = Array.from(
      new Set(
        inferredTags
          .map(t => t.toLocaleLowerCase())
          .map(t => t.replace(/\s+/g, '-'))
      )
    );

    // Convert inferredTags to actual tags in tag-list
    // Link tags to pub and insert into meta.json
    let id = Date.now();
    for (let inferredTag of inferredTags) {
      // Check if this tag already exists
      const tag = tags.find(t => t.name == inferredTag);

      // Link to existing tag
      if (tag) {
        pub.tags.push(tag.id);
      }
      // Create and link new tag
      else {
        const tag: Insightful.Tag = { name: inferredTag, id: id++ };
        pub.tags.push(tag.id);
        tags.push(tag);
      }
    }

    // Add to and update local storage
    zip.file('meta.json', JSON.stringify(pub));
    pubs.push(pub);
    await localForage.setItem(
      `pub-${pub.id}`,
      await zip.generateAsync({ type: 'blob' })
    );
    await localForage.setItem('tag-list', tags);
    await localForage.setItem('pub-list', pubs);

    enqueueSnackbar(`${pub.name} added to library`);
  }

  return (
    <form onSubmit={e => e.preventDefault()} className={classes.root}>
      <GeneralToolbar />

      {busy ? (
        <div className={classes.importingContainer}>
          <Typography className={classes.importingText}>
            Importing content. This may take a while...
          </Typography>
          <LinearProgress />
        </div>
      ) : null}

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
          disabled={!files.length || busy}
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
          disabled={!link || busy}
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
          disabled={!text || busy}
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
