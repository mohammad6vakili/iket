import { useState } from "react";
import styles from "../styles/Profile.module.css";
import Menu from "../Components/Menu/Menu";
import axios from "axios";
import Env from "../Constant/Env.json";
import { toast } from "react-toastify";
import { useEffect } from "react";
import FormatHelper from "../Helper/FormatHelper";
import Image from "next/image";
import logo from "../assets/images/logo_colored.webp";
import scooter from "../assets/images/scooter.png";


const Profile=()=>{
    
    const [profile , setProfile]=useState(null);

    const getProfile=async()=>{
        const userId =localStorage.getItem("userId");
        let postData = new FormData();
        postData.append("ID",userId);
        postData.append("Token",Env.token);
        try{
            const response = await axios.post(Env.baseUrl + "GetUserInfo.aspx",postData)
            setProfile(response.data.Data);
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
                    <div className={styles.profile_logo}>
                        <Image
                            src={logo}
                            alt="iket"
                            width={"140px"}
                            height={"40px"}
                        />
                    </div>
                    <div className={styles.profile_white_box}>
                        <div>
                            <div>
                                <Image
                                    src={scooter}
                                    alt="user avatar"
                                    width={"70px"}
                                    height={"70px"}
                                />
                            </div>
                        </div>
                        <div>
                            <div>
                                {profile && profile.FullName}
                            </div>
                            <div>
                                {profile && FormatHelper.toPersianString(profile.CellPhone)}
                            </div>
                            <div>
                                {profile && FormatHelper.toPersianString(profile.Email)}
                            </div>
                        </div>
                    </div>
                    <div className={styles.profile_links_list}>
                        <div>
                            لیست سفارشات
                        </div>
                        <div>
                            آدرس ها
                        </div>
                        <div>
                            ویرایش اطلاعات کاربری
                        </div>
                        <div>
                            ارسال برای دوستان
                        </div>
                        <div>
                            کیف پول
                        </div>
                        <div>
                            خروج از حساب کاربری
                        </div>
                    </div>
                </div>
            </div>        
        </div>
    )
}
export default Profile;