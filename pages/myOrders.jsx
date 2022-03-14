import { useState } from "react";
import styles from "../styles/MyOrders.module.css";
import axios from "axios";
import Env from "../Constant/Env.json";
import { toast } from "react-toastify";
import { Button } from "antd";
import { useEffect } from "react";
import {setFactorData,setMenu,setCategoryType,setCityHypers} from "../Store/Action";
import Head from 'next/head';
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import rightArrow from "../assets/images/right-arrow-white.svg";
import FormatHelper from "../Helper/FormatHelper";
import Image from "next/image";


const MyOrders=()=>{
    const router = useRouter();
    const dispatch = useDispatch();
    const [orders , setOrders]=useState(null);
    const hypers=useSelector(state=>state.Reducer.hypers);

    const getOrders=async()=>{
        const userId =localStorage.getItem("userId");
        let postData = new FormData();
        postData.append("ID",userId);
        postData.append("Token",Env.token);
        try{
            const response = await axios.post(Env.baseUrl + "SelectOrdersByUserID.aspx",postData)
            setOrders(response.data.Data);
        }catch({err,response}){
            console.log(err);
        }
    }

    const getAreaWithProvider=async()=>{
        let postData=new FormData();
        postData.append("token",Env.token);
        try{
            const response=await axios.post(Env.baseUrl + "SelectAreaWithProvider.aspx",postData);
            if(response.data.Status===1){
                dispatch(setCityHypers(response.data.Data));
                console.log(response.data.Data);
                response.data.Data.map((data)=>{
                    data.Area.map((ar)=>{
                        console.log(ar)
                        if(ar.Provider.length>0 && ar.ID.toString() === localStorage.getItem("selectArea")){
                            ar.Provider.map((pr , index)=>{
                                hypers.push(pr);
                            })
                        }
                    })
                })
            }else{
                toast.warning(response.data.Message,{
                    position:"bottom-left"
                })    
            }
        }catch(err){
            console.log(err);
        }
    }

    useEffect(()=>{
        getOrders();
        getAreaWithProvider();
        dispatch(setMenu(4));
        dispatch(setCategoryType("2"));
        localStorage.setItem("categoryType","2");
    },[])

    return(
        <div className="app-container">
            <Head>
                <title>آیکت</title>
                <meta name='description' content='فروشگاه آنلاین آیکت'/>
                <link rel="icon" href="/favicon.ico" />
                <link rel="manifest" href="/manifest.json" />
            </Head>
                <div className={`${styles.my_orders} dashboard-page`}>
                    <div className="header">
                        سفارشات من
                        <div className="header-right-icon">
                            <Image
                                src={rightArrow}
                                alt="back"
                                onClick={()=>router.push("/profile")}
                            />
                        </div>
                    </div>
                    {orders && orders.length===0 &&
                        <div style={{width:"100%",textAlign:"center",marginTop:"10vh"}}>شما هیچ سفارشی ندارید</div>
                    }
                    <div className={styles.orders_items}>
                        {orders && orders.map((order)=>(
                            <div className={styles.orders_item}>
                                <div>
                                    <Image
                                        src={order.Logo}
                                        loader={()=>order.Logo}
                                        width={"100%"}
                                        height={"100%"}
                                        alt="logo"
                                    />      
                                </div>
                                <div>
                                    <span style={{fontWeight:"600",color:"black",fontSize:"14px"}}>{order.BusinessName}</span>
                                    <span style={{fontSize:"12px"}}>
                                        تاریخ سفارش : {FormatHelper.toPersianString(order.CDate)}
                                    </span>
                                    <span style={{fontSize:"12px"}}>
                                        ساعت سفارش : {FormatHelper.toPersianString(order.CTime)}
                                    </span>
                                    <span style={{fontSize:"13px"}}>
                                        مبلغ : {FormatHelper.toPersianString(order.TotalPriceWithDiscount.toLocaleString())} تومان
                                    </span>
                                </div>
                                <Button 
                                    onClick={()=>{
                                        console.log(order);
                                        dispatch(setFactorData(order));
                                        router.push("/factor");
                                    }}
                                >
                                    مشاهده فاکتور
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
    )
}
export default MyOrders;