export const FIRST="FIRST";


export const setFirst=(data)=>{
    return(
        {
            type:FIRST,
            payload:data
        }
    )
}