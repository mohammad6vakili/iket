import { useEffect,useState } from "react";
import styles from "../styles/ProductList.module.css";
import { useSelector , useDispatch} from "react-redux";
import {setProduct} from "../Store/Action";
import Image from "next/image";
import rightArrow from "../assets/images/right-arrow-white.svg";
import { useRouter } from "next/router";
import FormatHelper from "../Helper/FormatHelper";
import { Input , Button} from "antd";
import listIcon from "../assets/images/list.svg";
import filterIcon from "../assets/images/filter.svg";


const ProductList=()=>{
    const router=useRouter();
    const dispatch=useDispatch();

    const subCat = useSelector(state=>state.Reducer.selectedSubCat); 

    useEffect(()=>{
        console.log(subCat);
    },[])

    return(
        <div className="app-container">
            <div className={`${styles.product_list} dashboard-page`}>
                <div onClick={()=>subCat.Product.map((data)=>{
                    console.log(data)
                })} className="header">
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
                    {subCat && subCat.Product && subCat.Product.length>0 && subCat.Product.map((data)=>(
                        <div>
                            <div>
                                <Image
                                    src={data.PhotoUrl}
                                    loader={()=>data.PhotoUrl}
                                    alt="food logo"
                                    width={"100%"}
                                    height={"100%"}
                                />
                            </div>
                            <div></div>
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