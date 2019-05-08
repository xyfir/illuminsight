import { Insightful } from 'types/insightful';
import * as React from 'react';

export function AST({ ast }: { ast: Insightful.AST }) {
  if (typeof ast == 'string') return <React.Fragment>{ast}</React.Fragment>;

  return React.createElement(
    ast.n,
    ast.a,
    ast.c && ast.c.map((child, i) => <AST key={i} ast={child} />)
  );
}
