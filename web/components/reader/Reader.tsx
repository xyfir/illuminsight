import { createStyles, WithStyles, withStyles, Theme } from '@material-ui/core';
import { WithSnackbarProps, withSnackbar } from 'notistack';
import { RouteComponentProps } from 'react-router';
import { ReaderToolbar } from 'components/reader/ReaderToolbar';
import { getByTagName } from 'lib/get-by-tag-name';
import * as localForage from 'localforage';
import { Insightful } from 'types/insightful';
import * as React from 'react';
import * as JSZip from 'jszip';
import { AST } from 'components/reader/AST';

const styles = (theme: Theme) =>
  createStyles({
    root: {
      overflowY: 'auto',
      padding: '1em',
      ' & > div': {
        maxWidth: '40em',
        margin: 'auto'
      }
    },
    ast: {
      fontFamily: 'serif',
      overflow: 'hidden',
      fontSize: '125%',
      margin: '1em auto !important',
      color: theme.palette.getContrastText(theme.palette.background.default),
      '& img': {
        maxWidth: '100%'
      },
      '& a': {
        textDecoration: 'none',
        color: theme.palette.primary.main
      },
      '& p': {
        textAlign: 'justify'
      }
    }
  });

interface ReaderState {
  pub?: Insightful.Pub;
  ast: Insightful.AST[];
}
type ReaderProps = WithStyles<typeof styles> &
  RouteComponentProps &
  WithSnackbarProps;

class _Reader extends React.Component<ReaderProps, ReaderState> {
  lastScrollSave: number = 0;
  lastScroll: number = 0;
  history: Insightful.Marker[] = [];
  imgURLs: string[] = [];
  state: ReaderState = { ast: [] };
  zip?: JSZip;

  constructor(props: ReaderProps) {
    super(props);
    this.attributor = this.attributor.bind(this);
    this.loadSection = this.loadSection.bind(this);
  }

  componentDidMount() {
    this.loadZip();
  }

  componentDidUpdate(prevProps: any, prevState: ReaderState) {
    const { pub } = this.state;

    // Scroll to bookmarked element on first load and section change
    if (
      pub &&
      (!prevState.pub || prevState.pub.bookmark.section != pub.bookmark.section)
    )
      this.scrollToBookmark(pub);
  }

  componentWillUnmount() {
    // Save file immediately
    if (this.state.pub) this.saveFile(this.state.pub);

    // Revoke image blob urls
    this.imgURLs.forEach(url => URL.revokeObjectURL(url));
  }

