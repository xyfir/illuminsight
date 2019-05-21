import { Insightful } from 'types/insightful';

const REPLACEMENT_ATTRIBUTES: { [attr: string]: string } = {
  'xlink:href': 'href'
};
const EXCLUDED_ATTRIBUTES = ['class', 'tag'];
const EXCLUDED_ELEMENTS = ['iframe', 'script', 'style', 'link'];

/**
 * Convert a DOM node to AST.
 */
export function nodeToAST(
  node: Node,
  /**
   * Preserve whitespace if a child of a `<pre>` element.
   */
  pre: boolean = false
): Insightful.AST | undefined {
  // Element node
  if (node.nodeType == node.ELEMENT_NODE) {
    const ast: Insightful.AST = { n: node.nodeName.toLowerCase() };

    // Ignore excluded elements
    if (EXCLUDED_ELEMENTS.includes(ast.n)) return;

    // Copy all but excluded attributes
    for (let attr of (node as Element).attributes) {
      if (EXCLUDED_ATTRIBUTES.includes(attr.name)) continue;

      const name = REPLACEMENT_ATTRIBUTES[attr.name] || attr.name;
      if (ast.a) ast.a[name] = attr.value;
      else ast.a = { [name]: attr.value };
    }

    // Recursively build AST for child nodes
    for (let childNode of node.childNodes) {
      const childAST = nodeToAST(childNode, pre || ast.n == 'pre');
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
    // Preserve text content as is without manipulating whitespace
    if (pre) return node.textContent;

    // Convert newlines and multiple spaces to a single space
    const text = node.textContent.replace(/\n/g, ' ').replace(/\s{2,}/g, ' ');

    // Only return if it's more than just a single space
    if (text != ' ') return text;
  }
}
