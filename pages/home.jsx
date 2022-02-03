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
import {setCategoryType , setCityHypers} from "../Store/Action";
import { Modal } from "antd";
import fastFoodImage from "../assets/images/fastfood.png";
import hyperMarketImage from "../assets/images/hyper_market.png";
import restaurantImage from "../assets/images/restaurant.png";


const Home=()=>{
    
    const dispatch=useDispatch();
    const router=useRouter();

    const [modal , setModal]=useState(false);

    const hypers = useSelector(state=>state.Reducer.cityHypers);

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

    useEffect(()=>{
        getAreaWithProvider();
        console.log(hypers);
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
                        <div style={{width:"100%",textAlign:"center",color:Colors.purple}}>نزدیکترین هایپر مارکت ها</div>
                    </div>
                </Modal>
                <div className={styles.home_logo}>
                    <Image
                        src={logo}
                        alt="enter"
                        width={"160px"}
                        height={"50px"}
                    />
                </div>
                <div className={styles.home_item_one}>
                    <div 
                        // onClick={()=>{dispatch(setCategoryType("1"))}}
                        onClick={()=>setModal(true)}
                    >
                        <Image
                            src={hyperMarketImage}
                            alt="service"
                        />  
                        <span>هایپر مارکت</span>
                    </div>
                    <div onClick={()=>{dispatch(setCategoryType("2"));router.push("/restaurant")}}>
                        <Image
                            src={restaurantImage}
                            alt="service"
                        />
                        <span>رستوران</span>
                    </div>
                </div>
                <div className={styles.home_item_two}>
                    <div onClick={()=>{dispatch(setCategoryType("3"));router.push("/restaurant")}}>
                        <Image
                            src={fastFoodImage}
                            alt="service"
                        />
                        <span>فست فود</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Home;