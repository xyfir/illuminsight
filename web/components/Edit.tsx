import { WithSnackbarProps, withSnackbar } from 'notistack';
import { RouteComponentProps } from 'react-router';
import * as localForage from 'localforage';
import { Insightful } from 'types/insightful';
import * as React from 'react';
import * as JSZip from 'jszip';
import {
  InputAdornment,
  createStyles,
  WithStyles,
  withStyles,
  TextField,
  Button,
  Theme
} from '@material-ui/core';
import {
  BookmarkBorder as BookmarkIcon,
  // DateRange as PublishedIcon,
  People as AuthorsIcon,
  Image as ImageIcon,
  Label as NameIcon,
  Home as PublisherIcon,
  Link as LinkIcon,
  Save as SaveIcon
} from '@material-ui/icons';

const styles = (theme: Theme) =>
  createStyles({
    coverInput: {
      display: 'none'
    },
    root: {
      padding: '1em'
    }
  });

interface EditState {
  entity?: Insightful.Entity;
  cover?: string;
}
type EditProps = WithStyles<typeof styles> &
  RouteComponentProps &
  WithSnackbarProps;

class _Edit extends React.Component<EditProps, EditState> {
  state: EditState = {};
  zip?: JSZip;

  constructor(props: EditProps) {
    super(props);
  }

  componentDidMount() {
    this.loadZip();
  }

  componentWillUnmount() {
    const { cover } = this.state;
    if (cover) URL.revokeObjectURL(cover);
  }

  /**
   * Load zip file for corresponding entity.
   */
  async loadZip() {
    const { enqueueSnackbar, history, match } = this.props;
    const { entityId } = match.params as { entityId: number };

    try {
      // Load file from localForage
      const file = await localForage.getItem(`entity-${entityId}`);
      if (file === null) throw 'Could not load data from storage';

      // Parse zip file and meta
      this.zip = await JSZip.loadAsync(file as Blob);
      const entity: Insightful.Entity = JSON.parse(
        await this.zip.file('meta.json').async('text')
      );

      // Load cover and generate blob url
      let cover;
      if (entity.cover) {
        cover = URL.createObjectURL(
          await this.zip.file(entity.cover).async('blob')
        );
      }

      // Load meta.json
      this.setState({ entity, cover });
    } catch (err) {
      // Notify user of error and send them back
      console.error(err);
      enqueueSnackbar(typeof err == 'string' ? err : 'Cannot read content');
      history.replace('/');
    }
  }

  onResetBookmark() {
    this.onChange('bookmark', {
      element: 0,
      section: 0
    } as Insightful.Entity['bookmark']);
  }

  onUploadCover(file: File) {
    const { entity, cover } = this.state;
    if (!entity || !this.zip) return;

    // Delete cover if not original
    if (entity.cover && !/^res\/\d+\./.test(entity.cover))
      this.zip.remove(entity.cover);

    // Update zip file
    entity.cover = `res/cover.${file.name.split('.').pop()}`;
    this.zip.file(entity.cover, file);
    this.zip.file('meta.json', JSON.stringify(entity));

    // Revoke old cover
    if (cover) URL.revokeObjectURL(cover);

    // Generate cover url
    this.setState({ entity, cover: URL.createObjectURL(file) });
  }

  onChange(prop: keyof Insightful.Entity, value: any) {
    if (!this.state.entity) return;
    this.setState({ entity: { ...this.state.entity, [prop]: value } });
  }

  async onSave() {
    const { entity } = this.state;
    if (!entity || !this.zip) return;

    // Update meta.json
    this.zip.file('meta.json', JSON.stringify(entity));

    // Save file
    await localForage.setItem(
      `entity-${entity.id}`,
      await this.zip.generateAsync({ type: 'blob' })
    );

    // Extract cover if available and save copy outside of zip
    if (entity.cover) {
      await localForage.setItem(
        `entity-cover-${entity.id}`,
        await this.zip.file(entity.cover).async('blob')
      );
    }

    // Save entity-list
    const entities: Insightful.Entity[] = await localForage.getItem(
      'entity-list'
    );
    const index = entities.findIndex(e => e.id == entity.id) as number;
    entities[index] = entity;
    await localForage.setItem('entity-list', entities);
  }

  render() {
    const { entity, cover } = this.state;
    const { classes } = this.props;
    if (!entity) return null;

    return (
      <form className={classes.root}>
        <TextField
          id="name"
          label="Name"
          value={entity.name}
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
          value={entity.authors}
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
          value={entity.publisher}
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
          value={entity.link}
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

        {cover ? <img src={cover} /> : null}
        <input
          id="cover-input"
          type="file"
          multiple
          onChange={e => this.onUploadCover((e.target.files as FileList)[0])}
          className={classes.coverInput}
        />
        <label htmlFor="cover-input">
          <Button variant="text" component="span" color="secondary">
            <ImageIcon />
            Set Cover
          </Button>
        </label>

        <Button
          onClick={() => this.onResetBookmark()}
          variant="contained"
          color="primary"
        >
          <BookmarkIcon />
          Reset Bookmark
        </Button>

        <Button
          onClick={() => this.onSave()}
          variant="contained"
          color="primary"
        >
          <SaveIcon />
          Save
        </Button>
      </form>
    );
  }
}

export const Edit = withStyles(styles)(withSnackbar(_Edit));
