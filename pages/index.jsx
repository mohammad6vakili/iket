import { useEffect, useState } from 'react';
import Head from 'next/head';
import Image from "next/image";
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import loadingLogo from "../assets/images/splash-logo.webp";

const Home=()=> {
  const router=useRouter();
  const [loading , setLoading]=useState(false);

  useEffect(()=>{
    setLoading(true);
    let firstTime=localStorage.getItem("first");
    let userId=localStorage.getItem("userId");
    setTimeout(()=>{
      setLoading(false);
      if(!firstTime){
        router.push("/welcome");
      }else{
        if(userId){
          router.push("/locateUser");
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