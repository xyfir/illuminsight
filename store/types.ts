import { Illuminsight } from 'types';
import { Dispatch } from 'redux';

export interface AppState {
  insightsIndex: Illuminsight.InsightsIndex;
  recipe: Illuminsight.Recipe;
  pub?: Illuminsight.Pub;
  ast: Illuminsight.AST[];
}

export const SET_INSIGHTS_INDEX = 'SET_INSIGHTS_INDEX';
export interface SetInsightsAction {
  type: typeof SET_INSIGHTS_INDEX;
  payload: Illuminsight.InsightsIndex;
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
  | SetInsightsAction
  | SetRecipeAction
  | SetPubAction
  | SetASTAction;

export type DispatchAction = Dispatch<ActionTypes>;
