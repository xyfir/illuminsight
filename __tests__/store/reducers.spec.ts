import { initialState, reducer } from 'store/reducers';
import { Illuminsight } from 'types';
import { testPub } from 'lib/test/data';
import {
  setInsights,
  toggleTheme,
  resetState,
  setRecipe,
  setPub,
  setAST,
} from 'store/actions';

test('setInsights()', () => {
  const insights: Illuminsight.Insights = { searches: [], wikis: [], text: '' };
  const state = reducer(undefined, setInsights(insights));
  expect(state.insights).toBe(insights);
});

test('toggleTheme()', () => {
  let state = reducer(undefined, toggleTheme());
  expect(state.theme).toBe('dark');
  state = reducer(state, toggleTheme());
  expect(state.theme).toBe('light');
});

test('resetState()', () => {
  const state = reducer(
    { ...initialState(), ast: [{ n: 'hr' }] },
    resetState(),
  );
  expect(state).toMatchObject(initialState());
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

test('initialState()', () => {
  // @ts-ignore
  const state = reducer(undefined, {});
  expect(state).toMatchObject(initialState());
});
