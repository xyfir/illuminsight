import { useRouteMatch, useHistory } from 'react-router-dom';
import { createStyles, makeStyles } from '@material-ui/core';
import { ReaderControls } from 'components/reader/ReaderControls';
import { defaultRecipe } from 'lib/reader/recipes';
import { getByTagName } from 'lib/reader/get-by-tag-name';
import { Illuminsight } from 'types';
import { useSnackbar } from 'notistack';
import { Indexer } from 'lib/reader/Indexer';
import localForage from 'localforage';
import * as React from 'react';
import { AST } from 'components/reader/AST';
import JSZip from 'jszip';

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      '-webkit-overflow-scrolling': 'touch',
      paddingBottom: '80vh',
      overflowY: 'auto',
      padding: '1em',
      ' & > div': {
        maxWidth: '40em',
        margin: 'auto',
      },
    },
    ast: {
      fontFamily: 'serif',
      textAlign: 'justify',
      overflow: 'hidden',
      fontSize: `${+localStorage.getItem('fontSize')! || 125}%`,
      margin: '1em auto !important',
      color: theme.palette.getContrastText(theme.palette.background.default),
      '& img': {
        maxWidth: '100%',
        display: 'block',
        margin: 'auto',
      },
      '& div': {
        margin: '1em 0',
      },
      '& a': {
        textDecoration: 'none',
        color: theme.palette.primary.main,
      },
    },
  }),
);

export interface ReaderContextState {
  setInsightsIndex: (insightsIndex: Illuminsight.InsightsIndex) => void;
  insightsIndex: Illuminsight.InsightsIndex;
  setRecipe: (recipe: Illuminsight.Recipe) => void;
  recipe: Illuminsight.Recipe;
  pub?: Illuminsight.Pub;
  ast: Illuminsight.AST[];
}

const defaultContextState: ReaderContextState = {
  setInsightsIndex: () => undefined,
  insightsIndex: {},
  setRecipe: () => undefined,
  recipe: defaultRecipe,
  ast: [],
};

export const ReaderContext = React.createContext<ReaderContextState>(
  defaultContextState,
);
let zip: JSZip | undefined;

