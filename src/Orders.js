import React, { useState, useEffect, useContext } from "react";
import { MdPermDeviceInformation } from "react-icons/md";
import { Link } from "react-router-dom";
import Header from "./components/Header";
import server from "./components/ServerURL";
import "./Orders.css";
import { UserContext } from "./UserContext";

export default function Orders() {
  const { orders } = useContext(UserContext);
  // const [orders, setOrders] = useState([]);

  // const getOrders = async () => {
  //   const link = server + "orders";
  //   const res = await fetch(link, {
  //     method: "GET",
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: "Bearer " + localStorage.getItem("access_token"),
  //     },
  //   });
  //   const data = await res.json();
  //   setOrders(data.orders);
  //   console.log(data);
  // };

  const date = (order) => {
    const d = new Date(order.date);
    return `${d.getDate()}/${d.getMonth()}/${d.getFullYear()}`;
  };

  // useEffect(() => {
  //   getOrders();
  // }, []);

  return (
    <div>
      <Header />
      <div className="orders">
        <div className="order-list">
          {orders?.map((order) => (
            <div className="order">
              <div className="order-item">
                <div className="order-item-name">Order id</div>
                <div className="order-item-value">{order.id}</div>
              </div>
              <div className="order-item">
                <div className="order-item-name">Order date</div>
                <div className="order-item-value">{date(order)}</div>
              </div>
              <div className="order-item">
                <div className="order-item-name">Order address</div>
                <div className="order-item-value">
                  {order.address.city}, {order.address.address}
                </div>
              </div>
              <div className="order-item">
                <div className="order-item-name">Order status</div>
                <div className="order-item-value">
                  {localStorage.getItem("lang") === "ka"
                    ? order.status.description_ge
                    : order.status.description_en}
                </div>
              </div>
              <div className="order-item">
                <div className="order-item-name">Subtotal</div>
                <div className="order-item-value">
                  ${order.basket.total_cost}
                </div>
              </div>
              <div className="order-item">
                <Link
                  className="order-item-value order-det text-link"
                  to={"/order/" + order.id}
                >
                  <div className="">View Order Details</div>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
