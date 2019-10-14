import { Illuminsight } from 'types';

/**
 * Get nodes from AST by tag name.
 */
export function getByTagName(
  name: string,
  ast: Illuminsight.AST[],
): Illuminsight.AST[] {
  const matches: Illuminsight.AST[] = [];

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
