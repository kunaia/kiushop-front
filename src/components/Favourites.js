import "./Favourites.css";
import { useState, useEffect, useContext } from "react";
import { UserContext } from "../UserContext";
import Header from "./Header";
import server from "./ServerURL";
import FooterEn from "./FooterEn";
import FavProduct from "./FavProduct";

const Favourites = () => {
  const { favs, setFavs } = useContext(UserContext);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div>
      <Header />
      <div className="favourites">
        <h1>Favorite Product</h1>
        {favs?.map((p) => (
          <FavProduct key={p.id} prod={p} />
        ))}
      </div>
      <FooterEn />
    </div>
  );
};

export default Favourites;
