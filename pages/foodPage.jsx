import { useEffect } from "react";
import styles from "../styles/FoodPage.module.css";
import Image from "next/image";
import rightArrow from "../assets/images/right-arrow-white.svg";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import noFood from "../assets/images/empty_food.png";
import FormatHelper from "../Helper/FormatHelper";


const foodPage=()=>{
    const router=useRouter();
    const food = useSelector(state=>state.Reducer.food);

    useEffect(()=>{
        // if(food===null){
            // router.push("/home");
        // }
        console.log(food);
    },[])

    return(
        <div className="app-container">
            {food &&
                <div className={`${styles.food_page} dashboard-page`}>
                    <div style={{fontSize:"14px"}} className="header">
                        {food.Title}
                        <div className="header-right-icon">
                            <Image
                                src={rightArrow}
                                alt="back"
                                onClick={()=>router.push("/restaurantPage")}
                            />
                        </div>
                    </div>
                    <div className={styles.food_page_banner}>
                        {food.PhotoUrl!=="https://iketpanel.com" ?
                            <Image
                                src={food.PhotoUrl}
                                loader={()=>food.PhotoUrl}
                                alt="food logo"
                                width={"100%"}
                                height={"100%"}
                            />
                        :
                            <Image
                                src={noFood}
                                alt="food logo"
                                width={"100%"}
                                height={"100%"}
                            />
                        }
                    </div>
                    <div className={styles.food_page_box}>
                        <div>
                            <div>
                                {food.Title}
                            </div>
                            <div>
                                {food.Description && food.Description}
                            </div>
                            <div>
                                <div className={food.PriceWithDiscount!==food.Price ? styles.restaurant_page_discount_price : ""}>
                                    {FormatHelper.toPersianString(food.Price.toLocaleString()) + " تومان"}
                                </div>
                                <div>
                                    {food.PriceWithDiscount!==food.Price && FormatHelper.toPersianString(food.PriceWithDiscount.toLocaleString()) +"تومان"}
                                </div>
                            </div>
                            <div>
                                <div>_</div>
                                <div>
                                    {FormatHelper.toPersianString(food.count)}
                                </div>
                                <div>+</div>
                                <div>
                                    {food.PriceWithDiscount===food.Price ?
                                        FormatHelper.toPersianString(food.Price.toLocaleString()) + " تومان"
                                    :
                                        FormatHelper.toPersianString(food.PriceWithDiscount.toLocaleString()) +"تومان"
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}
export default foodPage;