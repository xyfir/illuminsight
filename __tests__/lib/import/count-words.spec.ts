import { Illuminsight } from 'types';
import { countWords } from 'lib/import/count-words';

test('countWords()', async () => {
  const ast: Illuminsight.AST[] = [
    { n: 'h1', a: { id: 'h1' }, c: ['Lorem Ipsum'] },
    {
      n: 'h4',
      a: { id: 'h4' },
      c: [
        '"Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit..."',
      ],
    },
    {
      n: 'h5',
      c: [
        '"There is no one who loves pain itself, who seeks after it and wants to have it, simply because it is pain..."',
      ],
    },
    { n: 'hr' },
    {
      n: 'p',
      c: [
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed quis auctor erat. Sed accumsan, nibh non commodo dignissim, elit odio fringilla metus, ut ultrices turpis purus et orci.',
        {
          n: 'a',
          a: { href: 'https://example.com' },
          c: ['Nullam posuere tempor dictum.'],
        },
        'Donec nibh lectus, efficitur eu est quis, suscipit tempus lectus. Praesent eu sagittis libero, eu dapibus elit. Aliquam sed sapien magna. Fusce iaculis ultrices sapien, id fringilla nibh placerat eget. Phasellus cursus commodo velit sed condimentum. Praesent finibus euismod pharetra. Etiam vestibulum venenatis ligula.',
      ],
    },
    {
      n: 'p',
      c: [
        'Nunc lobortis posuere nulla,',
        { n: 'a', a: { href: 'lorem.html#h4' }, c: ['vel vestibulum'] },
        'massa viverra vitae. Maecenas porttitor dui et malesuada maximus. Aenean non elementum risus, et luctus ex. Duis feugiat orci quam, a condimentum justo sagittis eget. Curabitur vulputate turpis vitae tellus convallis imperdiet. Vivamus imperdiet massa neque, aliquam feugiat odio molestie nec. Donec suscipit, felis sit amet scelerisque dapibus, leo nisi semper quam, id vehicula ligula purus in dui. Sed cursus diam ut metus egestas tempus.',
      ],
    },
  ];

  // Count words in AST nodes
  let words = 0;
  for (const node of ast) words += countWords(node);

  // Validate that words counted has not changed
  expect(words).toBe(185);
});
