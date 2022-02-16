import { useState , useEffect } from "react";
import styles from "../styles/SelectAddress.module.css";
import { useSelector , useDispatch} from "react-redux";
import { setAddress , setSelectedAddress} from "../Store/Action";
import { useRouter } from "next/router";
import Image from "next/image";
import addLocation from "../assets/images/add-location.png";
import rightArrow from "../assets/images/right-arrow-white.svg";
import axios from "axios";
import { Radio } from "antd";
import Menu from "../Components/Menu/Menu";
import Env from "../Constant/Env.json";
import FormatHelper from "../Helper/FormatHelper";
import trash from "../assets/images/trash-black.svg";
import editIcon from "../assets/images/edit-pen.png";
import { toast } from "react-toastify";


const SelectAddress=()=>{
    const dispatch=useDispatch();
    const router=useRouter();

    const menu = useSelector(state=>state.Reducer.menu);
    const address = useSelector(state=>state.Reducer.address);
    const selectedHyper = useSelector(state=>state.Reducer.selectedHyper);
    const selectedAddress = useSelector(state=>state.Reducer.selectedAddress);


    const getAddresses=async()=>{
        const userId = localStorage.getItem("userId");
        let postData = new FormData();
        postData.append("ID",userId);
        postData.append("ProviderID",selectedHyper.ID);
        postData.append("Token",Env.token);
        try{
            const response=await axios.post(Env.baseUrl + "SelectUserAddressByUserID.aspx",postData);
            dispatch(setAddress(response.data.Data));
        }catch(err){
            toast.error("خطا در برقراری ارتباط",{
                position:"bottom-left"
            });
        }
    }

    const goToNext=()=>{
        if(selectedAddress===null){
            toast.warning("لطفا آدرس را انتخاب کنید",{
                position:"bottom-left"
            });
        }else{
            router.push("/selectPayment");
        }
    }

    useEffect(()=>{
        if(selectedHyper){
            getAddresses();
        }
    },[])

    return(
        <div style={{position:"relative"}} className="app-container">
            <div className={`${styles.select_address} dashboard-page`}>
                <div style={{fontSize:"14px"}} className="header">
                    آدرس های من
                    <div className="header-right-icon">
                        <Image
                            src={rightArrow}
                            alt="back"
                            onClick={()=>{
                                if(menu===4){
                                    router.push("/profile")
                                }else{
                                    router.push("/cart")
                                }
                            }}
                        />
                    </div>
                </div>
                <div className={styles.address_title}>
                    {menu===4 ?
                        "آدرس ها"
                        :
                        "انتخاب آدرس"
                    }
                </div>
                <Radio.Group 
                    onChange={(e)=>dispatch(setSelectedAddress(e.target.value))} 
                    className={styles.address_body}
                >
                    {address && address.length>0 && address.map((data)=>(
                        <Radio value={data.ID}>
                            {data.Title}
                            <div style={{color:"gray",margin:"5px 0"}}>{data.FullAddress}</div>
                            {data.DeliveryPrice>0 &&
                                <div style={{color:"gray",marginBottom:"5px"}}>هزینه ارسال : {FormatHelper.toPersianString(data.DeliveryPrice)} تومان</div>
                            }
                            {data.DeliveryPrice===0 &&
                                <div style={{color:"gray",marginBottom:"5px"}}>هزینه ارسال : رایگان</div>
                            }
                            <div>
                                <Image
                                    src={trash}
                                    alt="back"
                                    onClick={()=>alert("delete")}
                                />
                                <Image
                                    src={editIcon}
                                    alt="back"
                                    onClick={()=>alert("edit")}
                                />
                            </div>
                        </Radio>
                    ))}
                </Radio.Group>
                {menu!==4 &&
                    <div
                        onClick={goToNext}
                        className={styles.cart_page_bottom_box}
                    >
                        ثبت و ادامه
                    </div>
                }
                {address && address.length===0 && 
                    <div style={{width:"100%",textAlign:"center",marginTop:"10vh"}}>
                        شما آدرسی ثبت نکردید
                    </div>
                }
                <div 
                    style={{
                        width:"50px",
                        height:"50px",
                        position:"absolute",
                        bottom:"8vh",
                        right:"10px",
                        borderRadius:"50%",
                        background:"white",
                        cursor:"pointer"
                    }}
                >
                    <Image
                        src={addLocation}
                        alt="back"
                        onClick={()=>router.push("/addAddress")}
                    />
                </div>
            </div>
        </div>
    )
}
export default SelectAddress;