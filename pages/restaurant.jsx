import { useState,useEffect } from "react";
import styles from "../styles/Restaurant.module.css";
import Image from "next/image";
import { useRouter } from "next/router";
import { Modal } from "antd";
import Colors from "../Helper/Colors";
import { Button } from "antd";
import { useDispatch , useSelector} from "react-redux";
import { setResData,setMenu,setCart , setCategoryType , setHypers , setSelectedHyper} from "../Store/Action";
import Head from 'next/head';
import Env from "../Constant/Env.json";
import { toast } from "react-toastify";
import axios from "axios";
import whiteLogo from "../assets/images/white-logo.webp";
import searchIcon from "../assets/images/search.svg";
import dashboardIcon from "../assets/images/dashboard.png";
import Carousel from 'react-elastic-carousel';
import Menu from "../Components/Menu/Menu";
import fastFoodImage from "../assets/images/fastfood.png";
import hyperMarketImage from "../assets/images/hyper_market.png";
import restaurantImage from "../assets/images/restaurant.png";


const Restaurant=()=>{
    const dispatch=useDispatch();
    const router=useRouter();
    
    const lat=useSelector(state=>state.Reducer.lat);
    const hypers=useSelector(state=>state.Reducer.hypers);
    const categoryType=useSelector(state=>state.Reducer.categoryType);
    const cartData=useSelector(state=>state.Reducer.cart);
    const selectedHyper=useSelector(state=>state.Reducer.selectedHyper);
    const [sliders , setSliders]=useState(null);
    const [newest , setNewest]=useState(null);
    const [best , setBest]=useState(null);

    const [modal , setModal]=useState(false);

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
                response.data.Data.map((data)=>{
                    data.SubCategory.map((subCat)=>{
                        subCat.Product.map((pr)=>{
                            pr.count=0;
                        })
                    })
                });
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
                response.data.Data.map((data)=>{
                    data.SubCategory.map((subCat)=>{
                        subCat.Product.map((pr)=>{
                            pr.count=0;
                        })
                    })
                });
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
        router.push("/restaurantPage");
        dispatch(setResData(data));
    }

    useEffect(()=>{
        getSliders();
        getNewest();
        getBest();
    },[])

    useEffect(()=>{
        getSliders();
        getNewest();
        getBest();
    },[categoryType])

    useEffect(()=>{
        if(cartData && cartData.length>0){
            localStorage.setItem("cart",JSON.stringify(cartData));
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
            <div className={`${styles.restaurant} dashboard-page`}>
            <Modal
                    visible={modal}
                    width={320}
                    style={{top:"42vh"}}
                    bodyStyle={{backgroundColor:"rgba(200,200,200,0.5)"}}
                    onCancel={()=>setModal(false)}
                    onOk={()=>setModal(false)}
                    closable={false}
                >
                    <div style={{width:"100%",display:"flex",flexDirection:"column"}}>
                        <div 
                            style={{
                                width:"100%",
                                fontSize:"16px",
                                marginBottom:"20px",
                                textAlign:"center",
                                color:Colors.purple,
                            }}
                        >
                            نزدیکترین هایپر مارکت ها
                        </div>
                           {hypers.length > 0 && hypers.map((data)=>(
                                <div style={{display:'flex',alignItems:"center",marginBottom:"10px"}}>
                                    <input
                                        style={{marginLeft:"7px",cursor:"pointer"}}
                                        onClick={(e)=>{
                                            dispatch(setSelectedHyper(e.target.value));
                                            dispatch(setSelectedHyper(data));
                                        }}
                                        type="radio"
                                        value={data.ID}
                                        name="hyper"
                                    />
                                    <label htmlFor="hyper">
                                        {data.BusinessName}
                                    </label>
                                </div>
                           ))}
                        <div 
                            onClick={()=>{
                                if(selectedHyper===""){
                                    toast.warning("لطفا مجموعه مورد نظر خود را انتخاب کنید",{
                                        position:"bottom-left"
                                    })
                                }else{
                                    dispatch(setCategoryType("1"));
                                    router.push("/hypers");
                                }
                                 
                            }}
                            style={{color:Colors.purple,marginTop:"10px",cursor:"pointer"}}
                        >
                            انتخاب
                        </div>
                    </div>
                </Modal>
                <div className="header">
                    <Image
                        src={whiteLogo}
                        alt="iket"
                        width={"100px"}
                        height={"28px"}
                    />
                    <div
                        onClick={()=>{
                            dispatch(setMenu(3));
                            router.push("/search");
                        }}
                        style={{cursor:"pointer"}} 
                        className="header-left-icon"
                    >
                        <Image
                            src={searchIcon}
                            alt="search"
                            width={""}
                        />
                    </div>
                </div>
                <div className="service_change_wrapper">
                    <div
                        className={categoryType==="1" ? "type_selected" : ""}
                        onClick={()=>{
                            if(lat!==""){
                                dispatch(setCategoryType("1"));
                                router.push("/hypers");
                            }else{
                                if(hypers.length===0){
                                    toast.error("در حال حاضر مجموعه ای جهت ارائه خدمات فعال نمی باشد",{
                                        position:"bottom-left"
                                    })
                                }else if(hypers.length===1){
                                    dispatch(setSelectedHyper(hypers[0].ID));
                                    dispatch(setCategoryType("1"));
                                }else{
                                    if(hypers.length>0){
                                        dispatch(setHypers(
                                            hypers.filter((v,i,a)=>a.findIndex(t=>(t.ID===v.ID))===i)
                                        ))
                                    }
                                    setModal(true);
                                }
                            }
                        }}
                    >
                        <Image
                            src={hyperMarketImage}
                            alt="service"
                        />  
                        <span>هایپر مارکت</span>
                    </div>
                    <div
                        className={categoryType==="2" ? "type_selected" : ""}
                        onClick={()=>{dispatch(setCategoryType("2"));router.push("/restaurant")}}
                    >
                        <Image
                            src={restaurantImage}
                            alt="service"
                        />
                        <span>رستوران</span>
                    </div>
                    <div className={styles.home_item_two}>
                        <div
                            className={categoryType==="3" ? "type_selected" : ""}
                            onClick={()=>{dispatch(setCategoryType("3"));router.push("/restaurant")}}
                        >
                            <Image
                                src={fastFoodImage}
                                alt="service"
                            />
                            <span>فست فود</span>
                        </div>
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
                        <a href={data.Link !=="" ? data.Link : "#"}>
                            <Image
                                key={index}
                                width={"100%"}
                                height={"100%"}
                                src={data.PhotoUrl}
                                loader={()=>data.PhotoUrl}
                                alt="slider"
                            />
                        </a>
                    ))
                    }
                </Carousel>
                <Button
                    onClick={()=>{dispatch(setMenu(1));router.push("/allRestaurants");}}
                    className={`btn_green ${styles.all_restaurants_btn}`}
                >
                    {categoryType==="2" ?
                        <div>لیست رستوران ها</div>
                    :
                        <div>لیست فست فود ها</div>
                    }
                    <Image
                        width={"24px"}
                        height={"24px"}
                        src={dashboardIcon}
                        alt="restaurants"
                    />
                </Button>
                <Menu/>
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
                        <div 
                            onClick={()=>selectRes(data)} 
                            className={styles.restaurant_slider_box}
                        >
                            <div className={styles.restaurant_slider_box_image}>
                                <Image
                                    key={index}
                                    width={"100%"}
                                    height={"100%"}
                                    src={data.Profilebackground}
                                    loader={()=>data.Profilebackground}
                                    alt="slider"
                                />
                                {data.IsWork===0 &&
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
                                <span>پیک رستوران : </span><span>{data.DeliveryPrice===0 ? "رایگان" : data.DeliveryPrice+" "+"تومان"}</span>
                            </div>
                        </div>
                    ))}
                </Carousel>
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
                    {best && best.length!==0 && best.map((data,index)=>(
                        <div 
                            onClick={()=>selectRes(data)} 
                            className={styles.restaurant_slider_box}
                        >
                            <div className={styles.restaurant_slider_box_image}>
                                <Image
                                    key={index}
                                    width={"100%"}
                                    height={"100%"}
                                    src={data.Profilebackground}
                                    loader={()=>data.Profilebackground}
                                    alt="slider"
                                />
                                {data.IsWork===0 &&
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
                                <span>پیک رستوران : </span> <span>{data.DeliveryPrice===0 ? "رایگان" : data.DeliveryPrice+" "+"تومان"}</span>
                            </div>
                        </div>
                    ))}
                </Carousel>
            </div>
        </div>
    )
}
export default Restaurant;