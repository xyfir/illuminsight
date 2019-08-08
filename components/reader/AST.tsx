import { Illuminsight } from 'types';
import { Insights } from 'components/reader/Insights';
import { Indexer } from 'lib/reader/Indexer';
import * as React from 'react';

export function AST({ ast }: { ast: Illuminsight.AST }) {
  const index = Indexer.index;

  return (
    <React.Fragment>
      {typeof ast == 'object'
        ? React.createElement(
            ast.n,
            { ...(ast.a || {}), ast: index },
            ast.c && ast.c.map((child, i) => <AST key={i} ast={child} />)
          )
        : ast}

      <Insights index={index} />
    </React.Fragment>
  );
}
