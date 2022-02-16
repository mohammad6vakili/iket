import { useEffect, useState } from 'react';
import Head from 'next/head';
import Image from "next/image";
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { setMenu } from '../Store/Action';
import loadingLogo from "../assets/images/splash-logo.webp";
import {setRTLTextPlugin} from "react-map-gl";


const Home=()=> {
  const router=useRouter();
  const dispatch=useDispatch();
  const [loading , setLoading]=useState(false);

  useEffect(()=>{
    setLoading(true);
    let firstTime=localStorage.getItem("first");
    let userId=localStorage.getItem("userId");
    let area=localStorage.getItem("selectArea");
    setTimeout(()=>{
      setLoading(false);
      setRTLTextPlugin(
        'https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.2.3/mapbox-gl-rtl-text.js',
      );
      if(!firstTime){
        router.push("/welcome");
      }else{
        if(userId && area){
          router.push("/home");
          dispatch(setMenu(0));
        }else{
          router.push("/enter");
        }
      }
    },2000)
},[])
  
  return (
    <div>
      <Head>
        <title>Home</title>
      </Head>
      <div className="home">
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