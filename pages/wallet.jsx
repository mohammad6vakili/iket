import { useState , useEffect} from "react";
import styles from "../styles/Wallet.module.css";
import axios from "axios";
import Env from "../Constant/Env.json";
import { Button , Input} from "antd";
import Head from 'next/head';
import { useRouter } from "next/router";
import { useSelector , useDispatch} from "react-redux";
import { toast } from "react-toastify";
import { setProfile } from "../Store/Action";
import FormatHelper from "../Helper/FormatHelper";
import Image from "next/image";
import rightArrow from "../assets/images/right-arrow-white.svg";


const Wallet=()=>{
    const router = useRouter();
    const dispatch = useDispatch();
    const profile = useSelector(state=>state.Reducer.profile);

    const [price , setPrice]=useState("");

    const chargeWallet=async()=>{
        const postData = new FormData();
        postData.append("Token",Env.token);
        postData.append("UserID",localStorage.getItem("userId"));
        postData.append("Charge",FormatHelper.toEnglishString(price));
        postData.append("FromPlatform",2);
        try{
            const response = await axios.post(Env.baseUrl + "WalletChargeInsert.aspx",postData);
            if(response.data.Status===1){
                window.location.href = response.data.Message;
            }else{
                toast.warning(response.data.Message,{
                    position:"bottom-left"
                });
            }
        }catch(err){
            console.log(err);
        }
    }

    const getProfile=async()=>{
        const userId =localStorage.getItem("userId");
        let postData = new FormData();
        postData.append("ID",userId);
        postData.append("Token",Env.token);
        try{
            const response = await axios.post(Env.baseUrl + "GetUserInfo.aspx",postData)
            dispatch(setProfile(response.data.Data));
        }catch({err,response}){
            console.log(err);
        }
    }

        useEffect(() => {
            getProfile();
        }, []);

    return(
        <div>
            <div className="app-container">
            <Head>
                <title>آیکت</title>
                <meta name='description' content='فروشگاه آنلاین آیکت'/>
                <link rel="icon" href="/favicon.ico" />
                <link rel="manifest" href="/manifest.json" />
            </Head>
                <div className={`${styles.wallet} dashboard-page`}>
                    <div className="header">
                        کیف پول
                        <div className="header-right-icon">
                            <Image
                                src={rightArrow}
                                alt="back"
                                onClick={()=>router.push("/profile")}
                            />
                        </div>
                    </div>
                    <div style={{width:"94%",display:"flex",flexDirection:"column",alignItems:"center",background:"white",borderRadius:"5px",padding:"10px 5px"}}>
                        <div 
                            onClick={()=>console.log(profile)}
                            style={{fontSize:"20px",width:"100%",textAlign:"right",padding:"0 10px",margin:"20px 0 10px 0"}}
                        >
                            افزایش اعتبار
                        </div>
                        <div style={{fontSize:"12px",color:"gray",width:"100%",textAlign:"right",padding:"0 10px"}}>
                            موجودی کیف پول : {profile && FormatHelper.toPersianString(profile.Wallet.toLocaleString())} تومان
                        </div>
                        <div 
                            style={{
                                width:"100%",
                                padding:"0 10px",
                                display:"flex",
                                alignItems:"center",
                                justifyContent:"space-between",
                                margin:"20px 0 10px 0"
                            }}
                        >
                            <Button 
                                onClick={()=>setPrice(50000)}
                                style={{backgroundColor:"transparent",fontSize:"12px"}}
                            >
                                ۵۰,۰۰۰ تومان
                            </Button>
                            <Button 
                                onClick={()=>setPrice(20000)}
                                style={{backgroundColor:"transparent",fontSize:"12px"}}
                            >
                                ۲۰,۰۰۰ تومان
                            </Button>
                            <Button 
                                onClick={()=>setPrice(10000)}
                                style={{backgroundColor:"transparent",fontSize:"12px"}}
                            >
                                ۱۰,۰۰۰ تومان
                            </Button>
                        </div>
                        <Input
                            value={FormatHelper.toPersianString(price)}
                            onChange={(e)=>setPrice(e.target.value)}
                            style={{marginTop:"20px",backgroundColor:"transparent"}}
                            type="tel"
                            placeholder="مبلغ مورد نظر را وارد کنید"
                            className={styles.enter_input}
                        />
                    </div>
                    <Button
                            onClick={()=>{
                                if(price.length===0){
                                    toast.warning("لطفا مبلغ را وارد کنید",{
                                        position:"bottom-left"
                                    });
                                }else if(price==="0"){
                                    toast.warning("لطفا مبلغ را وارد کنید",{
                                        position:"bottom-left"
                                    });
                                }else{
                                    chargeWallet();
                                }
                            }}
                            style={{width:"94%",marginTop:"60px",height:"50px",borderRadius:"5px"}}
                            className={"enter_green_btn"}
                    >
                            پرداخت
                    </Button>
                </div>
            </div>        
        </div>
    )
}
export default Wallet;