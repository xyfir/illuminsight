import { waitForDomChange, fireEvent, render } from '@testing-library/react';
import { alternateTestWikitext, testWikitext } from 'lib/test/data';
import { defaultRecipe } from 'lib/reader/recipes';
import { WikiInsight } from 'components/reader/WikiInsight';
import * as React from 'react';
import wtf from 'wtf_wikipedia';

test('<WikiInsight>', async () => {
  const { getByLabelText, getAllByText, getByText } = render(
    <WikiInsight
      insight={{ recipe: defaultRecipe.wikis[0], doc: wtf(testWikitext) }}
    />,
  );

  // Validate only main section was rendered
  getByText("McCarthy's fifth book", { exact: false });
  // in second section:
  expect(() =>
    getByText('The novel follows an adolescent runaway', { exact: false }),
  ).toThrow();
  // in infobox:
  expect(() => getByText('historical novel')).toThrow();

  // Validate attribution
  let el = getByText('Source: Wikipedia:');
  el = el.querySelector('a')!;
  expect(el.textContent).toBe(
    'Blood Meridian or The Evening Redness in the West',
  );
  expect((el as HTMLAnchorElement).href).toBe(
    'https://en.wikipedia.org/wiki/Blood%20Meridian%20or%20The%20Evening%20Redness%20in%20the%20West',
  );

  // Trigger 'main+stats' section
  fireEvent.click(getByText('Show Statistics'));

  // Validate infobox has loaded alonside main section
  getByText("McCarthy's fifth book", { exact: false });
  getByText('historical novel');
  getByText('337 pp (first edition, hardback)');

  // Validate button is gone
  expect(() => getByText('Show Statistics')).toThrow();

  // Trigger 'all' section
  fireEvent.click(getByText('Continue Reading'));

  // Validate entire article has loaded
  getByText("McCarthy's fifth book", { exact: false });
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
    'CharactersMajor charactersOther recurring characters',
  );

  // Validate content from section we want isn't rendered
  expect(() => getByText('Captain White, or "the captain"')).toThrow();

  // Trigger section change to "Other recurring characters"
  fireEvent.click(el);

  // Validate only selected section was rendered
  getByText('Captain White, or "the captain"');

  // Validate attribution not rendered
  expect(() => getByText('Source: Wikipedia:')).toThrow();

  // Trigger section change from breadcrumbs to "Characters"
  fireEvent.click(getByText('Characters'));

  // Validate only selected section was rendered
  expect(() => getByText('Other recurring characters')).toThrow();
  const els = getAllByText('Characters');
  expect(els).toBeArrayOfSize(2);
  expect(els[0].tagName).toBe('SPAN');
  expect(els[1].tagName).toBe('H1');

  // Trigger section change from breadcrumbs to main "Blood Meridian or The Evening Redness in the West"
  fireEvent.click(
    getByText('Blood Meridian or The Evening Redness in the West'),
  );

  // Validate we're back to main section
  getByText('Source: Wikipedia:');
  getByText("McCarthy's fifth book", { exact: false });
  getByText('Continue Reading');
  getByText('Show Statistics');

  // Mock wtf_wikipedia.fetch()
  const mockFetch = ((wtf as any).fetch = jest.fn());
  mockFetch.mockResolvedValueOnce(wtf(alternateTestWikitext));

  // Click "Cormac McCarthy" link
  fireEvent.click(getByText('Cormac McCarthy'));

  // Validate new article was loaded
  expect(mockFetch).toHaveBeenCalledTimes(1);
  expect(mockFetch.mock.calls[0][0]).toBe('Cormac_McCarthy');
  await waitForDomChange();
  getByText('American novelist, playwright, and', { exact: false });

  // Click back button to main "Blood Meridian" article
  fireEvent.click(getByLabelText('Go back to previous article'));

  // Validate we're back to main article
  getByText("McCarthy's fifth book", { exact: false });
});
