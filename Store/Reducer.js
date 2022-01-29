import {
    FIRST,
    PROFILE,
    CITY_HYPERS,
    CATEGORY_TYPE,
    MENU,
    RES_DATA,
    LAT,
    LNG
} from "./Action";

const initialState = {
    first:"",
    profile:null,
    cityHypers:null,
    categoryType:"",
    menu:0,
    resData:null,
    lat:"",
    lng:""
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
    case MENU:
      return {...state, menu: action.payload};
    case RES_DATA:
      return {...state, resData: action.payload};
    case LAT:
      return {...state, lat: action.payload};
    case LNG:
      return {...state, lng: action.payload};
    default:
      return state;
  }
};
export default Reducer;