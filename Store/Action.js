export const FIRST="FIRST";
export const PROFILE="PROFILE";
export const CITY_HYPERS="CITY_HYPERS";
export const CATEGORY_TYPE="CATEGORY_TYPE";



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