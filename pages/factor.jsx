import styles from "../styles/Factor.module.css";
import { toast } from "react-toastify";
import Head from 'next/head';
import Logo from "../assets/images/logo_colored.webp";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import shareIcon from "../assets/images/share-white.png";
import rightArrow from "../assets/images/right-arrow-white.svg";
import FormatHelper from "../Helper/FormatHelper";
import Image from "next/image";


const Factor=()=>{
    const router = useRouter();

    const factorData=useSelector(state=>state.Reducer.factorData);
    const cartData=useSelector(state=>state.Reducer.cart);

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

        useEffect(()=>{
            console.log("cart");
            if(cartData.length>0){
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
                        {factorData && factorData.OrderList && factorData.OrderList.map((data,index)=>(
                            <div>
                                <div style={{width:"15%"}}>{FormatHelper.toPersianString(index+1)}</div>
                                <div style={{width:"45%"}}>{data.Title}</div>
                                <div style={{width:"15%"}}>{FormatHelper.toPersianString(data.Quantity)}</div>
                                <div style={{width:"25%"}}>{FormatHelper.toPersianString(data.Price.toLocaleString())}</div>
                            </div>
                        ))}
                    </div>
                    <div className={styles.factor_bottom_box}>
                        <div>شماره پیگیری : {factorData && factorData.TrackingCode && FormatHelper.toPersianString(factorData.TrackingCode)}</div>        
                        <div>
                            <div>
                                <div style={{fontSize:"11px"}}>هزینه ارسال</div>
                                <div style={{color:"gray"}}>- - - - - - - - - -</div>
                                <div style={{fontSize:"11px"}}>
                                    {factorData && factorData.DeliveryPrice &&FormatHelper.toPersianString(factorData.DeliveryPrice.toLocaleString())} تومان
                                </div>
                            </div>
                            <div>
                                <div style={{fontSize:"13px"}}>مبلغ کل</div>
                                <div style={{color:"gray"}}>- - - - - - - - - -</div>
                                <div style={{fontSize:"13px"}}>
                                    {factorData && factorData.TotalPrice && FormatHelper.toPersianString(factorData.TotalPrice.toLocaleString())} تومان
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    )
}
export default Factor;