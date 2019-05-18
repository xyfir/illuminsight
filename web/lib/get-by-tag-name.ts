import { Insightful } from 'types/insightful';

/**
 * Get nodes from AST by tag name.
 */
export function getByTagName(
  name: string,
  ast: Insightful.AST[]
): Insightful.AST[] {
  const matches: Insightful.AST[] = [];

  for (let node of ast) {
    // Ignore string nodes
    if (typeof node == 'string') continue;

    // Include node if it matches
    if (node.n == name) matches.push(node);

    // Include chilren if they match
    if (node.c) matches.push(...getByTagName(name, node.c));
  }

  return matches;
}
