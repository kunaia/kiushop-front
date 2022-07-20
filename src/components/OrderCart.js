import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { UserContext } from "../UserContext";
import Header from "./Header";
import "./OrderCart.css";
import server from "./ServerURL";

const OrderCart = () => {
  const { order_id } = useParams();
  const [order, setOrder] = useState([]);

  const getOrder = async () => {
    const link = server + "order/" + order_id;
    const response = await fetch(link, {
      method: "GET",
      headers: {
        Content_Type: "application/json",
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    });
    const data = await response.json();
    console.log("single order");
    console.log(data);
    setOrder(data.order);
  };

  const date = (order) => {
    const d = new Date(order?.date);
    return `${d.getDate()}/${d.getMonth()}/${d.getFullYear()}`;
  };

  useEffect(() => {
    //setOrder(orders.filter((ord) => ord.id == order_id)[0]);
    getOrder();
    console.log(order);
  }, []);

  return (
    <div>
      <Header />
      <div className="ordercart">
        <div className="cart-prods">
          {order?.basket?.products.map((prod) => (
            <div className="order-cart-prod" key={prod.id}>
              <img alt="product" src={prod?.images[0]?.img_url} />
              <div className="order-prod-info">
                <p className="order-prod-name">{prod.title_en}</p>
                <p>${prod.price?.toFixed(2)}</p>
                <p>Quantity: </p>
                <input
                  type="number"
                  className="amount"
                  min="1"
                  defaultValue={prod.quantity}
                  disabled
                />
                <div className="order-info-other">
                  <p>
                    {localStorage.getItem("lang") === "en"
                      ? prod.description_en
                      : prod.description_ge}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="order-info">
          <div className="order-info-item">
            <h2>Date:</h2>
            <h3>{date(order)}</h3>
          </div>
          <div className="order-info-item">
            <h2>Address:</h2>
            <h3>
              {order?.address?.city}, {order?.address?.address}
            </h3>
          </div>
          <div className="order-info-item">
            <h2>Status:</h2>
            <h3>{order?.status?.description_en}</h3>
          </div>
          {order?.user_comment?.length !== 0 && (
            <div className="order-info-item">
              <h2>User comment:</h2>
              <textarea value={order?.user_comment} disabled />
            </div>
          )}
          <div className="order-info-item">
            <h2>Subtotal:</h2>
            <h3>${order?.basket?.total_cost?.toFixed(2)}</h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderCart;
