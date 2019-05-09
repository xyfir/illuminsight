import { Insightful } from 'types/insightful';

/**
 * Convert a DOM node to AST.
 */
export function nodeToAST(node: Node): Insightful.AST | undefined {
  // Element node
  if (node.nodeType == node.ELEMENT_NODE) {
    const ast: Insightful.AST = { n: node.nodeName.toLowerCase() };

    // Save link's href attribute
    if (ast.n == 'a') {
      ast.a = { href: (node as HTMLAnchorElement).href };
    }
    // Save image's src attribute
    if (ast.n == 'img') {
      const { src, alt } = node as HTMLImageElement;
      ast.a = { src };
      if (alt) ast.a.alt = alt;
    }

    // Recursively build AST for child nodes
    for (let childNode of node.childNodes) {
      const childAST = nodeToAST(childNode);
      if (childAST) {
        // Add child to list
        if (ast.c) ast.c.push(childAST);
        // Create list with child
        else ast.c = [childAST];
      }
    }

    return ast;
  }
  // Text or CDATA node (which we treat same as text)
  else if (
    (node.nodeType == node.TEXT_NODE ||
      node.nodeType == node.CDATA_SECTION_NODE) &&
    node.textContent
  ) {
    // Only return if it still has content after trimming
    const text = node.textContent.trim();
    if (text) return text;
  }
}
