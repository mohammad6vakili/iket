import { useEffect, useState } from "react";
import styles from "../styles/FoodPage.module.css";
import Image from "next/image";
import rightArrow from "../assets/images/right-arrow-white.svg";
import { useSelector , useDispatch} from "react-redux";
import Head from 'next/head';
import { useRouter } from "next/router";
import { setCart } from "../Store/Action";
import noFood from "../assets/images/empty_food.png";
import FormatHelper from "../Helper/FormatHelper";
import { toast } from "react-toastify";


const foodPage=()=>{
    const router=useRouter();
    const dispatch=useDispatch();
    const food = useSelector(state=>state.Reducer.food);
    const cart = useSelector(state=>state.Reducer.cart);
    const [count , setCount]=useState(0);

    const addToCart=()=>{
        let already = false;
        if(cart && cart.length>0 && cart[0].ProviderID!==food.ProviderID){
            toast.warning("شما فقط میتوانید از یک تامین کننده خرید کنید",{
                position:"bottom-left"
            })
        }else if(food.count > food.Quantity){
            toast.warning("ظرفیت کافی نمیباشد",{
                position:"bottom-left"
            })
        }else{
            if(cart && cart.length>0){
                cart.map((data)=>{
                    if(data.ID===food.ID){
                        already=true;
                    }else{
                        already=false;
                    }
                })
            }
            if(food.count===0){
                toast.warning("لطفا مقدار را بیشتر از صفر قرار دهید",{
                    position:"bottom-left"
                });
            }else{
                if(cart && cart.length===0){
                    cart.push(food);
                    toast.success("به سبد خرید افزوده شد",{
                        position:"bottom-left"
                    })
                    console.log("first");
                }else{
                    if(already===true){
                        cart.map((data)=>{
                            if(data.ID===food.ID){
                                data.count=food.count;
                            }
                        })
                        toast.success("به سبد خرید افزوده شد",{
                            position:"bottom-left"
                        });
                    }
                    if(already===false && cart){
                        cart.push(food);
                        toast.success("به سبد خرید افزوده شد",{
                            position:"bottom-left"
                        });
                    }
                }
            }
            console.log(cart);
        }
    }

    const Increase=()=>{
        food.count++;
        setCount(count+1);
        if(count===10){
            food.count=10;
            setCount(10);
        }
    }

    const removeFromCart=()=>{
        food.count--;
        setCount(count-1);
        if(count===1){
            food.count=0;
            setCount(0);
        }
        console.log(cart);
    }

    useEffect(()=>{
        console.log(food);
        if(food){
            setCount(food.count)
        }
    },[])

    useEffect(()=>{
        if(cart && cart.length>0){
            localStorage.setItem("cart",JSON.stringify(cart));
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
            {food &&
                <div style={{position:"relative"}} className={`${styles.food_page} dashboard-page`}>
                    <div onClick={()=>console.log(cart , food)} style={{fontSize:"14px"}} className="header">
                        {food.Title}
                        <div className="header-right-icon">
                            <Image
                                src={rightArrow}
                                alt="back"
                                onClick={()=>router.push("/restaurantPage")}
                            />
                        </div>
                    </div>
                    <div className={styles.food_page_banner}>
                        {food.PhotoUrl!=="https://iketpanel.com" ?
                            <Image
                                src={food.PhotoUrl}
                                loader={()=>food.PhotoUrl}
                                alt="food logo"
                                width={"100%"}
                                height={"100%"}
                            />
                        :
                            <Image
                                src={noFood}
                                alt="food logo"
                                width={"100%"}
                                height={"100%"}
                            />
                        }
                    </div>
                    <div className={styles.food_page_box}>
                        <div>
                            <div>
                                {food.Title}
                            </div>
                            <div>
                                {food.Description && food.Description}
                            </div>
                            <div>
                                <div className={food.PriceWithDiscount!==food.Price ? styles.restaurant_page_discount_price : ""}>
                                    {FormatHelper.toPersianString(food.Price.toLocaleString()) + " تومان"}
                                </div>
                                <div>
                                    {food.PriceWithDiscount!==food.Price && FormatHelper.toPersianString(food.PriceWithDiscount.toLocaleString()) +"تومان"}
                                </div>
                            </div>
                            <div>
                                <div 
                                    onClick={()=>{
                                        if(count>0){
                                            removeFromCart();
                                        }
                                    }}
                                >
                                    _
                                </div>
                                <div>
                                    {FormatHelper.toPersianString(count)}
                                </div>
                                <div onClick={Increase}>+</div>
                                <div>
                                    {food.PriceWithDiscount===food.Price ?
                                        FormatHelper.toPersianString((food.Price * food.count).toLocaleString()) + " تومان"
                                    :
                                        FormatHelper.toPersianString((food.PriceWithDiscount * food.count).toLocaleString()) +"تومان"
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    <div
                        style={{
                            position:"absolute",
                            bottom:"0",
                            width:"100%",
                            height:"40px",
                            display:"flex",
                            background:"#00a854",
                            justifyContent:"center",
                            alignItems:"center",
                            color:"white"
                        }}
                        onClick={addToCart}
                    >
                        افزودن به سبد خرید
                    </div>
                </div>
            }
        </div>
    )
}
export default foodPage;