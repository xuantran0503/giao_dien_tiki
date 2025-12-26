import React from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header/Header";
import "./AboutPage.css";

const AboutPage = () => {
  return (
    <div className="about-page">
      <Header />
      <div className="about-content">
        <h1>Trang Giới Thiệu</h1>
        <div className="about-info">
          <p className="about-description">
            Đây là trang giới thiệu về Tiki và các dịch vụ.
          </p>
          <div className="about-features">
            <h3>Nội dung:</h3>
            <ul>
              <li>✓ Về Tiki</li>
              <li>✓ Giới thiệu Tiki</li>
              <li>✓ Tuyển dụng</li>
              <li>✓ Chính sách bảo mật</li>
              <li>✓ Điều khoản sử dụng</li>
            </ul>
          </div>
          <Link to="/" className="back-home">← Quay về trang chủ</Link>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;

