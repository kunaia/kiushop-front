import HomeEn from "./HomeEn";
import { Link, useNavigate } from "react-router-dom";
import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../UserContext";
import server from "./ServerURL";
import "./Login.css";

const LoginEn = ({ loading, login }) => {
  const [log, setLog] = useState("");
  const [password, setPassword] = useState("");
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
  return (
    <div className="login">
      <HomeEn />
      <Link style={{ cursor: "default" }} to="/">
        <div className="modal__bg"></div>
      </Link>
      <div className="login__modal">
        <h1>{lang === "ka" ? "ჩემი ანგარიში" : "My Account"}</h1>
        <form onSubmit={onSubmit}>
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
      </div>
    </div>
  );
};

export default LoginEn;
