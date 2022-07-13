import "./CartProduct.css";
import { useState, useContext } from "react";
import { UserContext } from "../UserContext";
import { MdRemoveCircle } from "react-icons/md";
import server from "./ServerURL";

const CartProduct = ({
  img,
  name,
  price,
  amount,
  id,
  product,
  addToBasket,
}) => {
  const [am, setAm] = useState(amount);
  const [total, setTotal] = useState(product.total_cost * am);
  const { deleteFromBasket, addToBasket2 } = useContext(UserContext);

  return (
    <div className="CartProduct">
      <div className="cart_profile">
        <div style={{ position: "relative" }}>
          <img src={img} className="profileImg" alt="" />
          {product.discount !== 0 && (
            <div className="sale-pointer" style={{ top: "-15px" }}>
              -{product.discount}%
            </div>
          )}
        </div>
        <div className="profileInfo">
          <h2>{name}</h2>
          <p>${price}</p>
          <div className="remove" onClick={() => deleteFromBasket(id)}>
            <p id="rm_cart">REMOVE</p>
          </div>
        </div>
      </div>
      <input
        type="number"
        className="amount"
        min="1"
        defaultValue={amount}
        onChange={(e) => {
          addToBasket(id, product, e.target.value);
          setTotal(total * e.target.value);
        }}
      />
      <p className="total">${product.total_cost}</p>
    </div>
  );
};

export default CartProduct;
