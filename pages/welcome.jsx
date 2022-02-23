import { useState } from "react";
import styles from "../styles/Welcome.module.css";
import Image from "next/image";
import Head from 'next/head';
import { useRouter } from "next/router";
import introOne from "../assets/images/intro1.webp";
import introTwo from "../assets/images/intro2.webp";
import introThree from "../assets/images/intro3.webp";
import introFour from "../assets/images/intro4.webp";
import arrowIcon from "../assets/images/right-arrow-purple.svg";


const Welcome=()=>{
    const router = useRouter();
    const [step , setStep]=useState(0);

    const nextStep=()=>{
        switch (step) {
            case 0:
                setStep(1);
                break;
            case 1:
                setStep(2);
                break;
            case 2:
                setStep(3);
                break;
            case 3:
                router.push("/enter");localStorage.setItem("first",true);
                break;
            default:
                break;
        }
    }

    return(
        <div className="app-container">
            <Head>
                <title>آیکت</title>
                <meta name='description' content='فروشگاه آنلاین آیکت'/>
                <link rel="icon" href="/favicon.ico" />
                <link rel="manifest" href="/manifest.json" />
            </Head>
            <div className={`${styles.welcome} dashboard-page`}>
                {step===0 &&
                    <>
                        <Image
                            src={introOne}
                            alt="loading"
                            width={"100px"}
                            height={"80px"}
                        />
                        <span className={styles.welcome_span}>به راحتی کالای خود را انتخاب کنید</span>
                    </>
                }
                {step===1 &&
                    <>
                        <Image
                            src={introTwo}
                            alt="loading"
                            width={"100px"}
                            height={"80px"}
                        />
                        <span className={styles.welcome_span}>در کوتاه ترین زمان خرید خود را تحویل بگیرید</span>
                    </>
                }
                {step===2 &&
                    <>
                        <Image
                            src={introThree}
                            alt="loading"
                            width={"100px"}
                            height={"80px"}
                        />
                        <span className={styles.welcome_span}>صورتحساب خود را به هر روشی که دوست دارید پرداخت کنید</span>
                    </>
                }
                {step===3 &&
                    <>
                        <Image
                            src={introFour}
                            alt="loading"
                            width={"100px"}
                            height={"80px"}
                        />
                        <span className={styles.welcome_span}>آی کت همیشه و در هر زمان باز است</span>
                    </>
                }
                <div className={styles.welcome_bottom_section}>
                    <div  onClick={nextStep}>
                        <Image
                            src={arrowIcon}
                            alt="loading"
                            width={"20px"}
                            height={"20px"}
                        />
                    </div>
                    <div>
                        <div 
                            onClick={()=>setStep(0)}
                            className={step===0 && styles.welcome_span_selected}
                        >

                        </div>
                        <div
                            onClick={()=>setStep(1)}
                            className={step===1 && styles.welcome_span_selected}
                        >

                        </div>
                        <div
                            onClick={()=>setStep(2)}
                            className={step===2 && styles.welcome_span_selected}
                        >

                        </div>
                        <div
                            onClick={()=>setStep(3)}
                            className={step===3 && styles.welcome_span_selected}
                        >

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Welcome;