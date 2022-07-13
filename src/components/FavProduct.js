import "./FavProduct.css";
import { useContext } from "react";
import { UserContext } from "../UserContext";
import server from "./ServerURL";
import { Link } from "react-router-dom";

const FavProduct = ({ prod }) => {
  const { favs, setFavs } = useContext(UserContext);

  const remove = async () => {
    const link = server + "favorites";
    const res = await fetch(link, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
      body: JSON.stringify({
        product_id: prod.id,
      }),
    });
    const data = await res.json();
    console.log(data);
    setFavs(favs.filter((p) => p.id !== prod.id));
  };

  return (
    <div className="favproduct">
      <div className="fav__image__container">
        <img className="fav__image" src={prod.images[0].img_url} />
        <div className="bg">
          <Link to={"/product/" + prod.id} className="text-link">
            <div className="view">View Plant</div>
          </Link>
        </div>
      </div>
      <div className="fav__info">
        <p style={{ fontSize: "22px" }}>
          {localStorage.getItem("lang") === "ka"
            ? prod.title_ge
            : prod.title_en}
        </p>
        <p style={{ fontWeight: "600" }}>${prod.price?.toFixed(2)}</p>
        <div className="fav__remove" onClick={remove}>
          <p>REMOVE</p>
        </div>
      </div>
    </div>
  );
};

export default FavProduct;
