import { useEffect,useState } from "react";
import styles from "../styles/ProductList.module.css";
import { useSelector , useDispatch} from "react-redux";
import {setProduct} from "../Store/Action";
import Image from "next/image";
import rightArrow from "../assets/images/right-arrow-white.svg";
import { useRouter } from "next/router";
import FormatHelper from "../Helper/FormatHelper";
import { Input , Button} from "antd";
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

    return(
        <div className="app-container">
            <div className={`${styles.product_list} dashboard-page`}>
                <div className="header">
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
                                    toast.warning("متاسفانه محصول موجود نمیباشد",{
                                        position:"bottom-left"
                                    })
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
                    <Button className="enter_purple_btn">اتمام خرید</Button>
                    <Button className="enter_purple_btn">۰ تومان</Button>
                </div>
            </div>
        </div>
    )
}
export default ProductList;