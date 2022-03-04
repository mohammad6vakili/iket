import { useEffect, useState } from 'react';
import Head from 'next/head';
import Image from "next/image";
import { useRouter } from 'next/router';
import { useDispatch , useSelector} from 'react-redux';
import { setMenu , setCart} from '../Store/Action';
import loadingLogo from "../assets/images/splash-logo.webp";
import {setRTLTextPlugin} from "react-map-gl";


const Home=({message})=> {
  const router=useRouter();
  const dispatch=useDispatch();
  const [loading , setLoading]=useState(false);

  const cartData = useSelector(state=>state.Reducer.cart);

  useEffect(()=>{
    setLoading(true);
    console.log(message)
    setTimeout(()=>{
      setLoading(false);
      setRTLTextPlugin(
        'https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.2.3/mapbox-gl-rtl-text.js',
      );
      if(message && message.includes("/wallet") || message && message.includes("/myOrders")){
        console.log("payment successFull");
      }
    },2000)
},[])


useEffect(()=>{
  if(localStorage.getItem("cart")){
    dispatch(setCart(JSON.parse(localStorage.getItem("cart"))));
  }
})
  
  return (
    <div>
      <Head>
        <title>آیکت</title>
        <meta name='description' content='فروشگاه آنلاین آیکت'/>
        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
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

export async function getServerSideProps(context) {
  if(context.req.headers.referer){
    return{props:{message:context.req.headers.referer}}
  }else{
    return{props:{}}
  }
}

export default Home;