import "./Product.css";
import { BsHeart, BsEyeSlash, BsEye } from "react-icons/bs";
import { useEffect, useContext, useState } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../UserContext";
import server from "./ServerURL";

const Product = ({
  isadmin,
  isvisible,
  lang,
  img,
  id,
  sale,
  name,
  price,
  self,
  amount
}) => {
  const [vis, set_vis] = useState(isvisible);
  const { addToBasket, getBasket } = useContext(UserContext);

  const turn_visible_on = () => {
    toggle_visibility();
    toggleVisible();
    console.log("visible");
  };
  const turn_invisible_off = () => {
    toggle_visibility();
    toggleVisible();
    console.log("fs");
  };

  const toggleVisible = () => {
    set_vis(!vis);
  };

  const toggle_visibility = async () => {
    const link = server + "/product/" + id + "/visible";
    const res = await fetch(link, {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    });
    const data = await res.json();
    console.log(data);
  };

  const createBasket = async () => {
    const link = server + "basket";
    const res = await fetch(link, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    localStorage.setItem("basket_title", data.basket_title);
    getBasket();
    console.log(data);
  };

  return (
    <div className="product">
      {sale !== 0 && <div className="sale-pointer">{"-" + sale + "%"}</div>}
      <div className="product__inner">
        <a href={"/product/" + id}>
          <div className="prod__img">
            {img === "" ? (
              <div id="product">
                <img
                  id="product"
                  src="https://images.assetsdelivery.com/compings_v2/yehorlisnyi/yehorlisnyi2104/yehorlisnyi210400016.jpg"
                />
              </div>
            ) : (
              amount==0?

              (<div className="outtastock">
                
                <div className="outOfStock">out of stock</div>
                <img id="product" src={img} alt="product" />
              </div>
                )
                : <img id="product" src={img} alt="product" />

            )}
            <div className="bg">
              <div className="view">
                {lang == "en" ? "View Plant" : "დეტალურად"}
              </div>
            </div>
          </div>
        </a>
        <p>{name}</p>
        {isadmin && (
          <div>
            {vis ? (
              <BsEye
                style={{ cursor: "pointer" }}
                size={20}
                onClick={turn_visible_on}
              />
            ) : (
              <BsEyeSlash
                style={{ cursor: "pointer" }}
                size={20}
                onClick={turn_invisible_off}
              />
            )}
          </div>
        )}
        <p>{"$" + price}</p>
        <div className="prod__action">
          <div
            className="add-cart"
            onClick={() => {
              addToBasket(id, self);
              console.log("added");
            }}
          >
            {lang == "en" ? "ADD TO CART" : "კალათაში დამატება"}
          </div>
          <BsHeart style={{ cursor: "pointer" }} size={30} />
        </div>
      </div>
    </div>
  );
};
export default Product;
