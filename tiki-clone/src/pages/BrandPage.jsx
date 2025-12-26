import React from "react";
import { useParams, Link } from "react-router-dom";
import Header from "../components/Header/Header";
import "./BrandPage.css";

const BrandPage = () => {
  const { brandId } = useParams();

  return (
    <div className="brand-page">
      <Header />
      <div className="brand-content">
        <h1>Trang Thương Hiệu</h1>
        <div className="brand-info">
          <p className="brand-id">Mã thương hiệu: <strong>#{brandId}</strong></p>
          <p className="brand-description">
            Đây là trang hiển thị tất cả sản phẩm của thương hiệu.
          </p>
          <div className="brand-features">
            <h3>Chức năng:</h3>
            <ul>
              <li>✓ Hiển thị thông tin thương hiệu</li>
              <li>✓ Danh sách sản phẩm</li>
              <li>✓ Lọc và sắp xếp</li>
              <li>✓ Xem chi tiết sản phẩm</li>
            </ul>
          </div>
          <Link to="/" className="back-home">← Quay về trang chủ</Link>
        </div>
      </div>
    </div>
  );
};

export default BrandPage;

