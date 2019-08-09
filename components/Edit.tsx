import { WithSnackbarProps, withSnackbar } from 'notistack';
import { RouteComponentProps } from 'react-router';
import { GeneralToolbar } from 'components/app/GeneralToolbar';
import { Illuminsight } from 'types';
import localForage from 'localforage';
import * as React from 'react';
import ISO6391 from 'iso-639-1';
import JSZip from 'jszip';
import {
  InputAdornment,
  createStyles,
  IconButton,
  WithStyles,
  withStyles,
  TextField,
  Button,
  Theme,
  Chip,
  Typography
} from '@material-ui/core';
import {
  BookmarkBorder as BookmarkIcon,
  DeleteForever as DeleteIcon,
  // DateRange as PublishedIcon,
  People as AuthorsIcon,
  GroupWork as SeriesIcon,
  Image as ImageIcon,
  Label as NameIcon,
  Home as PublisherIcon,
  Save as SaveIcon,
  Add as AddIcon
} from '@material-ui/icons';

const styles = (theme: Theme) =>
  createStyles({
    coverContainer: {
      flexDirection: 'column',
      alignItems: 'center',
      display: 'flex'
    },
    coverInput: {
      display: 'none'
    },
    bookmark: {
      alignItems: 'center',
      display: 'flex',
      margin: '2em 0'
    },
    buttons: {
      justifyContent: 'center',
      display: 'flex',
      '& > button': {
        margin: '0.5em'
      }
    },
    add: {
      alignItems: 'center',
      display: 'flex',
      '& > button': {
        marginLeft: '0.3em'
      }
    },
    cover: {
      maxWidth: '10em',
      margin: '0.5em 0'
    },
    chip: {
      marginBottom: '0.5em',
      marginRight: '0.5em'
    },
    root: {
      padding: '1em'
    }
  });

interface EditState {
  language: Illuminsight.Pub['languages'][0];
  cover?: string;
  tags: Illuminsight.Tag[];
  pub?: Illuminsight.Pub;
  tag: string;
}
type EditProps = WithStyles<typeof styles> &
  RouteComponentProps &
  WithSnackbarProps;

class _Edit extends React.Component<EditProps, EditState> {
  state: EditState = { language: '', tags: [], tag: '' };
  zip?: JSZip;

  constructor(props: EditProps) {
    super(props);
  }

  async componentDidMount() {
    const { enqueueSnackbar, history, match } = this.props;
    const { pubId } = match.params as { pubId: number };

    try {
      // Load from localForage
      const file: Blob = await localForage.getItem(`pub-${pubId}`);
      if (file === null) throw 'Could not load data from storage';
      const tags: Illuminsight.Tag[] = await localForage.getItem('tag-list');

      // Parse zip file and meta
      this.zip = await JSZip.loadAsync(file);
      const pub: Illuminsight.Pub = JSON.parse(
        await this.zip.file('meta.json').async('text')
      );

      // Load cover and generate blob url
      let cover;
      if (pub.cover) {
        cover = URL.createObjectURL(
          await this.zip.file(pub.cover).async('blob')
        );
      }

      // Set state
      this.setState({ pub, cover, tags });
    } catch (err) {
      // Notify user of error and send them back
      console.error(err);
      enqueueSnackbar(typeof err == 'string' ? err : 'Cannot read content');
      history.replace('/');
    }
  }

  componentWillUnmount() {
    const { cover } = this.state;
    if (cover) URL.revokeObjectURL(cover);
  }

  onResetBookmark() {
    this.onChange('bookmark', {
      element: 0,
      section: 0
    } as Illuminsight.Pub['bookmark']);
  }

  onUploadCover(file: File) {
    const { pub, cover } = this.state;
    if (!pub || !this.zip) return;

    // Delete cover if not original
    if (pub.cover && !/^res\/\d+\./.test(pub.cover)) this.zip.remove(pub.cover);

    // Update zip file
    pub.cover = `res/cover.${file.name.split('.').pop()}`;
    this.zip.file(pub.cover, file);
    this.zip.file('meta.json', JSON.stringify(pub));

    // Revoke old cover
    if (cover) URL.revokeObjectURL(cover);

    // Generate cover url
    this.setState({ pub, cover: URL.createObjectURL(file) });
  }

  onAddLanguage() {
    const { language, pub } = this.state;
    const code = ISO6391.getCode(language);
    if (!code) return;

    // Add language to pub
    if (!pub!.languages.includes(code)) pub!.languages.push(code);

    this.setState({ pub });
  }

  onAddTag() {
    const { pub, tags, tag } = this.state;
    const name = tag.toLowerCase().replace(/\s+/g, '-');

    // Check if tag already exists
    let _tag = tags.find(t => t.name == name);

    // Create new tag
    if (!_tag) {
      _tag = { id: Date.now(), name };
      tags.push(_tag);
    }

    // Add tag to pub
    if (!pub!.tags.includes(_tag.id)) pub!.tags.push(_tag.id);

    this.setState({ tags, tag: '' });
  }

