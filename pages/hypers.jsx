import { useState,useEffect } from "react";
import styles from "../styles/Restaurant.module.css";
import Image from "next/image";
import { useRouter } from "next/router";
import { Button } from "antd";
import { useDispatch , useSelector} from "react-redux";
import { setResData,setMenu, setProduct } from "../Store/Action";
import Env from "../Constant/Env.json";
import { toast } from "react-toastify";
import axios from "axios";
import FormatHelper from "../Helper/FormatHelper";
import Colors from "../Helper/Colors";
import whiteLogo from "../assets/images/white-logo.webp";
import searchIcon from "../assets/images/search.svg";
import dashboardIcon from "../assets/images/dashboard.png";
import Carousel from 'react-elastic-carousel';
import Menu from "../Components/Menu/Menu";


const Hypers=()=>{
    const dispatch=useDispatch();
    const router=useRouter();
    
    const categoryType=useSelector(state=>state.Reducer.categoryType);
    const selectedHyper=useSelector(state=>state.Reducer.selectedHyper);
    const lat=useSelector(state=>state.Reducer.lat);
    const lng=useSelector(state=>state.Reducer.lng);
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
        const areaId = localStorage.getItem("selectArea");
        let postData=new FormData();
        postData.append("Token",Env.token);
        postData.append("CategoryTypeID",categoryType);
        postData.append("AreaID",areaId);
        if(lat===""){
            postData.append("userLocation","0");
            postData.append("latitude",parseFloat(selectedHyper.Latitude).toFixed(4));
            postData.append("longitude",parseFloat(selectedHyper.Longitude).toFixed(4));
        }else{
            postData.append("userLocation","1");
            postData.append("latitude",lat);
            postData.append("longitude",lng);
        }
        try{
            const response=await axios.post(Env.baseUrl + "SelectNewestProductByDistance.aspx",postData);
            if(response.data.Status===1){
                response.data.Data.map((pr)=>{
                    pr.count=0;
                })
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
        const areaId = localStorage.getItem("selectArea");
        let postData=new FormData();
        postData.append("Token",Env.token);
        postData.append("CategoryTypeID",categoryType);
        postData.append("AreaID",areaId);
        if(lat===""){
            postData.append("userLocation","0");
            postData.append("latitude",parseFloat(selectedHyper.Latitude).toFixed(4));
            postData.append("longitude",parseFloat(selectedHyper.Longitude).toFixed(4));
        }else{
            postData.append("userLocation","1");
            postData.append("latitude",lat);
            postData.append("longitude",lng);
        }
        try{
            const response=await axios.post(Env.baseUrl + "SelectBestSellersProductByDistance.aspx",postData);
            if(response.data.Status===1){
                response.data.Data.map((pr)=>{
                    pr.count=0;
                })
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

    const selectRes=(data)=>{
        router.push("/product");
        dispatch(setProduct(data));
    }

    useEffect(()=>{
        if(selectedHyper){
            getSliders();
            getNewest();
            getBest();
        }
    },[])

    return(
        <div className="app-container">
            <div className={`${styles.restaurant} dashboard-page`}>
                <Menu/>
                <div className="header">
                    <Image
                        onClick={()=>console.log(newest)}
                        src={whiteLogo}
                        alt="iket"
                        width={"100px"}
                        height={"28px"}
                    />
                    <div style={{cursor:"pointer"}} className="header-left-icon">
                        <Image
                            src={searchIcon}
                            alt="search"
                            width={""}
                        />
                    </div>
                </div>
                {sliders && sliders.length>0 &&
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
                                onClick={()=>{data.Link!=="" && window.location.href == data.Link}}
                            />
                        ))
                        }
                    </Carousel>
                }
                <Button
                    onClick={()=>{dispatch(setMenu(1));router.push("/categories");}}
                    className={`btn_green ${styles.all_restaurants_btn}`}
                >
                    <div>لیست دسته بندی محصولات</div>
                    <Image
                        width={"24px"}
                        height={"24px"}
                        src={dashboardIcon}
                        alt="restaurants"
                    />
                </Button>
                {newest && newest.length!==0 &&
                    <>
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
                            {newest.map((data,index)=>(
                                <div 
                                    onClick={()=>selectRes(data)} 
                                    className={styles.restaurant_slider_box}
                                >
                                    <div className={styles.restaurant_slider_box_image}>
                                        <Image
                                            key={index}
                                            width={"100%"}
                                            height={"100%"}
                                            src={data.PhotoUrl}
                                            loader={()=>data.PhotoUrl}
                                            alt="slider"
                                        />
                                        {data.isActive===false &&
                                            <div>تعطیل</div>
                                        }
                                    </div>
                                    <div 
                                        style={{fontSize:"10px",fontWeight:"100"}} 
                                        className={styles.restaurant_slider_box_title}
                                    >
                                        {data.Title}
                                    </div>
                                    <div 
                                        style={{justifyContent:"flex-end",color:Colors.success}}
                                        className={styles.restaurant_slider_box_delivery}
                                    >
                                        {FormatHelper.toPersianString(data.Price)} تومان 
                                    </div>
                                </div>
                            ))}
                        </Carousel>
                    </>
                }
                {best && best.length!==0 &&
                <>
                    <div className={styles.title_seperate}>
                        <div style={{width:"110px"}}>پرفروش ترین ها</div>
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
                        {best.map((data,index)=>(
                            <div 
                                onClick={()=>selectRes(data)} 
                                className={styles.restaurant_slider_box}
                            >
                                <div className={styles.restaurant_slider_box_image}>
                                    <Image
                                        key={index}
                                        width={"100%"}
                                        height={"100%"}
                                        src={data.PhotoUrl}
                                        loader={()=>data.PhotoUrl}
                                        alt="slider"
                                    />
                                    {data.isActive===false &&
                                        <div>تعطیل</div>
                                    }
                                </div>
                                <div className={styles.restaurant_slider_box_title}>
                                    {data.Title}
                                </div>
                                <div className={styles.restaurant_slider_box_address}>
                                    {data.Address}
                                </div>
                                <div className={styles.restaurant_slider_box_delivery}>
                                    پیک رستوران : <span>{data.DeliveryPrice===0 ? "رایگان" : data.DeliveryPrice+" "+"تومان"}</span>
                                </div>
                            </div>
                        ))}
                    </Carousel>
                    </>
                }
            </div>
        </div>
    )
}
export default Hypers;