import { useLocation, useParams } from "react-router-dom";
import { useEffect } from "react";
import server from "./ServerURL";
import "./Verify.css";
import { useState } from "react";
import validVector from "../images/vector.png";
import invalidVector from "../images/vector404.png";
import { Link } from "react-router-dom";

const Verify = () => {
  const { user_id, token } = useParams();
  const [header, setHeader] = useState("");
  const [message, setMessage] = useState("Happy shoping");
  const [vector, setVector] = useState(validVector);
  const sendData = async () => {
    const log = {
      user_id: user_id,
      verification_code: token,
    };
    const link = server + "verify";
    const response = await fetch(link, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(log),
    });
    const data = await response.json();
    console.log(data);
    console.log(response.status);
    if (response.status === 400) {
      setHeader("Email already verified");
    } else if (response.status == 200) {
      setHeader("Your email has been verified");
    } else {
      setHeader("Looks like your request has failed");
      setMessage(
        "The link you are trying to access is no longer valid, so please request a new one"
      );
      setVector(invalidVector);
    }
  };

  useEffect(() => {
    sendData();
  }, []);

  return (
    <div className="veirfy">
      <img src={vector} class="vector" />
      <div className="textBox">
        <h1>{header}</h1>
        <p>{message}</p>
        <Link to="/">
          <div className="button">
            <div className="buttFront">GET BACK TO HOME PAGE</div>
            <div className="buttonBack"></div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Verify; //this is comment