  async onDelete() {
    const { enqueueSnackbar, history } = this.props;
    const pub = this.state.pub!;

    // Remove pub from list
    let pubs: Illuminsight.Pub[] = await localForage.getItem('pub-list');
    pubs = pubs.filter(p => p.id != pub.id);
    await localForage.setItem('pub-list', pubs);

    // Delete pub files
    await localForage.removeItem(`pub-${pub.id}`);
    await localForage.removeItem(`pub-cover-${pub.id}`);

    // Update tags
    await this.saveTags(pubs);

    // Take us home and notify user
    history.replace('/');
    // enqueueSnackbar(`${pub.name} was deleted`);
  }

  onChange(prop: keyof Illuminsight.Pub, value: any) {
    const pub = this.state.pub!;
    this.setState({ pub: { ...pub, [prop]: value } });
  }

  async onSave() {
    const { pub } = this.state;
    if (!pub || !this.zip) return;
    const { enqueueSnackbar } = this.props;

    // Update meta.json
    this.zip.file('meta.json', JSON.stringify(pub));

    // Save file
    await localForage.setItem(
      `pub-${pub.id}`,
      await this.zip.generateAsync({ type: 'blob' })
    );

    // Extract cover if available and save copy outside of zip
    if (pub.cover) {
      await localForage.setItem(
        `pub-cover-${pub.id}`,
        await this.zip.file(pub.cover).async('blob')
      );
    }

    // Save pub-list
    const pubs: Illuminsight.Pub[] = await localForage.getItem('pub-list');
    const index = pubs.findIndex(p => p.id == pub.id);
    pubs[index] = pub;
    await localForage.setItem('pub-list', pubs);

    // Update tags and notify user
    await this.saveTags(pubs);
    // enqueueSnackbar(`${pub.name} was updated`);
  }

  async saveTags(pubs: Illuminsight.Pub[]) {
    // Delete orphaned tags
    let tags = this.state.tags!;
    for (let tag of tags) {
      if (pubs.findIndex(p => p.tags.includes(tag.id)) == -1)
        tags = tags.filter(t => t.id != tag.id);
    }
    await localForage.setItem('tag-list', tags);
  }

  render() {
    const { language, cover, tags, tag, pub } = this.state;
    const { classes } = this.props;
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
          onChange={e => this.onChange('name', e.target.value)}
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <NameIcon />
              </InputAdornment>
            )
          }}
          placeholder="A Tale of Two Cities"
        />

        <TextField
          id="authors"
          label="Author(s)"
          value={pub.authors}
          margin="normal"
          variant="outlined"
          onChange={e => this.onChange('authors', e.target.value)}
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <AuthorsIcon />
              </InputAdornment>
            )
          }}
          placeholder="Ernest Hemingway"
        />

        <TextField
          id="series"
          label="Series"
          value={pub.series}
          margin="normal"
          variant="outlined"
          onChange={e => this.onChange('series', e.target.value)}
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SeriesIcon />
              </InputAdornment>
            )
          }}
          placeholder="The Lord of the Rings"
        />

        <TextField
          id="publisher"
          label="Publisher"
          value={pub.publisher}
          margin="normal"
          variant="outlined"
          onChange={e => this.onChange('publisher', e.target.value)}
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <PublisherIcon />
              </InputAdornment>
            )
          }}
          placeholder="Penguin Random House"
        />

        <div className={classes.coverContainer}>
          {cover ? <img src={cover} className={classes.cover} /> : null}
          <input
            id="cover-input"
            type="file"
            multiple
            onChange={e => this.onUploadCover((e.target.files as FileList)[0])}
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
            onChange={e => this.setState({ tag: e.target.value })}
            fullWidth
            placeholder="#tag"
          />
          <IconButton
            aria-label="Add tag"
            onClick={() => this.onAddTag()}
            color="primary"
          >
            <AddIcon />
          </IconButton>
        </div>

        <div>
          {pub.tags.map(tag => (
            <Chip
              className={classes.chip}
              onDelete={() =>
                this.onChange('tags', pub.tags.filter(t => t != tag))
              }
              label={`#${tags.find(t => t.id == tag)!.name}`}
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
            onChange={e => this.setState({ language: e.target.value })}
            fullWidth
            placeholder="Language"
          />
          <IconButton
            aria-label="Add language"
            onClick={() => this.onAddLanguage()}
            color="primary"
          >
            <AddIcon />
          </IconButton>
        </div>

        <div>
          {pub.languages.map(lang => (
            <Chip
              className={classes.chip}
              onDelete={() =>
                this.onChange('languages', pub.languages.filter(l => l != lang))
              }
              label={ISO6391.getName(lang)}
            />
          ))}
        </div>

        {pub.bookmark.section != 0 || pub.bookmark.element != 0 ? (
          <div className={classes.bookmark}>
            <Button onClick={() => this.onResetBookmark()} variant="text">
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
          <Button
            onClick={() => this.onSave()}
            variant="contained"
            color="primary"
          >
            <SaveIcon />
            Update
          </Button>

          <Button
            onClick={() => this.onDelete()}
            variant="contained"
            color="secondary"
          >
            <DeleteIcon />
            Delete
          </Button>
        </div>
      </form>
    );
  }
}

export const Edit = withStyles(styles)(withSnackbar(_Edit));