  /**
   * Triggered whenever an `<a>` element is clicked.
   */
  onLinkClick(e: MouseEvent, href: string) {
    // Empty link, do nothing
    if (!href) return;
    // Hash link for current section, allow normal behavior
    if (href.startsWith('#')) return;

    e.preventDefault();

    // Link for another section, change and optionally focus #hash
    const match = href.match(/^ast\/(\d+)\.json(?:#(.*))?$/);
    if (match) {
      const pub = this.state.pub!;

      // Save current location to history
      this.history.push(pub.bookmark);

      // Set location as bookmark and navigate to it
      pub.bookmark = { section: +match[1], element: match[2] || 0 };
      this.loadSection(pub);
    }
    // External link, open in new tab
    else {
      window.open(href);
    }
  }

  /**
   * Triggered when user scrolls reader.
   */
  onScroll(event: React.UIEvent<HTMLDivElement>) {
    const { pub } = this.state;
    if (!pub) return;

    // Throttle onScroll() to max one per second
    const now = Date.now();
    if (this.lastScroll + 1000 >= now) return;
    this.lastScroll = now;

    // Calculate bookmark.element
    const elements = document.querySelectorAll<HTMLElement>('#ast *');
    let element = 0;
    for (let i = 0; i < elements.length; i++) {
      if (elements[i].offsetTop >= (event.target as HTMLDivElement).scrollTop) {
        element = i;
        break;
      }
    }

    // Update bookmark if needed
    if (pub.bookmark.element != element) {
      pub.bookmark.element = element;
      this.setState({ pub });

      // Only save to file once a minute from scrolling
      if (now - 60 * 1000 > this.lastScrollSave) {
        this.lastScrollSave = Date.now();
        this.saveFile(pub);
      }
    }
  }

  /**
   * Load zip file for corresponding pub.
   */
  async loadZip() {
    const { enqueueSnackbar, history, match } = this.props;
    const { pubId } = match.params as { pubId: number };

    try {
      // Load file from localForage
      const file = await localForage.getItem(`pub-${pubId}`);
      if (file === null) throw 'Could not load data from storage';

      // Parse zip file
      this.zip = await JSZip.loadAsync(file as Blob);

      // Load meta.json
      const pub: Insightful.Pub = JSON.parse(
        await this.zip.file('meta.json').async('text')
      );

      // Load section
      await this.loadSection(pub);
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
  async loadSection(pub: Insightful.Pub) {
    const { enqueueSnackbar, history } = this.props;
    const zip = this.zip as JSZip;

    try {
      // Revoke previous blob urls
      this.imgURLs.forEach(url => URL.revokeObjectURL(url));
      this.imgURLs = [];

      // Load AST for section
      const ast: Insightful.AST[] = JSON.parse(
        await zip.file(`ast/${pub.bookmark.section}.json`).async('text')
      );

      // Find images in AST
      const imgNodes = getByTagName('img', ast).concat(
        getByTagName('image', ast)
      );

      for (let node of imgNodes) {
        if (typeof node == 'string' || !node.a) continue;

        // Load image from zip file
        const imgBlob = await zip
          .file(node.n == 'img' ? node.a.src : node.a['href'])
          .async('blob');

        // Convert node's src to use object url
        const url = URL.createObjectURL(imgBlob);
        node.a[node.n == 'img' ? 'src' : 'href'] = url;
        this.imgURLs.push(url);
      }

      // Update file if we've changed sections (not first load)
      if (this.state.pub) await this.saveFile(pub);

      // Update state
      this.setState({ pub, ast });
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
  async saveFile(pub: Insightful.Pub) {
    const zip = this.zip as JSZip;
    zip.file('meta.json', JSON.stringify(pub));
    await localForage.setItem(
      `pub-${pub.id}`,
      await zip.generateAsync({ type: 'blob' })
    );
  }

  /**
   * Scroll to `pub.bookmark.element` if able.
   */
  scrollToBookmark(pub: Insightful.Pub) {
    const { element } = pub.bookmark;

    // Get by id
    if (typeof element == 'string') {
      const el = document.getElementById(element);
      if (el) el.scrollIntoView(true);
    }
    // Get by index
    else if (element > 0) {
      const elements = document.querySelectorAll('#ast *');
      for (let i = 0; i < elements.length; i++) {
        if (i == element) elements[i].scrollIntoView(true);
      }
    }
  }

  attributor(node: Insightful.AST): any | null {
    if (typeof node == 'string' || node.n != 'a') return null;
    const { a: { href = '' } = {} } = node; // yes, this is necessary for TS
    return { onClick: (e: MouseEvent) => this.onLinkClick(e, href) };
  }

  render() {
    const { pub, ast } = this.state;
    const { classes } = this.props;

    return (
      <div
        data-testid="reader"
        className={classes.root}
        onScroll={e => this.onScroll(e)}
      >
        <ReaderToolbar
          onChange={this.loadSection}
          history={this.history}
          pub={pub}
        />

        <div id="ast" className={classes.ast}>
          {ast.map((node, i) => (
            <AST key={i} ast={node} attributor={this.attributor} />
          ))}
        </div>
      </div>
    );
  }
}

export const Reader = withStyles(styles)(withSnackbar(_Reader));
