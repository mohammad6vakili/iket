import { useEffect,useState } from "react";
import styles from "../styles/AllRestaurants.module.css";
import Menu from "../Components/Menu/Menu";
import { useSelector , useDispatch} from "react-redux";
import {setMenu, setResData} from "../Store/Action";
import Image from "next/image";
import Head from 'next/head';
import { useRouter } from "next/router";
import axios from "axios";
import { toast } from "react-toastify";
import FormatHelper from "../Helper/FormatHelper";
import Env from "../Constant/Env.json";
import { Input } from "antd";
import starIcon from "../assets/images/star.png";


const AllRestaurants=()=>{
    const router=useRouter();
    const dispatch=useDispatch();

    const categoryType=useSelector(state=>state.Reducer.categoryType);
    const cartData=useSelector(state=>state.Reducer.cart);
    const lat=useSelector(state=>state.Reducer.lat);
    const lng=useSelector(state=>state.Reducer.lng);
    const [restaurants , setRestaurants]=useState(null);
    const [text , setText]=useState("");
    const [search , setSearch]=useState([]);

    const getAllRestaurants=async()=>{
        const cityId = localStorage.getItem("selectCity");
        const postData = new FormData();
        postData.append("Token",Env.token);
        postData.append("CategoryTypeId",categoryType);
        postData.append("CityId",cityId);
        if(lat!==""){
            postData.append("Latitude",lat);
        }
        if(lng!==""){
            postData.append("Longitude",lng);
        }
        try{
            const response=await axios.post(Env.baseUrl + "SelectCategoryFamilyByRestaurant.aspx",postData);
            if(response.data.Status===1){
                response.data.Data.map((data)=>{
                    data.SubCategory.map((subCat)=>{
                        subCat.Product.map((pr)=>{
                            pr.count=0;
                        })
                    })
                });
                setRestaurants(response.data.Data);
            }else{
                toast.warning(response.data.Message,{
                    position:"bottom-left"
                })
            }
        }catch(err){
            console.log(err);
        }
    }

    const selectRes=(data)=>{
        router.push("/restaurantPage");
        dispatch(setResData(data));
        dispatch(setMenu(0));
    }

    useEffect(()=>{
        getAllRestaurants();
        dispatch(setMenu(1));
    },[])

    useEffect(()=>{
        if(cartData && cartData.length>0){
            localStorage.setItem("cart",JSON.stringify(cartData));
        }
    })

    useEffect(()=>{
        if(text.length===0 || text.length===1){
            setSearch([]);
        }else{
            setSearch(
                restaurants.filter((data)=>data.Title.includes(text))
            )
        }
    },[text])

    return(
        <div className="app-container">
            <Head>
                <title>آیکت</title>
                <meta name='description' content='فروشگاه آنلاین آیکت'/>
                <link rel="icon" href="/favicon.ico" />
                <link rel="manifest" href="/manifest.json" />
            </Head>
            <div className={`${styles.all_restaurants} dashboard-page`}>
                <Menu/>
                <div onClick={()=>console.log(search , text)} className="header">
                    {categoryType==="2" ?
                        "لیست رستوران ها"
                    :
                        "لیست فست فود ها"
                    }
                </div>
                <div className={styles.all_restaurants_search_bar}>
                    <Input 
                        value={text} 
                        onChange={(e)=>setText(e.target.value)} 
                        placeholder="جستجوی نام رستوران و فست فود" 
                    />
                </div>
                <div className={styles.all_restaurants_list}>
                    {search && search.length>0 && search.map((data,index)=>(
                        <div onClick={()=>selectRes(data)} className={styles.all_restaurants_list_item}>
                            <div>
                                <Image
                                    key={index}
                                    width={"65px"}
                                    height={"65px"}
                                    src={data.PhotoUrl}
                                    loader={()=>data.PhotoUrl}
                                    alt="slider"
                                />
                                {data.IsWork===0 &&                            
                                    <div>تعطیل</div>
                                }
                            </div>
                            <div>
                                <div>{data.Title}</div>
                                <div>
                                    <div>{data.Address}</div>
                                </div>
                                <div>
                                    <div className={styles.restaurant_slider_box_delivery}>
                                        هزینه ارسال : <span>{data.DeliveryPrice===0 ? "رایگان" : data.DeliveryPrice+" "+"تومان"}</span>
                                    </div>
                                    {data.Points!==0 &&
                                        <div className={styles.restaurant_list_rate_box}>
                                            <Image
                                                width={"12px"}
                                                height={"12px"}
                                                src={starIcon}
                                                alt="rate"
                                            />
                                            <span>{data.Points && FormatHelper.toPersianString(data.Points.toFixed(1))}</span>
                                        </div>
                                    }
                                </div>
                            </div>
                            {data.Discount!==null && data.Discount!==0 &&
                                <div className={styles.restaurant_list_discount_box}>
                                    {FormatHelper.toPersianString(data.Discount)} %
                                </div>
                            }
                        </div>
                    ))}
                    {restaurants && search.length===0 && restaurants.length>0 && restaurants.map((data,index)=>(
                        <div onClick={()=>selectRes(data)} className={styles.all_restaurants_list_item}>
                            <div>
                                <Image
                                    key={index}
                                    width={"65px"}
                                    height={"65px"}
                                    src={data.PhotoUrl}
                                    loader={()=>data.PhotoUrl}
                                    alt="slider"
                                />
                                {data.IsWork===0 &&                            
                                    <div>تعطیل</div>
                                }
                            </div>
                            <div>
                                <div>{data.Title}</div>
                                <div>
                                    <div>{data.Address}</div>
                                </div>
                                <div>
                                    <div className={styles.restaurant_slider_box_delivery}>
                                        هزینه ارسال : <span>{data.DeliveryPrice===0 ? "رایگان" : data.DeliveryPrice+" "+"تومان"}</span>
                                    </div>
                                    {data.Points!==0 &&
                                        <div className={styles.restaurant_list_rate_box}>
                                            <Image
                                                width={"12px"}
                                                height={"12px"}
                                                src={starIcon}
                                                alt="rate"
                                            />
                                            <span>{data.Points && FormatHelper.toPersianString(data.Points)}</span>
                                        </div>
                                    }
                                </div>
                            </div>
                            {data.Discount!==null && data.Discount!==0 &&
                                <div className={styles.restaurant_list_discount_box}>
                                    {FormatHelper.toPersianString(data.Discount)} %
                                </div>
                            }
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
export default AllRestaurants;