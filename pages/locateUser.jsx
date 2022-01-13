import { useState,useEffect } from "react";
import styles from "../styles/LocateUser.module.css";
import locationIcon from "../assets/images/location_icon.png";
import Image from "next/image";
import { Select } from "antd";
import axios from "axios";
import { toast } from "react-toastify";
import Env from "../Constant/Env.json";
const {Option}=Select;


const LocateUser=()=>{

    const [city , setCity]=useState(null);
    const [area , setArea]=useState(null);

    const getAreas=async()=>{
        let postData=new FormData();
        postData.append("token",Env.token);
        try{
            const response=await axios.post(Env.baseUrl + "SelectArea.aspx",postData);
            setCity(response.data.Data);
        }catch(err){
            toast.error("خطا در برقراری ارتباط",{
                position:"bottom-left"
            })
            console.log(err);
        }
    }

    const selectCityHandler=(val)=>{
        console.log(val);
    }

    useEffect(()=>{
        getAreas();
    },[])

    return(
        <div className="app-container">
            <div className={`${styles.locate_user} dashboard-page`}>
                <div className={styles.locate_user_icon}>
                    <Image
                        src={locationIcon}
                        alt="location"
                        width={"110px"}
                        height={"90px"}
                    />
                </div>
                <div className={styles.locate_user_title}>
                    جهت استفاده از امکانات اپلیکیشن نزدیکترین منطقه به خود را انتخاب کنید
                </div>
                <div className={styles.locate_user_select_wrapper}>
                    <Select
                        showSearch
                        style={{width:"35%"}}
                        className={styles.locate_user_select}
                        placeholder="شهر"
                        onChange={(val)=>selectCityHandler(val)}
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                    >
                        {city && city.map((data)=>(
                            <Option value={data.ID}>{data.Title}</Option>
                        ))}
                    </Select>
                    <Select
                        showSearch
                        disabled={!area}
                        style={{width:"60%"}}
                        className={styles.locate_user_select}
                        placeholder="محله یا آدرس"
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                    >
                    </Select>
                </div>
            </div>
        </div>
    )
}
export default LocateUser;