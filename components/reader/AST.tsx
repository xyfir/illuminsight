import { Illuminsight } from 'types';
import { Indexer } from 'lib/reader/Indexer';
import * as React from 'react';

export function AST({ ast }: { ast: Illuminsight.AST }): JSX.Element {
  const index = Indexer.index;

  return typeof ast == 'object' ? (
    React.createElement(
      ast.n,
      { ...(ast.a || {}), ast: index },
      ast.c && ast.c.map((child, i) => <AST key={i} ast={child} />),
    )
  ) : (
    <>{ast}</>
  );
}
