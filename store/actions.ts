import { Illuminsight } from 'types';
import {
  SET_INSIGHTS_INDEX,
  SetInsightsAction,
  SetRecipeAction,
  SetASTAction,
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

export function setRecipe(recipe: Illuminsight.Recipe): SetRecipeAction {
  return { type: SET_RECIPE, payload: recipe };
}

export function setPub(pub: Illuminsight.Pub): SetPubAction {
  return { type: SET_PUB, payload: pub };
}

export function setAST(ast: Illuminsight.AST[]): SetASTAction {
  return { type: SET_AST, payload: ast };
}
