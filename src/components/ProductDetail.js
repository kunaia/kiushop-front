import "./ProductDetail.css";
import Header from "./Header.js";
import ProductsEn from "./ProductsEn";
import FooterEn from "./FooterEn";
import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../UserContext";
import { useParams } from "react-router-dom";
import server from "./ServerURL.js";
import { MdRemoveCircle, MdPhoto } from "react-icons/md";
import Product from "./Product";
import AddProduct from "./AddProduct";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState("");
  const [main, setMain] = useState({});
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [images, set_images] = useState([]);
  const [editing, setEditing] = useState(false);
  const [relateds, setRelateds] = useState([]);

  const {
    userData,
    logout,
    logged_in,
    toggleLogged,
    lang,
    checkUser,
    getBasket,
    addToBasket2,
  } = useContext(UserContext);

  const getProduct = async () => {
    const link = server + "product/" + id;
    localStorage.getItem("access_token") !== undefined && checkUser();
    setLoading(true);
    const response = await fetch(link, {
      method: "GET",
      headers: localStorage.getItem("access_token")
        ? {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("access_token"),
          }
        : {
            "Content-Type": "application/json",
          },
    });
    const data = await response.json();
    setLoading(false);

    set_images(data.product.images);

    console.log("product");
    console.log(data.product);

    console.log(images);

    console.log("data product images");
    console.log(data.product.images);

    const main_img = data.product.images.filter((e) => e.main === true)[0];
    setMainImage(main_img && main_img.img_url);
    setMain(main_img && main_img);
    setProduct(data.product);
    console.log(data);
  };

  const getRelateds = async () => {
    if (product.tag_fk) {
      const link = `${server}products/filter?tag_id=${product.tag_fk}`;
      const res = await fetch(link, {
        method: "GET",
        headers: localStorage.getItem("access_token")
          ? {
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.getItem("access_token"),
            }
          : {
              "Content-Type": "application/json",
            },
      });
      const data = await res.json();
      setRelateds(data.products);
      console.log("rels");
      console.log(data);
    }
  };

  const sendPhoto = async (e) => {
    const formdata = new FormData();
    formdata.append("image", e.target.files[0]);
    const link = server + "product/" + id + "/attach_image";
    const img = document.getElementById("main_img");
    img.style.display = "none";

    setUploading(true);

    const response = await fetch(link, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
      body: formdata,
    });
    const data = await response.json();

    console.log(data.image);
    set_images([...images, data.image]);

    img.style.display = "block";
    setUploading(false);
    console.log(data);
  };

  const removeimg = async (element, img_id) => {
    console.log("remove");
    set_images(images.filter((e) => e !== element));
    const response = await fetch(
      server + "/product/" + id + "/detach_image/" + img_id,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("access_token"),
        },
      }
    );
    const data = await response.json();
    console.log(data);
  };

  const setMainPhoto = async (p, e) => {
    const img_id = p.id;
    setMainImage(p.img_url);
    setMain(p);
    const link = server + "product/" + id + "/main_image/" + img_id;
    const res = await fetch(link, {
      method: "PUT",
      headers: localStorage.getItem("access_token")
        ? {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("access_token"),
          }
        : {
            "Content-Type": "application/json",
          },
    });
    const data = await res.json();
    console.log(data);
  };

  useEffect(() => {
    getBasket();
    window.scrollTo(0, 0);
    getProduct();
    getRelateds();
  }, []);

  useEffect(() => {
    getRelateds();
  }, [product]);

  return (
    <div className="product_details">
      <Header
        logout={logout}
        name={userData.name}
        logged_in={logged_in}
        toggleLogged={toggleLogged}
      />
      {editing && (
        <AddProduct
          toggleShowAdd={() => setEditing(false)}
          method="PUT"
          info={{
            title_en: product.title_en,
            title_ge: product.title_ge,
            price: product.price,
            amount: product.amount,
            discount: product.discount,
            description_en: product.description_en,
            description_ge: product.description_ge,
            prod_id: id,
            setProduct: setProduct,
          }}
        />
      )}
      <div className="product_line">
        <div className="line_left">
          {images.map((x) => (
            <div className="left_img" key={x.img_url}>
              {userData.permission === "admin" && logged_in && (
                <MdRemoveCircle
                  size={20}
                  id="rm_circle"
                  onClick={() => removeimg(x, x.id)}
                />
              )}
              {userData.permission === "admin" && logged_in && (
                <MdPhoto
                  style={{ color: x.id === main.id ? "green" : "" }}
                  size={20}
                  id="photo_circle"
                  onClick={(e) => setMainPhoto(x, e)}
                />
              )}
              <img
                onClick={() => setMainImage(x.img_url)}
                className="detail-small-img"
                src={x.img_url}
              />
            </div>
          ))}
        </div>

        <div id="main_image_w_upload">
          {loading || uploading ? (
            <div class="mainImage">
              <div className="loading-spinner"></div>
            </div>
          ) : (
            <div className="mainImage">
              <img
                id="main_img"
                src={mainImage}
                style={{ objectFit: "cover", objectPosition: "center" }}
                alt="product image"
              />
              {product.discount !== 0 && (
                <div className="discount_place">-{product.discount}%</div>
              )}
              {userData.permission === "admin" && logged_in && (
                <input
                  className="main_upload"
                  type="file"
                  onChange={(e) => {
                    sendPhoto(e);
                  }}
                />
              )}
            </div>
          )}
        </div>
        <div className="line_right">
          <h1
            style={{
              fontSize: lang === "ka" ? "38px" : "52px",
              lineHeight: "40px",
            }}
          >
            {lang === "ka" ? product.title_ge : product.title_en}
          </h1>
          <p id="prod_detail_price">${product.price?.toFixed(2)}</p>
          <div className="amount">
            <label>{lang === "ka" ? "???????????????????????????: " : "Quantity: "}</label>
            <input
              type="number"
              id="quantity"
              min="1"
              defaultValue={1}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </div>
          <div className="amount" style={{ marginLeft: "-20px" }}>
            <label htmlFor="currency">
              {lang === "ka" ? "??????????????????: " : "Curency: "}
            </label>
            <select name="" id="currency">
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GEL">GEL</option>
            </select>
          </div>
          <p id="prod-detail-desc">
            {localStorage.getItem("lang") === "en"
              ? product.description_en
              : product.description_ge}
          </p>
          <button
            style={{ maxWidth: "360px" }}
            id="add-to-cart"
            onClick={() => addToBasket2(id, product, quantity)}
          >
            {lang == "ka" ? "???????????????????????? ????????????????????????" : "ADD TO CART"}
          </button>
          {/* <div className="terms_conditions">
            <input type="checkbox" />
            <p>
              {lang === "ka"
                ? "?????????????????????????????? ?????????????????? ?????? ????????????????????????"
                : "I agree with terms and conditions"}
            </p>
          </div> */}
          <div className="button" style={{ marginLeft: "-10PX" }}>
            <div className="front">
              {lang === "ka" ? "??????????????? ????????????" : "BUY IT NOW"}
            </div>
            <div className="back"></div>
          </div>
          {userData?.permission === "admin" && logged_in && (
            <button id="edit" onClick={() => setEditing(!editing)}>
              {lang === "ka" ? "??????????????????????????? ?????????????????????????????????" : "Edit Product"}
            </button>
          )}
        </div>
      </div>

      <div className="header2">
        {lang === "ka" ? "????????????????????? ????????????????????????" : "Related Products"}
      </div>
      <div className="relateds">
        {relateds?.map((p) => (
          <Product
            key={p.id}
            isrelated={true}
            isvisible={p.is_visible}
            img={p.images.filter((i) => i.main)[0].img_url}
            id={p.id}
            sale={p.discount}
            name={p.title_en}
            price={p.price}
            self={p}
          />
        ))}
      </div>
      <FooterEn />
    </div>
  );
};

export default ProductDetail;
