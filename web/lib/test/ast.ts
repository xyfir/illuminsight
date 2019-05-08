import { Insightful } from 'types/insightful';

export const ast: Insightful.AST[] = [
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
