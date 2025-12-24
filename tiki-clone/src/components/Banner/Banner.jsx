import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllCategories } from "../../store/categorySlice";
import "./Banner.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import HeroSlider from "../HeroSlider/HeroSlider";
import MiniCategories from "../MiniCategories/MiniCategories";
import TopDeals from "../TopDeals/TopDeals";
import FlashSale from "../FlashSale/FlashSale";
import FeaturedBrands from "../FeaturedBrands/FeaturedBrands";
import HotInternational from "../HotInternational/HotInternational";
import CategoryGrid from "../CategoryGrid/CategoryGrid";
import YouMayLike from "../YouMayLike/YouMayLike";
import SuggestedProducts from "../SuggestedProducts/SuggestedProducts";
import Footer from "../Footer/Footer";


const Banner = () => {
  const dispatch = useDispatch();
  const { categories, status } = useSelector((state) => state.category);

  useEffect(() => {
    if (categories.length === 0 && status === "idle") {
      dispatch(fetchAllCategories());
    }
  }, [dispatch, categories.length, status]);

  return (
    <div className="banner-row">
      <div className="banner-container">
        <div className="banner-content">

          <div className="banner-left-categories">
            <div className="left-card">
              <h3 className="card-title">Danh mục</h3>
              <ul className="category-list-small">
                {status === "pending" && categories.length === 0 ? (
                  <li style={{ padding: "10px", color: "#888" }}>Đang tải...</li>
                ) : (
                  categories.map((category) => (
                    <li key={category.id}>
                      <Link to={`/category/${category.id}`}>
                        {/* <img src={category.image} alt={category.name}  /> */}
                        <img src= {category.image ||"https://salt.tikicdn.com/cache/100x100/ts/category/ed/20/60/afa9b3b474bf7ad70f10dd6443211d5f.png.webp"} alt={category.name}/>
                        <span>{category.name}</span>
                      </Link>
                    </li>
                  ))
                )}
                
                {/* Fallback nếu không có danh mục nào từ API */}
                {!categories.length && status !== "pending" && (
                  <li style={{ padding: "10px", color: "#888" }}>Không có danh mục</li>
                )}
              </ul>
            </div>

            <div className="left-card small">
              <h4 className="card-title">Tiện ích</h4>
              <ul className="utility-list">
                <li>
                  <img
                    src="https://salt.tikicdn.com/cache/100x100/ts/upload/1e/27/a7/e2c0e40b6dc45a3b5b0a8e59e2536f23.png.webp"
                    alt="Ưu đãi thẻ"
                  />
                  <span>Ưu đãi thẻ, ví</span>
                </li>
                <li>
                  <img
                    src="https://salt.tikicdn.com/cache/100x100/ts/upload/4d/a3/cb/c86b6e4f17138195c026437458029d67.png.webp"
                    alt="Đóng tiền"
                  />
                  <span>Đóng tiền, nạp thẻ</span>
                </li>
                <li>
                  <img
                    src="https://salt.tikicdn.com/cache/100x100/ts/tmp/6f/4e/41/93f72f323d5b42207ab851dfa39d44fb.png.webp"
                    alt="Mua trước"
                  />
                  <span>Mua trước trả sau</span>
                </li>
              </ul>
            </div>

            <div className="left-card small seller-card">
              <div className="seller-container">
                <a href="/ban-hang-cung-tiki" className="seller-link">
                  <img
                    src="https://salt.tikicdn.com/cache/100x100/ts/upload/08/2f/14/fd9d34a8f9c4a76902649d04ccd9bbc5.png.webp"
                    alt="bán hàng"
                  />
                  <span>Bán hàng cùng Tiki</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="banner-center-hero">
          <div className="hero-area">
            {/* Hero slider block (separate white card) */}
            <div className="hero-slider-card">
              <HeroSlider height={360} />
            </div>

            {/* Mini categories block (separate white card below slider) */}
            <div className="mini-categories-container">
              <MiniCategories />
            </div>

            {/* TopDeals Section */}
            <div className="top-deals-container">
              <TopDeals />
            </div>

            {/* FlashSale Section */}
            <div className="flash-sale-container">
              <FlashSale />
            </div>

            {/* FeaturedBrands Section */}
            <div className="featured-brands-container">
              <FeaturedBrands />
            </div>

            {/* HotInternational Section */}
            <div className="hot-international-container">
              <HotInternational />
            </div>

            {/* CategoryGrid Section */}
            <div className="category-grid-container">
              <CategoryGrid />
            </div>

            {/* YouMayLike Section */}
            <div className="you-may-like-container">
              <YouMayLike />
            </div>

            {/* SuggestedProducts Section */}
            <div className="suggested-products-container">
              <SuggestedProducts />
            </div>

            {/* Footer Section */}
            <div className="footer-container">
              <Footer />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
