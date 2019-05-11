import { createStyles, WithStyles, withStyles, Theme } from '@material-ui/core';
import { withSnackbarProps, withSnackbar } from 'notistack';
import { RouteComponentProps } from 'react-router';
import { SectionNavigation } from 'components/SectionNavigation';
import * as localForage from 'localforage';
import { Insightful } from 'types/insightful';
import { queryAST } from 'lib/query-ast';
import * as React from 'react';
import * as JSZip from 'jszip';
import { AST } from 'components/AST';

const styles = (theme: Theme) =>
  createStyles({
    root: {
      padding: '1em'
    }
  });

interface ReaderState {
  entity?: Insightful.Entity;
  ast: Insightful.AST[];
}
type ReaderProps = WithStyles<typeof styles> &
  RouteComponentProps &
  withSnackbarProps;

class _Reader extends React.Component<ReaderProps, ReaderState> {
  imgURLs: string[] = [];
  state: ReaderState = { ast: [] };
  zip?: JSZip;

  constructor(props: ReaderProps) {
    super(props);
    this.loadSection = this.loadSection.bind(this);
  }

  componentDidMount() {
    this.loadZip();
  }

  componentWillUnmount() {
    // Revoke image blob urls
    this.imgURLs.forEach(url => URL.revokeObjectURL(url));
  }

  async loadZip() {
    const { enqueueSnackbar, history, match } = this.props;
    const { entityId } = match.params as { entityId: number };

    try {
      // Load file from localForage
      const file = await localForage.getItem(`entity-${entityId}`);
      if (file === null) throw 'Could not load data from storage';

      // Parse zip file
      this.zip = await JSZip.loadAsync(file as Blob);

      // Load meta.json
      const entity: Insightful.Entity = JSON.parse(
        await this.zip.file('meta.json').async('text')
      );

      // Load section
      await this.loadSection(entity);
    } catch (err) {
      // Notify user of error and send them back
      console.error(err);
      enqueueSnackbar(typeof err == 'string' ? err : 'Cannot read content');
      history.goBack();
    }
  }

  async loadSection(entity: Insightful.Entity) {
    const { enqueueSnackbar, history } = this.props;
    const zip = this.zip as JSZip;

    try {
      // Revoke previous blob urls
      this.imgURLs.forEach(url => URL.revokeObjectURL(url));
      this.imgURLs = [];

      // Load AST for section
      const ast: Insightful.AST[] = JSON.parse(
        await zip.file(entity.spine[entity.bookmark.section]).async('text')
      );

      // Find images in AST
      const imgNodes = queryAST(
        ast => (typeof ast == 'string' ? false : ast.n == 'img'),
        ast
      );

      for (let node of imgNodes) {
        if (typeof node == 'string' || !node.a) continue;

        // Load image from zip file
        const imgBlob = await zip.file(node.a.src).async('blob');

        // Convert node's src to use object url
        const url = URL.createObjectURL(imgBlob);
        node.a.src = url;
        this.imgURLs.push(url);
      }

      // Update state
      this.setState({ entity, ast });
    } catch (err) {
      // Notify user of error and send them back
      console.error(err);
      enqueueSnackbar(typeof err == 'string' ? err : 'Cannot read content');
      history.goBack();
    }
  }

  render() {
    const { entity, ast } = this.state;
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <SectionNavigation onChange={this.loadSection} entity={entity} />
        {ast.map((node, i) => (
          <AST key={i} ast={node} />
        ))}
        <SectionNavigation onChange={this.loadSection} entity={entity} />
      </div>
    );
  }
}

export const Reader = withStyles(styles)(withSnackbar(_Reader));
