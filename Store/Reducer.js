import {
    FIRST,
    PROFILE,
    CITY_HYPERS,
    CATEGORY_TYPE
} from "./Action";

const initialState = {
    first:"",
    profile:null,
    cityHypers:null,
    categoryType:""
};

const Reducer = (state = initialState, action) => {
  switch (action.type) {
    case FIRST:
      return {...state, first: action.payload};
    case PROFILE:
      return {...state, profile: action.payload};
    case CITY_HYPERS:
      return {...state, cityHypers: action.payload};
    case CATEGORY_TYPE:
      return {...state, categoryType: action.payload};
    default:
      return state;
  }
};
export default Reducer;