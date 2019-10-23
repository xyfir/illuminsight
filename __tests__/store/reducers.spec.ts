import { initialState, reducer } from 'store/reducers';
import { Illuminsight } from 'types';
import { testPub } from 'lib/test/data';
import {
  setInsightsIndex,
  removeInsights,
  addInsights,
  toggleTheme,
  setRecipe,
  setPub,
  setAST,
} from 'store/actions';

test('setInsightsIndex()', () => {
  const insightsIndex = {};
  const state = reducer(undefined, setInsightsIndex(insightsIndex));
  expect(state.insightsIndex).toBe(insightsIndex);
});

test('removeInsights()', () => {
  const insightsIndex: Illuminsight.InsightsIndex = {
    123: [{ searches: [], wikis: [], text: '' }],
  };
  const state = reducer(
    { ...initialState, insightsIndex },
    removeInsights(123),
  );
  expect(state.insightsIndex[123]).toBeUndefined();
});

test('addInsights()', () => {
  const insights: Illuminsight.Insight[] = [
    { searches: [], wikis: [], text: '' },
  ];
  const state = reducer(undefined, addInsights(123, insights));
  expect(state.insightsIndex).toMatchObject({ 123: insights });
});

test('toggleTheme()', () => {
  let state = reducer(undefined, toggleTheme());
  expect(state.theme).toBe('dark');
  state = reducer(state, toggleTheme());
  expect(state.theme).toBe('light');
});

test('setRecipe()', () => {
  const recipe: Illuminsight.Recipe = { id: '123', wikis: [], searches: [] };
  const state = reducer(undefined, setRecipe(recipe));
  expect(state.recipe).toBe(recipe);
});

test('setPub()', () => {
  const state = reducer(undefined, setPub(testPub));
  expect(state.pub).toBe(testPub);
});

test('setAST()', () => {
  const ast: Illuminsight.AST[] = [];
  const state = reducer(undefined, setAST(ast));
  expect(state.ast).toBe(ast);
});

test('initialState', () => {
  // @ts-ignore
  const state = reducer(undefined, {});
  expect(state).toBe(initialState);
});
