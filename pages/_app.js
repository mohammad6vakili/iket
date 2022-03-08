import '../styles/globals.css';
import "../styles/NotifStyle.css";
import 'antd/dist/antd.css';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import {Provider} from "react-redux";
import thunk from "redux-thunk";
import {createStore, combineReducers, applyMiddleware} from "redux";
import Reducer from "../Store/Reducer";
import { useEffect } from 'react';
import { useDispatch , useSelector } from 'react-redux';
import { useRouter } from 'next/router';

const rootReducer=combineReducers({
  Reducer:Reducer
});

const store = createStore(rootReducer , applyMiddleware(thunk));



function MyApp({ Component, pageProps , message}) {
  const router=useRouter();
  
  useEffect(()=>{
    console.log(router.pathname)
    if(!localStorage.getItem("first")){
      router.push("/welcome");
    }else{
      if(router.pathname==="/wallet"){
        router.push("/wallet");
      }else if(router.pathname==="/myOrders"){
        router.push("/myOrders")
      }else if(localStorage.getItem("userId") && localStorage.getItem("selectArea")){
        router.push("/locateUser");
        // dispatch(setMenu(0));
      }else{
        router.push("/enter");
      }
    }
  },[])

  return(
    <Provider store={store}>
      <ToastContainer rtl autoClose={3000} pauseOnFocusLoss={false}/>
      <Component {...pageProps} />
    </Provider>
  ) 
}

export async function getServerSideProps(context) {
  if(context.req.headers.referer){
    return{props:{message:context.req.headers.referer}}
  }else{
    return{props:{}}
  }
}

export default MyApp
