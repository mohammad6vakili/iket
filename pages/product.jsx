import { useEffect, useState } from "react";
import styles from "../styles/FoodPage.module.css";
import Image from "next/image";
import rightArrow from "../assets/images/right-arrow-white.svg";
import { useSelector , useDispatch} from "react-redux";
import { useRouter } from "next/router";
import { setMenu , setBadge} from "../Store/Action";
import Head from 'next/head';
import noFood from "../assets/images/empty_food.png";
import FormatHelper from "../Helper/FormatHelper";
import { toast } from "react-toastify";


const Product=()=>{
    const router=useRouter();
    const dispatch=useDispatch();
    const product = useSelector(state=>state.Reducer.product);
    const cart = useSelector(state=>state.Reducer.cart);
    const menu = useSelector(state=>state.Reducer.menu);
    const [count , setCount]=useState(0);
    
    
    const addToCart=()=>{
        let already = false;
        if(cart && cart.length>0 && cart[0].ProviderID!==product.ProviderID){
            toast.warning("خرید از چند فروشگاه امکان پذیر نیست.",{
                position:"bottom-left"
            })
        }else if(product.count > product.Quantity){
            toast.warning("ظرفیت کافی نمیباشد",{
                position:"bottom-left"
            })
        }else{
            if(menu===1){
                router.push("/productList");
            }else{
                router.push("/hypers");
            }
            if(cart && cart.length>0){
                cart.map((data)=>{
                    if(data.ID===product.ID){
                        already=true;
                    }else{
                        already=false;
                    }
                })
            }
            if(product.count===0){
                toast.warning("لطفا مقدار را بیشتر از صفر قرار دهید",{
                    position:"bottom-left"
                });
            }else{
                if(cart && cart.length===0){
                    cart.push(product);
                    toast.success("به سبد خرید افزوده شد",{
                        position:"bottom-left"
                    })
                    console.log("first");
                }else{
                    if(already===true){
                        cart.map((data)=>{
                            if(data.ID===product.ID){
                                data.count=product.count;
                            }
                        })
                        toast.success("به سبد خرید افزوده شد",{
                            position:"bottom-left"
                        });
                    }
                    if(already===false && cart){
                        cart.push(product);
                        toast.success("به سبد خرید افزوده شد",{
                            position:"bottom-left"
                        });
                    }
                }
            }
            console.log(cart);
            dispatch(setBadge(cart.length));
        }
    }

    const Increase=()=>{
        product.count++;
        setCount(count+1);
        if(count===10){
            product.count=10;
            setCount(10);
        }
    }

    const removeFromCart=()=>{
        product.count--;
        setCount(count-1);
        if(count===1){
            product.count=0;
            setCount(0);
        }
        console.log(cart);
    }


    useEffect(()=>{
        console.log(product);
        if(product){
            setCount(product.count)
        }
        dispatch(setMenu(0));
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
            {product &&
                <div className={`${styles.food_page} dashboard-page`} style={{position:"relative"}}>
                    <div style={{fontSize:"14px"}} className="header">
                        {product.Title}
                        <div className="header-right-icon">
                            <Image
                                src={rightArrow}
                                alt="back"
                                onClick={()=>{router.push("/hypers");dispatch(setMenu(0));}}
                            />
                        </div>
                    </div>
                    <div className={styles.food_page_banner}>
                        {product.PhotoUrl!=="https://iketpanel.com" ?
                            <Image
                                src={product.PhotoUrl}
                                loader={()=>product.PhotoUrl}
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
                            <div style={{fontSize:"14px"}}>
                                {product.Title}
                            </div>
                            <div>
                                {product.Description && FormatHelper.toPersianString(product.Description)}
                            </div>
                            <div>
                                <div className={product.PriceWithDiscount!==product.Price ? styles.restaurant_page_discount_price : ""}>
                                    {FormatHelper.toPersianString(product.Price.toLocaleString()) + " تومان"}
                                </div>
                                <div>
                                    {product.PriceWithDiscount!==product.Price && FormatHelper.toPersianString(product.PriceWithDiscount.toLocaleString()) +"تومان"}
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
                                <div onClick={()=>{
                                    if(product.count<10){
                                        Increase();
                                    }
                                }}>
                                    +
                                </div>
                                <div>
                                    {product.PriceWithDiscount===product.Price ?
                                        FormatHelper.toPersianString((product.Price * product.count).toLocaleString()) + " تومان"
                                    :
                                        FormatHelper.toPersianString((product.PriceWithDiscount * product.count).toLocaleString()) +"تومان"
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    <div style={{
                        position:"absolute",
                        bottom:"0",
                        width:"100%",
                        height:"50px",
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
export default Product;