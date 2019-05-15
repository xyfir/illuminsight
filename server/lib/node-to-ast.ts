import { Insightful } from 'types/insightful';

const EXCLUDED_ELEMENTS = ['iframe', 'script', 'style', 'link'];

/**
 * Convert a DOM node to AST.
 */
export function nodeToAST(node: Node): Insightful.AST | undefined {
  // Element node
  if (node.nodeType == node.ELEMENT_NODE) {
    const ast: Insightful.AST = { n: node.nodeName.toLowerCase() };

    // Ignore excluded elements
    if (EXCLUDED_ELEMENTS.includes(ast.n)) return;

    // Copy all but `class` attribute
    for (let attr of (node as Element).attributes) {
      if (attr.name == 'class') continue;
      if (ast.a) ast.a[attr.name] = attr.value;
      else ast.a = { [attr.name]: attr.value };
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
