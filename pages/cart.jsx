import { useState , useEffect } from "react";
import styles from "../styles/Cart.module.css";
import { useSelector , useDispatch} from "react-redux";
import { setCart } from "../Store/Action";
import trashIcon from "../assets/images/trash.svg";
import Image from "next/image";
import axios from "axios";
import Menu from "../Components/Menu/Menu";
import Env from "../Constant/Env.json";
import { toast } from "react-toastify";


const Cart=()=>{
    const dispatch=useDispatch();
    const cartData=useSelector(state=>state.Reducer.cart);

    const [deliveryPrice , setDeliveryPrice]=useState(null);

    const getDeliveryPrice=async()=>{
        try{
            const response=await axios.post(Env.baseUrl + "GetDeliveryPrice/SelectData",{
                ID: cartData[0].ID,
                Token: Env.token
            });
            console.log(response.data);
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
                            onClick={()=>dispatch(setCart([]))}
                        />
                    </div>
                </div>
                <Menu/>
                <div className={styles.cart_body}>
                    {cartData.length===0 && 
                        <div style={{width:"100%",textAlign:"center",marginTop:"10vh"}}>
                            سبد خرید شما خالی میباشد.
                        </div>
                    }
                    {cartData && cartData.length>0 && cartData.map((data)=>(
                        <div className={styles.cart_item}>

                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
export default Cart;