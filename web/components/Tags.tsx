import * as localForage from 'localforage';
import { Insightful } from 'types/insightful';
import * as React from 'react';
import {
  FilterList as FilterIcon,
  Search as SearchIcon,
  Star as StarIcon
} from '@material-ui/icons';
import {
  ListItemAvatar,
  InputAdornment,
  ListSubheader,
  createStyles,
  ListItemText,
  IconButton,
  WithStyles,
  Typography,
  withStyles,
  TextField,
  ListItem,
  Avatar,
  Theme,
  List
} from '@material-ui/core';

const styles = (theme: Theme) =>
  createStyles({
    selectedTagAvatar: {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText
    }
  });

function _Tags({
  setSelectedTags,
  selectedTags,
  classes,
  matches,
  tags
}: {
  setSelectedTags: React.Dispatch<React.SetStateAction<Insightful.Tag['id'][]>>;
  selectedTags: Insightful.Tag['id'][];
  matches: Insightful.Entity[];
  tags: Insightful.Tag[];
} & WithStyles<typeof styles>) {
  // Unselected tags linked to matching entities
  const availableTags = Array.from(
    new Set(
      matches
        .map(m => m.tags)
        .flat()
        .filter(t => !selectedTags.includes(t))
    )
  );

  return (
    <React.Fragment>
      {/* Display selected tags */}
      {selectedTags.length ? (
        <List dense>
          <ListSubheader>Active Filters</ListSubheader>
          {selectedTags.map(tag => (
            <ListItem
              key={tag}
              button
              onClick={() =>
                setSelectedTags(selectedTags.filter(t => t != tag))
              }
              selected
            >
              <ListItemAvatar>
                <Avatar className={classes.selectedTagAvatar}>#</Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={(tags.find(t => t.id == tag) as Insightful.Tag).name}
              />
            </ListItem>
          ))}
        </List>
      ) : null}

      {/* Display tags available to filter by */}
      {availableTags.length ? (
        <List dense>
          <ListSubheader>Tags</ListSubheader>
          {availableTags.map(tag => (
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
      ) : null}
    </React.Fragment>
  );
}

export const Tags = withStyles(styles)(_Tags);
