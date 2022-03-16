import { useEffect,useState } from "react";
import styles from "../styles/Categories.module.css";
import Menu from "../Components/Menu/Menu";
import { useSelector , useDispatch} from "react-redux";
import {setSelectedSubCat , setMenu,setSelectedProvider} from "../Store/Action";
import Image from "next/image";
import Logo from "../assets/images/logo_colored.webp";
import Head from 'next/head';
import { useRouter } from "next/router";
import rightArrow from "../assets/images/right-arrow-white.svg";
import axios from "axios";
import { toast } from "react-toastify";
import Env from "../Constant/Env.json";
import loadingSvg from "../assets/images/loading.svg";
import { Collapse } from "antd";
const { Panel } = Collapse;


const Categories=()=>{
    const router=useRouter();
    const dispatch=useDispatch();

    const categoryType=useSelector(state=>state.Reducer.categoryType);
    const selectedHyper=useSelector(state=>state.Reducer.selectedHyper);
    const cartData=useSelector(state=>state.Reducer.cart);
    const lat=useSelector(state=>state.Reducer.lat);
    const lng=useSelector(state=>state.Reducer.lng);

    const [step , setStep]=useState(0);
    const [categories , setCategories]=useState(null);
    const [selectedCategory , setSelectedCategory]=useState(null);
    const [selectedSubCategory, setSelectedSubCategory]=useState(null);
    const [inId , setInId]=useState(null);

    const divStyle = {
        filter: "invert(50%) sepia(84%) saturate(457%) hue-rotate(216deg) brightness(83%) contrast(89%) !important"
      };

    const getCategories=async()=>{
        const areaId = localStorage.getItem("selectArea");
        let postData=new FormData();
        postData.append("Token",Env.token);
        postData.append("CategoryTypeID",categoryType);
        postData.append("AreaID",areaId);
        if(lat===""){
            postData.append("userLocation","0");
            postData.append("latitude",parseFloat(selectedHyper.Latitude).toFixed(4));
            postData.append("longitude",parseFloat(selectedHyper.Longitude).toFixed(4));
        }else{
            postData.append("userLocation","1");
            postData.append("latitude",lat);
            postData.append("longitude",lng);
        }
        try{
            const response=await axios.post(Env.baseUrl + "SelectCategoryFamilyByHyperMarket.aspx",postData);
            if(response.data.Status===1){
                setCategories(response.data.Data);
                response.data.Data.map((data)=>{
                    data.SubCategory.map((subCat)=>{
                        subCat.SubCategoryVitrin.map((vitrin)=>{
                            vitrin.SubCategoryPackage.map((pack)=>{
                                pack.Product.map((pr)=>{
                                    return pr.count=1;
                                })
                            })
                        })
                    })
                })
            }else{
                toast.warning(response.data.Message,{
                    position:"bottom-left"
                })
            }
        }catch(err){
            console.log(err);
        }
    }


    useEffect(()=>{
        if(selectedHyper || lat!==""){
            getCategories();
        }
        dispatch(setMenu(1));
        dispatch(setSelectedProvider(null))
    },[])

    useEffect(()=>{
        if(cartData && cartData.length>0){
            localStorage.setItem("cart",JSON.stringify(cartData));
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
            <div className={`${styles.categories} dashboard-page`}>
                <Menu/>
                <div className="header">
                    {selectedCategory===null ? "دسته بندی ها" : selectedCategory.Title}
                    {step===1 &&
                        <div className="header-right-icon">
                            <Image
                                src={rightArrow}
                                alt="back"
                                onClick={()=>{setStep(0);setSelectedCategory(null);}}
                            />
                        </div>
                    }
                </div>
                {categories===null &&
                    <div style={{width:"100%",display:"flex",flexDirection:"column",alignItems:"center"}}> 
                        <Image
                            src={loadingSvg}
                            alt="loading"
                            width={100}
                            height={100}
                        />
                        <div>لطفا منتظر بمانید</div>
                    </div>
                }
                {step===0 &&
                    <div style={{marginTop:"20px"}}>
                        {categories && categories.length>0 && categories.map((data,index)=>(
                            <div 
                                onClick={()=>{
                                    setSelectedSubCategory(null);
                                    setSelectedCategory(data);
                                    setStep(1);
                                }}
                                className={styles.categories_items} 
                                key={index}
                            >
                                <div>
                                    {data.Title}
                                    {data.PhotoUrl==="https://iketpanel.com" ?
                                        <Image
                                            src={Logo}
                                            alt="food logo"
                                            width={80}
                                            height={50}
                                        />
                                        :
                                        <Image
                                            key={index}
                                            width={"65px"}
                                            height={"65px"}
                                            src={data.PhotoUrl}
                                            loader={()=>data.PhotoUrl}
                                            alt="slider"
                                        />
                                    }
                                </div>
                            </div>
                        ))}
                    </div>
                }
                {step===1 &&
                    <div className={styles.categories_step_two}>
                        <div>
                            {selectedCategory && selectedCategory.SubCategory.map((data , index)=>(
                                <div
                                    
                                    onClick={()=>{setSelectedSubCategory(data.SubCategoryVitrin);setInId(data.ID)}} key={index}
                                >
                                    {data.PhotoUrl==="https://iketpanel.com" ?
                                        <Image
                                            src={Logo}
                                            alt="food logo"
                                            width={80}
                                            height={50}
                                        />
                                    :
                                        <Image
                                            width={"65px"}
                                            height={"65px"}
                                            src={data.PhotoUrl}
                                            loader={()=>data.PhotoUrl}
                                            alt="category"
                                        />
                                    }
                                    <span style={inId && inId===data.ID ? {color:"#5925B6"} : {color:"unset"}}>{data.Title}</span>
                                </div>
                            ))}
                        </div>
                        <div>
                        <Collapse accordion defaultActiveKey={['0']}>
                            {selectedSubCategory && selectedSubCategory.length>0 && selectedSubCategory.map((data,index)=>(
                                    <Panel header={data.Title} key={index.toString()}>
                                        {data.SubCategoryPackage && data.SubCategoryPackage.length>0 && data.SubCategoryPackage.map((pac,index)=>(
                                            <div
                                                onClick={()=>{
                                                    if(pac.Product.length===0){
                                                        toast.warning("متاسفانه محصولی یافت نشد",{
                                                            position:"bottom-left"
                                                        });
                                                    }else{
                                                        dispatch(setSelectedSubCat(pac));
                                                        router.push("/productList");
                                                    }
                                                }}
                                                className={styles.category_package_item}
                                            >
                                                {pac.PhotoUrl === "https://iketpanel.com" ?
                                                    <Image
                                                        src={Logo}
                                                        alt="food logo"
                                                        width={80}
                                                        height={50}
                                                    />
                                                :
                                                    <Image
                                                        width={"65px"}
                                                        height={"65px"}
                                                        src={pac.PhotoUrl}
                                                        loader={()=>pac.PhotoUrl}
                                                        alt="product"
                                                    />
                                                }
                                                {pac.Title}
                                            </div>
                                        ))}
                                    </Panel>
                            ))}
                                </Collapse>
                        </div>
                    </div>
                }
            </div>
        </div>
    )
}
export default Categories;