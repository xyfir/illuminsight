import { WithSnackbarProps, withSnackbar } from 'notistack';
import { RouteComponentProps } from 'react-router';
import { GeneralToolbar } from 'components/app/GeneralToolbar';
import * as localForage from 'localforage';
import { Illuminsight } from 'types/illuminsight';
import * as React from 'react';
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
  Chip
} from '@material-ui/core';
import {
  BookmarkBorder as BookmarkIcon,
  DeleteForever as DeleteIcon,
  // DateRange as PublishedIcon,
  People as AuthorsIcon,
  Image as ImageIcon,
  Label as NameIcon,
  Home as PublisherIcon,
  Link as LinkIcon,
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
    buttons: {
      justifyContent: 'center',
      display: 'flex',
      '& > button': {
        margin: '0.5em'
      }
    },
    addTag: {
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
  pub?: Illuminsight.Pub;
  cover?: string;
  tags: Illuminsight.Tag[];
  tag: string;
}
type EditProps = WithStyles<typeof styles> &
  RouteComponentProps &
  WithSnackbarProps;

class _Edit extends React.Component<EditProps, EditState> {
  state: EditState = { tags: [], tag: '' };
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
    const { pub, cover, tags, tag } = this.state;
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

        <TextField
          id="link"
          label="Link"
          value={pub.link}
          margin="normal"
          variant="outlined"
          onChange={e => this.onChange('link', e.target.value)}
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LinkIcon />
              </InputAdornment>
            )
          }}
          placeholder="https://example.com/article-123"
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

        <div className={classes.addTag}>
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

        <div className={classes.buttons}>
          <Button
            onClick={() => this.onSave()}
            variant="contained"
            color="primary"
          >
            <SaveIcon />
            Update
          </Button>

          <Button onClick={() => this.onResetBookmark()} variant="contained">
            <BookmarkIcon />
            Reset Bookmark
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
