import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchChildCategories, fetchAllCategories } from "../store/categorySlice";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import "./CategoryPage.css"; 

const CategoryPage = () => {
  const { categoryId } = useParams();
  const dispatch = useDispatch();

  const childCategories = useSelector((state) => state.category.childCategories);
  const currentCategory = useSelector((state) => state.category.currentCategory);
  const { categories, status, chilldCategoryStatus } = useSelector((state) => state.category);

  useEffect(() => {
    if (categories.length === 0 && status === "idle") {
      dispatch(fetchAllCategories());
    }
  }, [dispatch, categories.length, status]);

  // Tải danh mục con khi categoryId thay đổi
  useEffect(() => {
    if (categoryId) {
      dispatch(fetchChildCategories(categoryId));
    }
  }, [dispatch, categoryId]);
  
  const isLoading = chilldCategoryStatus === "pending";

  return (
    <div className="category-page">
      <Header />
      
      <div className="category-breadcrumb-container">
        <div className="category-breadcrumb">
          <Link to="/">Trang chủ</Link>
          <span className="separator">{">"}</span>
          <span className="current">{currentCategory?.name || "Danh mục"}</span>
        </div>
      </div>

      <div className="category-content-container">
        <h1 className="category-title">
          {currentCategory?.name || "Danh mục"}
        </h1>

        {isLoading ? (
          <div className="category-loading">
            <p>Đang tải danh mục...</p>
          </div>
        ) : childCategories.length > 0 ? (
          <div className="subcategory-list">
            {childCategories.map((child) => (
              <Link 
                key={child.id} 
                to={`/category/${child.id}`}
                className="subcategory-item"
              >
                <div className="subcategory-image-wrapper">
                  <img 
                    
                    src={child.image || "https://salt.tikicdn.com/cache/100x100/ts/category/ed/20/60/afa9b3b474bf7ad70f10dd6443211d5f.png.webp"}
                    alt={child.name} 
                    className="subcategory-image" 
                    
                  />
                </div>
                <span className="subcategory-name">{child.name}</span>
              </Link>
            ))}
          </div>
        ) : (
          <div className="category-empty-state">
            <p>Không có danh mục con hoặc sản phẩm nào được tìm thấy.</p>
            <Link to="/" className="category-back-link">Quay về trang chủ</Link>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default CategoryPage;
