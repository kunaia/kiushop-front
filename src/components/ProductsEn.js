import "./Products.css";
import "./Carousel.css";
import { useState, useEffect } from "react";
import { useContext } from "react";
import { UserContext } from "../UserContext";
import Product from "./Product";
import { BiPlusCircle } from "react-icons/bi";
import AddProduct from "./AddProduct";
import server from "./ServerURL.js";

const ProductsEn = () => {
  const [type, setType] = useState("all");
  const [showAdd, setShowAdd] = useState(false);
  const [data, setData] = useState([]);
  const [basket, setBasket] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const { userData, logged_in, lang, checkUser, set_logged_in, authorized } =
    useContext(UserContext);

  const toggleShowAdd = () => {
    setShowAdd(!showAdd);
  };

  const changeVisibility = async (id) => {
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

  const getData = async () => {
    const link = server + "products/page/1";
    localStorage.getItem("access_token") && checkUser();
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
    const result = await response.json();
    setLoaded(true);
    setData(result.products);
    console.log(result.products);
    console.log("is logged in from product" + logged_in);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="products">
      {showAdd && (
        <AddProduct method="POST" prod_id=" " toggleShowAdd={toggleShowAdd} />
      )}
      <div className="prod__types">
        <div
          onClick={() => setType("new")}
          className={
            type === "new" ? "prod__type prod-type-selected" : "prod__type"
          }
        >
          {lang === "ka" ? "ახალი პროდუქტი" : "New Products"}
        </div>
        <div
          onClick={() => setType("featured")}
          className={
            type === "featured" ? "prod__type prod-type-selected" : "prod__type"
          }
        >
          {lang === "ka" ? "გამორჩეული პროდუქტი" : "Featured Products"}
        </div>
        <div
          onClick={() => setType("all")}
          className={
            type === "all" ? "prod__type prod-type-selected" : "prod__type"
          }
        >
          {lang === "ka" ? "ყველა პროდუქტი" : "All Products"}
        </div>
      </div>
      <div className="products__inner">
        <div className={"products__list__all"}>
          {loaded && userData.permission === "admin" && logged_in && (
            <div
              onClick={() => {
                toggleShowAdd();
                window.scrollTo(0, 0);
              }}
              className="addProduct"
            >
              <BiPlusCircle className="addIcon" size={100} />
            </div>
          )}
          {/* {
                        products.map((prod) => (type === prod.type || type === "all") && (
                            <Product key={products.indexOf(prod)} id={prod.id} sale={prod.sale} image={prod.image} name={prod.name} price={prod.price}/>
                        ))
                    } */}
          {data.map(
            (prod) =>
              ((prod.featured == true && type === "featured") ||
                (prod.featured == false && type !== "featured") ||
                type === "all") && (
                <Product
                  key={data.indexOf(prod)}
                  isadmin={userData.permission === "admin"}
                  lang="en"
                  self={prod}
                  isvisible={prod.is_visible}
                  id={prod.id}
                  sale={prod.discount}
                  name={lang === "ka" ? prod.title_ge : prod.title_en}
                  price={prod.price}
                  img={
                    prod.images.filter((e) => e.main)[0]
                      ? prod.images.filter((e) => e.main)[0].img_url
                      : ""
                  }
                />
              )
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsEn;
