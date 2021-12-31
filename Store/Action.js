export const HELLO="HELLO";


export const setHello=(data)=>{
    return(
        {
            type:HELLO,
            payload:data
        }
    )
}