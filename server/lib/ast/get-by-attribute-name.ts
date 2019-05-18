import { Insightful } from 'types/insightful';

/**
 * Get nodes from AST by attribute name.
 */
export function getByAttributeName(
  name: string,
  ast: Insightful.AST[]
): Insightful.AST[] {
  const matches: Insightful.AST[] = [];

  for (let node of ast) {
    // Ignore string nodes
    if (typeof node == 'string') continue;
    // Check attribute
    else {
      // Include node if it matches
      if (node.a && node.a[name] !== undefined) matches.push(node);

      // Include chilren if they match
      if (node.c) matches.push(...getByAttributeName(name, node.c));
    }
  }

  return matches;
}
