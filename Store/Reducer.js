import {
    HELLO,
} from "./Action";

const initialState = {
    hello:""
};

const Reducer = (state = initialState, action) => {
  switch (action.type) {
    case HELLO:
      return {...state, hello: action.payload};
    default:
      return state;
  }
};
export default Reducer;