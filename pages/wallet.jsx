import { useState } from "react";
import styles from "../styles/Wallet.module.css";
import Menu from "../Components/Menu/Menu";
import axios from "axios";
import Env from "../Constant/Env.json";
import { Button , Input, Space} from "antd";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useEffect } from "react";
import FormatHelper from "../Helper/FormatHelper";
import Image from "next/image";
import rightArrow from "../assets/images/right-arrow-white.svg";


const Wallet=()=>{
    const router = useRouter();
    const profile = useSelector(state=>state.Reducer.profile);

    const [price , setPrice]=useState("");

    const chargeWallet=async()=>{
        const postData = new FormData();
        postData.append("Token",Env.token);
        postData.append("UserID",localStorage.getItem("userId"));
        postData.append("Charge",price);
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
            toast.error("خطا در برقراری ارتباط",{
                position:"bottom-left"
            });
        }
    }

    return(
        <div>
            <div className="app-container">
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
                        className={styles.cart_page_bottom_box}
                    >
                        پرداخت
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
            </div>        
        </div>
    )
}
export default Wallet;