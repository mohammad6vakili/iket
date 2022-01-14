import { useState,useEffect,useRef} from "react";
import styles from "../styles/LocateUser.module.css";
import locationIcon from "../assets/images/location_icon.png";
import locationImage from "../assets/images/map-locate.webp";
import headerBackground from "../assets/images/header_background.jpg";
import successGray from "../assets/images/success-gray.svg";
import successGreen from "../assets/images/success-green.svg";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { setCityHypers } from "../Store/Action";
import { useRouter } from "next/router";
import { Input , Button , Modal} from "antd";
import { DownOutlined , RightOutlined } from '@ant-design/icons';
import axios from "axios";
import { toast } from "react-toastify";
import Env from "../Constant/Env.json";


const LocateUser=()=>{
    const dispatch = useDispatch();
    const router = useRouter();
    const submitRef = useRef();
    const [city , setCity]=useState(null);
    const [area , setArea]=useState(null);
    const [selectCity , setSelectCity]=useState({});
    const [selectArea , setSelectArea]=useState({});
    const [cityModal , setCityModal]=useState(false);
    const [areaModal , setAreaModal]=useState(false);


    const getAreas=async()=>{
        let postData=new FormData();
        postData.append("token",Env.token);
        try{
            const response=await axios.post(Env.baseUrl + "SelectArea.aspx",postData);
            if(response.data.Status===1){
                setCity(response.data.Data);
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

    const getAreaWithProvider=async()=>{
        let postData=new FormData();
        postData.append("token",Env.token);
        try{
            const response=await axios.post(Env.baseUrl + "SelectAreaWithProvider.aspx",postData);
            if(response.data.Status===1){
                dispatch(setCityHypers(response.data.Data));
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

    const getLatestNotifications =async()=>{
        let postData=new FormData();
        postData.append("Token",Env.token);
        postData.append("LastNotifID","1");
        try{
            const response=await axios.post(Env.baseUrl + "GetLatestNotifications.aspx",postData);
            if(response.data.Status===1){
                console.log(response.data);            
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

    const selectCityHandler=(data)=>{
        setSelectCity(data);
        localStorage.setItem("selectCity",data.ID);
        setCityModal(false);
        setArea(data.Area);
    }

    const selectAreaHandler=(data)=>{
        localStorage.setItem("selectArea",data.ID);
        setSelectArea(data);
        setAreaModal(false);
    }

    const goToLogin=()=>{
        if(Object.keys(selectCity).length === 0){
            toast.warning("لطفا شهر مورد نظر را وارد کنید",{
                position:"bottom-left"
            });
        }else if(Object.keys(selectArea).length === 0){
            toast.warning("لطفا محله و آدرس مورد نظر را وارد کنید",{
                position:"bottom-left"
            });
        }else{
            router.push("/home");
        }
    }

    useEffect(async()=>{
        getAreas();
        getAreaWithProvider();
        getLatestNotifications();
    },[])

    return(
        <div className="app-container">
            <div className={`${styles.locate_user} dashboard-page`}>
                <div className={styles.locate_user_icon}>
                    <Image
                        onClick={()=>console.log(selectArea , selectCity)}
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
                    <Input 
                        suffix={<DownOutlined style={{color:"gray"}} />} 
                        placeholder="شهر"
                        value={selectCity && selectCity.Title}
                        onFocus={()=>{setCityModal(true);submitRef.current.focus();}}
                    />
                    <Input 
                        disabled={!selectCity}
                        suffix={<DownOutlined style={{color:"gray"}} />} 
                        value={selectArea && selectArea.Area}
                        placeholder="محله یا آدرس"
                        onFocus={()=>{setAreaModal(true);submitRef.current.focus();}}
                    />
                </div>
                <div className={styles.locate_user_map_button}>
                    <div>
                        <Image
                            src={locationImage}
                            alt="location"
                            width={"40px"}
                            height={"40px"}
                        />
                    </div>
                    <span>مکان یابی خودکار</span>
                </div>
                <Button  
                    onClick={goToLogin}
                    ref={submitRef} 
                    className={`${styles.locate_user_login_button} enter_purple_btn`}
                >
                    ورود به برنامه
                    <RightOutlined style={{position:"absolute",right:"15px",top:"35%",fontSize:"13px"}}/>
                </Button>
            </div>
            <Modal 
                visible={cityModal}
                closable={false}
                className={styles.locate_user_city_modal_body}
                bodyStyle={{padding:"0"}}
                onCancel={()=>setCityModal(false)}
            >
                <div className={styles.locate_user_city_modal}>
                    <div>
                        <Image
                            src={headerBackground}
                            alt="location"
                            width={"100%"}
                            height={"150px"}
                        />
                        <div>
                            <Image
                                src={locationImage}
                                alt="location"
                                width={"35px"}
                                height={"35px"}
                            />
                        </div>
                    </div>
                    <div className={styles.locate_user_city_modal_list_wrapper}>
                        <div>شهر خود را انتخاب کنید</div>
                    </div>
                    <div className={styles.locate_user_city_modal_list}>
                        {city && city.map((data)=>(
                            <div onClick={()=>selectCityHandler(data)}>
                                <Image
                                    src={data.ID===selectCity.ID ? successGreen : successGray}
                                    alt="success"
                                    width={"25px"}
                                    height={"25px"}
                                />
                                <span className={data.ID===selectCity.ID && styles.city_selected_in_modal}>
                                    {data.Title}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </Modal>
            <Modal 
                visible={areaModal}
                closable={false}
                className={styles.locate_user_city_modal_body}
                bodyStyle={{padding:"0"}}
                onCancel={()=>setAreaModal(false)}
            >
                <div className={styles.locate_user_city_modal}>
                    <div>
                        <Image
                            src={headerBackground}
                            alt="location"
                            width={"100%"}
                            height={"150px"}
                        />
                        <div>
                            <Image
                                src={locationImage}
                                alt="location"
                                width={"35px"}
                                height={"35px"}
                            />
                        </div>
                    </div>
                    <div className={styles.locate_user_city_modal_list_wrapper}>
                        <div>محله یا آدرس خود را انتخاب کنید</div>
                    </div>
                    <div className={styles.locate_user_city_modal_list}>
                        {area && area.map((data)=>(
                            <div onClick={()=>selectAreaHandler(data)}>
                                <Image
                                    src={data.ID===selectArea.ID ? successGreen : successGray}
                                    alt="success"
                                    width={"25px"}
                                    height={"25px"}
                                />
                                <span className={data.ID===selectArea.ID && styles.city_selected_in_modal}>
                                    {data.Area}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </Modal>
        </div>
    )
}
export default LocateUser;