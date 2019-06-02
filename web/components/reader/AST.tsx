import { Insightful } from 'types/insightful';
import { Insights } from 'components/reader/Insights';
import { Indexer } from 'lib/reader/Indexer';
import * as React from 'react';

export function AST({
  insights,
  ast
}: {
  insights: Insightful.Insights;
  ast: Insightful.AST;
}) {
  const index = Indexer.index;

  return (
    <React.Fragment>
      {typeof ast == 'object'
        ? React.createElement(
            ast.n,
            { ...(ast.a || {}), ast: index },
            ast.c &&
              ast.c.map((child, i) => (
                <AST key={i} ast={child} insights={insights} />
              ))
          )
        : ast}
      {insights[index] ? <Insights insights={insights[index]} /> : null}
    </React.Fragment>
  );
}
