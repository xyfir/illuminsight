import { Insightful } from 'types/insightful';

/**
 * Query an AST to find matching nodes.
 */
export function queryAST(
  query: (ast: Insightful.AST) => boolean,
  ast: Insightful.AST[]
): Insightful.AST[] {
  const matches: Insightful.AST[] = [];

  for (let node of ast) {
    // Check if string node matches
    if (typeof node == 'string') {
      if (query(node)) matches.push(node);
    }
    // Check if non-string node matches
    else {
      // Include node if it matches
      if (query(node)) matches.push(node);

      // Include chilren if they match
      if (node.c) matches.push(...queryAST(query, node.c));
    }
  }

  return matches;
}
