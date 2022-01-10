import { useState } from "react";
import styles from "../styles/Enter.module.css";
import rightArrow from "../assets/images/right-arrow-white.svg";
import Image from "next/image";
import { useRouter } from "next/router";
import { Input , Button , Checkbox} from "antd";
import { toast } from "react-toastify";
import axios from "axios";
import Env from "../Constant/Env.json";
import Colors from "../Helper/Colors";
import loginIcon from "../assets/images/login_icon.png";


const Login=()=>{
    const router = useRouter();
    const [step , setStep]=useState(0)
    const [mobile , setMobile]=useState("");
    const [code , setCode]=useState("");



    const getCode=async(e)=>{
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
            postData.append("Token","5af6f02ccbc44675930a5f8e275d8213");
            try{
                const response = await axios.post(Env.baseUrl + "UserLogin.aspx",postData);
                console.log(response.data);
            }catch({err,response}){
                toast.err("خطا در برقراری ارتباط",{
                    position:"bottom-left"
                })
                console.log(err);
            }
        }
    }

    return(
        <div className="app-container">
            <div className={`${styles.signup} dashboard-page`}>
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
                </div>
            </div>
    )
}
export default Login;