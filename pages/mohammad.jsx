import { useEffect } from "react";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const Mohammad = () =>{
    const hello = useSelector(state=>state.Reducer.hello);
    useEffect(()=>{
        toast.warning(hello,{position:"bottom-center"});
    },[])

    return(
        <div className="mohammad">
            {hello==="" ? <span>null</span> : <span>hello mohammad</span>} 
        </div>
    )
}
export default Mohammad;