import { render } from 'react-testing-library';
import * as React from 'react';
import { AST } from 'components/AST';
import { testAST } from 'lib/test/objects';

test('<AST>', async () => {
  // Render AST
  const { getByAltText, getByText, container } = render(
    <div>
      {testAST.map((node, i) => (
        <AST key={i} ast={node} />
      ))}
    </div>
  );
  let el: HTMLElement;

  // h1
  el = getByText('Heading 1');
  expect(el.tagName).toBe('H1');

  // p
  el = getByText('This is a paragraph', { exact: false });
  expect(el.tagName).toBe('P');

  // p > a
  el = getByText('with a link');
  expect(el.tagName).toBe('A');
  expect((el as HTMLAnchorElement).href).toBe('https://example.com/');

  // p > em
  expect((el.parentElement as HTMLParagraphElement).tagName).toBe('P');
  el = getByText('emphasised text');
  expect(el.tagName).toBe('EM');

  // p > em > strong
  expect((el.parentElement as HTMLParagraphElement).tagName).toBe('P');
  el = getByText('strongly');
  expect(el.tagName).toBe('STRONG');

  // p > code
  el = getByText('inline code');
  expect(el.tagName).toBe('CODE');
  expect((el.parentElement as HTMLParagraphElement).tagName).toBe('P');

  // hr
  expect(container.querySelector('hr')).not.toBeNull();

  // img
  el = getByAltText('A picture of ...');
  expect(el.tagName).toBe('IMG');
  expect((el as HTMLImageElement).src).toEndWith('images/0.png');

  // ul > li
  el = getByText('UL item #1');
  expect(el.tagName).toBe('LI');
  expect((el.parentElement as HTMLUListElement).tagName).toBe('UL');
  el = getByText('UL item #2');
  expect(el.tagName).toBe('LI');

  // ol > li
  el = getByText('OL item #1');
  expect(el.tagName).toBe('LI');
  expect((el.parentElement as HTMLOListElement).tagName).toBe('OL');
  el = getByText('OL item #2');
  expect(el.tagName).toBe('LI');

  // pre > code
  el = getByText('code block line 1', { exact: false });
  expect(el.tagName).toBe('CODE');
  expect((el.parentElement as HTMLPreElement).tagName).toBe('PRE');
});
