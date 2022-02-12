import { useState , useEffect } from "react";
import styles from "../styles/Cart.module.css";
import { useSelector , useDispatch} from "react-redux";
import { setCart } from "../Store/Action";
import trashIcon from "../assets/images/trash.svg";
import Image from "next/image";
import axios from "axios";
import Menu from "../Components/Menu/Menu";
import Env from "../Constant/Env.json";
import FormatHelper from "../Helper/FormatHelper";
import scooter from "../assets/images/scooter.png";
import trashRed from "../assets/images/trash-red.svg";
import { toast } from "react-toastify";


const Cart=()=>{
    const dispatch=useDispatch();
    const cartData=useSelector(state=>state.Reducer.cart);

    const [deliveryPrice , setDeliveryPrice]=useState(null);
    const [change , setChange]=useState(false);
    const [showTotal , setShowTotal]=useState(true);

    const getDeliveryPrice=async()=>{
        try{
            const response=await axios.post(Env.baseUrl + "GetDeliveryPrice/SelectData",{
                ID: cartData[0].ID,
                Token: Env.token
            });
            setDeliveryPrice(response.data.Data);
        }catch(err){
            toast.error("خطا در برقراری ارتباط",{
                position:"bottom-left"
            });
        }
    }

    useEffect(()=>{
        if(cartData.length>0){
            getDeliveryPrice();
        }
    },[])

    useEffect(()=>{
        if(showTotal===false){
            setShowTotal(true);
        }
    },[change])

    return(
        <div className="app-container">
            <div className={`${styles.cart_page} dashboard-page`}>
                <div style={{fontSize:"14px"}} className="header">
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
                            <div>هزینه ارسال : {FormatHelper.toPersianString(deliveryPrice)} تومان</div>
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
                                    <Image
                                        src={data.PhotoUrl}
                                        loader={()=>data.PhotoUrl}
                                        alt="food logo"
                                        width={50}
                                        height={50}
                                    />
                                </div>
                                <div>
                                    <div>{FormatHelper.toPersianString(data.Title)}</div>
                                    <div>{FormatHelper.toPersianString(data.Description)}</div>
                                    {data.Price !== data.PriceWithDiscount &&
                                        <div style={{color:"red",textDecoration:"line-through"}}>{FormatHelper.toPersianString(data.PriceWithDiscount)} تومان</div>
                                    }
                                    <div style={{color:"#00a854"}}>{FormatHelper.toPersianString(data.Price)} تومان</div>
                                </div>
                            </div>
                            <div>
                                <div>
                                <Image
                                    width={25}
                                    height={20}
                                    src={trashRed}
                                    alt="delete"
                                    onClick={()=>{
                                        toast.success("با موفقیت از سبد خرید شما حذف شد",{
                                            position:'bottom-left'
                                        });
                                    }}
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
                                        FormatHelper.toPersianString((data.Price * data.count).toLocaleString()) + "تومان"
                                    }
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
export default Cart;