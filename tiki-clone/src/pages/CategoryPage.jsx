import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchChildCategories, fetchAllCategories } from "../store/categorySlice";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import "./ProductDetailPage.css"; // Tạm thời dùng style chung

const CategoryPage = () => {
  const { categoryId } = useParams();
  const dispatch = useDispatch();

  const childCategories = useSelector((state) => state.category.childCategories);
  const currentCategory = useSelector((state) => state.category.currentCategory);
  const { categories, status, chilldCategoryStatus } = useSelector((state) => state.category);

  useEffect(() => {
    // Tải danh sách danh mục gốc nếu chưa có
    if (categories.length === 0 && status === "idle") {
      dispatch(fetchAllCategories());
    }
  }, [dispatch, categories.length, status]);

  useEffect(() => {
    if (categoryId) {
      dispatch(fetchChildCategories(categoryId));
    }
  }, [dispatch, categoryId]);

  // Loading state
  const isLoading = chilldCategoryStatus === "pending";

  return (
    <div className="product-detail-page">
      <Header />
      
      <div className="breadcrumb-container" style={{ padding: "15px 0" }}>
        <div className="breadcrumb">
          <Link to="/">Trang chủ</Link>
          <span className="separator">{">"}</span>
          <span className="current">{currentCategory?.name }</span>
        </div>
      </div>

      <div className="product-detail-container" style={{ minHeight: "60vh", background: "white", borderRadius: "8px", padding: "20px" }}>
        <h1 style={{ fontSize: "24px", marginBottom: "20px" }}>
          {currentCategory?.name }
        </h1>

        {isLoading ? (
          <div style={{ textAlign: "center", padding: "40px" }}>
            <p>Đang tải danh mục...</p>
          </div>
        ) : childCategories.length > 0 ? (
          <div className="subcategory-list" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: "20px" }}>
            {childCategories.map((child) => (
              <Link 
                key={child.id} 
                to={`/category/${child.id}`}
                style={{ textDecoration: "none", color: "inherit", textAlign: "center" }}
              >
                <div style={{ background: "#f5f5fa", borderRadius: "8px", padding: "15px", marginBottom: "10px" }}>
                  <img 
                    // src={child.image} 
                    src={child.image || "https://salt.tikicdn.com/cache/100x100/ts/category/ed/20/60/afa9b3b474bf7ad70f10dd6443211d5f.png.webp"}
                    alt={child.name} 
                    style={{ width: "100%", height: "auto", borderRadius: "4px" }} 
                    
                  />
                </div>
                <span style={{ fontSize: "14px", fontWeight: "500" }}>{child.name}</span>
              </Link>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "40px", color: "#666" }}>
            <p>Không có danh mục con hoặc sản phẩm nào được tìm thấy.</p>
            <Link to="/" style={{ color: "#0b74e5", marginTop: "10px", display: "inline-block" }}>Quay về trang chủ</Link>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default CategoryPage;
