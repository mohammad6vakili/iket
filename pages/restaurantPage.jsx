import { useEffect, useState } from "react";
import styles from "../styles/RestaurantPage.module.css";
import Image from "next/image";
import rightArrow from "../assets/images/right-arrow-white.svg";
import searchIcon from "../assets/images/search.svg";
import {useDispatch,useSelector} from "react-redux";
import { setFood,setMenu,setBadge,setCart,setSelectedProvider} from "../Store/Action";
import Head from 'next/head';
import { useRouter } from "next/router";
import FormatHelper from "../Helper/FormatHelper";
import { Button } from "antd";
import { toast } from "react-toastify";
import noFoodIcon from "../assets/images/no-food.png";
import logo from "../assets/images/logo_colored.webp";


const RestaurantPage=()=>{
    
    const dispatch=useDispatch();
    const router=useRouter();
    const resData=useSelector(state=>state.Reducer.resData);
    const cart=useSelector(state=>state.Reducer.cart);
    const [products , setProducts]=useState([]);
    const [show , setShow]=useState(true);
    const [catId , setCatId]=useState(null);

    const addToCart=(product)=>{
        console.log(product)
        setShow(false);
        let already=false;
        if(cart && cart.length>0 && cart[0].ProviderID!==product.ProviderID){
            toast.warning("خرید از چند فروشگاه امکان پذیر نیست.",{
                position:"bottom-left"
            })
        }else if(product.count > product.Quantity){
            toast.warning("موجودی محصول کافی نیست",{
                position:"bottom-left"
            })
        }else{
            cart.map((pr)=>{
                if(pr.ID===product.ID){
                    already = true;
                    pr.count = product.count + pr.count;
                }
            });
            toast.success("به سبد خرید افزوده شد",{
                position:"bottom-left"
            })
            if (!already) {
                if(product.count===0 || product.count===1){
                    cart.push({...product , count:1});
                    product.count = 1;
                }else if(product.count>1){
                    cart.push(product);
                }
            }
            if(cart && cart.length>0){
                localStorage.setItem("cart",JSON.stringify(cart));
            }
        }
        dispatch(setBadge(cart.length));
    }

    useEffect(()=>{
        if(resData===null){
            router.push("/restaurant");
        }
        if(resData && cart && cart.length>0){
            if(resData.ID!==cart[0].ProviderID){
                dispatch(setCart([]));
                dispatch(setBadge(0))
                localStorage.setItem("cart",[]);
                console.log("2")
            }
        }
        dispatch(setMenu(0));
        if(resData){
            dispatch(setSelectedProvider(resData.ID));
        }
    },[])

    useEffect(()=>{
        if(show===false){
            setShow(true);
        }
    },[show])

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
            <div className={`${styles.restaurant_page} dashboard-page`}>
                <div onClick={()=>console.log(cart)} className="header">
                    منوی رستوران
                    <div className="header-right-icon">
                        <Image
                            src={rightArrow}
                            alt="back"
                            onClick={()=>router.push("/allRestaurants")}
                        />
                    </div>
                    <div onClick={()=>router.push("/search")} style={{cursor:"pointer"}} className="header-left-icon">
                        <Image
                            src={searchIcon}
                            alt="search"
                        />
                    </div>
                </div>
                {resData &&
                    <>
                        <div id={resData.PhotoUrl!=="https://iketpanel.com" ? "no_pic_image" : ""} className={styles.restaurant_page_banner}>
                            <Image
                                src={resData.Profilebackground}
                                loader={()=>resData.Profilebackground}
                                alt="restaurant logo"
                                width={"100%"}
                                height={"100%"}
                            />
                            <div className={styles.restaurant_page_banner_overlay}></div>
                                {resData.PhotoUrl==="https://iketpanel.com"?
                                <div className={styles.restaurant_page_banner_overlay_image}>
                                    <Image
                                        src={logo}
                                        alt="restaurant logo"
                                        width={"100px"}
                                        height={"50px"}
                                    />
                                </div>
                                :
                                <div className={styles.restaurant_page_banner_overlay_image}>
                                    <Image
                                        src={resData.PhotoUrl}
                                        loader={()=>resData.PhotoUrl}
                                        alt="restaurant logo"
                                        width={"100%"}
                                        height={"100%"}
                                    />
                                </div>
                                }
                            <div>{resData && resData.Title}</div>
                            <div>{resData && resData.SubTitle && FormatHelper.toPersianString(resData.SubTitle)}</div>
                        </div>
                        <div className={styles.restaurant_page_menu_wrapper}>
                            <div className={styles.restaurant_page_menu_sidebar}>
                                {resData.SubCategory && resData.SubCategory.map((cat,index)=>{
                                    if(cat.Product.length>0){
                                        return <div 
                                                    key={index} 
                                                    onClick={()=>{setProducts(cat.Product);setCatId(cat.ID)}}
                                                    className={cat.ID===catId ? "side_selected" : ""}
                                                >
                                                    <div>
                                                        <Image
                                                            src={cat.PhotoUrl}
                                                            loader={()=>cat.PhotoUrl}
                                                            alt="category image"
                                                            width={"100%"}
                                                            height={"100%"}
                                                        />
                                                    </div>
                                                    <div style={cat.ID===catId ? {color:"rgb(139,85,233)"} : {color:"unset"}}>{cat.Title}</div>
                                                </div>
                                    }
                                })}
                            </div>
                            <div className={styles.restaurant_page_menu_menu}>
                                {products && products.map((pr,index)=>(
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
                                        <div>{pr && pr.Description && FormatHelper.toPersianString(pr.Description)}</div>
                                        <div>
                                            <select
                                                onChange={(e)=>{
                                                    pr.count=parseInt(e.target.value);
                                                    console.log(pr)
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
                                                    {pr && pr.Price && FormatHelper.toPersianString(pr.Price.toLocaleString()) + " تومان"}
                                                </div>
                                                <div
                                                    onClick={()=>{
                                                        if(pr.IsActive===true){
                                                            dispatch(setFood(pr));
                                                            router.push("/foodPage");
                                                        }
                                                    }}
                                                >
                                                    {pr && pr.PriceWithDiscount && pr.Price &&pr.PriceWithDiscount!==pr.Price && FormatHelper.toPersianString(pr.PriceWithDiscount.toLocaleString()) +"تومان"}
                                                </div>
                                                <Button onClick={()=>addToCart(pr)}>
                                                    افزودن به سبد خرید
                                                </Button>
                                            </div>
                                            <div style={{position:"absolute",left:"10px",top:"10px"}}>
                                                {pr.IsActive===false &&
                                                    <Image
                                                        src={noFoodIcon}
                                                        alt="off"
                                                        width={"25px"}
                                                        height={"25px"}
                                                    />
                                                }
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className={styles.restaurant_page_bottom_box}>
                            <Button onClick={()=>router.push("/cart")} className="enter_purple_btn">اتمام خرید</Button>
                            <Button className="enter_purple_btn">
                                {cart && show &&
                                    FormatHelper.toPersianString(cart.reduce((a, c) => a + c.PriceWithDiscount * c.count, 0).toLocaleString())} تومان
                            </Button>
                        </div>
                    </>
                }
            </div>
        </div>
    )
}
export default RestaurantPage;