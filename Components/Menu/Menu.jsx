import React,{useEffect} from "react";
import styles from "../../styles/Menu.module.css";
import Image from "next/image";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { setMenu,setSelectedProvider } from "../../Store/Action";
import homeActive from "../../assets/images/home_tab_selected.webp";
import homeOff from "../../assets/images/home_tab_unselected.webp";
import catActive from "../../assets/images/category_tab_selected.webp";
import catOff from "../../assets/images/category_tab_unselected.webp";
import cartActive from "../../assets/images/shopping_cart_tab_selected.webp";
import cartOff from "../../assets/images/shopping_cart_tab_unselected.webp";
import searchActive from "../../assets/images/search_tab_selected.webp";
import searchOff from "../../assets/images/search_tab_unselected.webp";
import moreActive from "../../assets/images/more_tab_selected.webp";
import moreOff from "../../assets/images/more_tab_unselected.webp";
import FormatHelper from "../../Helper/FormatHelper";

const Menu = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const menu = useSelector((state) => state.Reducer.menu);
  const cart = useSelector((state) => state.Reducer.cart);
  const categoryType = useSelector((state) => state.Reducer.categoryType);
  const badge = useSelector((state) => state.Reducer.badge);


  return (
    <div className={styles.menu}>
      <div
        onClick={() => {
          dispatch(setMenu(0));
          if (categoryType === "1") {
            router.push("/hypers");
          } else {
            router.push("/restaurant");
          }
        }}
      >
        {menu === 0 ? (
          <Image src={homeActive} alt="home" width={"50%"} height={"50%"} />
        ) : (
          <Image src={homeOff} alt="home" width={"50%"} height={"50%"} />
        )}
      </div>
      <div
        onClick={() => {
          dispatch(setMenu(1));
          if (categoryType === "1") {
            router.push("/categories");
          } else {
            router.push("/allRestaurants");
          }
        }}
      >
        {menu === 1 ? (
          <Image src={catActive} alt="category" width={"50%"} height={"50%"} />
        ) : (
          <Image src={catOff} alt="category" width={"50%"} height={"50%"} />
        )}
      </div>
      <div
        onClick={() => {
          dispatch(setMenu(2));
          router.push("/cart");
        }}
        style={{ position: "relative" }}
      >
        <div
          style={{
            width: "20px",
            height: "20px",
            borderRadius: "50%",
            position: "absolute",
            right: "15px",
            fontSize:"12px",
            zIndex:"9999999",
            top: "0",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background:"red",
            color:"white",
          }}
        >
          {FormatHelper.toPersianString(badge)}
        </div>
        {menu === 2 ? (
          <Image src={cartActive} alt="category" width={"50%"} height={"50%"} />
        ) : (
          <Image src={cartOff} alt="category" width={"50%"} height={"50%"} />
        )}
      </div>
      <div
        onClick={() => {
          dispatch(setMenu(3));
          router.push("/search");
        }}
      >
        {menu === 3 ? (
          <Image
            src={searchActive}
            alt="category"
            width={"50%"}
            height={"50%"}
          />
        ) : (
          <Image src={searchOff} alt="category" width={"50%"} height={"50%"} />
        )}
      </div>
      <div
        onClick={() => {
          dispatch(setMenu(4));
          router.push("/profile");
        }}
      >
        {menu === 4 ? (
          <Image src={moreActive} alt="category" width={"50%"} height={"50%"} />
        ) : (
          <Image src={moreOff} alt="category" width={"50%"} height={"50%"} />
        )}
      </div>
    </div>
  );
};
export default Menu;
