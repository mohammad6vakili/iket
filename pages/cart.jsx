import { useState , useEffect } from "react";
import styles from "../styles/Cart.module.css";
import { useSelector , useDispatch} from "react-redux";
import { setCart, setMenu,setBadge,setSelectedProvider } from "../Store/Action";
import { useRouter } from "next/router";
import trashIcon from "../assets/images/trash.svg";
import Image from "next/image";
import Head from 'next/head';
import axios from "axios";
import Menu from "../Components/Menu/Menu";
import Env from "../Constant/Env.json";
import FormatHelper from "../Helper/FormatHelper";
import scooter from "../assets/images/scooter.png";
import trashRed from "../assets/images/trash-red.svg";
import noFood from "../assets/images/empty_food.png";
import { toast } from "react-toastify";


const Cart=()=>{
    const dispatch=useDispatch();
    const router=useRouter();
    const cartData=useSelector(state=>state.Reducer.cart);
    const selectedHyper=useSelector(state=>state.Reducer.selectedHyper);

    const [deliveryPrice , setDeliveryPrice]=useState(null);
    const [change , setChange]=useState(false);
    const [showTotal , setShowTotal]=useState(true);

    const getDeliveryPrice=async()=>{
        try{
            const response=await axios.post(Env.baseUrl + "GetDeliveryPrice/SelectData",{
                ID: cartData[0].ID,
                Token: Env.token
            });
            if(response.data.Data===0){
                setDeliveryPrice("رایگان");
            }else{
                setDeliveryPrice(response.data.Data);
            }
        }catch(err){
            toast.error("خطا در برقراری ارتباط",{
                position:"bottom-left"
            });
        }
    }

    const removeFromCart=(data)=>{
        dispatch(setCart(
            cartData.filter(cart=>cart.ID !== data.ID)
        ));
        toast.success("با موفقیت از سبد خرید شما حذف شد",{
            position:'bottom-left'
        });
    }

    useEffect(()=>{
        if(cartData && cartData.length>0){
            getDeliveryPrice();
            localStorage.setItem("cart",JSON.stringify(cartData));
        }
        dispatch(setMenu(2));
        dispatch(setSelectedProvider(null))
    },[])


    useEffect(()=>{
        if(showTotal===false){
            setShowTotal(true);
        }
    },[change])

    useEffect(()=>{
        if(cartData && cartData.length>0){
            localStorage.setItem("cart",JSON.stringify(cartData));
        }
        dispatch(setBadge(cartData.length));
    },[cartData])

    return(
        <div className="app-container">
            <Head>
                <title>آیکت</title>
                <meta name='description' content='فروشگاه آنلاین آیکت'/>
                <link rel="icon" href="/favicon.ico" />
                <link rel="manifest" href="/manifest.json" />
            </Head>
            <div className={`${styles.cart_page} dashboard-page`}>
                <div onClick={()=>console.log(cartData)} style={{fontSize:"14px"}} className="header">
                    سبد خرید شما
                    <div className="header-left-icon">
                        <Image
                            width={25}
                            height={20}
                            src={trashIcon}
                            alt="back"
                            onClick={()=>{
                                dispatch(setCart([]));
                                toast.success("سبد خرید شما خالی شد",{
                                    position:'bottom-left'
                                });
                                localStorage.removeItem("cart")
                            }}
                        />
                    </div>
                </div>
                <Menu/>
                <div className={styles.cart_delivery_banner}>
                    {deliveryPrice &&
                        <div>
                            <Image
                                width={40}
                                height={40}
                                src={scooter}
                                alt="delivery"
                            />
                            {deliveryPrice===-1 && <div>غیر قابل ارسال</div>}
                            {deliveryPrice==="رایگان" && <div>هزینه ارسال : رایگان</div>}
                            {deliveryPrice>0 && <div>هزینه ارسال : {FormatHelper.toPersianString(deliveryPrice)} تومان</div>}
                        </div>
                    }
                </div>
                <div className={styles.cart_body}>
                    {cartData.length===0 && 
                        <div style={{width:"100%",textAlign:"center",marginTop:"10vh"}}>
                            سبد خرید شما خالی میباشد.
                        </div>
                    }
                    {cartData && cartData.length>0 && cartData.map((data,index)=>(
                        <div onClick={()=>console.log(data)} key={index} className={styles.cart_item}>
                            <div>
                                <div>
                                    {data.PhotoUrl==="https://iketpanel.com" ?
                                        <Image
                                            src={noFood}
                                            alt="food logo"
                                            width={85}
                                            height={85}
                                        />
                                    :
                                        <Image
                                            src={data.PhotoUrl}
                                            loader={()=>data.PhotoUrl}
                                            alt="food logo"
                                            width={85}
                                            height={85}
                                        />
                                    }

                                </div>
                                <div>
                                    <div>{data.Title && FormatHelper.toPersianString(data.Title)}</div>
                                    <div>{data.Description && FormatHelper.toPersianString(data.Description)}</div>
                                    {data.Price && data.Price !== data.PriceWithDiscount &&
                                        <div style={{color:"red",textDecoration:"line-through"}}>{FormatHelper.toPersianString(data.Price.toLocaleString())} تومان</div>
                                    }
                                    <div style={{color:"black"}}>{data.PriceWithDiscount && FormatHelper.toPersianString(data.PriceWithDiscount.toLocaleString())} تومان</div>
                                </div>
                            </div>
                            <div>
                                <div>
                                <Image
                                    width={25}
                                    height={20}
                                    src={trashRed}
                                    alt="delete"
                                    onClick={()=>removeFromCart(data)}
                                />
                                </div>
                                <div>
                                    <select
                                        defaultValue={data.count}
                                        onChange={(e)=>{
                                            setChange(!change);
                                            setShowTotal(false);
                                            data.count=parseInt(e.target.value);
                                        }}
                                    >
                                        <option value="1">۱ عدد</option>
                                        <option value="2">۲ عدد</option>
                                        <option value="3">۳ عدد</option>
                                        <option value="4">۴ عدد</option>
                                        <option value="5">۵ عدد</option>
                                        <option value="6">۶ عدد</option>
                                        <option value="7">۷ عدد</option>
                                        <option value="8">۸ عدد</option>
                                        <option value="9">۹ عدد</option>
                                        <option value="10">۱۰ عدد</option>
                                    </select>
                                </div>
                                <div>
                                    {showTotal &&
                                        FormatHelper.toPersianString((data.PriceWithDiscount * data.count).toLocaleString()) + "تومان"
                                    }
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div
                    onClick={()=>{
                        if(deliveryPrice===-1){
                            toast.warning("ارسال از این تامین کننده ممکن نیست",{
                                position:"bottom-left"
                            })
                        }else if (cartData && cartData.length===0){
                            toast.warning("سبد خرید خالی میباشد",{
                                position:"bottom-left"
                            })
                        }else{
                            router.push("/selectAddress");
                        }
                    }}
                    className={styles.cart_page_bottom_box}
                >
                    خرید خود را نهایی کنید
                    <div>
                        {FormatHelper.toPersianString(cartData.reduce((a, c) => a + c.PriceWithDiscount * c.count, 0).toLocaleString())} تومان
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Cart;