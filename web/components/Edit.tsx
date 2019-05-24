import { WithSnackbarProps, withSnackbar } from 'notistack';
import { RouteComponentProps } from 'react-router';
import * as localForage from 'localforage';
import { Insightful } from 'types/insightful';
import * as React from 'react';
import * as JSZip from 'jszip';
import {
  InputAdornment,
  createStyles,
  ListItemText,
  IconButton,
  WithStyles,
  withStyles,
  TextField,
  ListItem,
  Button,
  Theme,
  List
} from '@material-ui/core';
import {
  BookmarkBorder as BookmarkIcon,
  DeleteForever as DeleteIcon,
  RemoveCircle as RemoveIcon,
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
  tags: Insightful.Tag[];
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
    const { entityId } = match.params as { entityId: number };

    try {
      // Load from localForage
      const file: Blob = await localForage.getItem(`entity-${entityId}`);
      if (file === null) throw 'Could not load data from storage';
      const tags: Insightful.Tag[] = await localForage.getItem('tag-list');

      // Parse zip file and meta
      this.zip = await JSZip.loadAsync(file);
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

      // Set state
      this.setState({ entity, cover, tags });
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

  onAddTag() {
    const { entity, tags, tag } = this.state;

    // Check if tag already exists
    let _tag = tags.find(t => t.name == tag);

    // Create new tag
    if (!_tag) {
      _tag = { id: Date.now(), name: tag };
      tags.push(_tag);
    }

    // Add tag to entity
    if (!entity!.tags.includes(_tag.id)) entity!.tags.push(_tag.id);

    this.setState({ tags });
  }

  async onDelete() {
    const entity = this.state.entity!;

    // Remove entity from list
    let entities: Insightful.Entity[] = await localForage.getItem(
      'entity-list'
    );
    entities = entities.filter(e => e.id != entity.id);
    await localForage.setItem('entity-list', entities);

    // Delete entity files
    await localForage.removeItem(`entity-${entity.id}`);
    await localForage.removeItem(`entity-cover-${entity.id}`);

    // Update tags
    await this.saveTags(entities);

    // Take us home
    this.props.history.replace('/');
  }

  onChange(prop: keyof Insightful.Entity, value: any) {
    const entity = this.state.entity!;
    this.setState({ entity: { ...entity, [prop]: value } });
  }

  async onSave() {
    const { entity, tags } = this.state;
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
    const index = entities.findIndex(e => e.id == entity.id);
    entities[index] = entity;
    await localForage.setItem('entity-list', entities);

    // Update tags
    await this.saveTags(entities);
  }

  async saveTags(entities: Insightful.Entity[]) {
    // Delete orphaned tags
    let tags = this.state.tags!;
    for (let tag of tags) {
      if (entities.findIndex(e => e.tags.includes(tag.id)) == -1)
        tags = tags.filter(t => t.id != tag.id);
    }
    await localForage.setItem('tag-list', tags);
  }

  render() {
    const { entity, cover, tags, tag } = this.state;
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
          <Button variant="text" component="span">
            <ImageIcon />
            Set Cover
          </Button>
        </label>

        <Button onClick={() => this.onResetBookmark()} variant="contained">
          <BookmarkIcon />
          Reset Bookmark
        </Button>

        <TextField
          id="tag"
          label="Tag"
          value={tag}
          margin="normal"
          variant="outlined"
          onChange={e => this.setState({ tag: e.target.value.toLowerCase() })}
          fullWidth
        />
        <Button onClick={() => this.onAddTag()} variant="text">
          Add Tag
        </Button>
        <List dense>
          {entity.tags.map(tag => (
            <ListItem key={tag}>
              <IconButton
                aria-label="Remove"
                onClick={() =>
                  this.onChange('tags', entity.tags.filter(t => t != tag))
                }
              >
                <RemoveIcon />
              </IconButton>
              <ListItemText primary={`#${tags.find(t => t.id == tag)!.name}`} />
            </ListItem>
          ))}
        </List>

        <Button
          onClick={() => this.onDelete()}
          variant="contained"
          color="secondary"
        >
          <DeleteIcon />
          Delete
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
