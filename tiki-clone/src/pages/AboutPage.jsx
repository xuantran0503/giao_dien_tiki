import React from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header/Header";
import "./TestPage.css";

const AboutPage = () => {
  return (
    <div className="test-page">
      <Header />
      <div className="test-content">
        <h1>Trang Giới Thiệu</h1>
        <div className="test-info">
          <p className="test-description">
            Đây là trang giới thiệu về Tiki và các dịch vụ.
          </p>
          <div className="test-features">
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
