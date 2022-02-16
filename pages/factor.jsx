import { useState } from "react";
import styles from "../styles/Factor.module.css";
import axios from "axios";
import Env from "../Constant/Env.json";
import { toast } from "react-toastify";
import { Button } from "antd";
import { useEffect } from "react";
import Logo from "../assets/images/logo_colored.webp";
import {setFactorData} from "../Store/Action";
import { useDispatch , useSelector } from "react-redux";
import { useRouter } from "next/router";
import shareIcon from "../assets/images/share-white.png";
import rightArrow from "../assets/images/right-arrow-white.svg";
import FormatHelper from "../Helper/FormatHelper";
import Image from "next/image";
import logo from "../assets/images/logo_colored.webp";
import scooter from "../assets/images/scooter.png";


const Factor=()=>{
    const router = useRouter();
    const dispatch = useDispatch();

    const factorData=useSelector(state=>state.Reducer.factorData);

    const handleSharing = async () => {
        let shareData = {
          title: 'آیکت',
          text: 'آیکت - فروشگاه آنلاین',
          url: 'http://www.iket.ir',
        }        
        if (navigator.share) {
            try {
              await navigator
                .share(shareData)
                .then(() =>
                  toast.success("با موفقیت به اشتراک گذاشته شد",{
                      position: toast.POSITION.BOTTOM_LEFT
                  })
                );
            } catch (error) {
              toast.error("ظاهرا خطایی رخ داده است !",{
                  position: toast.POSITION.BOTTOM_LEFT
              })
              console.log(error);
            }
          } else {
            toast.error("اشتراک گذاری در این مرورگر پشتیبانی نمیشود",{
              position: toast.POSITION.BOTTOM_LEFT
          })
          }
        };


    return(
        <div>
            <div className="app-container">
                <div className={`${styles.factor} dashboard-page`}>
                    <div className="header">
                        فاکتور
                        <div className="header-right-icon">
                            <Image
                                src={rightArrow}
                                alt="back"
                                onClick={()=>router.push("/myOrders")}
                            />
                        </div>
                    </div>
                    <div className={styles.factor_top_logo}>
                        <Image
                            src={Logo}
                            width={"100px"}
                            height={"30px"}
                            alt="iket"
                        />
                        <div onClick={handleSharing}>
                            <Image
                                src={shareIcon}
                                width={"20px"}
                                height={"20px"}
                                alt="share"
                            />
                        </div>
                    </div>
                    <div className={styles.factor_body}>
                        <div onClick={()=>console.log(factorData)}>
                            <div style={{width:"15%"}}>ردیف</div>
                            <div style={{width:"45%"}}>کالا</div>
                            <div style={{width:"15%"}}>تعداد</div>
                            <div style={{width:"25%"}}>مبلغ</div>
                        </div>
                        {factorData && factorData.OrderList.map((data,index)=>(
                            <div>
                                <div style={{width:"15%"}}>{FormatHelper.toPersianString(index+1)}</div>
                                <div style={{width:"45%"}}>{data.Title}</div>
                                <div style={{width:"15%"}}>{FormatHelper.toPersianString(data.Quantity)}</div>
                                <div style={{width:"25%"}}>{FormatHelper.toPersianString(data.Price.toLocaleString())}</div>
                            </div>
                        ))}
                    </div>
                    <div className={styles.factor_bottom_box}>
                        <div>شماره پیگیری : {FormatHelper.toPersianString(factorData.TrackingCode)}</div>        
                        <div>
                            <div>
                                <div style={{fontSize:"11px"}}>هزینه ارسال</div>
                                <div style={{color:"gray"}}>- - - - - - - - - -</div>
                                <div style={{fontSize:"11px"}}>
                                    {FormatHelper.toPersianString(factorData.DeliveryPrice.toLocaleString())} تومان
                                </div>
                            </div>
                            <div>
                                <div style={{fontSize:"13px"}}>مبلغ کل</div>
                                <div style={{color:"gray"}}>- - - - - - - - - -</div>
                                <div style={{fontSize:"13px"}}>
                                    {FormatHelper.toPersianString(factorData.TotalPrice.toLocaleString())} تومان
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>        
        </div>
    )
}
export default Factor;