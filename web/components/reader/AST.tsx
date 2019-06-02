import { Insightful } from 'types/insightful';
import { Insights } from 'components/reader/Insights';
import { Indexer } from 'lib/reader/Indexer';
import * as React from 'react';

export function AST({
  insightsIndex,
  ast
}: {
  insightsIndex: Insightful.InsightsIndex;
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
                <AST key={i} ast={child} insightsIndex={insightsIndex} />
              ))
          )
        : ast}
      {insightsIndex[index] ? (
        <Insights insights={insightsIndex[index]} />
      ) : null}
    </React.Fragment>
  );
}
