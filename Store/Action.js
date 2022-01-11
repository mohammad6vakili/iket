export const FIRST="FIRST";
export const PROFILE="PROFILE";


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