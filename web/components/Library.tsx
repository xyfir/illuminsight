import { Search as SearchIcon, Star as StarIcon } from '@material-ui/icons';
import { formatRelative } from 'date-fns';
import * as localForage from 'localforage';
import { Insightful } from 'types/insightful';
import * as React from 'react';
import { Cover } from 'components/Cover';
import * as Fuse from 'fuse.js';
import { Link } from 'react-router-dom';
import {
  ListItemAvatar,
  InputAdornment,
  createStyles,
  ListItemText,
  WithStyles,
  Typography,
  withStyles,
  TextField,
  ListItem,
  Avatar,
  Theme,
  Chip,
  List
} from '@material-ui/core';

const styles = (theme: Theme) =>
  createStyles({
    entityName: {
      fontSize: '150%',
      display: 'flex'
    },
    entityInfo: {
      color: theme.palette.grey[500]
    },
    entity: {
      textDecoration: 'none'
    }
  });

function _Library({ classes }: WithStyles<typeof styles>) {
  const [selectedTags, setSelectedTags] = React.useState<
    Insightful.Tag['id'][]
  >([]);
  const [entities, setEntities] = React.useState<Insightful.Entity[]>([]);
  const [search, setSearch] = React.useState('');
  const [tags, setTags] = React.useState<Insightful.Tag[]>([]);
  const now = new Date();

  // Load entities and tags from local storage on mount
  React.useEffect(() => {
    localForage
      .getItem('tag-list')
      .then(tags => {
        if (tags !== null) setTags(tags as Insightful.Tag[]);
        return localForage.getItem('entity-list');
      })
      .then(entities => setEntities((entities as Insightful.Entity[]) || []))
      .catch(() => undefined);
  }, []);

  // Filter by tags
  let matches = selectedTags.length
    ? entities.filter(
        entity => entity.tags.findIndex(tag => selectedTags.includes(tag)) > -1
      )
    : entities;

  // Filter by search
  if (search) {
    const fuse = new Fuse(matches, {
      shouldSort: true,
      threshold: 0.4,
      keys: ['name', 'link', 'authors', 'published', 'publisher']
    });
    matches = fuse.search(search);
  }

  // Starred items stick to top
  matches = matches.sort((a, b) => {
    if (!a.starred && b.starred) return 1;
    if (a.starred && !b.starred) return -1;
    return 0;
  });

  return (
    <div>
      {/* Search field */}
      <TextField
        id="search"
        label="Search"
        value={search}
        margin="normal"
        variant="outlined"
        onChange={e => setSearch(e.target.value)}
        fullWidth
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          )
        }}
        placeholder="A Tale of Two Cities"
      />

      {/* Display selected tags */}
      {selectedTags.map(tag => (
        <Chip
          key={tag}
          label={(tags.find(t => t.id == tag) as Insightful.Tag).name}
          avatar={<Avatar>#</Avatar>}
          variant="outlined"
          onDelete={() => setSelectedTags(selectedTags.filter(t => t != tag))}
        />
      ))}

      {/* Display unselected tags linked to matching entities */}
      <List dense>
        {Array.from(
          new Set(
            matches
              .map(m => m.tags)
              .flat()
              .filter(t => !selectedTags.includes(t))
          )
        ).map(tag => (
          <ListItem
            key={tag}
            button
            onClick={() => setSelectedTags(selectedTags.concat(tag))}
          >
            <ListItemAvatar>
              <Avatar>#</Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={(tags.find(t => t.id == tag) as Insightful.Tag).name}
            />
          </ListItem>
        ))}
      </List>

      {/* Display matching entities */}
      <List dense>
        {matches.map(match => (
          <Link to={`/read/${match.id}`} className={classes.entity}>
            <ListItem key={match.id} button>
              <Cover id={match.id} />
              <div>
                <Typography className={classes.entityName} variant="h2">
                  {match.starred ? <StarIcon color="primary" /> : null}
                  {match.name}
                </Typography>
                <Typography className={classes.entityInfo}>
                  {match.words} words — Added {formatRelative(match.id, now)}
                </Typography>
                <Typography className={classes.entityInfo}>
                  {match.tags
                    .map(
                      tag =>
                        `#${
                          (tags.find(t => t.id == tag) as Insightful.Tag).name
                        }`
                    )
                    .join(' ')}
                </Typography>
              </div>
            </ListItem>
          </Link>
        ))}
      </List>
    </div>
  );
}

export const Library = withStyles(styles)(_Library);
