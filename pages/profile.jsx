import { useState } from "react";
import styles from "../styles/Profile.module.css";
import Menu from "../Components/Menu/Menu";
import axios from "axios";
import Env from "../Constant/Env.json";
import { Button , Modal} from "antd";
import { useRouter } from "next/router";
import { useDispatch , useSelector } from "react-redux";
import { setProfile } from "../Store/Action";
import { toast } from "react-toastify";
import Head from 'next/head';
import { useEffect } from "react";
import FormatHelper from "../Helper/FormatHelper";
import Image from "next/image";
import infoIcon from "../assets/images/info.png";
import logo from "../assets/images/logo_colored.webp";
import scooter from "../assets/images/scooter.png";
import hamIcon from "../assets/images/ham-profile.svg";
import locationIcon from "../assets/images/location-profile.png";
import editIcon from "../assets/images/edit-profile.png";
import shareIcon from "../assets/images/share-profile.png";
import walletIcon from "../assets/images/wallet-profile.png";
import logoutIcon from "../assets/images/logout-profile.png";


const Profile=()=>{
    const router = useRouter();
    const dispatch = useDispatch();

    const profile=useSelector(state=>state.Reducer.profile);
    const [modal , setModal]=useState(false);



    const handleSharing = async () => {
        let shareData = {
          title: 'آیکت',
          text: 'آیکت - فروشگاه آنلاین',
          url: 'http://www.iket.ir',
        }        
        if (navigator.share) {
            try {
              await navigator
                .share(shareData)
                .then(() =>
                  toast.success("با موفقیت به اشتراک گذاشته شد",{
                      position: toast.POSITION.BOTTOM_LEFT
                  })
                );
            } catch (error) {
              toast.error("ظاهرا خطایی رخ داده است !",{
                  position: toast.POSITION.BOTTOM_LEFT
              })
              console.log(error);
            }
          } else {
            toast.error("اشتراک گذاری در این مرورگر پشتیبانی نمیشود",{
              position: toast.POSITION.BOTTOM_LEFT
          })
          }
        };

    const getProfile=async()=>{
        const userId =localStorage.getItem("userId");
        let postData = new FormData();
        postData.append("ID",userId);
        postData.append("Token",Env.token);
        try{
            const response = await axios.post(Env.baseUrl + "GetUserInfo.aspx",postData)
            dispatch(setProfile(response.data.Data));
        }catch({err,response}){
            toast.error("خطا در برقراری ارتباط",{
                position:"bottom-left"
            })
        }
    }


    useEffect(()=>{
        getProfile();
    },[])


    return(
        <div className="app-container">
            <Head>
                <title>آیکت</title>
                <meta name='description' content='فروشگاه آنلاین آیکت'/>
                <link rel="icon" href="/favicon.ico" />
                <link rel="manifest" href="/manifest.json" />
            </Head>
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
                        <div>
                            توجه
                        </div>
                        <div>آیا میخواهید از حساب کاربری خود خارج شوید؟</div>
                        <div>
                            <Button 
                                onClick={()=>{
                                    localStorage.removeItem("userId");
                                    localStorage.removeItem("selectArea");
                                    router.push("/enter");
                                }}
                                style={{color:"white"}}
                                className="enter_purple_btn"
                            >
                                تایید
                            </Button>
                            <Button
                                onClick={()=>setModal(false)}
                                style={{color:"#5a25b6c5"}}
                            >
                                انصراف
                            </Button>
                        </div>
                    </div>
                </Modal>
                <Menu/>
                <div className={`${styles.profile} dashboard-page`}>
                    <div className="header">
                        حساب کاربری شما
                    </div>
                    <div className={styles.profile_logo}>
                        <Image
                            src={logo}
                            alt="iket"
                            width={"140px"}
                            height={"40px"}
                        />
                    </div>
                    <div className={styles.profile_white_box}>
                        <div>
                            <div>
                                {profile && profile.PhotoUrl && profile.PhotoUrl==="https://iketpanel.com" ?                                
                                    <Image
                                        src={scooter}
                                        alt="user avatar"
                                        width={"50px"}
                                        height={"50px"}
                                    />
                                : profile && profile.PhotoUrl &&
                                    <Image
                                        src={profile.PhotoUrl}
                                        loader={()=>profile.PhotoUrl}
                                        alt="user avatar"
                                        width={"50px"}
                                        height={"50px"}
                                    />
                                }
                            </div>
                        </div>
                        <div style={{paddingRight:"10px"}}>
                            <div>
                                {profile && profile.FullName}
                            </div>
                            <div>
                                {profile && profile.CellPhone && FormatHelper.toPersianString(profile.CellPhone)}
                            </div>
                            <div>
                                {profile && profile.Email && FormatHelper.toPersianString(profile.Email)}
                            </div>
                        </div>
                    </div>
                    <div className={styles.profile_links_list}>
                        <div onClick={()=>router.push("/myOrders")}>
                                <Image
                                    src={hamIcon}
                                    alt="orders"
                                    width={"20px"}
                                    height={"20px"}
                                />
                                لیست سفارشات
                        </div>
                        <div onClick={()=>router.push("/selectAddress")}>
                            <Image
                                src={locationIcon}
                                alt="addresses"
                                width={"20px"}
                                height={"20px"}
                            />
                            آدرس ها
                        </div>
                        <div onClick={()=>router.push("/editProfile")}>
                            <Image
                                src={editIcon}
                                alt="edit"
                                width={"20px"}
                                height={"20px"}
                            />
                            ویرایش اطلاعات کاربری
                        </div>
                        <div onClick={handleSharing}>
                            <Image
                                src={shareIcon}
                                alt="share"
                                width={"20px"}
                                height={"20px"}
                            />
                            ارسال برای دوستان
                        </div>
                        <div onClick={()=>router.push("/wallet")}>
                            <Image
                                src={walletIcon}
                                alt="wallet"
                                width={"20px"}
                                height={"20px"}
                            />
                            کیف پول
                        </div>
                        <div onClick={()=>setModal(true)}>
                            <Image
                                src={logoutIcon}
                                alt="exit"
                                width={"20px"}
                                height={"20px"}
                            />
                            خروج از حساب کاربری
                        </div>
                    </div>
                    <Button 
                        className="enter_purple_btn"
                        style={{width:"90%",boxShadow:"0 0 5px 0 #a3a3a3",border:"none",borderRadius:"6px",marginTop:"5px",height:"50px"}}
                    >
                        <a href="tel:09426001269">
                            تماس با پشتیبانی
                        </a>
                    </Button>
                </div>
            </div>
    )
}
export default Profile;