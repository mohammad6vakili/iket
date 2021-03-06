import { useState , useEffect } from "react";
import styles from "../styles/AddAddress.module.css";
import { useSelector , useDispatch} from "react-redux";
import { setAddress, setEditAddress } from "../Store/Action";
import { useRouter } from "next/router";
import Image from "next/image";
import { Input , Button} from "antd";
import addLocation from "../assets/images/add-location.png";
import rightArrow from "../assets/images/right-arrow-white.svg";
import axios from "axios";
import ReactMapGL,{Marker} from "react-map-gl";
import locationImage from "../assets/images/map-locate.webp";
import Menu from "../Components/Menu/Menu";
import Env from "../Constant/Env.json";
import markerIcon from "../assets/images/location-marker.png";
import FormatHelper from "../Helper/FormatHelper";
import scooter from "../assets/images/scooter.png";
import trashRed from "../assets/images/trash-red.svg";
import { toast } from "react-toastify";
const {TextArea}=Input;


const AddAddress=()=>{
    const dispatch=useDispatch();
    const router=useRouter();

    const editAddress=useSelector(state=>state.Reducer.editAddress);

    const [isMarker , setIsMarker]=useState(true);
    const [lat , setLat]=useState("");
    const [lng , setLng]=useState("");
    const [isMap , setIsMap]=useState(false);
    const [viewport , setViewport]=useState({
        latitude:parseFloat(lat),
        longitude:parseFloat(lng),
        width:"100%",
        height:"100vh",
        zoom:12,
        transitionDuration: 2000,
    });
    
    const [provinces , setProvinces]=useState(null);
    const [cities , setCities]=useState(null);
    const [areas , setAreas]=useState(null);

    const [name , setName]=useState("");
    const [title , setTitle]=useState("");
    const [mobile , setMobile]=useState("");
    const [selectedProvince , setSelectedProvince]=useState("");
    const [selectedCity , setSelectedCity]=useState("");
    const [selectedArea , setSelectedArea]=useState("");
    const [postAddress , setPostAddress]=useState("");


    const getStatesData=async()=>{
        let postData = new FormData();
        postData.append("Token",Env.token);
        try{
            const response=await axios.post(Env.baseUrl + "SelectStateAndCities/SelectData",{
                Token:Env.token
            });
            setProvinces(response.data.Data);
        }catch(err){
            toast.error("?????? ???? ?????????????? ????????????",{
                position:"bottom-left"
            });
        }
    }

    const openMap=()=>{
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(setCoord,handler);
                function setCoord(position){
                    setLat(position.coords.latitude.toFixed(6));
                    setLng(position.coords.longitude.toFixed(6));
                    viewport.latitude =parseFloat(position.coords.latitude.toFixed(6));
                    viewport.longitude =parseFloat(position.coords.longitude.toFixed(6));
                    setIsMap(true);
                }
            }
            function handler(error){
                switch(error.code) {
                    case error.PERMISSION_DENIED:
                        toast.error("???????? ?????????????? ???? ???????? ???????? ???? ???????????? ???????????? ?????????? ????????????.",{
                            position: toast.POSITION.BOTTOM_LEFT
                        });
                    break;
                    case error.POSITION_UNAVAILABLE:
                        toast.error("???????????? ?????????????????? ???????????? ????????????.",{
                            position: toast.POSITION.BOTTOM_LEFT
                        });
                    break;
                    case error.TIMEOUT:
                        toast.error("???????? ???? ???????????? ???????? ???????? ?? ???????????? ???????????? ????????.",{
                            position: toast.POSITION.BOTTOM_LEFT
                        });
                    break;
                    case error.UNKNOWN_ERROR:
                        toast.error("???? ???????? ???????????? ???? ???????? !",{
                            position: toast.POSITION.BOTTOM_LEFT
                        });  
                    break;
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
                console.log(response.data)
                setPostAddress(response.data.formatted_address);
            }catch(err){
                console.log(err);
                toast.error("?????? ???? ?????????????? ????????????",{
                    position:"bottom-left"
                });
            }
        }

        const submitAddressReq=async()=>{
            let endPoint;
            if(editAddress===null){
                endPoint = "InsertUserAddress.aspx";
            }else{
                endPoint = "UpdateUserAddressByAddressID.aspx";
            }
            const userId = localStorage.getItem("userId");
            let postData=new FormData();
            if(name===""){
                toast.warning("???????? ?????? ?? ?????? ???????????????? ?????? ???? ???????? ????????",{
                    position:"bottom-left"
                });
            }else if(title===""){
                toast.warning("???????? ?????????? ???????? ?????? ???? ???????? ????????",{
                    position:"bottom-left"
                });
            }else if(mobile===""){
                toast.warning("???????? ?????????? ???????????? ?????? ???? ???????? ????????",{
                    position:"bottom-left"
                });
            }else if(selectedProvince==="-1" || selectedProvince===""){
                toast.warning("???????? ?????????? ?????? ???? ???????????? ????????",{
                    position:"bottom-left"
                });
            }else if(selectedCity==="-1" || selectedCity===""){
                toast.warning("???????? ?????? ?????? ???? ???????????? ????????",{
                    position:"bottom-left"
                });
            }else if(selectedArea==="-1" || selectedArea===""){
                toast.warning("???????? ???????? ?????? ???? ???????????? ????????",{
                    position:"bottom-left"
                });
            }else if(postAddress===""){
                toast.warning("???????? ???????? ???????? ?????? ???? ???????? ????????",{
                    position:"bottom-left"
                });
            }else{
                postData.append("FullName",name);
                postData.append("Title",title);
                postData.append("UID",userId);
                postData.append("Cellphone",mobile);
                postData.append("StateIDFK",selectedProvince);
                postData.append("CityIDFk",selectedCity);
                postData.append("AreaIDFk",selectedArea);
                postData.append("FullAddress",postAddress);
                if(lat!==""){
                    postData.append("Latitude",lat);
                }
                if(lng!==""){
                    postData.append("Longitude",lng);
                }
                if(editAddress){
                    postData.append("AddressID",editAddress.ID);
                }
                postData.append("Token",Env.token);
                try{
                    const response = await axios.post(Env.baseUrl + endPoint ,postData);
                    if(response.data.Status===1){
                        toast.success(response.data.Message,{
                            position:"bottom-left"
                        });
                        dispatch(setEditAddress(null));
                        router.push("/selectAddress");
                    }else{
                        toast.warning(response.data.Message,{
                            position:"bottom-left"
                        });
                    }
                }catch(err){
                    console.log(err);
                    toast.error("?????? ???? ?????????????? ????????????",{
                        position:"bottom-left"
                    });
                }
            }
        }

    useEffect(()=>{
        getStatesData();
        if(editAddress){
            setTitle(editAddress.Title);
            setMobile(editAddress.Cellphone);
            setPostAddress(editAddress.FullAddress);
        }
    },[])

    useEffect(()=>{
        if(provinces){
            provinces.map((data)=>{
                if(data.ID.toString()===selectedProvince){
                    setCities(data.City);
                }
            })
        }
    },[selectedProvince])

    useEffect(()=>{
        if(cities){
            cities.map((data)=>{
                if(data.ID.toString()===selectedCity){
                    setAreas(data.Area);
                }
            })
        }
    },[selectedCity])

    useEffect(()=>{
        if(isMarker===false){
            setIsMarker(true);
        }
    },[isMarker])

    return(
        <div style={{position:"relative"}} className="app-container">
            {isMap===false ?
                <div className={`${styles.add_address} dashboard-page`}>
                    <div onClick={()=>console.log(editAddress)} style={{fontSize:"14px"}} className="header">
                        ???????? ????????
                        <div className="header-right-icon">
                            <Image
                                src={rightArrow}
                                alt="back"
                                onClick={()=>{
                                    router.push("/selectAddress");
                                    dispatch(setEditAddress(null));
                                }}
                            />
                        </div>
                    </div>
                    <div className={styles.add_address_body}>
                        <Input
                            value={name}
                            onChange={(e)=>setName(e.target.value)}
                            type="text"
                            placeholder="?????? ?? ?????? ????????????????"
                            className={styles.enter_input}
                        />
                        <Input
                            value={title}
                            onChange={(e)=>setTitle(e.target.value)}
                            type="text"
                            placeholder="?????????? ????????"
                            className={styles.enter_input}
                        />
                        <Input
                            value={mobile}
                            onChange={(e)=>setMobile(e.target.value)}
                            type="tel"
                            placeholder="?????????? ???????? ??????????"
                            className={styles.enter_input}
                        />
                        <div className={styles.combos_wrapper}>
                            <select
                                disabled={provinces===null}
                                style={provinces===null ? {opacity:".5"} : {opacity:"1"}}
                                onChange={(e)=>{
                                    setSelectedProvince(e.target.value);
                                }}
                            >
                                <option value="-1">??????????</option>
                                {provinces && provinces.map((province)=>(
                                    <option value={province.ID}>{province.Title}</option>
                                ))}
                            </select>
                            <select
                                disabled={cities===null}
                                style={cities===null ? {opacity:".5"} : {opacity:"1"}}
                                onChange={(e)=>{
                                    setSelectedCity(e.target.value);
                                }}
                            >
                                <option value="-1">??????</option>
                                {cities && cities.map((city)=>(
                                    <option value={city.ID}>{city.City}</option>
                                ))}
                            </select>
                            <select
                                disabled={areas===null}
                                style={areas===null ? {opacity:".5"} : {opacity:"1"}}
                                onChange={(e)=>{
                                    setSelectedArea(e.target.value);
                                }}
                            >
                                <option value="-1">????????</option>
                                {areas && areas.map((area)=>(
                                    <option value={area.ID}>{area.Area}</option>
                                ))}
                            </select>  
                        </div>
                        <TextArea
                            value={postAddress}
                            onChange={(e)=>setPostAddress(e.target.value)}
                            type="text"
                            style={{height:"70px"}}
                            placeholder="???????? ????????"
                            className={styles.enter_input}
                        />
                        <div onClick={openMap} className={styles.locate_user_map_button}>
                            <div>
                                <Image
                                    src={locationImage}
                                    alt="location"
                                    width={"30px"}
                                    height={"30px"}
                                />
                            </div>
                            <span>???????? ???????? ????????????</span>
                        </div>
                        <Button
                            style={{
                                width:"90%",
                                height:"40px",
                                border:"none",
                                borderRadius:"6px",
                                marginTop:"10px"
                            }}
                            onClick={submitAddressReq}
                            className="enter_green_btn"
                        >
                            ?????? ??????????????
                        </Button>
                    </div>
                </div>
            :
                <div className={`${styles.map_page} dashboard-page`}>
                    <div className="header">
                        ???????? ????
                        <div className="header-right-icon">
                            <Image
                                src={rightArrow}
                                alt="back"
                                onClick={()=>{
                                    setIsMap(false);
                                }}
                            />
                        </div>
                    </div>
                    <ReactMapGL 
                        mapboxApiAccessToken="pk.eyJ1IjoibW9oYW1tYWQtdmFhIiwiYSI6ImNremE0Z3dyYjBtM3gybm1xbzY2b3h4czQifQ.gbksB6wI93D2GW1AIIE1Gw" 
                        {...viewport}
                        onNativeClick={(val)=>{
                            setLng(val.lngLat[0]);
                            setLat(val.lngLat[1]);
                            getAddress(val.lngLat[1] , val.lngLat[0]);
                            setIsMarker(false);
                        }}
                        onViewportChange={(viewport)=>setViewport(viewport)}
                        mapStyle="mapbox://styles/mapbox/streets-v11"
                    >
                        {isMarker &&
                            <Marker latitude={parseFloat(lat)} longitude={parseFloat(lng)} offsetLeft={-20} offsetTop={-10}>
                                <Image
                                    src={markerIcon}
                                    alt="marker"
                                    width={"25px"}
                                    height={"25px"}
                                />
                            </Marker>
                    }
                    </ReactMapGL>
                    <div className={styles.map_page_bottom_btn}>
                        <Button
                            onClick={()=>{
                                setIsMap(false);
                            }}
                            className="enter_green_btn"
                        >
                            ?????? ????????
                        </Button>
                    </div>
                </div>
            }
        </div>
    )
}
export default AddAddress;