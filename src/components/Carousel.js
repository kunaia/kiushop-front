import carousel1 from "../images/carousel1.png";
import carousel2 from "../images/carousel2.png";
import carousel3 from "../images/carousel3.png";
import "./Carousel.css";
import { useState, useEffect } from "react";

const Carousel = () => {
  const [counter, setCounter] = useState(1);
  const [seconds, setSeconds] = useState(0);

  const next = () => {
    const size = document.querySelector(".carousel__image").clientWidth;
    const slide = document.querySelector(".carousel__slide");
    slide.style.transform = "translateX(" + -size * counter + "px)";
    setCounter(counter + 1);
  };

  const prev = () => {
    const size = document.querySelector(".carousel__image").clientWidth;
    const slide = document.querySelector(".carousel__slide");
    slide.style.transform = "translateX(" + -size * (counter - 2) + "px)";
    slide.classList.add("slided");
    setCounter(counter - 1);
  };

  const prev2 = () => {
    const size = document.querySelector(".carousel__image").clientWidth;
    const slide = document.querySelector(".carousel__slide");
    slide.style.transform = "translateX(" + -size * 2 * (counter - 3) + "px)";
    slide.classList.add("slided");
    setCounter(counter - 2);
  };

  const next2 = () => {
    const size = document.querySelector(".carousel__image").clientWidth;
    const slide = document.querySelector(".carousel__slide");
    slide.style.transform = "translateX(" + -size * 2 * counter + "px)";
    slide.classList.add("slided");
    setCounter(counter + 2);
  };

  useEffect(() => {
    let interval = setInterval(() => {
      setSeconds(seconds + 1);
      const slide = document.querySelector(".carousel__slide");
      if (seconds === 3) {
        next();
        setSeconds(0);
      }
      if (counter === 4) {
        const size = document.querySelector(".carousel__image").clientWidth;
        slide.style.transition = "none";
        slide.style.transform = "translateX(" + -3 * size + "px)";
        setCounter(0);
      }

      if (counter === 1) {
        slide.style.transition = "transform 0.6s ease-in-out";
      }
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [seconds]);

  return (
    <div>
      <div className="carousel__container">
        <h1 id="carousel__logo">KIUSoft</h1>
        <div className="shopnow">
          <div className="shopnow__outer">Shop now</div>
          <div className="shopnow__inner"></div>
        </div>
        <div className="dots">
          <div
            onClick={() => {
              if (counter === 2) {
                prev();
              }
              if (counter === 3) {
                prev2();
              }
            }}
            className={
              counter === 1 || counter == 0 ? "dot dot__selected" : "dot"
            }
          ></div>
          <div
            onClick={() => {
              if (counter === 1) {
                next();
              }
              if (counter === 3) {
                prev();
              }
            }}
            className={counter === 2 ? "dot dot__selected" : "dot"}
          ></div>
          <div
            onClick={() => {
              if (counter === 2) {
                next();
              }
              if (counter === 1) {
                next2();
              }
            }}
            className={counter === 3 ? "dot dot__selected" : "dot"}
          ></div>
        </div>
        <div className="carousel__slide">
          <img className="carousel__image" src={carousel1} alt="carousel" />
          <img className="carousel__image" src={carousel2} alt="carousel" />
          <img className="carousel__image" src={carousel3} alt="carousel" />
          <img
            className="carousel__image"
            id="firstCopy"
            src={carousel1}
            alt="carousel"
          />
        </div>
      </div>
    </div>
  );
};

export default Carousel;
