import styles from "../styles/Home.module.css";
import logo from "../assets/images/logo_colored.webp";
import Image from "next/image";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import {setCategoryType} from "../Store/Action";
import fastFoodImage from "../assets/images/fastfood.png";
import hyperMarketImage from "../assets/images/hyper_market.png";
import restaurantImage from "../assets/images/restaurant.png";


const Home=()=>{
    
    const dispatch=useDispatch();
    const router=useRouter();

    return(
        <div className="app-container">
            <div className={`${styles.home} dashboard-page`}>
                <div className={styles.home_logo}>
                    <Image
                        src={logo}
                        alt="enter"
                        width={"160px"}
                        height={"50px"}
                    />
                </div>
                <div className={styles.home_item_one}>
                    <div onClick={()=>{dispatch(setCategoryType("1"))}}>
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
                    <div onClick={()=>{dispatch(setCategoryType("3"))}}>
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