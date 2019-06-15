import { Illuminsight } from 'types/illuminsight';

/**
 * Count words in AST node.
 */
export function countWords(node: Illuminsight.AST): number {
  // Count words in string
  if (typeof node == 'string') {
    const text = node.trim();
    return !text ? 0 : text.split(/\s+|\-+/).length;
  }
  // Count words recursively in child nodes
  else if (node.c) {
    let words = 0;
    for (let child of node.c) words += countWords(child);
    return words;
  }
  return 0;
}
