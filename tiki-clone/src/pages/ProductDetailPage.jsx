import React from "react";
import { useParams, Link } from "react-router-dom";
import Header from "../components/Header/Header";
import "./TestPage.css";

const ProductDetailPage = () => {
  const { productId } = useParams();

  return (
    <div className="test-page">
      <Header />
      <div className="test-content">
        <h1>Trang Chi Tiết Sản Phẩm</h1>
        <div className="test-info">
          <p className="product-id">Mã sản phẩm: <strong>#{productId}</strong></p>
          <p className="test-description">
            Đây là trang hiển thị thông tin chi tiết của sản phẩm.
          </p>
          <div className="test-features">
            <h3>Thông tin hiển thị:</h3>
            <ul>
              <li>✓ Hình ảnh sản phẩm</li>
              <li>✓ Tên và mô tả chi tiết</li>
              <li>✓ Giá và khuyến mãi</li>
              <li>✓ Đánh giá và nhận xét</li>
              <li>✓ Thông tin vận chuyển</li>
              <li>✓ Sản phẩm tương tự</li>
            </ul>
          </div>
          <Link to="/" className="back-home">← Quay về trang chủ</Link>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
