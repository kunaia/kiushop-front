import { Link, useNavigate } from "react-router-dom";
import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { UserContext } from "../UserContext";
import server from "./ServerURL";
import "./Login.css";

export default function ResetPass() {
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [loading, setLoading] = useState(false);
  const { lang } = useContext(UserContext);
  const { user_id, password_reset_token } = useParams();

  const onSubmit = async function (e) {
    e.preventDefault();
    const link = server + "reset_password";
    const match_err = document.querySelector(".match_error");
    const subm = document.getElementById("login__submit");
    const in1 = document.querySelector("input")[0];
    const in2 = document.querySelector("input")[1];
    const suc = document.getElementById("reset_success");
    if (password1 === password2) {
      match_err.style.display = "none";
      setLoading(true);
      const res = await fetch(link, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id,
          password_reset_token,
          new_password: password1,
        }),
      });
      setLoading(false);
      const data = await res.json();

      if (res.ok) {
        subm.style.display = "none";
        suc.innerText = data.message;
        suc.style.display = "block";
        document.getElementById("reset_btn").style.display = "block";
      } else {
      }

      console.log(data);
    } else {
      match_err.style.display = "block";
    }
  };

  return (
    <div>
      <div className="login__modal">
        <h1>{lang === "ka" ? "ჩემი ანგარიში" : "My Account"}</h1>
        <form onSubmit={onSubmit} id="login_form">
          <label>{lang === "ka" ? "ახალი პაროლი" : "NEW PASSWORD"}</label>
          <input
            value={password1}
            onChange={(e) => setPassword1(e.target.value)}
            type="password"
            required
          />
          <label>
            {lang === "ka" ? "დაადასტურე პაროლი" : "CONFIRM PASSWORD"}
          </label>
          <input
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
            type="password"
            required
          />
          {loading && <div className="loading-spinner"></div>}
          <p
            id="reset_success"
            style={{
              display: "none",
              marginBottom: "30px",
              color: "green",
              fontSize: "12px",
            }}
            className="error_message"
          ></p>
          <p className="error error_message match_error">
            {lang === "ka" ? "პაროლები არ ემთხვევა" : "passwords doesn't match"}
          </p>
          <button
            id="login__submit"
            type="submit"
            style={{ marginBottom: "60px" }}
          >
            {lang === "ka" ? "პაროლის განახლება" : "RESET PASSWORD"}
          </button>
          <a href="/">
            <div style={{ display: "none" }} id="reset_btn">
              {lang === "ka" ? "მთავარ გვერდზე დაბრუნება" : "BACK TO HOMEPAGE"}
            </div>
          </a>
        </form>
      </div>
    </div>
  );
}
