import React from "react";
import { useParams, Link } from "react-router-dom";
import Header from "../components/Header/Header";
import "./TestPage.css";

const CategoryPage = () => {
  const { categoryName } = useParams();

  return (
    <div className="test-page">
      <Header />
      <div className="test-content">
        <h1>Trang Danh Mục</h1>
        <div className="test-info">
          <p className="category-name">Danh mục: <strong>{categoryName || "Tất cả"}</strong></p>
          <p className="test-description">
            Đây là trang hiển thị các sản phẩm theo danh mục được chọn.
          </p>
          <div className="test-features">
            <h3>Chức năng:</h3>
            <ul>
              <li>✓ Hiển thị danh sách sản phẩm theo danh mục</li>
              <li>✓ Lọc và sắp xếp sản phẩm</li>
              <li>✓ Phân trang sản phẩm</li>
              <li>✓ Xem chi tiết sản phẩm</li>
            </ul>
          </div>
          <Link to="/" className="back-home">← Quay về trang chủ</Link>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
