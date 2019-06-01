import { Insightful } from 'types/insightful';
import { Indexer } from 'lib/reader/Indexer';
import * as React from 'react';

export function AST({
  attributor,
  ast
}: {
  attributor: (node: Insightful.AST) => any;
  ast: Insightful.AST;
}) {
  const index = Indexer.index;

  return typeof ast == 'object' ? (
    React.createElement(
      ast.n,
      { ...(ast.a || {}), ...attributor(ast), ast: index },
      ast.c &&
        ast.c.map((child, i) => (
          <AST key={i} ast={child} attributor={attributor} />
        ))
    )
  ) : (
    <React.Fragment>{ast}</React.Fragment>
  );
}
