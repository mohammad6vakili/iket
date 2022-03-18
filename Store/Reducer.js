import {
    FIRST,
    PROFILE,
    CART,
    CITY_HYPERS,
    CATEGORY_TYPE,
    MENU,
    RES_DATA,
    LAT,
    LNG,
    FOOD,
    HYPERS,
    SELECTED_HYPER,
    SELECTED_SUBCAT,
    PRODUCT,
    ADDRESS,
    SELECTED_ADDRESS,
    FACTOR_DATA,
    EDTI_ADDRESS,
    BADGE,
    SELECTED_PROVIDER,
    VITRIN,
    CATEGORIES,
    STEP
} from "./Action";

const initialState = {
    first:"",
    profile:null,
    cart:[],
    cityHypers:null,
    categoryType:"",
    menu:0,
    resData:null,
    lat:"",
    lng:"",
    food:null,
    hypers:[],
    selectedHyper:null,
    selectedSubCat:null,
    product:null,
    address:null,
    selectedAddress:null,
    factorData:null,
    editAddress:null,
    badge:0,
    selectedProvider:null,
    vitrin:null,
    categories:null,
    step:0
};

const Reducer = (state = initialState, action) => {
  switch (action.type) {
    case FIRST:
      return {...state, first: action.payload};
    case PROFILE:
      return {...state, profile: action.payload};
    case CART:
      return {...state, cart: action.payload};
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
    case FOOD:
      return {...state, food: action.payload};
    case HYPERS:
      return {...state, hypers: action.payload};
    case SELECTED_HYPER:
      return {...state, selectedHyper: action.payload};
    case SELECTED_SUBCAT:
      return {...state, selectedSubCat: action.payload};
    case PRODUCT:
      return {...state, product: action.payload};
    case ADDRESS:
      return {...state, address: action.payload};
    case SELECTED_ADDRESS:
      return {...state, selectedAddress: action.payload};
    case FACTOR_DATA:
      return {...state, factorData: action.payload};
    case EDTI_ADDRESS:
      return {...state, editAddress: action.payload};
    case BADGE:
      return {...state, badge: action.payload};
    case SELECTED_PROVIDER:
      return {...state, selectedProvider: action.payload};
    case VITRIN:
      return {...state, vitrin: action.payload};
    case CATEGORIES:
      return {...state, categories: action.payload};
    case STEP:
      return {...state, step: action.payload};
    default:
      return state;
  }
};
export default Reducer;