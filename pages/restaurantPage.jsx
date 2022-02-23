import { useEffect, useState } from "react";
import styles from "../styles/RestaurantPage.module.css";
import Image from "next/image";
import rightArrow from "../assets/images/right-arrow-white.svg";
import searchIcon from "../assets/images/search.svg";
import {useDispatch,useSelector} from "react-redux";
import { setFood } from "../Store/Action";
import Head from 'next/head';
import { useRouter } from "next/router";
import FormatHelper from "../Helper/FormatHelper";
import { Button } from "antd";
import { toast } from "react-toastify";


const RestaurantPage=()=>{
    
    const dispatch=useDispatch();
    const router=useRouter();
    const resData=useSelector(state=>state.Reducer.resData);
    const cart=useSelector(state=>state.Reducer.cart);
    const [products , setProducts]=useState([]);

    const addToCart=(product)=>{
        let already=false;
        cart.map((pr)=>{
            if(pr.ID===product.ID){
                already = true;
                pr.count = product.count;
            }
        });
        toast.success("به سبد خرید افزوده شد",{
            position:"bottom-left"
        })
        if (!already) {
            cart.push({...product , count:1});
        }
    }

    useEffect(()=>{
        if(resData===null){
            router.push("/restaurant");
        }
    },[])

    useEffect(()=>{
        console.log("cart");
        if(cart.length>0){
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
            <div className={`${styles.restaurant_page} dashboard-page`}>
                <div onClick={()=>console.log(cart)} className="header">
                    منوی رستوران
                    <div className="header-right-icon">
                        <Image
                            src={rightArrow}
                            alt="back"
                            onClick={()=>router.push("/restaurant")}
                        />
                    </div>
                    <div style={{cursor:"pointer"}} className="header-left-icon">
                        <Image
                            src={searchIcon}
                            alt="search"
                        />
                    </div>
                </div>
                {resData &&
                    <>
                        <div className={styles.restaurant_page_banner}>
                            <Image
                                src={resData.Profilebackground}
                                loader={()=>resData.Profilebackground}
                                alt="restaurant logo"
                                width={"100%"}
                                height={"100%"}
                            />
                            <div className={styles.restaurant_page_banner_overlay}></div>
                            <div className={styles.restaurant_page_banner_overlay_image}>
                                <Image
                                    src={resData.PhotoUrl}
                                    loader={()=>resData.PhotoUrl}
                                    alt="restaurant logo"
                                    width={"100%"}
                                    height={"100%"}
                                />  
                            </div>
                            <div>{resData.Title}</div>
                            <div>{resData.SubTitle && FormatHelper.toPersianString(resData.SubTitle)}</div>
                        </div>
                        <div className={styles.restaurant_page_menu_wrapper}>
                            <div className={styles.restaurant_page_menu_sidebar}>
                                {resData.SubCategory && resData.SubCategory.map((cat,index)=>{
                                    if(cat.Product.length>0){
                                        return <div key={index} onClick={()=>setProducts(cat.Product)}>
                                                    <Image
                                                        src={cat.PhotoUrl}
                                                        loader={()=>cat.PhotoUrl}
                                                        alt="category image"
                                                        width={"100%"}
                                                        height={"100%"}
                                                    />
                                                    <div>{cat.Title}</div>
                                                </div>
                                    }
                                })}
                            </div>
                            <div className={styles.restaurant_page_menu_menu}>
                                {products.map((pr,index)=>(
                                    <div
                                        className={pr.IsActive===false ? styles.restaurant_page_item_disabled : ""}
                                        key={index}
                                    >
                                        <div 
                                            onClick={()=>{
                                                if(pr.IsActive===true){
                                                    dispatch(setFood(pr));
                                                    router.push("/foodPage");
                                                }
                                            }}
                                        >
                                            {pr.Title}
                                        </div>
                                        <div>
                                            <select
                                                onChange={(e)=>{
                                                    pr.count=parseInt(e.target.value);
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
                                            <div>
                                                <div 
                                                    onClick={()=>{
                                                        if(pr.IsActive===true){
                                                            dispatch(setFood(pr));
                                                            router.push("/foodPage");
                                                        }
                                                    }}
                                                    className={pr.PriceWithDiscount!==pr.Price ? styles.restaurant_page_discount_price : ""}
                                                >
                                                    {FormatHelper.toPersianString(pr.Price.toLocaleString()) + " تومان"}
                                                </div>
                                                <div
                                                    onClick={()=>{
                                                        if(pr.IsActive===true){
                                                            dispatch(setFood(pr));
                                                            router.push("/foodPage");
                                                        }
                                                    }}
                                                >
                                                    {pr.PriceWithDiscount!==pr.Price && FormatHelper.toPersianString(pr.PriceWithDiscount.toLocaleString()) +"تومان"}
                                                </div>
                                                <Button onClick={()=>addToCart(pr)}>
                                                    افزودن به سبد خرید
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className={styles.restaurant_page_bottom_box}>
                            <Button onClick={()=>router.push("/cart")} className="enter_purple_btn">اتمام خرید</Button>
                            <Button className="enter_purple_btn">
                                {cart && cart.map((data)=>{
                                    return FormatHelper.toPersianString((data.Price * data.count).toLocaleString()) + "تومان"
                                })}
                            </Button>
                        </div>
                    </>
                }
            </div>
        </div>
    )
}
export default RestaurantPage;