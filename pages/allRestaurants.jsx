import { useEffect,useState } from "react";
import styles from "../styles/AllRestaurants.module.css";
import Menu from "../Components/Menu/Menu";
import { useSelector , useDispatch} from "react-redux";
import {setResData} from "../Store/Action";
import Image from "next/image";
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
    const [restaurants , setRestaurants]=useState(null);

    const getAllRestaurants=async()=>{
        const cityId = localStorage.getItem("selectCity");
        const postData = new FormData();
        postData.append("Token",Env.token);
        postData.append("CategoryTypeId",categoryType);
        postData.append("CityId",cityId);
        try{
            const response=await axios.post(Env.baseUrl + "SelectCategoryFamilyByRestaurant.aspx",postData);
            if(response.data.Status===1){
                setRestaurants(response.data.Data);
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
        getAllRestaurants();
    },[])

    return(
        <div className="app-container">
            <div className={`${styles.all_restaurants} dashboard-page`}>
                <Menu/>
                <div className="header">
                    رستوران ها
                </div>
                <div className={styles.all_restaurants_search_bar}>
                    <Input placeholder="جستجوی نام رستوران و فست فود" />
                </div>
                <div className={styles.all_restaurants_list}>
                    {restaurants && restaurants.length>0 && restaurants.map((data,index)=>(
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