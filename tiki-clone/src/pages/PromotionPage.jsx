import React from "react";
import { useParams, Link } from "react-router-dom";
import Header from "../components/Header/Header";
import "./PromotionPage.css";

const PromotionPage = () => {
  const { promoType } = useParams();

  return (
    <div className="promotion-page">
      <Header />
      <div className="promotion-content">
        <h1>Trang Khuyến Mãi</h1>
        <div className="promotion-info">
          <p className="promo-type">Loại khuyến mãi: <strong>{promoType || "Tất cả"}</strong></p>
          <p className="promotion-description">
            Đây là trang hiển thị các chương trình khuyến mãi đặc biệt.
          </p>
          <div className="promotion-features">
            <h3>Chức năng:</h3>
            <ul>
              <li>✓ Hiển thị sản phẩm khuyến mãi</li>
              <li>✓ Lọc theo mức giảm giá</li>
              <li>✓ Sắp xếp theo giá</li>
              <li>✓ Thêm vào giỏ hàng</li>
            </ul>
          </div>
          <Link to="/" className="back-home">← Quay về trang chủ</Link>
        </div>
      </div>
    </div>
  );
};

export default PromotionPage;

