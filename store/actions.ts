import { Illuminsight } from 'types';
import {
  SetInsightsAction,
  ToggleThemeAction,
  SetRecipeAction,
  SET_INSIGHTS,
  SetASTAction,
  TOGGLE_THEME,
  SetPubAction,
  SET_RECIPE,
  SET_PUB,
  SET_AST,
} from 'store/types';

export function setInsights(
  insights: SetInsightsAction['payload'],
): SetInsightsAction {
  return { type: SET_INSIGHTS, payload: insights };
}

export function toggleTheme(): ToggleThemeAction {
  return { type: TOGGLE_THEME };
}

export function setRecipe(recipe: Illuminsight.Recipe): SetRecipeAction {
  return { type: SET_RECIPE, payload: recipe };
}

export function setPub(pub: SetPubAction['payload']): SetPubAction {
  return { type: SET_PUB, payload: pub };
}

export function setAST(ast: Illuminsight.AST[]): SetASTAction {
  return { type: SET_AST, payload: ast };
}
