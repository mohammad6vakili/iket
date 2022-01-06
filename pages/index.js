import { useEffect, useState } from 'react';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import Image from "next/image";
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import loadingLogo from "../assets/images/splash-logo.webp";

const Home=()=> {
  const router=useRouter();
  const [loading , setLoading]=useState(false);

  useEffect(()=>{
    setLoading(true);
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(setCoord,handler);
        function setCoord(position){
            localStorage.setItem("lat",position.coords.latitude.toFixed(6));
            localStorage.setItem("long",position.coords.longitude.toFixed(6));
            setLoading(false);
            let firstTime=localStorage.getItem("first");
            if(!firstTime){
              router.push("/welcome");
            }else{
              router.push("/enter");
            }
        }
        function handler(error){
            switch(error.code) {
                case error.PERMISSION_DENIED:
                    toast.error("برای استفاده از نرم افزار نیاز به دسترسی موقعیت مکانی میباشد.لطفا خارج شوید و دوباره وارد شوید یا صفحه را رفرش کنید",{
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
},[])
  
  return (
    <div className={styles.container}>
      <Head>
        <title>Home</title>
      </Head>
      <div className={styles.home}>
        {loading===true &&
            <Image
              src={loadingLogo}
              alt="loading"
              width={"200px"}
              height={"80px"}
            />
        }
      </div>
    </div>
  )
}
export default Home;