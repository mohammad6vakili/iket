import {
    FIRST,
} from "./Action";

const initialState = {
    first:""
};

const Reducer = (state = initialState, action) => {
  switch (action.type) {
    case FIRST:
      return {...state, first: action.payload};
    default:
      return state;
  }
};
export default Reducer;