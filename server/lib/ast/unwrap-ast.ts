import { Insightful } from 'types/insightful';

/**
 * Remove top-level wrapper elements that will prevent bookmark's "blocks"
 *  system from working.
 */
export function unwrapAST(node: Insightful.AST): Insightful.AST[] {
  // We received a string (shouldn't happen)
  if (typeof node == 'string') return [node];

  // Node does not have children (shouldn't happen)
  if (!node.c || !node.c.length) return [node];

  // Unwrap this node's only child
  if (node.c.length == 1 && typeof node.c[0] != 'string')
    return unwrapAST(node.c[0]);

  // Return node's non-string, non-wrapper children
  if (!node.c.some(c => typeof c == 'string')) return node.c;

  // Node contains string children, so keep it
  return [node];
}
