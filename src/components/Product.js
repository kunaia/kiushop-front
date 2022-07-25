import "./Product.css";
import { BsHeart, BsEyeSlash, BsEye } from "react-icons/bs";
import { useEffect, useContext, useState } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../UserContext";
import server from "./ServerURL";

const Product = ({
  isvisible,
  img,
  id,
  sale,
  name,
  price,
  isrelated,
  self,
}) => {
  const [vis, set_vis] = useState(isvisible);
  const { addToBasket, getBasket, setFavs, favs, logged_in, userData, lang } =
    useContext(UserContext);
  const isadmin = userData.permission === "admin";

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

  const addToFavs = async () => {
    const link = server + "favorites";
    const res = await fetch(link, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
      body: JSON.stringify({
        product_id: id,
      }),
    });
    const data = await res.json();
    console.log(data);
  };

  const onHeart = (e) => {
    if (logged_in) {
      if (e.target.style.color !== "red") {
        e.target.style.color = "red";
        addToFavs();
        setFavs([...favs, self]);
      } else {
        e.target.style.color = "black";
        addToFavs();
        setFavs(favs.filter((p) => p.id !== self.id));
      }
    }
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
              <div className="outtastock">
                {self.amount === 0 && (
                  <div className="outOfStock">out of stock</div>
                )}
                <img id="product" src={img} alt="product" />
              </div>
            )}
            <div className="bg">
              <div className="view">
                {lang == "en" ? "View Plant" : "დეტალურად"}
              </div>
            </div>
          </div>
        </a>
        <p>{name}</p>
        {isadmin && !isrelated && (
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
        <p>{"$" + price?.toFixed(2)}</p>
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
          <Link to={!logged_in && "/login"} className="text-link">
            <BsHeart
              style={{
                cursor: "pointer",
                color: self.is_favorite === true ? "red" : "",
              }}
              size={30}
              onClick={(e) => onHeart(e)}
            />
          </Link>
        </div>
      </div>
    </div>
  );
};
export default Product;
