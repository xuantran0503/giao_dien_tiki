import React from "react";
import { Link } from "react-router-dom";
import "./FloatingButtons.css";

const FloatingButtons = () => {
  return (
    <div className="floating-buttons">
      <div className="floating-buttons-container">
        <div className="floating-button-wrapper">
          <Link to="/support" className="floating-button tro-ly">
            <img
              src={process.env.PUBLIC_URL + "/img_troli.png"}
              alt="Trợ lý"
              className="button-icon"
            />
            <span className="button-text">Trợ lý</span>
          </Link>
        </div>

        <div className="button-separator"></div>

        <div className="floating-button-wrapper">
          <Link to="/notifications" className="floating-button tin-moi">
            <img
              src={process.env.PUBLIC_URL + "/img_tinnhan.png"}
              alt="Tin mới"
              className="button-icon"
            />
            <span className="button-text">Tin mới</span>
          </Link>
        </div>      </div>
    </div>
  );
};

export default FloatingButtons;
