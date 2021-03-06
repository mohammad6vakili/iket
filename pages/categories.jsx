import { useEffect,useState } from "react";
import styles from "../styles/Categories.module.css";
import Menu from "../Components/Menu/Menu";
import { useSelector , useDispatch} from "react-redux";
import {setSelectedSubCat} from "../Store/Action";
import Image from "next/image";
import { useRouter } from "next/router";
import rightArrow from "../assets/images/right-arrow-white.svg";
import axios from "axios";
import { toast } from "react-toastify";
import FormatHelper from "../Helper/FormatHelper";
import Env from "../Constant/Env.json";
import { Input , Collapse } from "antd";
const { Panel } = Collapse;


const Categories=()=>{
    const router=useRouter();
    const dispatch=useDispatch();

    const categoryType=useSelector(state=>state.Reducer.categoryType);
    const selectedHyper=useSelector(state=>state.Reducer.selectedHyper);
    const lat=useSelector(state=>state.Reducer.lat);
    const lng=useSelector(state=>state.Reducer.lng);

    const [step , setStep]=useState(0);
    const [categories , setCategories]=useState(null);
    const [selectedCategory , setSelectedCategory]=useState(null);
    const [selectedSubCategory, setSelectedSubCategory]=useState(null);

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
            toast.error("?????? ???? ?????????????? ????????????",{
                position:"bottom-left"
            })
            console.log(err);
        }
    }


    useEffect(()=>{
        if(selectedHyper){
            getCategories();
        }
    },[])

    return(
        <div className="app-container">
            <div className={`${styles.categories} dashboard-page`}>
                <Menu/>
                <div className="header">
                    {selectedCategory===null ? "???????? ???????? ????" : selectedCategory.Title}
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
                {step===0 &&
                    <div style={{marginTop:"20px"}}>
                        {categories && categories.length>0 && categories.map((data,index)=>(
                            <div 
                                onClick={()=>{
                                    setSelectedCategory(data);
                                    setStep(1);
                                }}
                                className={styles.categories_items} 
                                key={index}
                            >
                                <div>
                                    {data.Title}
                                    <Image
                                        key={index}
                                        width={"65px"}
                                        height={"65px"}
                                        src={data.PhotoUrl}
                                        loader={()=>data.PhotoUrl}
                                        alt="slider"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                }
                {step===1 &&
                    <div className={styles.categories_step_two}>
                        <div>
                            {selectedCategory && selectedCategory.SubCategory.map((data , index)=>(
                                <div onClick={()=>setSelectedSubCategory(data.SubCategoryVitrin)} key={index}>
                                    <Image
                                        width={"65px"}
                                        height={"65px"}
                                        src={data.PhotoUrl}
                                        loader={()=>data.PhotoUrl}
                                        alt="category"
                                    />
                                    <span>{data.Title}</span>
                                </div>
                            ))}
                        </div>
                        <div>
                            {selectedSubCategory && selectedSubCategory.length>0 && selectedSubCategory.map((data,index)=>(
                                <Collapse defaultActiveKey={['0']}>
                                    <Panel header={data.Title} key={index}>
                                        {data.SubCategoryPackage && data.SubCategoryPackage.length>0 && data.SubCategoryPackage.map((pac,index)=>(
                                            <div
                                                key={index}
                                                onClick={()=>{
                                                    if(pac.Product.length===0){
                                                        toast.warning("???????????????? ???????????? ???????? ??????",{
                                                            position:"bottom-left"
                                                        });
                                                    }else{
                                                        dispatch(setSelectedSubCat(pac));
                                                        router.push("/productList");
                                                    }
                                                }}
                                                className={styles.category_package_item}
                                            >
                                                <Image
                                                    width={"65px"}
                                                    height={"65px"}
                                                    src={pac.PhotoUrl}
                                                    loader={()=>pac.PhotoUrl}
                                                    alt="product"
                                                />
                                                {pac.Title}
                                            </div>
                                        ))}
                                    </Panel>
                                </Collapse>
                            ))}
                        </div>
                    </div>
                }
            </div>
        </div>
    )
}
export default Categories;