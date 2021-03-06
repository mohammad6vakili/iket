import {useEffect,useState} from "react";
import styles from "../styles/Home.module.css";
import logo from "../assets/images/logo_colored.webp";
import Image from "next/image";
import Env from "../Constant/Env.json";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import Colors from "../Helper/Colors";
import axios from "axios";
import { useDispatch , useSelector} from "react-redux";
import {setCategoryType , setCityHypers , setHypers , setSelectedHyper , setCart} from "../Store/Action";
import { Modal , Radio} from "antd";
import fastFoodImage from "../assets/images/fastfood.png";
import hyperMarketImage from "../assets/images/hyper_market.png";
import restaurantImage from "../assets/images/restaurant.png";


const Home=()=>{
    
    const dispatch=useDispatch();
    const router=useRouter();

    const [modal , setModal]=useState(false);

    const lat = useSelector(state=>state.Reducer.lat);
    const lng = useSelector(state=>state.Reducer.lng);
    const cityHypers = useSelector(state=>state.Reducer.cityHypers);
    const hypers = useSelector(state=>state.Reducer.hypers);
    const selectedHyper = useSelector(state=>state.Reducer.selectedHyper);

    const getAreaWithProvider=async()=>{
        let postData=new FormData();
        postData.append("token",Env.token);
        try{
            const response=await axios.post(Env.baseUrl + "SelectAreaWithProvider.aspx",postData);
            if(response.data.Status===1){
                dispatch(setCityHypers(response.data.Data));
                console.log(response.data.Data);
                response.data.Data.map((data)=>{
                    data.Area.map((ar)=>{
                        if(ar.Provider.length>0){
                             ar.Provider.map((pr , index)=>{
                                if(pr.AreaIDFK === parseInt(localStorage.getItem("selectArea"))){
                                    hypers.push(pr);
                                }
                             })
                        }
                    })
                })
            }else{
                toast.warning(response.data.Message,{
                    position:"bottom-left"
                })    
            }
        }catch(err){
            toast.error("?????? ???? ?????????????? ????????????",{
                position:"bottom-left"
            })
            console.log(err);
        }
    }

    useEffect(()=>{
        getAreaWithProvider();
        dispatch(setCart([]));
    },[])


    return(
        <div className="app-container">
            <div className={`${styles.home} dashboard-page`}>
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
                            ?????????????????? ?????????? ?????????? ????
                        </div>
                           {hypers.length > 0 && hypers.map((data)=>(
                                <div style={{display:'flex',alignItems:"center",marginBottom:"10px"}}>
                                    <input
                                        style={{marginLeft:"7px",cursor:"pointer"}}
                                        onClick={(e)=>{
                                            setSelectedHyper(e.target.value);
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
                                    toast.warning("???????? ???????????? ???????? ?????? ?????? ???? ???????????? ????????",{
                                        position:"bottom-left"
                                    })
                                }else{
                                    dispatch(setCategoryType("1"));
                                    router.push("/hypers");
                                }
                                 
                            }}
                            style={{color:Colors.purple,marginTop:"10px",cursor:"pointer"}}
                        >
                            ????????????
                        </div>
                    </div>
                </Modal>
                <div onClick={()=>console.log(lat , lng)} className={styles.home_logo}>
                    <Image
                        src={logo}
                        alt="enter"
                        width={"160px"}
                        height={"50px"}
                    />
                </div>
                <div className={styles.home_item_one}>
                    <div 
                        onClick={()=>{
                            if(hypers.length===0){
                                toast.error("???? ?????? ???????? ???????????? ???? ?????? ?????????? ?????????? ???????? ?????? ????????",{
                                    position:"bottom-left"
                                })
                            }else if(hypers.length===1){
                                setSelectedHyper(hypers[0].ID);
                                dispatch(setCategoryType("1"));
                            }else{
                                if(hypers.length>0){
                                    dispatch(setHypers(
                                        hypers.filter((v,i,a)=>a.findIndex(t=>(t.ID===v.ID))===i)
                                    ))
                                }
                                setModal(true);
                            }
                        }}
                    >
                        <Image
                            src={hyperMarketImage}
                            alt="service"
                        />  
                        <span>?????????? ??????????</span>
                    </div>
                    <div onClick={()=>{dispatch(setCategoryType("2"));router.push("/restaurant")}}>
                        <Image
                            src={restaurantImage}
                            alt="service"
                        />
                        <span>??????????????</span>
                    </div>
                </div>
                <div className={styles.home_item_two}>
                    <div onClick={()=>{dispatch(setCategoryType("3"));router.push("/restaurant")}}>
                        <Image
                            src={fastFoodImage}
                            alt="service"
                        />
                        <span>?????? ??????</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Home;