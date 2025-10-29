import React from "react";
import { useParams, Link } from "react-router-dom";
import Header from "../components/Header/Header";
import "./TestPage.css";

const BrandPage = () => {
  const { brandId } = useParams();

  return (
    <div className="test-page">
      <Header />
      <div className="test-content">
        <h1>Trang Thương Hiệu</h1>
        <div className="test-info">
          <p className="brand-id">Mã thương hiệu: <strong>#{brandId}</strong></p>
          <p className="test-description">
            Đây là trang hiển thị tất cả sản phẩm của thương hiệu.
          </p>
          <div className="test-features">
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
