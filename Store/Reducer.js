import {
    FIRST,
    PROFILE
} from "./Action";

const initialState = {
    first:"",
    profile:null
};

const Reducer = (state = initialState, action) => {
  switch (action.type) {
    case FIRST:
      return {...state, first: action.payload};
    case PROFILE:
      return {...state, profile: action.payload};
    default:
      return state;
  }
};
export default Reducer;