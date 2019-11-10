import { useRouteMatch, useHistory } from 'react-router-dom';
import { GeneralToolbar } from 'components/app/GeneralToolbar';
import { Illuminsight } from 'types';
import { useSnackbar } from 'notistack';
import localForage from 'localforage';
import * as React from 'react';
import ISO6391 from 'iso-639-1';
import JSZip from 'jszip';
import {
  InputAdornment,
  createStyles,
  IconButton,
  makeStyles,
  Typography,
  TextField,
  Button,
  Chip,
} from '@material-ui/core';
import {
  BookmarkBorder as BookmarkIcon,
  DeleteForever as DeleteIcon,
  GroupWork as SeriesIcon,
  People as AuthorsIcon,
  Image as ImageIcon,
  Label as NameIcon,
  Home as PublisherIcon,
  Save as SaveIcon,
  Add as AddIcon,
} from '@material-ui/icons';

const useStyles = makeStyles(() =>
  createStyles({
    coverContainer: {
      flexDirection: 'column',
      alignItems: 'center',
      display: 'flex',
    },
    coverInput: {
      display: 'none',
    },
    bookmark: {
      alignItems: 'center',
      display: 'flex',
      margin: '2em 0',
    },
    buttons: {
      justifyContent: 'center',
      display: 'flex',
      '& > button': {
        margin: '0.5em',
      },
    },
    add: {
      alignItems: 'center',
      display: 'flex',
      '& > button': {
        marginLeft: '0.3em',
      },
    },
    cover: {
      maxWidth: '10em',
      margin: '0.5em 0',
    },
    chip: {
      marginBottom: '0.5em',
      marginRight: '0.5em',
    },
    root: {
      padding: '1em',
    },
  }),
);

let zip: JSZip | undefined;

