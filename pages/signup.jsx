import { useState } from "react";
import styles from "../styles/Enter.module.css";
import rightArrow from "../assets/images/right-arrow-white.svg";
import Image from "next/image";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import Head from 'next/head';
import { setProfile } from "../Store/Action";
import signupVector from "../assets/images/signup.png";
import Countdown from "react-countdown";
import secIcon from "../assets/images/sec-icon.png";
import { Input , Button , Checkbox} from "antd";
import { toast } from "react-toastify";
import axios from "axios";
import Env from "../Constant/Env.json";
import Colors from "../Helper/Colors";


const Signup=()=>{
    const dispatch = useDispatch();
    const router = useRouter();
    const [step , setStep]=useState(0);
    const [name , setName]=useState("");
    const [mobile , setMobile]=useState("");
    const [email , setEmail]=useState("");
    const [checked , setChecked]=useState(false);
    const [code , setCode]=useState("");
    const [isCount , setIsCount]=useState(false);
    const [userId , setUserId]=useState("");
    const [noww , setNoww]=useState(null);



    const getCode=async(e)=>{
        setIsCount(false);
        if(name===""){
            toast.warning("لطفا نام و نام خانوادگی خود را وارد کنید",{
                position:"bottom-left"
            });
        }else if(mobile===""){
            toast.warning("لطفا شماره موبایل خود را وارد کنید",{
                position:"bottom-left"
            });
        }else if(mobile.length!==11){
            toast.warning("شماره موبایل وارد شده باید 11 رقم باشد",{
                position:"bottom-left"
            });
        }else if(checked!==true){
            toast.warning("برای عضویت در این نرم افزار باید با قوانین نرم افزار موافقت کنید",{
                position:"bottom-left"
            });
        }else{
            const postData = new FormData();
            postData.append("FullName",name);
            postData.append("Cellphone",mobile);
            postData.append("Email",email);
            postData.append("Token",Env.token);
            try{
                const response = await axios.post(Env.baseUrl + "InsertUser.aspx",postData);
                if(response.data.Status===1){
                    toast.success("ثبت نام شما با موفقیت انجام شد",{
                        position:"bottom-left"
                    });
                    setStep(1);
                    setUserId(response.data.Data);
                }else if(response.data.Status===-2 && response.data.Message==="شما با این شماره قبلا ثبت نام کردید"){
                    toast.warning(response.data.Message,{
                        position:"bottom-left"
                    });
                    setStep(1);
                    setNoww(Date.now() + 60000);
                    setUserId(response.data.Data);
                }else{
                    toast.warning(response.data.Message,{
                        position:"bottom-left"
                    });
                }
            }catch({err,response}){
                toast.error("خطا در برقراری ارتباط",{
                    position:"bottom-left"
                })
                console.log(err);
            }
        }
    }

    const userLogin=async(e)=>{
        e.preventDefault();
        if(mobile===""){
            toast.warning("لطفا شماره موبایل خود را وارد کنید",{
                position:"bottom-left"
            });
        }else if(mobile.length!==11){
            toast.warning("شماره موبایل وارد شده باید 11 رقم باشد",{
                position:"bottom-left"
            });
        }else{
            const postData = new FormData();
            postData.append("Cellphone",mobile);
            postData.append("Token",Env.token);
            try{
                const response = await axios.post(Env.baseUrl + "UserLogin.aspx",postData);
                if(response.data.Status===1){
                    toast.success(response.data.Message,{
                        position:"bottom-left"
                    })
                    setStep(1);
                    setUserId(response.data.Data);
                    setIsCount(true);
                }else{
                    toast.warning(response.data.Message,{
                        position:"bottom-left"
                    })
                }
            }catch(err){
                toast.error("خطا در برقراری ارتباط",{
                    position:"bottom-left"
                })
                console.log(err);
            }
        }
    }

    const sendCode=async(e)=>{
        e.preventDefault();
        if(mobile===""){
            toast.warning("لطفا شماره موبایل خود را وارد کنید",{
                position:"bottom-left"
            });
        }else if(mobile.length!==11){
            toast.warning("شماره موبایل وارد شده باید 11 رقم باشد",{
                position:"bottom-left"
            });
        }else{
            const postData = new FormData();
            postData.append("ID",userId);
            postData.append("ActivationCode",code);
            postData.append("Token",Env.token);
            try{
                const response = await axios.post(Env.baseUrl + "InsertUserStatus.aspx",postData);
                if(response.data.Status===1){
                    toast.success(response.data.Message,{
                        position:"bottom-left"
                    })
                    dispatch(setProfile(response.data.Data[0]));
                    localStorage.setItem("userId",response.data.Data[0].ID);
                    router.push("/locateUser");
                }else{
                    toast.warning(response.data.Message,{
                        position:"bottom-left"
                    })
                }
            }catch(err){
                toast.error("خطا در برقراری ارتباط",{
                    position:"bottom-left"
                })
                console.log(err);
            }
        }
    }

    const renderer = ({ minutes, seconds}) => (
        <span style={{margin:"0 5px"}}>{seconds}</span>
    );

    return(
        <div className="app-container">
            <Head>
                <title>آیکت</title>
                <meta name='description' content='فروشگاه آنلاین آیکت'/>
                <link rel="icon" href="/favicon.ico" />
                <link rel="manifest" href="/manifest.json" />
            </Head>
            <div className={`${styles.signup} dashboard-page`}>
                {step===0 ?
                    <>
                        <div className="header">
                            عضویت
                            <div className="header-right-icon">
                                <Image
                                    src={rightArrow}
                                    alt="back"
                                    onClick={()=>router.push("/enter")}
                                />
                            </div>
                        </div>
                        <div style={{margin:"5vh 0"}}>
                            <Image
                                src={signupVector}
                                alt="signup"
                                width={"110px"}
                                height={"90px"}
                            />
                        </div>
                        <Input
                            value={name}
                            onChange={(e)=>setName(e.target.value)}
                            type="text"
                            placeholder="نام و نام خانوادگی"
                            className={styles.enter_input}
                        />
                        <Input
                            value={mobile}
                            onChange={(e)=>setMobile(e.target.value)}
                            type="tel"
                            placeholder="شماره تلفن همراه"
                            className={styles.enter_input}
                        />
                        <Input
                            value={email}
                            onChange={(e)=>setEmail(e.target.value)}
                            type="email"
                            placeholder="ایمیل (اختیاری)"
                            className={styles.enter_input}
                        />
                        <div style={{width:"90%",display:"flex",justifyContent:"flex-start",alignItems:"center",margin:"2vh"}}>
                            <Checkbox
                                style={{color:Colors.purple}}
                                onChange={(e)=>setChecked(e.target.checked)}
                                checked={checked}
                            >
                                قوانین نرم افزار را قبول دارم.
                            </Checkbox>
                        </div>
                        <Button
                            onClick={getCode}
                            style={{marginTop:"5vh"}} 
                            className="enter_purple_btn"
                        >
                            عضویت
                        </Button>
                    </>
                :
                    <>
                        <div className="header">
                            فعال سازی
                            <div className="header-right-icon">
                                <Image
                                    src={rightArrow}
                                    alt="back"
                                    onClick={()=>setStep(0)}
                                />
                            </div>
                        </div>
                        <div style={{margin:"5vh 0"}}>
                            <Image
                                src={secIcon}
                                alt="confirm"
                                width={"110px"}
                                height={"90px"}
                            />
                        </div>
                        <div style={{width:"100%",textAlign:"center",color:Colors.purple,fontSize:"16px"}}>
                            لطفا کد فعال سازی ارسال شده را وارد کنید
                        </div>
                        <Input
                            value={code}
                            onChange={(e)=>setCode(e.target.value)}
                            type="tel"
                            style={{margin:"20px 0"}}
                            placeholder="کد فعال سازی"
                            className={styles.enter_input}
                        />
                        {isCount===true && noww &&
                            <div style={{width:"90%",display:"flex",justifyContent:"flex-start",alignItems:"center",margin:"2vh"}}>
                                برای ارسال دوباره کد فعال سازی
                                <div>
                                    <Countdown
                                        date={noww}
                                        autoStart={true}
                                        zeroPadTime={2}
                                        onStart={()=>console.log("mioo")}
                                        renderer={renderer}
                                        onComplete={()=>setIsCount(false)}
                                    />
                                </div>
                                ثانیه صبر کنید
                            </div>
                        }
                        {isCount===false &&
                            <div 
                                onClick={userLogin}
                                style={{width:"90%",color:Colors.purple,textAlign:"right",margin:"2vh"}}
                            >
                                ارسال مجدد کد
                            </div>
                        }
                        <Button
                            onClick={sendCode}
                            style={{marginTop:"5vh"}} 
                            className="enter_green_btn"
                        >
                            تایید
                        </Button>
                    </>
                }
            </div>
        </div>
    )
}
export default Signup;