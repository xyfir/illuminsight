import { createStyles, WithStyles, withStyles, Theme } from '@material-ui/core';
import { WithSnackbarProps, withSnackbar } from 'notistack';
import { RouteComponentProps } from 'react-router';
import { ReaderToolbar } from 'components/reader/ReaderToolbar';
import { defaultRecipe } from 'lib/reader/recipes';
import { getByTagName } from 'lib/reader/get-by-tag-name';
import { Illuminsight } from 'types/illuminsight';
import { Indexer } from 'lib/reader/Indexer';
import localForage from 'localforage';
import * as React from 'react';
import { AST } from 'components/reader/AST';
import JSZip from 'jszip';

const styles = (theme: Theme) =>
  createStyles({
    root: {
      '-webkit-overflow-scrolling': 'touch',
      paddingBottom: '80vh',
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
      fontSize: `${+localStorage.getItem('fontSize')! || 125}%`,
      margin: '1em auto !important',
      color: theme.palette.getContrastText(theme.palette.background.default),
      '& img': {
        maxWidth: '100%',
        display: 'block',
        margin: 'auto'
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

type ReaderProps = WithStyles<typeof styles> &
  RouteComponentProps &
  WithSnackbarProps;

export interface ReaderState {
  insightsIndex: Illuminsight.InsightsIndex;
  recipe: Illuminsight.Recipe;
  pub?: Illuminsight.Pub;
  ast: Illuminsight.AST[];
}

export const ReaderContext = React.createContext<ReaderState>({
  insightsIndex: {},
  recipe: defaultRecipe,
  ast: []
});

class _Reader extends React.Component<ReaderProps, ReaderState> {
  lastScrollSave: number = 0;
  lastScroll: number = 0;
  history: Illuminsight.Marker[] = [];
  imgURLs: string[] = [];
  zip?: JSZip;

  state: ReaderState = {
    insightsIndex: {},
    recipe: defaultRecipe,
    ast: []
  };

  constructor(props: ReaderProps) {
    super(props);
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
   * Triggered whenever an element in `#ast` is clicked. Handles links, ignores
   *  everything else.
   */
  onLinkClick(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    const a = e.target as HTMLAnchorElement;

    // If not a link and parent isn't #ast, bubble up
    if (a.tagName != 'A' && a.parentElement!.id != 'ast') {
      e.target = a.parentElement!;
      this.onLinkClick(e);
      return;
    }
    e.preventDefault();

    // Empty link, do nothing
    if (!a.href) return;

    // External link, open in new tab
    if (a.origin != location.origin) return window.open(a.href);

    const pub = { ...this.state.pub! };

    // Hash link for current section, focus #hash
    if (a.pathname == location.pathname && a.hash.length > 1) {
      // Get element by hash
      const el = document.getElementById(a.hash.substr(1));
      if (!el) return;

      // Save current location to history
      this.history.push({ ...pub.bookmark });

      // Set location as bookmark and navigate to it
      pub.bookmark = { ...pub.bookmark, element: a.hash.substr(1) };
      this.loadSection(pub);
      return;
    }

    // Link for another section, change and optionally focus #hash
    const match = a.href.match(/\/ast\/(\d+)\.json(?:#(.*))?$/);
    if (match) {
      // Save current location to history
      this.history.push(pub.bookmark);

      // Set location as bookmark and navigate to it
      pub.bookmark = { section: +match[1], element: match[2] || 0 };
      this.loadSection(pub);
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
    const elements = document.querySelectorAll<HTMLElement>('#ast *[ast]');
    let element = -1;
    for (let el of elements) {
      if (el.offsetTop >= (event.target as HTMLDivElement).scrollTop) {
        element = +el.getAttribute('ast')!;
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
      const pub: Illuminsight.Pub = JSON.parse(
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
  async loadSection(pub: Illuminsight.Pub) {
    const { pub: oldPub } = this.state;

    // Catch unexpected issues
    if (pub === oldPub) throw 'loadSection() received same pub from state!';

    // Section hasn't changed so all we need to do is scroll to bookmark
    if (oldPub && oldPub.bookmark.section == pub.bookmark.section)
      return this.scrollToBookmark(pub);

    const { enqueueSnackbar, history } = this.props;
    const zip = this.zip as JSZip;

    try {
      // Revoke previous blob urls
      this.imgURLs.forEach(url => URL.revokeObjectURL(url));
      this.imgURLs = [];

      // Load AST for section
      const ast: Illuminsight.AST[] = JSON.parse(
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
      this.setState({ insightsIndex: {}, pub, ast });
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
  async saveFile(pub: Illuminsight.Pub) {
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
  scrollToBookmark(pub: Illuminsight.Pub) {
    const { element } = pub.bookmark;

    // Get by id
    if (typeof element == 'string') {
      const el = document.getElementById(element);
      if (el) el.scrollIntoView(true);
    }
    // Get by index
    else {
      const el = document.querySelector(`#ast *[ast="${element}"]`);
      if (el) el.scrollIntoView(true);
    }
  }

  render() {
    const { classes } = this.props;
    const { ast } = this.state;

    Indexer.reset();

    return (
      <ReaderContext.Provider value={this.state}>
        <div
          data-testid="reader"
          className={classes.root}
          onScroll={e => this.onScroll(e)}
        >
          <ReaderToolbar
            onNavigate={this.loadSection}
            onInsight={i => this.setState({ insightsIndex: i })}
            history={this.history}
          />

          <div
            className={classes.ast}
            onClick={e => this.onLinkClick(e)}
            id="ast"
          >
            {ast.map((node, i) => (
              <AST key={i} ast={node} />
            ))}
          </div>
        </div>
      </ReaderContext.Provider>
    );
  }
}

export const Reader = withStyles(styles)(withSnackbar(_Reader));
