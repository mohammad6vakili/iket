import { useState , useEffect } from "react";
import styles from "../styles/Search.module.css";
import { useSelector , useDispatch} from "react-redux";
import { useRouter } from "next/router";
import { setMenu , setBadge } from "../Store/Action";
import Head from 'next/head';
import Image from "next/image";
import axios from "axios";
import Menu from "../Components/Menu/Menu";
import searchIcon from "../assets/images/search.svg";
import Env from "../Constant/Env.json";
import FormatHelper from "../Helper/FormatHelper";
import { toast } from "react-toastify";
import { Input , Button} from "antd";


const Search=()=>{
    const dispatch=useDispatch();
    const router=useRouter();

    const [products , setProducts]=useState(null);

    const cart = useSelector(state=>state.Reducer.cart);
    const categoryType = useSelector(state=>state.Reducer.categoryType);
    const selectedHyper = useSelector(state=>state.Reducer.selectedHyper);
    const lat = useSelector(state=>state.Reducer.lat);
    const lng = useSelector(state=>state.Reducer.lng);

    const onSearch=async(str)=>{
        let postData = new FormData();
        postData.append("Token",Env.token);
        postData.append("CategoryTypeID",categoryType);
        postData.append("Search",str);
        if(selectedHyper!==null){
            postData.append("ProviderID",selectedHyper.ID);
        }
        if(categoryType!=="1"){
            postData.append("CityID",localStorage.getItem("selectCity"));
        }
        if(lat!=="" && lng!==""){
            postData.append("Latitude",lat);
            postData.append("Longitude",lng);
        }
        if(str.length>1){
            try{
                const response=await axios.post(Env.baseUrl + "SelectBySearch.aspx",postData);
                setProducts(response.data.Data);
            }catch(err){
                console.log(err);
            }
        }
    }

    const addToCart=(product)=>{
        let already=false;
        if(cart && cart.length>0 && cart[0].ProviderID!==product.ProviderID){
            toast.warning("خرید از چند فروشگاه امکان پذیر نیست.",{
                position:"bottom-left"
            })
        }else if(product.count > product.Quantity){
            toast.warning("ظرفیت غذا کافی نمیباشد",{
                position:"bottom-left"
            })
        }else{
            cart.map((pr)=>{
                if(pr.ID===product.ID){
                    already = true;
                    pr.count = product.count;
                }
            });
            toast.success("به سبد خرید افزوده شد",{
                position:"bottom-left"
            })
            if (!already) {
                if(product.count===0 || product.count===1){
                    cart.push({...product , count:1});
                }else if(product.count>1){
                    cart.push(product);
                }
            }
            if(cart && cart.length>0){
                localStorage.setItem("cart",JSON.stringify(cart));
            }
        }
        dispatch(setBadge(cart.length));
    }

    useEffect(()=>{
        if(products && products.length>0){
            products.map((pr)=>{
                return pr.count=0;
            })
        }
    },[products])

    useEffect(()=>{
        if(cart && cart.length>0){
            localStorage.setItem("cart",JSON.stringify(cart));
        }
    })

    useEffect(()=>{
        dispatch(setMenu(3));
    },[])

    return(
        <div className="app-container">
            <Head>
                <title>آیکت</title>
                <meta name='description' content='فروشگاه آنلاین آیکت'/>
                <link rel="icon" href="/favicon.ico" />
                <link rel="manifest" href="/manifest.json" />
            </Head>
            <div className={`${styles.search} dashboard-page`}>
                <div onClick={()=>console.log(products)} style={{fontSize:"14px"}} className="header">
                    <Input
                        placeholder="جستجو کنید . . ."
                        style={{
                            width:"70%",
                            backgroundColor:"transparent",
                            border:"none",
                            borderBottom:"1px solid white",
                            color:"white"
                        }}
                        onChange={(e)=>onSearch(e.target.value)}
                    />
                    <div style={{cursor:"pointer"}} className="header-left-icon">
                        <Image
                            src={searchIcon}
                            alt="search"
                            width={""}
                        />
                    </div>
                </div>
                <div className={styles.restaurant_page_menu_menu}>
                    {products && products.length>0 && products.map((pr , index)=>(
                        <div
                            className={pr.IsActive===false ? styles.restaurant_page_item_disabled : ""}
                            key={index}
                        >
                            <div>
                                {pr.Title}
                            </div>
                        <div>
                        <select
                            onChange={(e)=>{
                                pr.count=parseInt(e.target.value);
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
                        <div>
                            <div className={pr.PriceWithDiscount!==pr.Price ? styles.restaurant_page_discount_price : ""}>
                                {FormatHelper.toPersianString(pr.Price.toLocaleString()) + " تومان"}
                            </div>
                            <div>
                                {pr.PriceWithDiscount!==pr.Price && FormatHelper.toPersianString(pr.PriceWithDiscount.toLocaleString()) +"تومان"}
                            </div>
                            <Button onClick={()=>addToCart(pr)}>
                                افزودن به سبد خرید
                            </Button>
                        </div>
                        </div>
                    </div>
                    ))}
                </div>
                <Menu/>
            </div>
        </div>
    )
}
export default Search;