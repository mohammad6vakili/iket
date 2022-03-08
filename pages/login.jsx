import { useState } from "react";
import styles from "../styles/Enter.module.css";
import rightArrow from "../assets/images/right-arrow-white.svg";
import Image from "next/image";
import { useRouter } from "next/router";
import secIcon from "../assets/images/sec-icon.png";
import { useDispatch } from "react-redux";
import { Input , Button} from "antd";
import { setProfile} from "../Store/Action";
import Head from 'next/head';
import { toast } from "react-toastify";
import axios from "axios";
import Countdown from "react-countdown";
import Env from "../Constant/Env.json";
import Colors from "../Helper/Colors";
import loginIcon from "../assets/images/login_icon.png";


const Login=()=>{
    const dispatch = useDispatch();
    const router = useRouter();
    const [step , setStep]=useState(0);
    const [mobile , setMobile]=useState("");
    const [isCount , setIsCount]=useState(false);
    const [userId , setUserId]=useState("");
    const [code , setCode]=useState("");
    const [now , setNow]=useState(null);



    const getCode=async(e)=>{
        setIsCount(false);
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
                    setNow(Date.now() + 60000);
                    setIsCount(true);
                }else{
                    toast.warning(response.data.Message,{
                        position:"bottom-left"
                    })
                }
            }catch({err,response}){
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
                    console.log(response.data.Data[0]);
                    router.push("/locateUser");
                    dispatch(setProfile(response.data.Data[0]));
                    localStorage.setItem("userId",response.data.Data[0].ID);
                }else{
                    toast.warning(response.data.Message,{
                        position:"bottom-left"
                    })
                }
            }catch({err,response}){
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
                {
                    step===0 ?
                    <>
                        <div className="header">
                            ورود
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
                                src={loginIcon}
                                alt="signup"
                                width={"110px"}
                                height={"100px"}
                            />
                        </div>
                        <Input
                            value={mobile}
                            onChange={(e)=>setMobile(e.target.value)}
                            type="tel"
                            placeholder="شماره تلفن همراه"
                            className={styles.enter_input}
                        />
                        <Button
                            onClick={getCode}
                            style={{marginTop:"5vh"}} 
                            className="enter_green_btn"
                        >
                            ورود
                        </Button>
                        <Button
                            onClick={()=>router.push("/signup")}
                            style={{marginTop:"2vh"}} 
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
                        {isCount===true && now &&
                            <div style={{width:"90%",display:"flex",justifyContent:"flex-start",alignItems:"center",margin:"2vh"}}>
                                برای ارسال دوباره کد فعال سازی
                                <div>
                                    <Countdown
                                        date={now}
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
                                onClick={getCode}
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
export default Login;