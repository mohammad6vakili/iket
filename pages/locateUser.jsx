import { useState,useEffect,useRef} from "react";
import styles from "../styles/LocateUser.module.css";
import locationIcon from "../assets/images/location_icon.png";
import locationImage from "../assets/images/map-locate.webp";
import headerBackground from "../assets/images/header_background.jpg";
import successGray from "../assets/images/success-gray.svg";
import successGreen from "../assets/images/success-green.svg";
import Image from "next/image";
import ReactMapGL,{Marker} from "react-map-gl";
import rightArrow from "../assets/images/right-arrow-white.svg";
import { useDispatch , useSelector} from "react-redux";
import { setCityHypers , setLat , setLng} from "../Store/Action";
import { useRouter } from "next/router";
import markerIcon from "../assets/images/location-marker.png";
import { Input , Button , Modal} from "antd";
import { DownOutlined , RightOutlined } from '@ant-design/icons';
import axios from "axios";
import { toast } from "react-toastify";
import Env from "../Constant/Env.json";


const LocateUser=()=>{
    const dispatch = useDispatch();
    const router = useRouter();
    const submitRef = useRef();
    const [isMap , setIsMap]=useState(false);
    const [city , setCity]=useState(null);
    const [area , setArea]=useState(null);
    const [state , setState]=useState("");
    const [selectCity , setSelectCity]=useState({});
    const [selectArea , setSelectArea]=useState({});
    const [cityModal , setCityModal]=useState(false);
    const [areaModal , setAreaModal]=useState(false);
    const [locName , setLocName]=useState("");

    const lat=useSelector(state=>state.Reducer.lat);
    const lng=useSelector(state=>state.Reducer.lng);

    const [viewport , setViewport]=useState({
        latitude:parseFloat(lat),
        longitude:parseFloat(lng),
        width:"100%",
        height:"100vh",
        zoom:12,
        transitionDuration: 2000,
    });

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

    const getLatestNotifications =async()=>{
        let postData=new FormData();
        postData.append("Token",Env.token);
        postData.append("LastNotifID","1");
        try{
            const response=await axios.post(Env.baseUrl + "GetLatestNotifications.aspx",postData);
            if(response.data.Status===1){
                Notification.requestPermission().then(function(result) {
                    response.data.Data.map((data)=>{
                        new Notification(data.Message);
                    })
                  });
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

    const openMap=()=>{
        if(Object.keys(selectCity).length===0){
            toast.warning("لطفا شهر را انتخاب کنید",{
                position:"bottom-left"
            });
        }else if(Object.keys(selectArea).length===0){
            toast.warning("لطفا محله خود را انتخاب کنید",{
                position:"bottom-left"
            })
        }else{
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(setCoord,handler);
                function setCoord(position){
                    dispatch(setLat(position.coords.latitude.toFixed(6)));
                    dispatch(setLng(position.coords.longitude.toFixed(6)));
                    viewport.latitude =parseFloat(position.coords.latitude.toFixed(6));
                    viewport.longitude =parseFloat(position.coords.longitude.toFixed(6));
                    setIsMap(true);
                }
            }
            function handler(error){
                switch(error.code) {
                    case error.PERMISSION_DENIED:
                        toast.error("برای استفاده از نقشه نیاز به دسترسی موقعیت مکانی میباشد.",{
                            position: toast.POSITION.BOTTOM_LEFT
                        });
                    break;
                    case error.POSITION_UNAVAILABLE:
                        toast.error("موقعیت جغرافیایی ناشناس میباشد.",{
                            position: toast.POSITION.BOTTOM_LEFT
                        });
                    break;
                    case error.TIMEOUT:
                        toast.error("لطفا از برنامه خارج شوید و دوباره امتحان کنید.",{
                            position: toast.POSITION.BOTTOM_LEFT
                        });
                    break;
                    case error.UNKNOWN_ERROR:
                        toast.error("یک خطای ناشناس رخ داده !",{
                            position: toast.POSITION.BOTTOM_LEFT
                        });  
                    break;
                }
            }
        }
    }

    const getAddress=async(latt , lngg)=>{
        try{
            const response = await axios.get(`https://api.neshan.org/v2/reverse?lat=${latt}&lng=${lngg}`,{
                headers:{
                    "Api-Key":"service.3QQRUWJV73dPVDuDBgKEdvS55nTOmiZz8jCJes9j"
                }
            })
            setLocName(response.data.formatted_address);
            setState(response.data.state);
        }catch(err){
            console.log(err);
            toast.error("خطا در برقراری ارتباط",{
                position:"bottom-left"
            });
        }
    }

    useEffect(async()=>{
        getAreas();
        getLatestNotifications();
        setIsMap(false);
    },[])

    return(
        <div className="app-container">
            {isMap===false ?
            <>
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
                <div onClick={openMap} className={styles.locate_user_map_button}>
                    <div>
                        <Image
                            src={locationImage}
                            alt="location"
                            width={"40px"}
                            height={"40px"}
                        />
                    </div>
                    <span>مکان یابی خودکار</span>
                    <span>{locName}</span>
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
            </>
            :    
            <div className={`${styles.map_page} dashboard-page`}>
                <div className="header">
                    آدرس من
                    <div className="header-right-icon">
                        <Image
                            src={rightArrow}
                            alt="back"
                            onClick={()=>{
                                setIsMap(false);
                                if(state==="" || state!=="استان مازندران"){
                                    toast.error("با عرض پوزش استان مورد نظر شما تحت پوشش نیست",{
                                        position:"bottom-left"
                                    });
                                }
                            }}
                        />
                    </div>
                </div>
                {/* <NeshanMap
                    options={{
                        key: 'web.lZXZa2W9KrpFIQdhfFjiAXDUh7kz1t1JnSLmkSE9',
                        maptype: 'dreamy',
                        poi: true,
                        traffic: false,
                        center: [parseFloat(lat), parseFloat(lng)],
                        zoom: 13
                    }}

                    onInit={(L, myMap) => {
                        let marker = L.marker([parseFloat(lat), parseFloat(lng)])
                        .addTo(myMap)

                        myMap.on('click', function (e) {
                            marker.setLatLng(e.latlng);
                            dispatch(setLat(e.latlng.lat));
                            dispatch(setLng(e.latlng.lng));
                            getAddress(e.latlng.lat,e.latlng.lng);
                        });
                    }}
                /> */}
                <ReactMapGL 
                    mapboxApiAccessToken="pk.eyJ1IjoibW9oYW1tYWQtdmFhIiwiYSI6ImNremE0Z3dyYjBtM3gybm1xbzY2b3h4czQifQ.gbksB6wI93D2GW1AIIE1Gw" 
                    {...viewport}
                    onNativeClick={(val)=>{
                        dispatch(setLng(val.lngLat[0]));
                        dispatch(setLat(val.lngLat[1]));
                        console.log(lat , lng);
                    }}
                    onViewportChange={(viewport)=>setViewport(viewport)}
                    mapStyle="mapbox://styles/mapbox/streets-v11"
                >
                    <Marker latitude={parseFloat(lat)} longitude={parseFloat(lng)} offsetLeft={-20} offsetTop={-10}>
                        <Image
                            src={markerIcon}
                            alt="marker"
                            width={"25px"}
                            height={"25px"}
                        />
                    </Marker>
                </ReactMapGL>
                <div className={styles.map_page_bottom_btn}>
                        <Button
                            onClick={()=>{
                                setIsMap(false);
                                if(state==="" || state!=="استان مازندران"){
                                    toast.error("با عرض پوزش استان مورد نظر شما تحت پوشش نیست",{
                                        position:"bottom-left"
                                    });
                                }
                            }}
                            className="enter_green_btn"
                        >
                            ثبت آدرس
                        </Button>
                </div>
            </div>
            }
        </div>
    )
}
export default LocateUser;