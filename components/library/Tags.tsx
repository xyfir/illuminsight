import { Illuminsight } from 'types';
import * as React from 'react';
import {
  ListItemAvatar,
  ListSubheader,
  createStyles,
  ListItemText,
  makeStyles,
  ListItem,
  Avatar,
  Theme,
  List,
} from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    selectedTagAvatar: {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
    },
  }),
);

export function Tags({
  setSelectedTags,
  selectedTags,
  matches,
  tags,
}: {
  setSelectedTags: React.Dispatch<
    React.SetStateAction<Illuminsight.Tag['id'][]>
  >;
  selectedTags: Illuminsight.Tag['id'][];
  matches: Illuminsight.Pub[];
  tags: Illuminsight.Tag[];
}): JSX.Element {
  const classes = useStyles();

  // Unselected tags linked to matching pubs
  const availableTags = Array.from(
    new Set(
      matches
        .map((m) => m.tags)
        .flat()
        .filter((t) => !selectedTags.includes(t)),
    ),
  );

  return (
    <React.Fragment>
      {/* Display selected tags */}
      {selectedTags.length ? (
        <List dense>
          <ListSubheader>Active Filters</ListSubheader>
          {selectedTags.map((tag) => (
            <ListItem
              key={tag}
              button
              onClick={(): void =>
                setSelectedTags(selectedTags.filter((t) => t != tag))
              }
              selected
            >
              <ListItemAvatar>
                <Avatar className={classes.selectedTagAvatar}>#</Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  (tags.find((t) => t.id == tag) as Illuminsight.Tag).name
                }
              />
            </ListItem>
          ))}
        </List>
      ) : null}

      {/* Display tags available to filter by */}
      {availableTags.length ? (
        <List dense>
          <ListSubheader>Tags</ListSubheader>
          {availableTags.map((tag) => (
            <ListItem
              key={tag}
              button
              onClick={(): void => setSelectedTags(selectedTags.concat(tag))}
            >
              <ListItemAvatar>
                <Avatar>#</Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  (tags.find((t) => t.id == tag) as Illuminsight.Tag).name
                }
              />
            </ListItem>
          ))}
        </List>
      ) : null}
    </React.Fragment>
  );
}
