export const FIRST="FIRST";
export const PROFILE="PROFILE";
export const CITY_HYPERS="CITY_HYPERS";
export const SELECT_CITY="SELECT_CITY";
export const SELECT_AREA="SELECT_AREA";


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