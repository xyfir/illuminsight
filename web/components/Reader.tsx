import { createStyles, WithStyles, withStyles, Theme } from '@material-ui/core';
import { WithSnackbarProps, withSnackbar } from 'notistack';
import { RouteComponentProps } from 'react-router';
import { SectionNavigation } from 'components/SectionNavigation';
import { getByTagName } from 'lib/get-by-tag-name';
import * as localForage from 'localforage';
import { Insightful } from 'types/insightful';
import * as React from 'react';
import * as JSZip from 'jszip';
import { AST } from 'components/AST';

const styles = (theme: Theme) =>
  createStyles({
    root: {
      overflowY: 'auto',
      padding: '1em'
    }
  });

interface ReaderState {
  entity?: Insightful.Entity;
  ast: Insightful.AST[];
}
type ReaderProps = WithStyles<typeof styles> &
  RouteComponentProps &
  WithSnackbarProps;

class _Reader extends React.Component<ReaderProps, ReaderState> {
  lastBookmark: number = 0;
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

  componentDidUpdate(prevProps: any, prevState: ReaderState) {
    const { classes } = this.props;
    const { entity } = this.state;

    // Scroll to bookmarked block on first load
    if (!prevState.entity && entity) {
      // +2 since nth-child() isn't 0-based and to skip section navigation
      const el = document.querySelector(
        `.${classes.root} > *:nth-child(${entity.bookmark.block + 2})`
      );
      if (el) el.scrollIntoView(true);
    }
  }

  componentWillUnmount() {
    // Save file immediately
    if (this.state.entity) this.saveFile(this.state.entity);

    // Revoke image blob urls
    this.imgURLs.forEach(url => URL.revokeObjectURL(url));
  }

  onScroll(event: React.UIEvent<HTMLDivElement>) {
    const { entity } = this.state;
    if (!entity) return;

    // Ignore scroll if we updated bookmark within past minute
    if (Date.now() - 60 * 1000 < this.lastBookmark) return;
    this.lastBookmark = Date.now();

    // Get top level block elements
    const blocks: HTMLElement[] = Array.from(
      document.querySelectorAll(`.${this.props.classes.root} > *`)
    );

    // Remove section navigation
    blocks.shift();
    blocks.pop();

    // Calculate bookmark.block
    let block = 0;
    for (let i = 0; i < blocks.length; i++) {
      if (blocks[i].offsetTop >= (event.target as HTMLDivElement).scrollTop) {
        block = i;
        break;
      }
    }

    // Update bookmark if needed
    if (entity.bookmark.block != block) {
      entity.bookmark.block = block;
      this.setState({ entity });
      this.saveFile(entity);
    }
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

  /**
   * Load section from zip file by bookmark.
   */
  async loadSection(entity: Insightful.Entity) {
    const { enqueueSnackbar, history } = this.props;
    const zip = this.zip as JSZip;

    try {
      // Revoke previous blob urls
      this.imgURLs.forEach(url => URL.revokeObjectURL(url));
      this.imgURLs = [];

      // Load AST for section
      const ast: Insightful.AST[] = JSON.parse(
        await zip.file(`ast/${entity.bookmark.section}.json`).async('text')
      );

      // Find images in AST
      const imgNodes = getByTagName('img', ast);

      for (let node of imgNodes) {
        if (typeof node == 'string' || !node.a) continue;

        // Load image from zip file
        const imgBlob = await zip.file(node.a.src).async('blob');

        // Convert node's src to use object url
        const url = URL.createObjectURL(imgBlob);
        node.a.src = url;
        this.imgURLs.push(url);
      }

      // Update file if we've changed sections (not first load)
      if (this.state.entity) await this.saveFile(entity);

      // Update state
      this.setState({ entity, ast });
    } catch (err) {
      // Notify user of error and send them back
      console.error(err);
      enqueueSnackbar(typeof err == 'string' ? err : 'Cannot read content');
      history.goBack();
    }
  }

  /**
   * Save meta.json in zip file and update storage.
   */
  async saveFile(entity: Insightful.Entity) {
    const zip = this.zip as JSZip;
    zip.file('meta.json', JSON.stringify(entity));
    await localForage.setItem(
      `entity-${entity.id}`,
      await zip.generateAsync({ type: 'blob' })
    );
  }

  render() {
    const { entity, ast } = this.state;
    const { classes } = this.props;

    return (
      <div
        data-testid="reader"
        className={classes.root}
        onScroll={e => this.onScroll(e)}
      >
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
