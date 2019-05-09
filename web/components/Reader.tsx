import { createStyles, WithStyles, withStyles, Theme } from '@material-ui/core';
import { RouteComponentProps } from 'react-router';
import * as localForage from 'localforage';
import { useSnackbar } from 'notistack';
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

function _Reader({
  classes,
  history,
  match
}: WithStyles<typeof styles> & RouteComponentProps) {
  const { enqueueSnackbar } = useSnackbar();
  const [ast, setAST] = React.useState<Insightful.AST[]>([]);
  const { entityId } = match.params as { entityId: number };

  // Load data on mount
  React.useEffect(() => {
    let imgURLs: string[] = [];

    async function loadData() {
      try {
        // Load entity file from localForage
        const file = await localForage.getItem(`entity-${entityId}`);
        if (file === null) throw 'Could not load data from storage';

        // Load blob into jszip
        const zip = await JSZip.loadAsync(file as Blob);

        // Load meta.json
        const entity: Insightful.Entity = JSON.parse(
          await zip.file('meta.json').async('text')
        );

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
          const imgBlob = await zip.file(node.a.src.substr(1)).async('blob');

          // Convert node's src to use object url
          const url = URL.createObjectURL(imgBlob);
          node.a.src = url;
          imgURLs.push(url);
        }

        // Save modified AST to state
        setAST(ast);
      } catch (err) {
        // Notify user of error and send them back
        console.error(err);
        enqueueSnackbar(typeof err == 'string' ? err : 'Cannot read content');
        history.goBack();
      }
    }
    loadData();

    // Revoke blob urls on unmount
    return () => imgURLs.forEach(url => URL.revokeObjectURL(url));
  }, []);

  return (
    <div className={classes.root}>
      {ast.map((node, i) => (
        <AST key={i} ast={node} />
      ))}
    </div>
  );
}

export const Reader = withStyles(styles)(_Reader);
