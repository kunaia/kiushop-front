import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { UserContext } from "../UserContext";
import Header from "./Header";
import "./OrderCart.css";

const OrderCart = () => {
  const { order_id } = useParams();
  const { orders } = useContext(UserContext);
  const [order, setOrder] = useState(
    orders.filter((ord) => ord.id == order_id)[0]
  );

  useEffect(() => {
    console.log(orders);
    console.log(orders.filter((ord) => ord.id == order_id));
    setOrder(orders.filter((ord) => ord.id == order_id)[0]);
    console.log(order);
  }, []);

  return (
    <div>
      <Header />
      <div className="ordercart">
        {order?.basket?.products.map((prod) => (
          <div className="order-cart-prod">
            <img alt="product" src={prod?.images[0]?.img_url} />
            <div className="order-prod-info">
              <p className="order-prod-name">{prod.title_en}</p>
              <p>${prod.price}</p>
              <p>Quantity: </p>
              <input
                type="number"
                className="amount"
                min="1"
                defaultValue={prod.quantity}
                disabled
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderCart;
