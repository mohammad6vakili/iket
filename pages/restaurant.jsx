import { useState,useEffect } from "react";
import styles from "../styles/Restaurant.module.css";
import Image from "next/image";
import { useRouter } from "next/router";
import { useDispatch , useSelector} from "react-redux";
import Env from "../Constant/Env.json";
import { toast } from "react-toastify";
import axios from "axios";
import whiteLogo from "../assets/images/white-logo.webp";
import searchIcon from "../assets/images/search.svg";
import Carousel from 'react-elastic-carousel';


const Restaurant=()=>{
    const dispatch=useDispatch();
    const router=useRouter();
    
    const categoryType=useSelector(state=>state.Reducer.categoryType);
    const [sliders , setSliders]=useState(null);

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

    useEffect(()=>{
        getSliders();
    },[])

    return(
        <div className="app-container">
            <div className={`${styles.restaurant} dashboard-page`}>
                <div className="header">
                    <Image
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
                {/* <Carousel
                    showArrows={false}
                    itemsToShow={1}
                >
                    {sliders && sliders.length!==0 && sliders.map((data,index)=>(
                        <Image
                            key={index}
                            src={data.PhotoUrl}
                            loader={()=>data.PhotoUrl}
                            alt="slider"
                        />
                    ))
                    }
                </Carousel> */}
            </div>
        </div>
    )
}
export default Restaurant;