export function Reader(): JSX.Element {
  const [lastScrollSave, setLastScrollSave] = React.useState(0);
  const [insightsIndex, setInsightsIndex] = React.useState<
    Illuminsight.InsightsIndex
  >({});
  const [contextState] = React.useState<ReaderContextState>(
    Object.assign({}, defaultContextState),
  );
  const [lastScroll, setLastScroll] = React.useState(0);
  const [recipe, setRecipe] = React.useState<Illuminsight.Recipe>(
    defaultRecipe,
  );
  const { enqueueSnackbar } = useSnackbar();
  const [pub, setPub] = React.useState<Illuminsight.Pub | undefined>();
  const [ast, setAST] = React.useState<Illuminsight.AST[]>([]);
  const routeHistory = useHistory();
  const [history] = React.useState<Illuminsight.Marker[]>([]);
  const [imgURLs] = React.useState<string[]>([]);
  const classes = useStyles();
  const match = useRouteMatch();
  Indexer.reset();

  contextState.setInsightsIndex = setInsightsIndex;
  contextState.insightsIndex = insightsIndex;
  contextState.setRecipe = setRecipe;
  contextState.recipe = recipe;
  contextState.ast = ast;
  contextState.pub = pub;

  /**
   * Save meta.json in zip file and update storage.
   */
  async function saveFile(pub: Illuminsight.Pub): Promise<void> {
    zip!.file('meta.json', JSON.stringify(pub));
    await localForage.setItem(
      `pub-${pub.id}`,
      await zip!.generateAsync({ type: 'blob' }),
    );
  }

  /**
   * Scroll to `pub.bookmark.element` if able.
   */
  function scrollToBookmark(pub: Illuminsight.Pub): void {
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

  /**
   * Load section from zip file by bookmark.
   */
  async function loadSection(newPub: Illuminsight.Pub): Promise<void> {
    const oldPub = pub;

    // Catch unexpected issues
    if (newPub === oldPub) throw 'loadSection() received same pub from state!';

    // Section hasn't changed so all we need to do is scroll to bookmark
    if (oldPub && oldPub.bookmark.section == newPub.bookmark.section)
      return scrollToBookmark(newPub);

    try {
      // Revoke previous blob urls
      imgURLs.forEach((url) => URL.revokeObjectURL(url));

      // Load AST for section
      const ast: Illuminsight.AST[] = JSON.parse(
        await zip!.file(`ast/${newPub.bookmark.section}.json`).async('text'),
      );

      // Find images in AST
      const imgNodes = getByTagName('img', ast).concat(
        getByTagName('image', ast),
      );
      for (const node of imgNodes) {
        if (typeof node == 'string' || !node.a) continue;

        // Load image from zip file
        const imgBlob = await zip!
          .file(node.n == 'img' ? node.a.src : node.a['href'])
          .async('blob');

        // Convert node's src to use object url
        const url = URL.createObjectURL(imgBlob);
        node.a[node.n == 'img' ? 'src' : 'href'] = url;
        imgURLs.push(url);
      }

      // Update file if we've changed sections (not first load)
      if (oldPub) await saveFile(newPub);

      // Update state
      setAST(ast);
      setPub(newPub);
      setInsightsIndex({});
    } catch (err) {
      // Notify user of error and send them back
      console.error(err);
      enqueueSnackbar(typeof err == 'string' ? err : 'Cannot read content');
      routeHistory.goBack();
    }
  }

  /**
   * Triggered whenever an element in `#ast` is clicked. Handles links, ignores
   *  everything else.
   */
  function onLinkClick(e: React.MouseEvent<HTMLDivElement, MouseEvent>): void {
    const a = e.target as HTMLAnchorElement;

    // If not a link and parent isn't #ast, bubble up
    if (a.tagName != 'A' && a.parentElement!.id != 'ast') {
      e.target = a.parentElement!;
      onLinkClick(e);
      return;
    }
    e.preventDefault();

    // Empty link, do nothing
    if (!a.href) return;

    // External link, open in new tab
    if (a.origin != location.origin) {
      window.open(a.href);
      return;
    }

    const _pub = { ...pub! };

    // Hash link for current section, focus #hash
    if (a.pathname == location.pathname && a.hash.length > 1) {
      // Get element by hash
      const el = document.getElementById(a.hash.substr(1));
      if (!el) return;

      // Save current location to history
      history.push({ ..._pub.bookmark });

      // Set location as bookmark and navigate to it
      _pub.bookmark = { ..._pub.bookmark, element: a.hash.substr(1) };
      loadSection(_pub);
      return;
    }

    // Link for another section, change and optionally focus #hash
    const match = /\/ast\/(\d+)\.json(?:#(.*))?$/.exec(a.href);
    if (match) {
      // Save current location to history
      history.push(_pub.bookmark);

      // Set location as bookmark and navigate to it
      _pub.bookmark = { section: +match[1], element: match[2] || 0 };
      loadSection(_pub);
    }
  }

  /**
   * Triggered when user scrolls reader.
   */
  function onScroll(event: React.UIEvent<HTMLDivElement>): void {
    if (!pub) return;

    // Throttle onScroll() to max one per second
    const now = Date.now();
    if (lastScroll + 1000 >= now) return;
    setLastScroll(now);

    // Calculate bookmark.element
    const elements = document.querySelectorAll<HTMLElement>('#ast *[ast]');
    let element = -1;
    for (const el of elements) {
      if (el.offsetTop >= (event.target as HTMLDivElement).scrollTop) {
        element = +el.getAttribute('ast')!;
        break;
      }
    }

    // Update bookmark if needed
    if (pub.bookmark.element != element) {
      pub.bookmark.element = element;
      setPub(pub);

      // Only save to file once a minute from scrolling
      if (now - 60 * 1000 > lastScrollSave) {
        setLastScrollSave(Date.now());
        saveFile(pub);
      }
    }
  }

  /**
   * Load zip file for corresponding pub.
   */
  async function loadZip(): Promise<void> {
    const { pubId } = match!.params as { pubId: number };

    try {
      // Load file from localForage
      const file = await localForage.getItem(`pub-${pubId}`);
      if (file === null) throw 'Could not load data from storage';

      // Parse zip file
      zip = await JSZip.loadAsync(file as Blob);

      // Load meta.json
      const pub: Illuminsight.Pub = JSON.parse(
        await zip.file('meta.json').async('text'),
      );

      // Load section
      await loadSection(pub);
    } catch (err) {
      // Notify user of error and send them back
      console.error(err);
      enqueueSnackbar(typeof err == 'string' ? err : 'Cannot read content');
      routeHistory.goBack();
    }
  }

  // on mount
  React.useEffect(() => {
    const { pubId } = match!.params as { pubId: number };

    // Load zip and recipe
    localForage
      .getItem(`pub-recipe-${pubId}`)
      .then((res) => res && setRecipe(res as Illuminsight.Recipe))
      .catch(() => undefined);
    loadZip();

    return (): void => {
      if (pub) saveFile(pub);
      imgURLs.forEach((url) => URL.revokeObjectURL(url));
      zip = undefined;
    };
  }, []);

  // Scroll to bookmark on load and when section changes
  React.useEffect(() => {
    if (pub) scrollToBookmark(pub);
  }, [pub && pub.bookmark.section]);

  return (
    <ReaderContext.Provider value={contextState}>
      <div
        data-testid="reader"
        className={classes.root}
        onScroll={(e): void => onScroll(e)}
      >
        <ReaderControls onNavigate={loadSection} history={history} />

        <div
          className={classes.ast}
          onClick={(e): void => onLinkClick(e)}
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
