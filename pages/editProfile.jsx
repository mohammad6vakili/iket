import { useState } from "react";
import styles from "../styles/EditProfile.module.css";
import axios from "axios";
import Env from "../Constant/Env.json";
import rightArrow from "../assets/images/right-arrow-white.svg";
import { Button , Input} from "antd";
import { useRouter } from "next/router";
import { useDispatch , useSelector } from "react-redux";
import Logo from "../assets/images/logo_colored.webp";
import Head from 'next/head';
import { toast } from "react-toastify";
import { useEffect } from "react";
import FormatHelper from "../Helper/FormatHelper";
import Image from "next/image";


const EditProfile=()=>{
    const router = useRouter();
    const dispatch = useDispatch();

    const [name , setName]=useState("");
    const [email , setEmail]=useState("");
    const [uploadRef , setUploadRef]=useState(null);
    const [imageList , setImageList]=useState("");
    const [fileList , setFileList]=useState([]);

    const upload =async  (e) => {
        let list=[];
        const base64 = await converter(e.target.files[0]);
        setImageList(base64)
        setFileList(base64.split(',')[1]);
    };

    const converter=(file)=>{
        return new Promise((resolve , reject)=>{
           const fileReader = new FileReader();
            fileReader.readAsDataURL(file);
            fileReader.onload =()=>{
                resolve(fileReader.result);
            }
            fileReader.onerror = (error) =>{
                reject(error);
            }
        })
    }

    const profile=useSelector(state=>state.Reducer.profile);
    const cartData=useSelector(state=>state.Reducer.cart);

    const updateProfile=async()=>{
        const userId =localStorage.getItem("userId");
        let postData = new FormData();
        postData.append("ID",userId);
        postData.append("Token",Env.token);
        postData.append("Email",email);
        postData.append("FullName",name);
        postData.append("PhotoUrl","image");
        if(fileList && fileList.length>0){
            postData.append("imageBase64",fileList);
        }
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
            console.log(err);
        }
    }

    useEffect(()=>{
        if(profile){
            setName(profile.FullName);
            setEmail(profile.Email);
        }
    },[])

    useEffect(()=>{
        if(cartData && cartData.length>0){
            localStorage.setItem("cart",JSON.stringify(cartData));
        }
    })


    return(
        <div className="app-container">
            <Head>
                <title>آیکت</title>
                <meta name='description' content='فروشگاه آنلاین آیکت'/>
                <link rel="icon" href="/favicon.ico" />
                <link rel="manifest" href="/manifest.json" />
            </Head>
                <div className={`${styles.edit_profile} dashboard-page`}>
                    <div onClick={()=>console.log(imageList , fileList)} className="header">
                        ویرایش حساب کاربری
                        <div className="header-right-icon">
                            <Image
                                src={rightArrow}
                                alt="back"
                                onClick={()=>router.push("/profile")}
                            />
                        </div>
                        <input 
                            onChange={upload}
                            type="file" 
                            name="filefield" 
                            style={{display:"none"}}
                            ref={(fileInput)=>setUploadRef(fileInput)}    
                        />
                    </div>
                    <div className={styles.edit_profile_top}>
                        <div onClick={()=>uploadRef.click()}>
                            {imageList==="" ?
                                <div style={{cursor:"pointer"}}>
                                    افزودن تصویر
                                </div>
                            :imageList!=="" &&
                                <Image
                                    src={imageList}
                                    alt="back"
                                    width={"70px"}
                                    height={"70px"}
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
                            موبایل : {profile && profile.CellPhone && FormatHelper.toPersianString(profile.CellPhone)}
                        </div>
                    </div>
                    <Button
                        onClick={updateProfile}
                        className="enter_green_btn"
                        style={{
                            width:"calc(100% - 50px)",
                            border:"none",
                            borderRadius:"5px",
                            marginTop:"150px",
                            height:"50px",
                            boxShadow:"0 0 5px 0 #a3a3a3"
                        }}
                    >
                        ثبت تغییرات
                    </Button>
                </div>
        </div>        
    )
}
export default EditProfile;