import { defaultRecipe } from 'lib/reader/recipes';
import {
  SET_INSIGHTS,
  TOGGLE_THEME,
  ActionTypes,
  RESET_STATE,
  SET_RECIPE,
  AppState,
  SET_PUB,
  SET_AST,
} from 'store/types';

export function initialState(): AppState {
  return {
    recipe: defaultRecipe,
    theme: localStorage.theme || 'light',
    ast: [],
  };
}

export function reducer(
  state: AppState = initialState(),
  action: ActionTypes,
): AppState {
  switch (action.type) {
    case SET_INSIGHTS:
      return { ...state, insights: action.payload };
    case TOGGLE_THEME:
      return { ...state, theme: state.theme == 'dark' ? 'light' : 'dark' };
    case RESET_STATE:
      return { ...initialState() };
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
