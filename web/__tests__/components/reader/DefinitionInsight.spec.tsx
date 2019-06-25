import { testWiktionaryWikitext } from 'lib/test/data';
import { DefinitionInsight } from 'components/reader/DefinitionInsight';
import { fireEvent, render } from '@testing-library/react';
import * as React from 'react';
import wtf from 'wtf_wikipedia';

test('<DefinitionInsight>', async () => {
  const { getByText, container } = render(
    <DefinitionInsight doc={wtf(testWiktionaryWikitext)} />
  );

  // Validate there's no links
  expect(Array.from(container.getElementsByTagName('a'))).toBeArrayOfSize(0);

  // Validate top "English" header has been removed
  expect(container.getElementsByTagName('h1')[0]!.textContent).not.toBe(
    'English'
  );

  // Validate no non-language or non-POS sections
  expect(() => getByText('Etymology')).toThrow();
  expect(() => getByText('Synonyms')).toThrow();

  // Render full article
  fireEvent.click(getByText('Full Definition'));

  // Validate full article was loaded into <WikiInsights>
  getByText('Wiktionary.org', { exact: false });
  getByText('Synonyms');
});
