import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import HomeEn from "./components/HomeEn.js";
import ProductDetail from "./components/ProductDetail.js";
import LoginEn from "./components/LoginEn.js";
import RegisterEn from "./components/RegisterEn.js";
import Verify from "./components/Verify.js";
import SearchPage from "./components/SearchPage.js";
import server from "./components/ServerURL.js";
import vector from "./images/vector.png";
import MessengerCustomerChat from "react-messenger-customer-chat";
import Favourites from "./components/Favourites.js";
import Cart from "./components/Cart.js";
import { UserContext } from "./UserContext.js";
import SuccessOrder from "./components/SuccessOrder.js";
import Orders from "./Orders.js";
import OrderCart from "./components/OrderCart.js";

const App = () => {
  const [logged_in, set_logged_in] = useState(false);
  const [LoginLoading, setLoginLoading] = useState(false);
  const [basket, set_basket] = useState({ products: [] });
  const [basketProds, setBasketProds] = useState([]);
  const [cartSize, setCartSize] = useState(0);
  const [favs, setFavs] = useState([]);
  const [orders, setOrders] = useState([]);
  const [userData, setUserData] = useState({
    email: "",
    name: "",
    surname: "",
  });

  const [lang, set_lang] = useState(
    localStorage.getItem("lang") !== undefined
      ? localStorage.getItem("lang")
      : "en"
  );

  const getOrders = async () => {
    const link = server + "orders";
    const res = await fetch(link, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    });
    const data = await res.json();
    setOrders(data.orders);
    console.log(data);
  };

  const fetchFavs = async () => {
    const link = server + "favorites";
    const res = await fetch(link, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    });
    const data = await res.json();
    console.log(data);
    setFavs(data.favorites);
  };

  const changeLang = (newLang) => {
    set_lang(newLang);
    localStorage.setItem("lang", newLang);
  };

  const deleteFromBasket = async (id) => {
    const link = server + "basket";
    set_basket({
      title: basket.title,
      total_cost: basket.total_cost,
      products: basket.products.filter((p) => p.id !== id),
    });
    const res = await fetch(link, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
      body: JSON.stringify({
        product_id: id,
        basket_title: localStorage.getItem("basket_title"),
      }),
    });
    const data = await res.json();
    console.log(data);
    setCartSize(data.basket.basket_product_cnt);
  };

  const createBasket = async () => {
    const link = server + "basket";
    const res = await fetch(link, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    localStorage.setItem("basket_title", data.basket_title);
    console.log(data);
  };

  const getBasket = async () => {
    const link =
      server + `basket?title=${localStorage.getItem("basket_title")}`;
    const res = await fetch(link, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    });
    const data = await res.json();
    console.log(data);
    set_basket(data.basket);
    setBasketProds(data.basket.products);
    setCartSize(data.basket?.products.length);
  };

  const addToBasket = async (prod_id, product) => {
    const link = server + "basket/add";
    console.log(basket.products);
    set_basket({
      title: basket.title,
      total_cost: basket.total_cost,
      products: basket.products.includes(product)
        ? basket.products
        : [...basket.products, product],
    });
    const res = await fetch(link, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        product_id: prod_id,
        basket_title: localStorage.getItem("basket_title"),
      }),
    });
    const data = await res.json();

    setCartSize(data.basket_product_cnt);
    console.log(data.basket_product_cnt);
    console.log(data);
  };

  const addToBasket2 = async (prod_id, product, q) => {
    const link = server + "basket";
    console.log(basket.products);
    set_basket({
      title: basket.title,
      total_cost: basket.total_cost,
      products: basket.products,
    });
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
    console.log(data);
    setCartSize(data.basket.basket_product_cnt);
  };

  const tokenRefresh = async () => {
    const link = server + "/token_refresh";
    const res = await fetch(link, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("refresh_token"),
      },
    });
    const data = await res.json();
    localStorage.setItem("access_token", data.access_token);
    console.log("refreshed");
    console.log(data);
    window.location.reload();
  };

  const checkUser = async () => {
    const link = server + "user_info";
    const response = await fetch(link, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    });
    const data = await response.json();
    if (data.msg === "Token has expired") {
      tokenRefresh();
    }
    if (response.ok) {
      set_logged_in(true);
      console.log("my logged in " + logged_in);
      setUserData(data.user);
    }
    console.log("checkuseroiii");
    console.log(data);
  };

  const login = async (em, pass, nav) => {
    const log = {
      login: em,
      password: pass,
    };
    const loginError = document.getElementById("login_error");

    console.log(log);
    const link = server + "login";

    setLoginLoading(true);
    loginError.style.display = "none";
    const response = await fetch(link, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(log),
    });
    const data = await response.json();
    setLoginLoading(false);
    if (response.status === 200) {
      set_logged_in(true);
      setUserData(data.user);
      nav("/");
      loginError.style.display = "none";
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("refresh_token", data.refresh_token);
    } else {
      loginError.style.display = "block";
    }
    console.log(data);
    console.log(logged_in);
  };

  // 401 if not logged in
  // 403 if not admin

  const logout2 = async () => {
    const link = server + "logout2";
    const response = await fetch(link, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("refresh_token"),
      },
    });
    const data = await response.json();
    console.log(data);
  };

  const logout = async () => {
    const link = server + "logout";

    const response = await fetch(link, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    });
    window.location.reload();
    const data = await response.json();
    set_logged_in(false);
    setFavs([]);
    setUserData({});
    logout2();
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    console.log(data);
  };

  useEffect(() => {
    localStorage.getItem("access_token") && checkUser();
    localStorage.getItem("basket_title") && getBasket();
    localStorage.getItem("access_token") && fetchFavs();
    localStorage.getItem("access_token") && getOrders();
    if (!localStorage.getItem("basket_title")) {
      createBasket();
      console.log("craeted");
    }
    console.log(orders);
  }, [logged_in]);

  return (
    <Router>
      <UserContext.Provider
        value={{
          logged_in,
          lang,
          changeLang,
          set_logged_in,
          userData,
          logout,
          checkUser,
          getBasket,
          basket,
          deleteFromBasket,
          addToBasket,
          addToBasket2,
          cartSize,
          setCartSize,
          setFavs,
          favs,
          orders,
          basketProds,
          setBasketProds,
        }}
      >
        <div className="app">
          {/* <MessengerCustomerChat
            pageId="116684631043186"
            appId="940663426750156"
          /> */}
          <Routes>
            <Route path="/" element={<HomeEn userData={userData} />} />

            <Route
              path="/login"
              element={<LoginEn loading={LoginLoading} login={login} />}
            />
            <Route
              path="/register"
              element={<RegisterEn userData={userData} />}
            />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/cart/:id" element={<Cart />} />
            <Route path="/verify" element={<Verify />} />
            <Route path="/favourites/:id" element={<Favourites />} />
            <Route path={"/product/:id"} element={<ProductDetail />} />

            <Route
              path={"/kiushop/verify/:email/:token"}
              element={<Verify />}
            />
            <Route path="/order_success" element={<SuccessOrder />} />
            <Route path="/orders" exact element={<Orders />} />
            <Route path="/order/:order_id" element={<OrderCart />} />
          </Routes>
        </div>
      </UserContext.Provider>
    </Router>
  );
};

export default App;
