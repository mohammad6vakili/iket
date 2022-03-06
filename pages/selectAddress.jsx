import { useState , useEffect } from "react";
import styles from "../styles/SelectAddress.module.css";
import { useSelector , useDispatch} from "react-redux";
import { setAddress , setSelectedAddress , setEditAddress} from "../Store/Action";
import { useRouter } from "next/router";
import Image from "next/image";
import addLocation from "../assets/images/add-location.png";
import infoIcon from "../assets/images/info.png";
import rightArrow from "../assets/images/right-arrow-white.svg";
import axios from "axios";
import Head from 'next/head';
import { Radio , Modal,Button} from "antd";
import Env from "../Constant/Env.json";
import FormatHelper from "../Helper/FormatHelper";
import trash from "../assets/images/trash-black.png";
import editIcon from "../assets/images/edit-pen.png";
import { toast } from "react-toastify";


const SelectAddress=()=>{
    const dispatch=useDispatch();
    const router=useRouter();

    const menu = useSelector(state=>state.Reducer.menu);
    const address = useSelector(state=>state.Reducer.address);
    const selectedHyper = useSelector(state=>state.Reducer.selectedHyper);
    const selectedAddress = useSelector(state=>state.Reducer.selectedAddress);

    const [modal , setModal]=useState(false);
    const [selectAddress , setSelectAddress]=useState(null);

    const getAddresses=async(index)=>{
        const userId = localStorage.getItem("userId");
        let postData = new FormData();
        postData.append("ID",userId);
        if(index){
            postData.append("ProviderID",selectedHyper.ID);
        }        
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

    const deleteAddress=async()=>{
        let postData = new FormData();
        postData.append("ID",selectAddress.ID);
        postData.append("Token",Env.token);
        try{
            const response=await axios.post(Env.baseUrl + "DeleteUserAddress.aspx",postData);
            if(response.data.Status===1){
                toast.success(response.data.Message,{
                    position:"bottom-left"
                });
                setModal(false);
                getAddresses();
            }else{
                toast.warning(response.data.Message,{
                    position:"bottom-left"
                });
                setModal(false);
                getAddresses();
            }
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
        console.log(selectedAddress)
    }

    useEffect(()=>{
        if(selectedHyper){
            getAddresses(1);
        }else{
            getAddresses();
        }
    },[])

    return(
        <div style={{position:"relative"}} className="app-container">
            <Head>
                <title>آیکت</title>
                <meta name='description' content='فروشگاه آنلاین آیکت'/>
                <link rel="icon" href="/favicon.ico" />
                <link rel="manifest" href="/manifest.json" />
            </Head>
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
                <Modal
                    visible={modal}
                    closable={false}
                    width={250}
                    style={{borderRadius:"10px"}}
                    bodyStyle={{padding:"0",borderRadius:"10px"}}
                    onCancel={()=>setModal(false)}
                    onOk={()=>setModal(false)}
                >
                    <div className={styles.exit_modal}>
                        <div>
                            <Image
                                src={infoIcon}
                                alt="log out"
                                width={"20px"}
                                height={"20px"}
                            />
                        </div>
                        <div style={{marginTop:"10px"}}>
                            حذف
                        </div>
                        <div style={{fontSize:"12px",textAlign:"center"}}>
                            آیا از حذف آدرس {selectAddress && selectAddress.Title} مطمئن هستید؟
                        </div>
                        <div>
                            <Button 
                                onClick={()=>{
                                    deleteAddress();
                                }}
                                style={{color:"white",background:"red"}}
                            >
                                بله
                            </Button>
                            <Button
                                onClick={()=>setModal(false)}
                                style={{color:"white",background:"gray"}}
                            >
                                خیر
                            </Button>
                        </div>
                    </div>
                </Modal>
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
                        <Radio
                            disabled={data.DeliveryPrice===-1}
                            value={data.ID}
                        >
                            <span style={{color:"black",fontSize:"12px",fontWeight:"600"}}>{data.Title}</span> 
                            <div style={{color:"#747474",margin:"5px 0",fontSize:"11px",fontWeight:"600"}}>{data.FullAddress}</div>
                            {data.DeliveryPrice>0 &&
                                <div style={{color:"gray",marginBottom:"5px",fontSize:"12px"}}>هزینه ارسال : {FormatHelper.toPersianString(data.DeliveryPrice)} تومان</div>
                            }
                            {data.DeliveryPrice===0 &&
                                <div style={{color:"gray",marginBottom:"5px",fontSize:"12px"}}>هزینه ارسال : رایگان</div>
                            }
                            {data.DeliveryPrice===-1 &&
                                <div style={{color:"red",marginBottom:"5px",fontSize:"12px"}}>غیر قابل ارسال</div>
                            }
                            <div>
                                <Image
                                    src={trash}
                                    alt="back"
                                    onClick={()=>{
                                        setSelectAddress(data);
                                        setModal(true);
                                    }}
                                />
                                <Image
                                    src={editIcon}
                                    alt="back"
                                    onClick={()=>{
                                        dispatch(setEditAddress(data));
                                        router.push("/addAddress");
                                    }}
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
                 className={styles.addLoc}
                    style={{
                        width:"50px",
                        height:"50px",
                        position:"absolute",
                        bottom:"11vh",
                        right:"10px",
                        borderRadius:"50%",
                        background:"white",
                        cursor:"pointer",
                        boxShadow:"0 0 3px 0 #a3a3a3"
                    }}
                >
                    <Image
                        src={addLocation}
                        alt="back"
                        width={40}
                        height={40}
                        onClick={()=>router.push("/addAddress")}
                    />
                    <div style={{fontSize:"8px",color:"#5925B6",textAlign:"center"}}>آدرس جدید</div>
                </div>
            </div>
        </div>
    )
}
export default SelectAddress;