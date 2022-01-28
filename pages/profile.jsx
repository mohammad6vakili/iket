import styles from "../styles/Profile.module.css";
import Menu from "../Components/Menu/Menu";
import axios from "axios";
import Env from "../Constant/Env.json";
import { toast } from "react-toastify";
import { useEffect } from "react";


const Profile=()=>{
    
    const getProfile=async()=>{
        const userId =localStorage.getItem("userId");
        let postData = new FormData();
        postData.append("ID",userId);
        postData.append("Token",Env.token);
        try{
            const response = await axios.post(Env.baseUrl + "GetUserInfo.aspx",postData)
            console.log(response.data);
        }catch({err,response}){
            toast.error("خطا در برقراری ارتباط",{
                position:"bottom-left"
            })
        }
    }

    useEffect(()=>{
        getProfile();
    },[])

    return(
        <div>
            <div className="app-container">
                <Menu/>
                <div className={`${styles.profile} dashboard-page`}>
                    <div className="header">
                        حساب کاربری شما
                    </div>
                </div>
            </div>        
        </div>
    )
}
export default Profile;