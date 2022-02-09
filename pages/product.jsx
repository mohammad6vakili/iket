import { useEffect, useState } from "react";
import styles from "../styles/FoodPage.module.css";
import Image from "next/image";
import rightArrow from "../assets/images/right-arrow-white.svg";
import { useSelector , useDispatch} from "react-redux";
import { useRouter } from "next/router";
import { setCart } from "../Store/Action";
import noFood from "../assets/images/empty_food.png";
import FormatHelper from "../Helper/FormatHelper";
import { toast } from "react-toastify";


const Product=()=>{
    const router=useRouter();
    const dispatch=useDispatch();
    const product = useSelector(state=>state.Reducer.product);
    const cart = useSelector(state=>state.Reducer.cart);
    const [count , setCount]=useState(0);

    const addToCart=()=>{
        let already = false;
        if(cart.length>0){
            cart.map((data)=>{
                if(data.ID===product.ID){
                    already=true;
                }else{
                    already=false;
                }
            })
        }
        if(cart.length===0){
            product.count++;
            cart.push(product);
            toast.success("به سبد خرید افزوده شد",{
                position:"bottom-left"
            })
            console.log("first");
            setCount(count+1);
        }else{
            if(already===true){
                    product.count++;
                    cart.map((data)=>{
                        if(data.ID===product.ID){
                            data.count=product.count;
                        }
                    })
                    setCount(count+1);
                    console.log("already");
            }
            if(already===false){
                product.count++;
                cart.push(product);
                console.log("not already");
                toast.success("به سبد خرید افزوده شد",{
                    position:"bottom-left"
                });
                setCount(count + 1);
            }
        }
        console.log(cart);
    }

    const removeFromCart=()=>{
        cart.map((data)=>{
            if(data.ID===product.ID){
                product.count--;
                data.count=product.count;
                setCount(count-1);
            }
            if(count===1){
                dispatch(setCart(
                    cart.filter(cr=>cr.ID !== product.ID)
                ));
                product.count=0;
                toast.success("از سبد خرید حذف شد",{
                    position:"bottom-left"
                })
            }
        })
    console.log(cart);
    }

    useEffect(()=>{
        console.log(product);
        if(product){
            setCount(product.count)
        }
    },[])

    return(
        <div className="app-container">
            {product &&
                <div className={`${styles.food_page} dashboard-page`}>
                    <div onClick={()=>console.log(cart , product)} style={{fontSize:"14px"}} className="header">
                        {product.Title}
                        <div className="header-right-icon">
                            <Image
                                src={rightArrow}
                                alt="back"
                                onClick={()=>router.push("/restaurantPage")}
                            />
                        </div>
                    </div>
                    <div className={styles.food_page_banner}>
                        {product.PhotoUrl!=="https://iketpanel.com" ?
                            <Image
                                src={product.PhotoUrl}
                                loader={()=>product.PhotoUrl}
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
                                {product.Title}
                            </div>
                            <div>
                                {product.Description && product.Description}
                            </div>
                            <div>
                                <div className={product.PriceWithDiscount!==product.Price ? styles.restaurant_page_discount_price : ""}>
                                    {FormatHelper.toPersianString(product.Price.toLocaleString()) + " تومان"}
                                </div>
                                <div>
                                    {product.PriceWithDiscount!==product.Price && FormatHelper.toPersianString(product.PriceWithDiscount.toLocaleString()) +"تومان"}
                                </div>
                            </div>
                            <div>
                                <div 
                                    onClick={()=>{
                                        if(count>0){
                                            removeFromCart();
                                        }
                                    }}
                                >
                                    _
                                </div>
                                <div>
                                    {FormatHelper.toPersianString(count)}
                                </div>
                                <div onClick={addToCart}>+</div>
                                <div>
                                    {product.PriceWithDiscount===product.Price ?
                                        FormatHelper.toPersianString(product.Price.toLocaleString()) + " تومان"
                                    :
                                        FormatHelper.toPersianString(product.PriceWithDiscount.toLocaleString()) +"تومان"
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
export default Product;