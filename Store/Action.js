export const FIRST="FIRST";
export const PROFILE="PROFILE";
export const CITY_HYPERS="CITY_HYPERS";
export const CATEGORY_TYPE="CATEGORY_TYPE";
export const MENU="MENU";
export const RES_DATA="RES_DATA";
export const LAT="LAT";
export const LNG="LNG";


export const setFirst=(data)=>{
    return(
        {
            type:FIRST,
            payload:data
        }
    )
}
export const setProfile=(data)=>{
    return(
        {
            type:PROFILE,
            payload:data
        }
    )
}
export const setCityHypers=(data)=>{
    return(
        {
            type:CITY_HYPERS,
            payload:data
        }
    )
}
export const setCategoryType=(data)=>{
    return(
        {
            type:CATEGORY_TYPE,
            payload:data
        }
    )
}
export const setMenu=(data)=>{
    return(
        {
            type:MENU,
            payload:data
        }
    )
}
export const setResData=(data)=>{
    return(
        {
            type:RES_DATA,
            payload:data
        }
    )
}
export const setLat=(data)=>{
    return(
        {
            type:LAT,
            payload:data
        }
    )
}
export const setLng=(data)=>{
    return(
        {
            type:LNG,
            payload:data
        }
    )
}