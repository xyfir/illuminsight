import { Illuminsight } from 'types/illuminsight';
import { Insights } from 'components/reader/Insights';
import { Indexer } from 'lib/reader/Indexer';
import * as React from 'react';

export function AST({
  insightsIndex,
  ast
}: {
  insightsIndex: Illuminsight.InsightsIndex;
  ast: Illuminsight.AST;
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
        <Insights insights={insightsIndex[index]} index={index} />
      ) : null}
    </React.Fragment>
  );
}
