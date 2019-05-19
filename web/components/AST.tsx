import { Insightful } from 'types/insightful';
import * as React from 'react';

export function AST({
  attributor,
  ast
}: {
  attributor: (node: Insightful.AST) => any | null;
  ast: Insightful.AST;
}) {
  if (typeof ast == 'string') return <React.Fragment>{ast}</React.Fragment>;

  return React.createElement(
    ast.n,
    { ...(ast.a || {}), ...(attributor(ast) || {}) },
    ast.c &&
      ast.c.map((child, i) => (
        <AST key={i} ast={child} attributor={attributor} />
      ))
  );
}
