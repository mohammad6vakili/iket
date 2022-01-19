import { useState,useEffect } from "react";
import styles from "../styles/Restaurant.module.css";
import Image from "next/image";
import { useRouter } from "next/router";
import { Button } from "antd";
import { useDispatch , useSelector} from "react-redux";
import Env from "../Constant/Env.json";
import { toast } from "react-toastify";
import axios from "axios";
import whiteLogo from "../assets/images/white-logo.webp";
import searchIcon from "../assets/images/search.svg";
import dashboardIcon from "../assets/images/dashboard.png";
import Carousel from 'react-elastic-carousel';
import Menu from "../Components/Menu/Menu";


const Restaurant=()=>{
    const dispatch=useDispatch();
    const router=useRouter();
    
    const categoryType=useSelector(state=>state.Reducer.categoryType);
    const [sliders , setSliders]=useState(null);
    const [newest , setNewest]=useState(null);
    const [best , setBest]=useState(null);

    const getSliders=async()=>{
        const cityId = localStorage.getItem("selectCity");
        let postData=new FormData();
        postData.append("Token",Env.token);
        postData.append("CategoryTypeID",categoryType);
        postData.append("CityID",cityId);
        try{
            const response=await axios.post(Env.baseUrl + "SelectSliderByCategoryType.aspx",postData);
            if(response.data.Status===1){
                setSliders(response.data.Data);
            }else{
                toast.warning(response.data.Message,{
                    position:"bottom-left"
                })
            }
        }catch(err){
            toast.error("خطا در برقراری ارتباط",{
                position:"bottom-left"
            })
            console.log(err);
        }
    }

    const getNewest=async()=>{
        const cityId = localStorage.getItem("selectCity");
        try{
            const response=await axios.post(Env.baseUrl + "SelectNewestSellerResturanFastfood/SelectData",{
                Token:Env.token,
                CategoryTypeId: categoryType,
                CityId:cityId
            });
            if(response.data.Status===1){
                setNewest(response.data.Data);
            }else{
                toast.warning(response.data.Message,{
                    position:"bottom-left"
                })
            }
        }catch(err){
            toast.error("خطا در برقراری ارتباط",{
                position:"bottom-left"
            })
            console.log(err);
        }
    }

    const getBest=async()=>{
        const cityId = localStorage.getItem("selectCity");
        try{
            const response=await axios.post(Env.baseUrl + "SelectBestSellerResturanFastfood/SelectData",{
                Token:Env.token,
                CategoryTypeId: categoryType,
                CityId:cityId
            });
            if(response.data.Status===1){
                setBest(response.data.Data);
            }else{
                toast.warning(response.data.Message,{
                    position:"bottom-left"
                })
            }
        }catch(err){
            toast.error("خطا در برقراری ارتباط",{
                position:"bottom-left"
            })
            console.log(err);
        }
    }

    useEffect(()=>{
        getSliders();
        getNewest();
        getBest();
    },[])

    return(
        <div className="app-container">
            <div className={`${styles.restaurant} dashboard-page`}>
                <Menu/>
                <div className="header">
                    <Image
                        onClick={()=>console.log(menu)}
                        src={whiteLogo}
                        alt="iket"
                        width={"100px"}
                        height={"28px"}
                    />
                    <div style={{cursor:"pointer"}} className="header-left-icon">
                        <Image
                            src={searchIcon}
                            alt="search"
                        />
                    </div>
                </div>
                <Carousel
                    className={styles.restaurant_slider}
                    showArrows={false}
                    itemsToShow={1}
                    isRTL={true}
                    enableAutoPlay={true}
                >
                    {sliders && sliders.length!==0 && sliders.map((data,index)=>(
                        <Image
                            key={index}
                            width={"100%"}
                            height={"100%"}
                            src={data.PhotoUrl}
                            loader={()=>data.PhotoUrl}
                            alt="slider"
                        />
                    ))
                    }
                </Carousel>
                <Button
                    className={`btn_green ${styles.all_restaurants_btn}`}
                >
                    <div>لیست رستوران ها</div>
                    <Image
                        width={"24px"}
                        height={"24px"}
                        src={dashboardIcon}
                        alt="restaurants"
                    />
                </Button>
                <div className={styles.title_seperate}>
                    <div>جدیدترین ها</div>
                    <div></div>
                </div>
                <Carousel
                    className={styles.restaurant_slider}
                    showArrows={false}
                    enableAutoPlay={true}
                    renderPagination={()=>(<span></span>)}
                    itemsToShow={2}
                    isRTL={true}
                >
                    {newest && newest.length!==0 && newest.map((data,index)=>(
                        <div className={styles.restaurant_slider_box}>
                            <div className={styles.restaurant_slider_box_image}>
                                <Image
                                    key={index}
                                    width={"100%"}
                                    height={"100%"}
                                    src={data.PhotoUrl}
                                    loader={()=>data.PhotoUrl}
                                    alt="slider"
                                />
                            </div>
                        </div>
                    ))
                    }
                </Carousel>
                <div className={styles.title_seperate}>
                    <div style={{width:"110px"}}>پرفروش ترین ها</div>
                    <div></div>
                </div>
            </div>
        </div>
    )
}
export default Restaurant;