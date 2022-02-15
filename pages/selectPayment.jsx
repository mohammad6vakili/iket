import { useState } from "react";
import styles from "../styles/SelectPayment.module.css";
import { useSelector , useDispatch} from "react-redux";
import { useRouter } from "next/router";
import {setProfile} from "../Store/Action";
import Image from "next/image";
import rightArrow from "../assets/images/right-arrow-white.svg";
import walletIcon from "../assets/images/wallet.svg";
import axios from "axios";
import { Input, Radio, Switch , Button } from "antd";
import Env from "../Constant/Env.json";
import FormatHelper from "../Helper/FormatHelper";
import { toast } from "react-toastify";
import { useEffect } from "react";


const SelectPayment=()=>{
    const dispatch=useDispatch();
    const router=useRouter();

    const [method , setMethod]=useState("");
    const [isWallet , setIsWallet]=useState(false);
    const [discount , setDiscount]=useState("");
    const [discountVal , setDiscountVal]=useState(null);

    const address = useSelector(state=>state.Reducer.address);
    const profile = useSelector(state=>state.Reducer.profile);
    const selectedAddress = useSelector(state=>state.Reducer.selectedAddress);
    const cart = useSelector(state=>state.Reducer.cart);

    const [sum,setSum] =useState(0);
    const [delivery , setDelivery] =useState(0);

    const getUserInfo=async()=>{
        const userId=localStorage.getItem("userId");
        let postData = new FormData();
        postData.append("Token",Env.token);
        postData.append("ID",userId);
        try{
            const response = await axios.post(Env.baseUrl + "GetUserInfo.aspx",postData);
            dispatch(setProfile(response.data.Data));
        }catch(err){
            toast.error("خطا در برقراری ارتباط",{
                position:"bottom-left"
            });
        }
    }

    const submitDiscount=async()=>{
        let postData = new FormData();
        let proccess = [];
        postData.append("Code",discount);
        postData.append("Token",Env.token);
        postData.append("ID",localStorage.getItem("userId"));
        cart.map((data)=>{
            proccess.push({"id":data.ID,"Quantity":data.count})
        })
        postData.append("CartItems",JSON.stringify(proccess));
        try{
            const response = await axios.post(Env.baseUrl + "ValidateIketDiscountCode.aspx",postData);
            if(response.data.Status===-5){
                toast.warning(response.data.Message,{
                    position:"bottom-left"
                });
            }else{
                setSum(response.data.Data);
            }
        }catch(err){
            toast.error("خطا در برقراری ارتباط",{
                position:"bottom-left"
            });
        }
    }

    const submitOrder=async()=>{
        let postData = new FormData();
        let proccess = [];
        postData.append("Token",Env.token);
        postData.append("ID",localStorage.getItem("userId"));
        cart.map((data)=>{
            proccess.push({"id":data.ID,"Quantity":data.count})
        })
        postData.append("CartItems",JSON.stringify(proccess));
        postData.append("BasketStatus",1);
        postData.append("FromPlatform",2);
        postData.append("Code",discount);
        postData.append("AddressID",selectedAddress);
        postData.append("PaymentInterface",parseInt(method));
        try{
            const response = await axios.post(Env.baseUrl + "InsertBasket.aspx",postData);
            if(response.data.Status!==1){
                toast.warning(response.data.Message,{
                    position:"bottom-left"
                });
            }else{
                window.location.href = response.data.Message;
            }
        }catch(err){
            toast.error("خطا در برقراری ارتباط",{
                position:"bottom-left"
            });
        }
    }

    useEffect(()=>{
        setSum(cart.reduce((a, c) => a + c.Price * c.count, 0));
        if(address){
            address.map((data)=>{
                if(selectedAddress === data.ID){
                    setDelivery(data.DeliveryPrice);
                }
            })
        }
        getUserInfo();
    },[])

    return(
        <div style={{position:"relative"}} className="app-container">
            <div className={`${styles.select_address} dashboard-page`}>
                <div style={{fontSize:"14px"}} className="header">
                    تکمیل فرایند خرید
                    <div className="header-right-icon">
                        <Image
                            src={rightArrow}
                            alt="back"
                            onClick={()=>router.push("/selectAddress")}
                        />
                    </div>
                </div>
                <div className={styles.address_title}>
                    نحوه پرداختتون چجوری باشه؟
                </div>
                <Radio.Group 
                    onChange={(e)=>{
                        setMethod(e.target.value);
                        if(e.target.value==="2"){
                            setIsWallet(true);
                            if(profile.Wallet===sum){
                                setSum(0);
                            } if(profile.Wallet>sum){
                                setSum(0);
                            }
                            if(profile.Wallet> sum+delivery){
                                setSum(0);
                                setDelivery(0);
                            }
                        }else{
                            if(address){
                                address.map((data)=>{
                                    if(selectedAddress === data.ID){
                                        setDelivery(data.DeliveryPrice);
                                    }
                                })
                            }
                            setSum(cart.reduce((a, c) => a + c.Price * c.count, 0));
                            setIsWallet(false);
                        }
                    }} 
                    className={styles.address_body}
                >
                        <Radio value={"0"}>
                            <div>پرداخت آنلاین</div>
                            <div>از طریق کلیه کارت های عضو شتاب</div>
                            <Image
                                src={walletIcon}
                                width={30}
                                height={30}
                                alt="back"
                            />
                        </Radio>
                        <Radio value={"1"}>
                            <div>استفاده از کیف پول</div>
                            <div>موجودی کیف پول : {profile && FormatHelper.toPersianString(profile.Wallet.toLocaleString())} تومان</div>
                            <Switch checked={isWallet}/>
                        </Radio>
                </Radio.Group>
                <div className={styles.select_payment_address_box}>
                    <span style={{fontSize:"14px"}}>آدرس تحویل</span>
                    {address && address.map((data)=>{
                        if(selectedAddress === data.ID){
                            return <span style={{fontSize:"12px",color:"gray",marginTop:"5px"}}>{data.FullAddress}</span>
                        }
                    })}
                    <div style={{width:"100%",display:"flex",alignItems:"center",marginTop:"10px"}}>
                        <Input
                            value={discount}
                            onChange={(e)=>setDiscount(e.target.value)}
                            style={{
                                boxShadow:"1px 2px 5px rgb(0,0,0,.2)",
                                height:"40px",
                                borderRadius:"5px"
                            }}
                            placeholder="کد تخفیف"
                        />
                        <Button 
                            style={{
                                backgroundColor:"#5925B6",
                                width:"100px",
                                height:"40px",
                                border:"none",
                                borderRadius:"5px",
                                color:"white",
                                marginRight:"5px"
                            }}
                            onClick={submitDiscount}
                        >
                            اعمال
                        </Button>
                    </div>
                    <div style={{width:"100%",textAlign:"center",marginTop:"10px"}}>
                        مبلغ : {FormatHelper.toPersianString(sum.toLocaleString())} تومان
                    </div>
                    <div style={{width:"100%",textAlign:"center",marginTop:"10px",fontSize:"10px",color:"gray"}}>
                        هزینه ارسال : 
                        {" "}
                        {FormatHelper.toPersianString(delivery.toLocaleString())}
                    </div>
                </div>
                <div
                    onClick={()=>{
                        if(method===""){
                            toast.warning("لطفا روش پرداخت خود را انتخاب کنید",{
                                position:"bottom-left"
                            })
                        }else{
                            submitOrder();
                        }
                    }}
                    className={styles.cart_page_bottom_box}
                >
                    ثبت نهایی
                </div>
            </div>
        </div>
    )
}
export default SelectPayment;