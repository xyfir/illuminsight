import { Search as SearchIcon } from '@material-ui/icons';
import { formatRelative } from 'date-fns';
import * as localforage from 'localforage';
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
  Chip,
  List
} from '@material-ui/core';

const styles = createStyles({});

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
    localforage
      .getItem('entity-list')
      .then(r => {
        if (r !== null) setEntities(r as Insightful.Entity[]);
        return localforage.getItem('tag-list');
      })
      .then(r => setTags((r as Insightful.Tag[]) || []));
  }, []);

  // Filter by tags
  let matches = entities.filter(
    entity => entity.tags.findIndex(tag => selectedTags.includes(tag)) > -1
  );

  // Filter by search
  const fuse = new Fuse(entities, {
    shouldSort: true,
    threshold: 0.4,
    keys: ['name', 'link', 'authors', 'published', 'publisher']
  });
  matches = fuse.search(search);

  // ** Scrolling pagination
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
      <ul>
        {matches.map(match => (
          <li key={match.id}>
            <Link to={`/read/${match.id}`}>
              <Cover id={match.id} />
            </Link>
            <Link to={`/read/${match.id}`}>
              <Typography variant="h2">{match.name}</Typography>
            </Link>
            <Typography>
              {match.tags
                .map(
                  tag =>
                    `#${(tags.find(t => t.id == tag) as Insightful.Tag).name}`
                )
                .join(' ')}
            </Typography>
            {match.authors ? <Typography>{match.authors}</Typography> : null}
            {match.published || match.publisher ? (
              <Typography>
                {match.published}
                {match.published && match.publisher ? ' — ' : null}
                {match.publisher}
              </Typography>
            ) : null}
            <Typography>
              {match.words} — added {formatRelative(match.id, now)}
            </Typography>
          </li>
        ))}
      </ul>
    </div>
  );
}

export const Library = withStyles(styles)(_Library);
