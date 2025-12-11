import React from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header/Header";
import "./TestPage.css";

const FlashSalePage = () => {
  return (
    <div className="test-page">
      <Header />
      <div className="test-content">
        <h1>Trang Flash Sale</h1>
        <div className="test-info">
          <p className="test-description">
            Đây là trang hiển thị tất cả các sản phẩm Flash Sale đang diễn ra.
          </p>
          <div className="test-features">
            <h3>Chức năng:</h3>
            <ul>
              <li>✓ Hiển thị sản phẩm giảm giá sốc</li>
              <li>✓ Đếm ngược thời gian kết thúc</li>
              <li>✓ Hiển thị số lượng còn lại</li>
              <li>✓ Thêm vào giỏ hàng nhanh</li>
            </ul>
          </div>
          <Link to="/" className="back-home">← Quay về trang chủ</Link>
        </div>
      </div>
    </div>
  );
};

export default FlashSalePage;
