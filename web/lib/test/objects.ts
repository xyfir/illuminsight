import { Insightful } from 'types/insightful';

export const testTags: Insightful.Tag[] = [
  { id: 1556915133433, name: 'alpha' },
  { id: 1556915133434, name: 'bravo' },
  { id: 1556915133435, name: 'charlie' },
  { id: 1556915133436, name: 'delta' }
];

export const testEntity: Insightful.Entity = {
  authors: 'Jane Austen',
  bookmark: { section: 0, element: 0 },
  id: 1556915133437,
  name: 'Pride and Prejudice',
  cover: 'images/cover.jpg',
  published: -4952074022000,
  toc: [
    { section: 0, element: 0, title: 'Title' },
    { section: 1, element: 0, title: 'Pride and Prejudice' },
    { section: 2, element: 0, title: 'Index' }
  ],
  sections: 3,
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
      src: 'images/0.png',
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

export const alternateTestAST: Insightful.AST[] = [
  { n: 'h1', c: ['Lorem Ipsum ...'] },
  {
    n: 'p',
    c: [
      '... dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lectus quam id leo in vitae. Gravida quis blandit turpis cursus in hac. Molestie ac feugiat sed lectus vestibulum mattis ullamcorper velit sed. Sed cras ornare arcu dui. Nisi porta lorem mollis aliquam ut porttitor leo a. Sit amet cursus sit amet dictum sit amet. Faucibus in ornare quam viverra orci sagittis. Quis vel eros donec ac odio tempor. Elementum curabitur vitae nunc sed velit dignissim sodales ut. Lacus laoreet non curabitur gravida arcu ac. Tempor orci eu lobortis elementum nibh tellus. Nisi est sit amet facilisis. Tristique risus nec feugiat in fermentum posuere urna.'
    ]
  },
  {
    n: 'p',
    c: [
      'Purus viverra accumsan in nisl nisi scelerisque eu ultrices vitae. Sit amet luctus venenatis lectus magna fringilla. Consectetur adipiscing elit duis tristique sollicitudin. Metus aliquam eleifend mi in nulla posuere. Orci eu lobortis elementum nibh tellus molestie nunc. Consequat semper viverra nam libero justo laoreet sit. Consequat mauris nunc congue nisi. Sem integer vitae justo eget. Habitant morbi tristique senectus et netus. Id neque aliquam vestibulum morbi blandit. Porta non pulvinar neque laoreet suspendisse interdum consectetur libero id. Sit amet facilisis magna etiam tempor orci eu lobortis elementum. Feugiat scelerisque varius morbi enim nunc faucibus a pellentesque. Vel facilisis volutpat est velit.'
    ]
  },
  {
    n: 'p',
    c: [
      'Turpis massa tincidunt dui ut ornare lectus sit amet. Ultricies mi eget mauris pharetra et. Velit egestas dui id ornare arcu odio ut. Posuere lorem ipsum dolor sit amet consectetur. Risus quis varius quam quisque id. Ultrices gravida dictum fusce ut placerat orci nulla pellentesque. Viverra vitae congue eu consequat ac felis donec et odio. Nunc eget lorem dolor sed viverra. At lectus urna duis convallis convallis. Pharetra pharetra massa massa ultricies mi. Sem nulla pharetra diam sit amet nisl suscipit adipiscing. Aenean euismod elementum nisi quis eleifend quam adipiscing vitae. Lectus quam id leo in vitae turpis massa sed. Viverra tellus in hac habitasse platea dictumst. Netus et malesuada fames ac turpis egestas.'
    ]
  },
  {
    n: 'p',
    c: [
      'Pellentesque pulvinar pellentesque habitant morbi tristique senectus. Dignissim suspendisse in est ante in nibh. Facilisis mauris sit amet massa vitae tortor condimentum. Sit amet nulla facilisi morbi tempus. In vitae turpis massa sed elementum tempus egestas sed. Vel quam elementum pulvinar etiam non quam lacus. Massa massa ultricies mi quis hendrerit dolor magna. Libero nunc consequat interdum varius sit amet mattis vulputate enim. Viverra justo nec ultrices dui sapien. Pellentesque elit eget gravida cum sociis natoque penatibus. Diam volutpat commodo sed egestas egestas fringilla phasellus. Nascetur ridiculus mus mauris vitae ultricies leo integer malesuada.'
    ]
  },
  {
    n: 'p',
    c: [
      'Erat imperdiet sed euismod nisi porta lorem mollis aliquam ut. Gravida cum sociis natoque penatibus et. Sit amet est placerat in egestas erat imperdiet. Eu feugiat pretium nibh ipsum consequat nisl vel pretium. Massa id neque aliquam vestibulum morbi blandit cursus risus at. Praesent elementum facilisis leo vel fringilla est ullamcorper eget nulla. At ultrices mi tempus imperdiet nulla malesuada pellentesque. Nunc vel risus commodo viverra maecenas. Mattis nunc sed blandit libero volutpat sed cras ornare arcu. Sed egestas egestas fringilla phasellus faucibus scelerisque eleifend donec pretium.'
    ]
  }
];
