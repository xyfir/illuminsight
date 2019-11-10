import { Illuminsight } from 'types';
import { ThemeType } from 'lib/app/theme';
import { Dispatch } from 'redux';

export interface AppState {
  insights?: Illuminsight.Insights;
  recipe: Illuminsight.Recipe;
  theme: ThemeType;
  pub?: Illuminsight.Pub;
  ast: Illuminsight.AST[];
}

export const SET_INSIGHTS = 'SET_INSIGHTS';
export interface SetInsightsAction {
  type: typeof SET_INSIGHTS;
  payload: Illuminsight.Insights | undefined;
}

export const TOGGLE_THEME = 'TOGGLE_THEME';
export interface ToggleThemeAction {
  type: typeof TOGGLE_THEME;
}

export const SET_RECIPE = 'SET_RECIPE';
export interface SetRecipeAction {
  type: typeof SET_RECIPE;
  payload: Illuminsight.Recipe;
}

export const SET_PUB = 'SET_PUB';
export interface SetPubAction {
  type: typeof SET_PUB;
  payload: Illuminsight.Pub | undefined;
}

export const SET_AST = 'SET_AST';
export interface SetASTAction {
  type: typeof SET_AST;
  payload: Illuminsight.AST[];
}

export type ActionTypes =
  | SetInsightsAction
  | ToggleThemeAction
  | SetRecipeAction
  | SetPubAction
  | SetASTAction;

export type DispatchAction = Dispatch<ActionTypes>;
