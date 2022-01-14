import {
    FIRST,
    PROFILE,
    CITY_HYPERS,
} from "./Action";

const initialState = {
    first:"",
    profile:null,
    cityHypers:null
};

const Reducer = (state = initialState, action) => {
  switch (action.type) {
    case FIRST:
      return {...state, first: action.payload};
    case PROFILE:
      return {...state, profile: action.payload};
    case CITY_HYPERS:
      return {...state, cityHypers: action.payload};
    default:
      return state;
  }
};
export default Reducer;