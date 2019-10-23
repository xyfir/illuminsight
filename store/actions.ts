import { Illuminsight } from 'types';
import {
  RemoveInsightsAction,
  SET_INSIGHTS_INDEX,
  SetInsightsAction,
  AddInsightsAction,
  ToggleThemeAction,
  SetRecipeAction,
  REMOVE_INSIGHTS,
  SetASTAction,
  TOGGLE_THEME,
  ADD_INSIGHTS,
  SetPubAction,
  SET_RECIPE,
  SET_PUB,
  SET_AST,
} from 'store/types';

export function setInsightsIndex(
  insightsIndex: Illuminsight.InsightsIndex,
): SetInsightsAction {
  return { type: SET_INSIGHTS_INDEX, payload: insightsIndex };
}

export function removeInsights(index: number): RemoveInsightsAction {
  return { type: REMOVE_INSIGHTS, payload: index };
}

export function addInsights(
  index: number,
  insights: Illuminsight.Insight[],
): AddInsightsAction {
  return { type: ADD_INSIGHTS, payload: { index, insights } };
}

export function toggleTheme(): ToggleThemeAction {
  return { type: TOGGLE_THEME };
}

export function setRecipe(recipe: Illuminsight.Recipe): SetRecipeAction {
  return { type: SET_RECIPE, payload: recipe };
}

export function setPub(pub: Illuminsight.Pub): SetPubAction {
  return { type: SET_PUB, payload: pub };
}

export function setAST(ast: Illuminsight.AST[]): SetASTAction {
  return { type: SET_AST, payload: ast };
}
