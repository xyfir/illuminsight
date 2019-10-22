import { defaultRecipe } from 'lib/reader/recipes';
import {
  SET_INSIGHTS_INDEX,
  REMOVE_INSIGHTS,
  ADD_INSIGHTS,
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
    case REMOVE_INSIGHTS:
      return ((): AppState => {
        const insightsIndex = { ...state.insightsIndex };
        delete insightsIndex[action.payload];
        return { ...state, insightsIndex };
      })();
    case ADD_INSIGHTS:
      return {
        ...state,
        insightsIndex: {
          ...state.insightsIndex,
          [action.payload.index]: state.insightsIndex[action.payload.index]
            ? state.insightsIndex[action.payload.index].concat(
                action.payload.insights,
              )
            : action.payload.insights,
        },
      };
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
