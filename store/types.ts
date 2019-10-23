import { Illuminsight } from 'types';
import { ThemeType } from 'lib/app/theme';
import { Dispatch } from 'redux';

export interface AppState {
  insightsIndex: Illuminsight.InsightsIndex;
  recipe: Illuminsight.Recipe;
  theme: ThemeType;
  pub?: Illuminsight.Pub;
  ast: Illuminsight.AST[];
}

export const SET_INSIGHTS_INDEX = 'SET_INSIGHTS_INDEX';
export interface SetInsightsAction {
  type: typeof SET_INSIGHTS_INDEX;
  payload: Illuminsight.InsightsIndex;
}

export const REMOVE_INSIGHTS = 'REMOVE_INSIGHTS';
export interface RemoveInsightsAction {
  type: typeof REMOVE_INSIGHTS;
  payload: number;
}

export const ADD_INSIGHTS = 'ADD_INSIGHTS';
export interface AddInsightsAction {
  type: typeof ADD_INSIGHTS;
  payload: {
    index: number;
    insights: Illuminsight.Insight[];
  };
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
  payload: Illuminsight.Pub;
}

export const SET_AST = 'SET_AST';
export interface SetASTAction {
  type: typeof SET_AST;
  payload: Illuminsight.AST[];
}

export type ActionTypes =
  | RemoveInsightsAction
  | SetInsightsAction
  | AddInsightsAction
  | ToggleThemeAction
  | SetRecipeAction
  | SetPubAction
  | SetASTAction;

export type DispatchAction = Dispatch<ActionTypes>;
