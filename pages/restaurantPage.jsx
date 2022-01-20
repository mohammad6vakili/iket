import { useEffect } from "react";
import styles from "../styles/RestaurantPage.module.css";
import Image from "next/image";
import Menu from "../Components/Menu/Menu";
import rightArrow from "../assets/images/right-arrow-white.svg";
import searchIcon from "../assets/images/search.svg";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import FormatHelper from "../Helper/FormatHelper";


const RestaurantPage=()=>{
    
    const router=useRouter();
    const resData=useSelector(state=>state.Reducer.resData);

    useEffect(()=>{
        if(resData===null){
            router.push("/restaurant");
        }
    },[])

    return(
        <div className="app-container">
            <div className={`${styles.restaurant_page} dashboard-page`}>
                <Menu/>
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
                        <div>{FormatHelper.toPersianString(resData.SubTitle)}</div>
                    </div>
                }
            </div>
        </div>
    )
}
export default RestaurantPage;