export function Edit(): JSX.Element | null {
  const [language, setLanguage] = React.useState<
    Illuminsight.Pub['languages'][0]
  >('');
  const { enqueueSnackbar } = useSnackbar();
  const [cover, setCover] = React.useState<string | undefined>();
  const [tags, setTags] = React.useState<Illuminsight.Tag[]>([]);
  const [pub, setPub] = React.useState<Illuminsight.Pub | null>(null);
  const [tag, setTag] = React.useState('');
  const history = useHistory();
  const classes = useStyles();
  const match = useRouteMatch();

  function onChange(prop: keyof Illuminsight.Pub, value: any): void {
    if (pub) setPub({ ...pub, [prop]: value });
  }

  function onResetBookmark(): void {
    onChange('bookmark', {
      element: 0,
      section: 0,
    } as Illuminsight.Pub['bookmark']);
  }

  function onUploadCover(file: File): void {
    if (!pub || !zip) return;

    // Delete cover if not original
    if (pub.cover && !/^res\/\d+\./.test(pub.cover)) zip.remove(pub.cover);

    // Update zip file
    pub.cover = `res/cover.${file.name.split('.').pop()}`;
    zip.file(pub.cover, file);
    zip.file('meta.json', JSON.stringify(pub));

    // Revoke old cover
    if (cover) URL.revokeObjectURL(cover);

    // Generate cover url
    setPub(pub);
    setCover(URL.createObjectURL(file));
  }

  function onAddLanguage(): void {
    const code = ISO6391.getCode(language);
    if (!code) return;

    // Add language to pub
    if (!pub!.languages.includes(code)) pub!.languages.push(code);

    setPub(pub);
  }

  function onAddTag(): void {
    const name = tag.toLowerCase().replace(/\s+/g, '-');

    // Check if tag already exists
    let _tag = tags.find((t) => t.name == name);

    // Create new tag
    if (!_tag) {
      _tag = { id: Date.now(), name };
      tags.push(_tag);
    }

    // Add tag to pub
    if (!pub!.tags.includes(_tag.id)) pub!.tags.push(_tag.id);

    setTags(tags);
    setTag('');
  }

  async function saveTags(pubs: Illuminsight.Pub[]): Promise<void> {
    let _tags = tags.slice();
    // Delete orphaned tags
    for (const tag of _tags) {
      if (pubs.findIndex((p) => p.tags.includes(tag.id)) == -1)
        _tags = _tags.filter((t) => t.id != tag.id);
    }
    await localForage.setItem('tag-list', _tags);
  }

  async function onDelete(): Promise<void> {
    if (!pub) return;

    // Remove pub from list
    let pubs: Illuminsight.Pub[] = await localForage.getItem('pub-list');
    pubs = pubs.filter((p) => p.id != pub.id);
    await localForage.setItem('pub-list', pubs);

    // Delete pub files
    await localForage.removeItem(`pub-${pub.id}`);
    await localForage.removeItem(`pub-cover-${pub.id}`);

    // Update tags
    await saveTags(pubs);

    // Take us home and notify user
    history.replace('/');
    enqueueSnackbar(`${pub.name} was deleted`);
  }

  async function onSave(): Promise<void> {
    if (!pub || !zip) return;

    // Update meta.json
    zip.file('meta.json', JSON.stringify(pub));

    // Save file
    await localForage.setItem(
      `pub-${pub.id}`,
      await zip.generateAsync({ type: 'blob' }),
    );

    // Extract cover if available and save copy outside of zip
    if (pub.cover) {
      await localForage.setItem(
        `pub-cover-${pub.id}`,
        await zip.file(pub.cover).async('blob'),
      );
    }

    // Save pub-list
    const pubs: Illuminsight.Pub[] = await localForage.getItem('pub-list');
    const index = pubs.findIndex((p) => p.id == pub.id);
    pubs[index] = pub;
    await localForage.setItem('pub-list', pubs);

    // Update tags and notify user
    await saveTags(pubs);
    enqueueSnackbar(`${pub.name} was updated`);
  }

  async function onMount(): Promise<void> {
    const { pubId } = match!.params as { pubId: number };

    try {
      // Load from localForage
      const file: Blob = await localForage.getItem(`pub-${pubId}`);
      if (file === null) throw 'Could not load data from storage';
      const tags: Illuminsight.Tag[] = await localForage.getItem('tag-list');

      // Parse zip file and meta
      zip = await JSZip.loadAsync(file);
      const pub: Illuminsight.Pub = JSON.parse(
        await zip.file('meta.json').async('text'),
      );

      // Load cover and generate blob url
      let cover;
      if (pub.cover) {
        cover = URL.createObjectURL(await zip.file(pub.cover).async('blob'));
      }

      // Set state
      setCover(cover);
      setTags(tags);
      setPub(pub);
    } catch (err) {
      // Notify user of error and send them back
      console.error(err);
      enqueueSnackbar(typeof err == 'string' ? err : 'Cannot read content');
      history.replace('/');
    }
  }

  function onUnmount(): void {
    if (cover) URL.revokeObjectURL(cover);
    zip = undefined;
  }

  React.useEffect(() => {
    onMount();
    return onUnmount;
  }, []);

  if (!pub) return null;

  return (
    <form className={classes.root}>
      <GeneralToolbar />

      <TextField
        id="name"
        label="Name"
        value={pub.name}
        margin="normal"
        variant="outlined"
        onChange={(e): void => onChange('name', e.target.value)}
        fullWidth
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <NameIcon />
            </InputAdornment>
          ),
        }}
        placeholder="A Tale of Two Cities"
      />

      <TextField
        id="authors"
        label="Author(s)"
        value={pub.authors}
        margin="normal"
        variant="outlined"
        onChange={(e): void => onChange('authors', e.target.value)}
        fullWidth
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <AuthorsIcon />
            </InputAdornment>
          ),
        }}
        placeholder="Ernest Hemingway"
      />

      <TextField
        id="series"
        label="Series"
        value={pub.series}
        margin="normal"
        variant="outlined"
        onChange={(e): void => onChange('series', e.target.value)}
        fullWidth
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SeriesIcon />
            </InputAdornment>
          ),
        }}
        placeholder="The Lord of the Rings"
      />

      <TextField
        id="publisher"
        label="Publisher"
        value={pub.publisher}
        margin="normal"
        variant="outlined"
        onChange={(e): void => onChange('publisher', e.target.value)}
        fullWidth
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <PublisherIcon />
            </InputAdornment>
          ),
        }}
        placeholder="Penguin Random House"
      />

      <div className={classes.coverContainer}>
        {cover ? <img src={cover} className={classes.cover} /> : null}
        <input
          id="cover-input"
          type="file"
          multiple
          onChange={(e): void => onUploadCover((e.target.files as FileList)[0])}
          className={classes.coverInput}
        />
        <label htmlFor="cover-input">
          <Button variant="text" component="span">
            <ImageIcon />
            Set Cover
          </Button>
        </label>
      </div>

      <div className={classes.add}>
        <TextField
          id="tag"
          label="Tag"
          value={tag}
          margin="normal"
          variant="outlined"
          onChange={(e): void => setTag(e.target.value)}
          fullWidth
          placeholder="#tag"
        />
        <IconButton aria-label="Add tag" onClick={onAddTag} color="primary">
          <AddIcon />
        </IconButton>
      </div>

      <div>
        {pub.tags.map((tag) => (
          <Chip
            className={classes.chip}
            onDelete={(): void =>
              onChange(
                'tags',
                pub.tags.filter((t) => t != tag),
              )
            }
            label={`#${tags.find((t) => t.id == tag)!.name}`}
            key={tag}
          />
        ))}
      </div>

      <div className={classes.add}>
        <TextField
          id="languages"
          label="Language"
          value={language}
          margin="normal"
          variant="outlined"
          onChange={(e): void => setLanguage(e.target.value)}
          fullWidth
          placeholder="Language"
        />
        <IconButton
          aria-label="Add language"
          onClick={onAddLanguage}
          color="primary"
        >
          <AddIcon />
        </IconButton>
      </div>

      <div>
        {pub.languages.map((lang) => (
          <Chip
            className={classes.chip}
            onDelete={(): void =>
              onChange(
                'languages',
                pub.languages.filter((l) => l != lang),
              )
            }
            label={ISO6391.getName(lang)}
            key={lang}
          />
        ))}
      </div>

      {pub.bookmark.section != 0 || pub.bookmark.element != 0 ? (
        <div className={classes.bookmark}>
          <Button onClick={onResetBookmark} variant="text">
            <BookmarkIcon />
            Remove
          </Button>
          <Typography>
            bookmark at section <strong>#{pub.bookmark.section + 1}</strong>,
            element <strong>#{pub.bookmark.element}</strong>.
          </Typography>
        </div>
      ) : null}

      <div className={classes.buttons}>
        <Button onClick={onSave} variant="contained" color="primary">
          <SaveIcon />
          Update
        </Button>

        <Button onClick={onDelete} variant="contained" color="secondary">
          <DeleteIcon />
          Delete
        </Button>
      </div>
    </form>
  );
}
