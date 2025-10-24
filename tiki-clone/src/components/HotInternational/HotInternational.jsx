import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import { PrevArrow, NextArrow } from "../shared/NavigationArrows";
import { hotInternationalData } from "../../data/hotInternationalData";
import { calculateDiscountedPrice, formatPrice } from "../../utils/priceUtils";
import "./HotInternational.css";
import "../shared/NavigationArrows.css";

const HotInternational = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [direction, setDirection] = useState('next');
  const itemsPerPage = 6;
  const totalPages = Math.ceil(hotInternationalData.length / itemsPerPage);

  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const products = hotInternationalData.slice(startIndex, endIndex);

  const handlePrev = () => {
    setDirection('prev');
    setCurrentPage((prev) => (prev > 0 ? prev - 1 : totalPages - 1));
  };

  const handleNext = () => {
    setDirection('next');
    setCurrentPage((prev) => (prev < totalPages - 1 ? prev + 1 : 0));
  };

  // const renderStars = (rating) => {
  //   return Array(5).fill(0).map((_, i) => (
  //     <FaStar
  //       key={i}
  //       className={`star ${i < Math.floor(rating) ? 'filled' : ''}`}
  //     />
  //   ));
  // };


  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i} className="star filled">★</span>);
    }
    if (hasHalfStar) {
      stars.push(<span key="half" className="star half">★</span>);
    }
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<span key={`empty-${i}`} className="star">★</span>);
    }
    return stars;
  };

  return (
    <div className="hot-international">

      <div className="hot-international-header">
        <h2 className="hot-international-title">Hàng ngoại giá hot</h2>
        <Link to="/international-products" className="view-all">
          Xem tất cả
        </Link>
      </div>

      <div className="hot-international-grid-wrapper">
        <PrevArrow onClick={handlePrev} />
        <div className={`hot-international-grid slide-${direction}`} key={currentPage}>
          {products.map((product) => (
            <Link to={`/product/${product.id}`} key={product.id} className="hot-product-card">
              <div className="hot-product-image">
                <img src={product.image} alt={product.title} />
              </div>

              <div className="hot-product-info">
                <h3 className="hot-product-title">{product.title}</h3>

                {product.rating && (
                  <div className="rating">
                    <div className="stars">
                      {renderStars(product.rating)}
                    </div>
                  </div>
                )}

                <div className="price-section">
                  <div className="price-row">
                    <span className={`current-price ${!product.discount || !product.originalPrice ? 'no-discount' : ''}`}>
                      {formatPrice(calculateDiscountedPrice(product.originalPrice, product.discount))}<sup>₫</sup>
                    </span>
                  </div>

                  {product.discount && product.originalPrice && (
                    <div className="discount-row">
                      <span className="discount-percent">-{product.discount}%</span>
                      <span className="original-price">{formatPrice(product.originalPrice)}<sup>₫</sup></span>
                    </div>
                  )}
                </div>


                <div className="hot-product-bottom-badges">
                  {product.madeIn && (
                    <div className="made-in">{product.madeIn}</div>
                  )}


                  <div className="divider"></div>
                  <div className="badge-row">
                    {product.badge === "NOW" && (
                      <img src="../img_giao_ngay.png" alt="now" />
                    )}
                    {product.badge === "DELIVERY" && (
                      <img src="../img_giao_chieu_mai.png" alt="delivery" />
                    )}
                    {product.shippingBadge && (
                      <span className="shipping-info">{product.shippingBadge}</span>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        <NextArrow onClick={handleNext} />
      </div>
    </div>
  );
};

export default HotInternational;
