import { useEffect, useState } from "react";
import styles from "../styles/RestaurantPage.module.css";
import Image from "next/image";
import Menu from "../Components/Menu/Menu";
import rightArrow from "../assets/images/right-arrow-white.svg";
import searchIcon from "../assets/images/search.svg";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import FormatHelper from "../Helper/FormatHelper";
import { Button } from "antd";


const RestaurantPage=()=>{
    
    const router=useRouter();
    const resData=useSelector(state=>state.Reducer.resData);
    const [products , setProducts]=useState([]);

    useEffect(()=>{
        if(resData===null){
            router.push("/restaurant");
        }
    },[])

    return(
        <div className="app-container">
            <div className={`${styles.restaurant_page} dashboard-page`}>
                <div className="header">
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
                                    <div key={index}>
                                        fimkf
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className={styles.restaurant_page_bottom_box}>
                            <Button className="enter_purple_btn">اتمام خرید</Button>
                            <Button className="enter_purple_btn">۰ تومان</Button>
                        </div>
                    </>
                }
            </div>
        </div>
    )
}
export default RestaurantPage;