import { useEffect } from "react";
import styles from "../styles/Enter.module.css";
import Image from "next/image";
import loginIcon from "../assets/images/login_icon.png";
import { Button } from "antd";

const Enter=({title})=>{

    return(
        <div className="app-container">
            <div className={`${styles.enter} dashboard-page`}>
                <div className="header">
                    حساب کاربری
                </div>
                <div className={styles.enter_vector}>
                    <Image
                        src={loginIcon}
                        alt="login"
                        width={"90px"}
                        height={"90px"}
                    />
                </div>
                <Button 
                    className="enter_green_btn"
                >
                    ورود
                </Button>
                <Button 
                    style={{marginTop:"2vh"}} 
                    className="enter_green_btn"
                >
                    عضویت
                </Button>
                <Button 
                    style={{marginTop:"10vh"}} 
                    className="enter_purple_btn"
                    href="tel:09426001269"
                >
                    تماس با پشتیبانی
                </Button>
            </div>
        </div>
    )
}
export default Enter;