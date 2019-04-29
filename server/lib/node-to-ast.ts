import { Insightful } from 'types/insightful';

/**
 * Convert a DOM node to AST.
 */
export function nodeToAst(node: Node): Insightful.AST | string | undefined {
  // Element node
  if (node.nodeType == node.ELEMENT_NODE) {
    const ast: Insightful.AST = { n: node.nodeName.toLowerCase(), c: [] };

    // Save link's href attribute
    if (ast.n == 'a') ast.a = { href: (node as HTMLAnchorElement).href };
    // Save image's src attribute
    if (ast.n == 'img') ast.a = { src: (node as HTMLImageElement).src };

    // Recursively build AST for child nodes
    for (let childNode of node.childNodes) {
      const childAST = nodeToAst(childNode);
      if (childAST) ast.c.push(childAST);
    }

    return ast;
  }
  // Text or CDATA node (which we treat same as text)
  else if (
    (node.nodeType == node.TEXT_NODE ||
      node.nodeType == node.CDATA_SECTION_NODE) &&
    node.textContent
  ) {
    return node.textContent;
  }
}
