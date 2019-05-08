import { Insightful } from 'types/insightful';

export const testEntity: Insightful.Entity = {
  authors: 'Jane Austen',
  bookmark: { section: 0, block: 0 },
  id: 1556915133437,
  name: 'Pride and Prejudice',
  cover: 'images/cover.jpg',
  published: -4952074022000,
  spine: [],
  starred: false,
  tags: [],
  version: process.enve.ASTPUB_VERSION,
  words: '123'
};

export const testAST: Insightful.AST[] = [
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
