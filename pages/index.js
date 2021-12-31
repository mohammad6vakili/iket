import { Button } from 'antd';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import { useDispatch } from 'react-redux';
import {setHello} from "../Store/Action.js";
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';

const Home=()=> {
  const router=useRouter();
  const dispatch=useDispatch();
  return (
    <div className={styles.container}>
      <Head>
        <title>Home</title>
      </Head>
      <div className={styles.home}>
        <Button 
          onClick={()=>{router.push("/mohammad");dispatch(setHello("hello mohammad"))}}
        >
          go to mohammad
        </Button>
      </div>
    </div>
  )
}
export default Home;