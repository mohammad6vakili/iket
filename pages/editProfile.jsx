import { useState } from "react";
import styles from "../styles/EditProfile.module.css";
import Menu from "../Components/Menu/Menu";
import axios from "axios";
import Env from "../Constant/Env.json";
import rightArrow from "../assets/images/right-arrow-white.svg";
import { Button , Input} from "antd";
import { useRouter } from "next/router";
import { useDispatch , useSelector } from "react-redux";
import Logo from "../assets/images/logo_colored.webp";
import { setProfile } from "../Store/Action";
import { toast } from "react-toastify";
import { useEffect } from "react";
import FormatHelper from "../Helper/FormatHelper";
import Image from "next/image";


const EditProfile=()=>{
    const router = useRouter();
    const dispatch = useDispatch();

    const [name , setName]=useState("");
    const [email , setEmail]=useState("");

    const profile=useSelector(state=>state.Reducer.profile);

    const updateProfile=async()=>{
        const userId =localStorage.getItem("userId");
        let postData = new FormData();
        postData.append("ID",userId);
        postData.append("Token",Env.token);
        postData.append("Email",email);
        postData.append("FullName",name);
        try{
            const response = await axios.post(Env.baseUrl + "UpdateUserInformationByUserID.aspx",postData)
            if(response.data.Status===1){
                toast.success(response.data.Message,{
                    position:"bottom-left"
                });
                router.push("/profile");
            }else{
                toast.warning(response.data.Message,{
                    position:"bottom-left"
                });
            }
        }catch({err,response}){
            toast.error("خطا در برقراری ارتباط",{
                position:"bottom-left"
            })
        }
    }

    useEffect(()=>{
        setName(profile.FullName);
        setEmail(profile.Email);
    },[])

    return(
        <div>
            <div className="app-container">
                <div className={`${styles.edit_profile} dashboard-page`}>
                    <div onClick={()=>console.log(profile)} className="header">
                        ویرایش حساب کاربری
                        <div className="header-right-icon">
                            <Image
                                src={rightArrow}
                                alt="back"
                                onClick={()=>router.push("/profile")}
                            />
                        </div>
                    </div>
                    <div className={styles.edit_profile_top}>
                        <div>
                            {profile && profile.PhotoUrl==="https://iketpanel.com" ?
                                <Image
                                    src={Logo}
                                    alt="back"
                                    width={"70px"}
                                    height={"40px"}
                                />
                                :
                                <Image
                                    src={profile.PhotoUrl}
                                    alt="back"
                                    width={"60px"}
                                    height={"60px"}
                                />
                            }
                            
                        </div>
                        <div>
                            <Input
                                value={name}
                                onChange={(e)=>setName(e.target.value)}
                                type="text"
                                placeholder="نام و نام خانوادگی"
                                className={styles.enter_input}
                            />
                        </div>
                    </div>
                    <div style={{marginTop:"5vh",flexDirection:"column",padding:"20px 0",height:"20vh"}} className={styles.edit_profile_top}>
                        <div style={{width:"100%"}}>
                            <Input
                                value={email}
                                onChange={(e)=>setEmail(e.target.value)}
                                type="email"
                                placeholder="ایمیل"
                                className={styles.enter_input}
                            />
                        </div>
                        <div style={{padding:"0 20px",marginTop:"10px"}}>
                            موبایل : {profile && FormatHelper.toPersianString(profile.CellPhone)}
                        </div>
                    </div>
                    <Button
                        onClick={updateProfile}
                        className="enter_green_btn"
                        style={{
                            width:"calc(100% - 20px)",
                            border:"none",
                            borderRadius:"6px",
                            marginTop:"auto",
                            height:"40px"
                        }}
                    >
                        ثبت تغییرات
                    </Button>
                </div>
            </div>        
        </div>
    )
}
export default EditProfile;