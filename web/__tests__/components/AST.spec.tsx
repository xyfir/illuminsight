import { Insightful } from 'types/insightful';
import { render } from 'react-testing-library';
import * as React from 'react';
import { AST } from 'components/AST';

test('<AST>', async () => {
  // Create AST
  const ast: Insightful.AST[] = [
    {
      n: 'h1',
      c: ['Heading 1']
    },
    {
      n: 'p',
      c: [
        'This is a paragraph',
        {
          n: 'a',
          c: ['with a link'],
          a: { href: 'https://example.com' }
        },
        'and',
        {
          n: 'em',
          c: [
            {
              n: 'strong',
              c: ['strongly']
            },
            'emphasised text'
          ]
        },
        'and',
        {
          n: 'code',
          c: ['inline code']
        }
      ]
    },
    {
      n: 'h2',
      c: ['Heading 2']
    },
    { n: 'hr' },
    {
      n: 'img',
      a: {
        src: 'https://example.com/img.png',
        alt: 'A picture of ...'
      }
    },
    {
      n: 'ul',
      c: [
        {
          n: 'li',
          c: ['UL item #1']
        },
        {
          n: 'li',
          c: ['UL item #2']
        }
      ]
    },
    {
      n: 'ol',
      c: [
        {
          n: 'li',
          c: ['OL item #1']
        },
        {
          n: 'li',
          c: ['OL item #2']
        }
      ]
    },
    {
      n: 'pre',
      c: [
        {
          n: 'code',
          c: ['code block line 1\ncode block line 2']
        }
      ]
    }
  ];

  // Render AST
  const { getByAltText, getByText, container } = render(
    <div>
      {ast.map((node, i) => (
        <AST key={i} ast={node} />
      ))}
    </div>
  );

  let el: HTMLElement;

  // Expect properly rendered AST
  el = getByText('Heading 1');
  expect(el.tagName).toBe('H1');
  el = getByText(
    'This is a paragraph with a link and strongly emphasised text and inline code'
  );
  expect(el.tagName).toBe('P');
  el = getByText('with a link');
  expect(el.tagName).toBe('A');
  expect((el as HTMLAnchorElement).href).toBe('https://example.com');
  el = getByText('strongly emphasised text');
  expect(el.tagName).toBe('EM');
  el = getByText('strongly');
  expect(el.tagName).toBe('STRONG');
  el = getByText('inline code');
  expect(el.tagName).toBe('CODE');
  expect(container.querySelector('hr')).not.toBeNull();
  el = getByAltText('A picture of ...');
  expect(el.tagName).toBe('IMG');
  expect((el as HTMLImageElement).src).toBe('https://example.com/img.png');
  el = getByAltText('UL item #1');
  expect(el.tagName).toBe('LI');
  expect((el.parentElement as HTMLUListElement).tagName).toBe('UL');
  el = getByAltText('UL item #2');
  expect(el.tagName).toBe('LI');
  el = getByAltText('OL item #1');
  expect(el.tagName).toBe('LI');
  expect((el.parentElement as HTMLOListElement).tagName).toBe('OL');
  el = getByAltText('OL item #2');
  expect(el.tagName).toBe('LI');
  el = getByAltText('OL item #2');
  expect(el.tagName).toBe('LI');
  el = getByAltText('code block line 1\ncode block line 2');
  expect(el.tagName).toBe('CODE');
  expect((el.parentElement as HTMLPreElement).tagName).toBe('PRE');
});
