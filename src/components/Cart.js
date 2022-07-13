import { useState, useContext, useEffect } from "react";
import { UserContext } from "../UserContext";
import server from "./ServerURL";
import "./Cart.css";
import FooterEn from "./FooterEn.js";
import Header from "./Header";
import CartProduct from "./CartProduct.js";
import { Link, useNavigate } from "react-router-dom";

const Cart = () => {
  const { lang, basket, getBasket } = useContext(UserContext);
  const [subtotal, setSubtotal] = useState(basket.total_cost);
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(0);
  const [comment, setComment] = useState("");
  const navigate = useNavigate();

  const addToBasket = async (prod_id, product, q) => {
    const link = server + "basket";
    const res = await fetch(link, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        product_id: prod_id,
        basket_title: localStorage.getItem("basket_title"),
        quantity: q,
      }),
    });
    const data = await res.json();
    setSubtotal(data.basket.total_cost);
    console.log("PUT quant");
    console.log(data);
  };

  const getAddresses = async () => {
    const link = server + "address";
    try {
      const res = await fetch(link, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("access_token"),
        },
      });
      const data = await res.json();
      setAddresses(data.addresses.map((a) => ({ ...a, selected: false })));
      setSelectedAddress(data.addresses[0].id);
      console.log(data);
    } catch (err) {
      console.log(err);
    }
  };

  const createAddress = async () => {
    const link = server + "address";
    const field_err_msg = document.getElementById("address-fields-err");
    if (city.length !== 0 && address.length !== 0) {
      const res = await fetch(link, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("access_token"),
        },
        body: JSON.stringify({
          city: city,
          address: address,
        }),
      });
      const data = await res.json();
      console.log(data);
      field_err_msg.style.display = "none";
    } else {
      field_err_msg.style.display = "block";
    }
  };

  const removeAddress = async (id) => {
    console.log("id: " + id);
    const link = server + "address";
    const res = await fetch(link, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
      body: JSON.stringify({
        address_id: id,
      }),
    });
    const data = await res.json();
    setAddresses(addresses.filter((a) => a.id !== id));
    console.log(data);
  };

  const createOrder = async () => {
    const link = server + "order";
    const field_err_msg = document.getElementById("address-field-err");

    const res = await fetch(link, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
      body: JSON.stringify({
        address_fk: selectedAddress,
        user_comment: comment,
        basket_title: localStorage.getItem("basket_title"),
      }),
    });
    const data = await res.json();
    if (res.ok) {
      navigate("/order_success");
      localStorage.removeItem("basket_title");
    }
  };

  useEffect(() => {
    localStorage.getItem("basket_title") && getBasket();
    localStorage.getItem("access_token") && getAddresses();
  }, []);

  return (
    <div className="cart">
      <Header />
      <div className="main">
        <div className="cart-left">
          <h1>Cart</h1>
          <ul>
            <li>Product</li>
            <li>Quantity</li>
            <li>Total</li>
          </ul>
          <div className="line"></div>
          {basket.products &&
            basket.products.map((x) => (
              <CartProduct
                key={x.id}
                img={x.images?.filter((e) => e.main)[0]?.img_url}
                name={x.title_en}
                price={x.price}
                amount={x.quantity}
                id={x.id}
                product={x}
                addToBasket={addToBasket}
              />
            ))}
          {/* <CartProduct img="https://s3-alpha-sig.figma.com/img/fc02/9aa1/d67135cc0060e5613780dc4756fd4137?Expires=1655078400&Signature=dpqGp8BwhKghtiZqOPE2MEjM7khzBycXY-F972tUkrO~UJMa0LZm3pSXftq~L6qM96EW7c~URAzSPZWOgtKLmPAL~CBjqiqrTGvXPdzJ5pJnDMHmMU3AJxgBbQ60alioH2f4vOsPjyN0GbRBYRh~cZy920o-PcDaPUdDrDMRdRlgYNV8UFvuGhy9dRdrbOv4DurJqnE4lsLnOkBElXgWUcx-BjOjgFNzG3UD5kFirRqHPTq96IUogPtzZLAGK3mohjdyQOkVUFTB~meV9synuzW5mPDwOIxHtzs7BBqH1ZjwfBfxtdpVhDfVgfUgCtjn17MUWGVRiC~g3oGqx7ZFUQ__&Key-Pair-Id=APKAINTVSUGEWH5XD5UA" name={"monstera"} price="30 "/> */}
        </div>
        <div className="cart-right">
          <h1>Cart total</h1>

          <label>CREATE ADDRESS</label>
          <input
            type="text"
            placeholder="Enter your city"
            onChange={(e) => setCity(e.target.value)}
            style={{ margin: "10px 0" }}
            value={city}
          />

          <input
            type="text"
            placeholder="Enter your address"
            onChange={(e) => setAddress(e.target.value)}
            value={address}
            style={{ margin: "10px 0" }}
          />
          <p className="error" id="address-fields-err">
            *fill out fields
          </p>
          <button
            id="address-save"
            onClick={() => {
              createAddress();
              getAddresses();
            }}
          >
            SAVE
          </button>

          <label htmlFor="country">YOUR ADDRESSES</label>
          <div className="addresses">
            {addresses.map((a) => (
              <div
                className={
                  a.id === selectedAddress
                    ? "address address-selected"
                    : "address"
                }
                onClick={() => {
                  setSelectedAddress(a.id);
                }}
              >
                {a.city}, {a.address}
                <span id="addr-rm" onClick={() => removeAddress(a.id)}>
                  &#10006;
                </span>
              </div>
            ))}
          </div>

          <label htmlFor="zipcode">TYPE YOUR COMMENT</label>
          <textarea
            id="comment"
            placeholder="Enter Text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />

          <h3>SUBTOTAL</h3>
          <p>${subtotal ? subtotal : basket.total_cost}</p>
          <div className="button">
            <div className="front" onClick={createOrder}>
              {lang === "ka" ? "ყიდვა" : "PROCEED TO CHECKOUT"}
            </div>
            <div className="back"></div>
          </div>
        </div>
      </div>

      <FooterEn />
    </div>
  );
};

export default Cart;
