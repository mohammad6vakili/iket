import { useEffect,useState } from "react";
import styles from "../styles/ProductList.module.css";
import { useSelector , useDispatch} from "react-redux";
import {setProduct} from "../Store/Action";
import Image from "next/image";
import rightArrow from "../assets/images/right-arrow-white.svg";
import { useRouter } from "next/router";
import FormatHelper from "../Helper/FormatHelper";
import {Button} from "antd";
import Head from 'next/head';
import { toast } from "react-toastify";
import listIcon from "../assets/images/list.svg";
import filterIcon from "../assets/images/filter.svg";


const ProductList=()=>{
    const router=useRouter();
    const dispatch=useDispatch();

    const subCat = useSelector(state=>state.Reducer.selectedSubCat);
    const cart=useSelector(state=>state.Reducer.cart);

    const addToCart=(data)=>{
        let already=false;
        cart.map((pr)=>{
            if(pr.ID===data.ID){
                already = true;
                pr.count = data.count;
            }
        });
        toast.success("به سبد خرید افزوده شد",{
            position:"bottom-left"
        })
        if (!already) {
            cart.push(data);
        }
    }

    useEffect(()=>{
        if(cart.length>0){
            localStorage.setItem("cart",JSON.stringify(cart));
        }
    })

    return(
        <div className="app-container">
            <Head>
                <title>آیکت</title>
                <meta name='description' content='فروشگاه آنلاین آیکت'/>
                <link rel="icon" href="/favicon.ico" />
                <link rel="manifest" href="/manifest.json" />
            </Head>
            <div className={`${styles.product_list} dashboard-page`}>
                <div onClick={()=>console.log(subCat)} className="header">
                    {subCat && subCat.Title}
                    <div className="header-right-icon">
                        <Image
                            src={rightArrow}
                            alt="back"
                            onClick={()=>router.push("/categories")}
                        />
                    </div>
                </div>
                <div className={styles.product_list_filters}>
                    <Button>
                        <Image
                            src={filterIcon}
                            alt="filter"
                        />
                        فیلتر کردن
                    </Button>
                    <Button>
                        <Image
                            src={listIcon}
                            alt="list"
                        />
                        مرتب سازی
                    </Button>
                </div>
                <div className={styles.product_list_list}>
                    {subCat && subCat.Product && subCat.Product.length>0 && subCat.Product.map((data,index)=>(
                        <div
                            onClick={()=>{
                                if(data.IsActive===false){
                                    console.log("product is not active");
                                }else{
                                    dispatch(setProduct(data));
                                    router.push("/product");
                                }
                            }}
                            className={data.IsActive===false ? styles.restaurant_page_item_disabled : ""}
                            key={index}
                        >
                            <div>
                                <Image
                                    src={data.PhotoUrl}
                                    loader={()=>data.PhotoUrl}
                                    alt="food logo"
                                    width={"100%"}
                                    height={"100%"}
                                />
                            </div>
                            <div>
                                <div>{data.Title}</div>
                                <div>{FormatHelper.toPersianString(data.Price)} تومان</div>
                                <div>
                                    <select
                                        onChange={(e)=>{
                                            data.count=parseInt(e.target.value);
                                        }}
                                    >
                                        <option value="1">۱ عدد</option>
                                        <option value="2">۲ عدد</option>
                                        <option value="3">۳ عدد</option>
                                        <option value="4">۴ عدد</option>
                                        <option value="5">۵ عدد</option>
                                        <option value="6">۶ عدد</option>
                                        <option value="7">۷ عدد</option>
                                        <option value="8">۸ عدد</option>
                                        <option value="9">۹ عدد</option>
                                        <option value="10">۱۰ عدد</option>
                                    </select>
                                    <Button onClick={()=>addToCart(data)}>
                                        افزودن به سبد خرید
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className={styles.product_bottom_box}>
                    <Button onClick={()=>router.push("/cart")} className="enter_purple_btn">اتمام خرید</Button>
                    <Button className="enter_purple_btn">
                        {cart && 
                            FormatHelper.toPersianString(cart.reduce((a, c) => a + c.Price * c.count, 0).toLocaleString())} تومان
                    </Button>
                </div>
            </div>
        </div>
    )
}
export default ProductList;