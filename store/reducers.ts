import { defaultRecipe } from 'lib/reader/recipes';
import {
  SET_INSIGHTS_INDEX,
  ActionTypes,
  SET_RECIPE,
  AppState,
  SET_PUB,
  SET_AST,
} from 'store/types';

const initialState: AppState = {
  insightsIndex: {},
  recipe: defaultRecipe,
  ast: [],
};

export function reducer(
  state: AppState = initialState,
  action: ActionTypes,
): AppState {
  switch (action.type) {
    case SET_INSIGHTS_INDEX:
      return { ...state, insightsIndex: action.payload };
    case SET_RECIPE:
      return { ...state, recipe: action.payload };
    case SET_PUB:
      return { ...state, pub: action.payload };
    case SET_AST:
      return { ...state, ast: action.payload };
    default:
      return state;
  }
}
