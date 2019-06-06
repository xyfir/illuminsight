import { fireEvent, render } from '@testing-library/react';
import { testWikitext } from 'lib/test/data';
import { WikiInsight } from 'components/reader/WikiInsight';
import * as React from 'react';
import * as wtf from 'wtf_wikipedia';

test('<WikiInsight>', () => {
  const { getByLabelText, getAllByText, getByText } = render(
    <WikiInsight
      insight={{
        text: 'Blood Meridian',
        wiki: wtf(testWikitext)
      }}
    />
  );

  // Validate only main section was rendered
  getByText("McCarthy's fifth book, it was published by", {
    exact: false
  });
  // in second section:
  expect(() =>
    getByText('The novel follows an adolescent runaway', { exact: false })
  ).toThrow();
  // in infobox:
  expect(() => getByText('historical novel')).toThrow();

  // Validate links are fixed
  let el = getByText('anti-Western');
  expect((el as HTMLAnchorElement).href).toBe(
    'https://en.wikipedia.org/wiki/Revisionist_Western'
  );

  // Validate attribution
  el = getByText('Source: (English) Wikipedia.org:');
  el = el.querySelector('a')!;
  expect(el.textContent).toBe('Blood Meridian');
  expect((el as HTMLAnchorElement).href).toBe(
    'https://en.wikipedia.org/wiki/Blood%20Meridian'
  );

  // Trigger 'main+stats' section
  fireEvent.click(getByText('Show Statistics'));

  // Validate infobox has loaded alonside main section
  getByText("McCarthy's fifth book, it was published by", {
    exact: false
  });
  getByText('historical novel');
  getByText('337 pp (first edition, hardback)');

  // Validate button is gone
  expect(() => getByText('Show Statistics')).toThrow();

  // Trigger 'all' section
  fireEvent.click(getByText('Continue Reading'));

  // Validate entire article has loaded
  getByText("McCarthy's fifth book, it was published by", {
    exact: false
  });
  getByText('The novel follows an adolescent runaway', { exact: false });
  getByText('historical novel');

  // Validate buttons are gone
  expect(() => getByText('Show Statistics')).toThrow();
  expect(() => getByText('Continue Reading')).toThrow();

  // Trigger 'toc' section
  fireEvent.click(getByLabelText('Wiki article table of contents'));

  // Validate TOC
  // Characters > Other recurring characters
  el = getByText('Other recurring characters');
  expect(el.parentElement!.parentElement!.parentElement!.textContent).toBe(
    'CharactersMajor charactersOther recurring characters'
  );

  // Validate content from section we want isn't rendered
  expect(() => getByText('Captain White, or "the captain"')).toThrow();

  // Trigger section change to "Other recurring characters"
  fireEvent.click(el);

  // Validate only selected section was rendered
  getByText('Captain White, or "the captain"');

  // Validate attribution not rendered
  expect(() => getByText('Source: (English) Wikipedia.org:')).toThrow();

  // Trigger section change from breadcrumbs to "Characters"
  fireEvent.click(getByText('Characters'));

  // Validate only selected section was rendered
  expect(() => getByText('Other recurring characters')).toThrow();
  let els = getAllByText('Characters');
  expect(els).toBeArrayOfSize(2);
  expect(els[0].tagName).toBe('SPAN');
  expect(els[1].tagName).toBe('H1');

  // Trigger section change from breadcrumbs to main "Blood Meridian"
  fireEvent.click(getByText('Blood Meridian'));

  // Validate we're back to main section
  getByText('Source: (English) Wikipedia.org:');
  getByText("McCarthy's fifth book, it was published by", {
    exact: false
  });
  getByText('Continue Reading');
  getByText('Show Statistics');
});
