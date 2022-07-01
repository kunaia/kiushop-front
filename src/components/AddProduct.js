import "./AddProduct.css";
import { useState, useEffect } from "react";
import server from "./ServerURL";

const AddProduct = ({ toggleShowAdd, method, info }) => {
  const [title_en, set_title_en] = useState(info?.title_en);
  const [title_ge, set_title_ge] = useState(info?.title_ge);
  const [price, set_price] = useState(info?.price);
  const [amount, set_amount] = useState(info?.amount);
  const [color, set_color] = useState(info?.color);
  const [size, set_size] = useState("");
  const [desc_en, set_desc_en] = useState(info?.description_en);
  const [desc_ge, set_desc_ge] = useState(info?.description_ge);
  const [discount, set_discount] = useState(info?.discount);
  const [featured, set_featured] = useState(false);
  const [dropped, set_dropped] = useState(false);
  const [categories, set_categories] = useState([]);
  const [category_name_en, set_category_name_en] = useState("");
  const [category_name_ge, set_category_name_ge] = useState("");
  const [selected_category, set_selected_category] = useState(null);

  const addProduct = async () => {
    const link =
      method === "PUT"
        ? server + "product/" + info.prod_id
        : server + "product";
    const product = {
      tag_fk: selected_category !== null ? selected_category.id : 1,
      title_en: title_en,
      title_ge: title_ge,
      discount: discount,
      price: price,
      size: size,
      amount: amount,
      color: color,
      description_en: desc_en,
      description_ge: desc_ge,
      featured: featured,
    };
    info?.setProduct(product);
    const response = await fetch(link, {
      method: method,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
      body: JSON.stringify(product),
    });
    const data = await response.json();
    console.log(data);
  };

  const createCategory = async () => {
    const link = server + "create_tag";
    const send_data = {
      name_en: category_name_en,
      name_ge: category_name_ge,
    };
    const err = document.getElementById("category_error");
    if (category_name_en.length !== 0 && category_name_ge.length !== 0) {
      const response = await fetch(link, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("access_token"),
        },
        body: JSON.stringify(send_data),
      });
      const data = await response.json();
      console.log(data);
      set_categories([
        ...categories,
        {
          id: data.tag.id,
          name_en: category_name_en,
          name_ge: category_name_ge,
        },
      ]);
      err.style.display = "none";
    } else {
      err.style.display = "block";
    }
  };

  const deleteCategory = async (id) => {
    const link = server + "remove_tag/" + id;
    const response = await fetch(link, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    });
    const result = await response.json();
    console.log(result);
  };

  const getCategories = async () => {
    const link = server + "all_tags";
    const response = await fetch(link, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("access_token"),
      },
    });
    const data = await response.json();
    set_categories(data.tags);
    console.log(data);
  };

  const submit = (e) => {
    e.preventDefault();
    toggleShowAdd();
    addProduct();
  };

  const modalStyle = {
    transform: "translate(-50%, 0%)",
  };

  useEffect(() => {
    getCategories();
  }, []);

  return (
    <div className="addproduct">
      <div onClick={toggleShowAdd} className="modal__bg"></div>
      <div
        className="addproduct_modal"
        style={method === "PUT" ? modalStyle : {}}
      >
        <h1>{method === "PUT" ? "Edit Product Data" : "Enter Product Data"}</h1>
        <form onSubmit={submit}>
          <label>*title in English</label>
          <input
            type="text"
            value={title_en}
            placeholder="title"
            required
            onChange={(e) => set_title_en(e.target.value)}
          />

          <label>*title in Georgian</label>
          <input
            type="text"
            value={title_ge}
            placeholder="სახელი"
            required
            onChange={(e) => set_title_ge(e.target.value)}
          />

          <label>*Price in dollars</label>
          <input
            type="text"
            value={price}
            placeholder="price"
            required
            onChange={(e) => set_price(e.target.value)}
          />

          <label>*Amount in stock</label>
          <input
            type="text"
            placeholder="amount"
            value={amount}
            required
            onChange={(e) => set_amount(e.target.value)}
          />

          <label>Discount</label>
          <input
            type="text"
            value={discount}
            placeholder="percentage"
            onChange={(e) => set_discount(e.target.value)}
          />

          <label>Color</label>
          <input
            type="text"
            placeholder="color"
            onChange={(e) => set_color(e.target.value)}
          />

          <label>size</label>
          <select onChange={(e) => {set_size(e.target.value);alert(e.target.value)}}>
                                        <option value="default" onChange={(e) => set_size(e.target.value)}>default</option>
                                        <option value="small" onChange={(e) => set_size(e.target.value)}>small</option>
                                        <option value="medium" onChange={(e) => set_size(e.target.value)}>medium</option>
                                        <option value="large" onChange={(e) => set_size(e.target.value)}>large</option>
                    </select>

          <label>Descritpion in English</label>
          <input
            type="text"
            value={desc_en}
            placeholder="description"
            onChange={(e) => set_desc_en(e.target.value)}
          />

          <label>Description in Georgian</label>
          <input
            type="text"
            placeholder="აღწერა"
            value={desc_ge}
            onChange={(e) => set_desc_ge(e.target.value)}
          />

          {method === "POST" && (
            <div>
              <label>Choose Category</label>
              <div
                onClick={() => set_dropped(!dropped)}
                className="category d-flex space-between"
              >
                <label>{selected_category && selected_category.name_en}</label>
                <span
                  style={{
                    transform: dropped ? "rotate(270deg)" : "rotate(90deg)",
                    transition: "0.8s",
                  }}
                >
                  &#9758;
                </span>
              </div>
              {dropped && (
                <ul className="category__dropdown">
                  <div className="category__input">
                    <input
                      type="text"
                      required
                      className="category__field"
                      placeholder="English"
                      onChange={(e) => set_category_name_en(e.target.value)}
                    />
                    <input
                      type="text"
                      required
                      className="category__field"
                      placeholder="ქართული"
                      onChange={(e) => set_category_name_ge(e.target.value)}
                    />
                    <p id="category_error">*fill out both fields</p>
                    <div className="add-cat" onClick={createCategory}>
                      add
                    </div>
                  </div>
                  {categories.map((e) => (
                    <li key={e.id} onClick={() => set_selected_category(e)}>
                      {e.name_en}{" "}
                      <span
                        onClick={() => {
                          deleteCategory(e.id);
                          set_categories(
                            categories.filter((cat) => cat.id !== e.id)
                          );
                        }}
                      >
                        &#10006;
                      </span>
                    </li>
                  ))}
                </ul>
              )}

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "180px",
                }}
              >
                <input
                  type="checkbox"
                  name=""
                  id="featured"
                  onChange={(e) => set_featured(e.currentTarget.checked)}
                />
                <label>Check if featured</label>
              </div>
            </div>
          )}

          <button type="submit" id="addproduct_submit">
            Save
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
