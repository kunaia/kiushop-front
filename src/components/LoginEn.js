import HomeEn from "./HomeEn";
import { Link, useNavigate } from "react-router-dom";
import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../UserContext";
import server from "./ServerURL";
import "./Login.css";

const LoginEn = ({ loading, login }) => {
  const [log, setLog] = useState("");
  const [password, setPassword] = useState("");
  const [reset_mail, set_reset_mail] = useState("");
  const [errorFlag, setErrorFlag] = useState(false);
  const { userData, logged_in, toggleLogged, lang } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();
    login(log, password, navigate);
  };

  const onForgot = function (e) {
    const frm = document.getElementById("login_form");
    const reset_form = document.querySelector(".reset-form");
    frm.style.display = "none";
    e.target.style.display = "none";
    reset_form.style.display = "inline-block";
  };

  const onSend = async function (e) {
    const email_inp = document.querySelector(".inp");
    const err = document.querySelector(".send_reset_error");
    const link = server + "reset_password";
    const res = await fetch(link, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email_inp.value,
      }),
    });
    const data = await res.json();

    if (res.ok) {
      email_inp.disabled = true;
      e.target.style.display = "none";
      err.innerText = data.message;
      err.style.display = "block";
      err.style.color = "green";
    } else {
      err.innerText = data.message;
      err.style.display = "block";
    }

    console.log(data);
  };

  return (
    <div className="login">
      <HomeEn />
      <Link style={{ cursor: "default" }} to="/">
        <div className="modal__bg"></div>
      </Link>
      <div className="login__modal">
        <h1>{lang === "ka" ? "ჩემი ანგარიში" : "My Account"}</h1>
        <form onSubmit={onSubmit} id="login_form">
          <label>
            {lang === "ka" ? "იუზერნეიმი ან ელ-ფოსტა" : "EMAIL OR USERNAME"}
          </label>
          <input
            value={log}
            onChange={(e) => setLog(e.target.value)}
            type="text"
            required
          />
          <label>{lang === "ka" ? "პაროლი" : "PASSWORD"}</label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            required
          />
          {loading && <div className="loading-spinner"></div>}
          <p
            id="login_error"
            style={{
              display: "none",
              marginBottom: "30px",
              color: "red",
              textAlign: "center",
              fontSize: "12px",
            }}
            className="error_message"
          >
            {lang === "ka"
              ? "*არასწორი პაროლი ან ელფოსტა"
              : "*Invalid credentials"}
          </p>
          <p>
            {lang === "ka" ? "ახალი მომხმარებელი?" : "New Customer?"}{" "}
            <span>
              <Link to="/register">
                {lang === "ka" ? "დარეგისტრირდი აქ" : "Register here"}
              </Link>
            </span>
          </p>
          <button id="login__submit" type="submit">
            {lang === "ka" ? "შესვლა" : "Login"}
          </button>
        </form>
        <p id="forgot" onClick={(e) => onForgot(e)}>
          Forgot password?
        </p>
        <div className="reset-form">
          <label>{lang === "ka" ? "ელ-ფოსტა" : "EMAIL"}</label>
          <input
            onChange={(e) => setLog(e.target.value)}
            type="email"
            required
            className="inp"
          />
          <p className="error send_reset_error">errirrr</p>
          <div id="reset_btn" onClick={onSend}>
            {lang === "ka" ? "გაგზავნა" : "Send"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginEn;
