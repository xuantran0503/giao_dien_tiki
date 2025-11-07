import React, { useState } from "react";
import { Link } from "react-router-dom";
// import { FaStar } from "react-icons/fa";
import { topDealsData } from "../../data/topDealsData";
import { PrevArrow, NextArrow } from "../shared/NavigationArrows";
import { calculateDiscountedPrice, formatPrice } from "../../utils/priceUtils";
import "../shared/NavigationArrows.css";
import "./TopDeals.css";

const TopDeals = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [direction, setDirection] = useState('next');


  const itemsPerPage = 6;
  const totalPages = Math.ceil(topDealsData.length / itemsPerPage);
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const deals = topDealsData.slice(startIndex, endIndex);

  const handlePrev = () => {
    setDirection('prev');
    setCurrentPage((prev) => (prev > 0 ? prev - 1 : totalPages - 1));
  };

  const handleNext = () => {
    setDirection('next');
    setCurrentPage((prev) => (prev < totalPages - 1 ? prev + 1 : 0));
  };

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
    <div className="top-deals has-navigation">
      <div className="deals-header">
        <div className="header-left">
          <img src="../img_top_deal_sieu_re.png" alt="top deal siêu rẻ" />
        </div>
        <Link to="/top-deals" className="view-all">
          Xem tất cả
        </Link>
      </div>

      <div className="deals-grid-wrapper" style={{ position: 'relative' }}>
        <PrevArrow onClick={handlePrev} />
        <div className={`deals-grid slide-${direction}`} key={currentPage}>
          {deals.map((deal) => (
            <Link to={`/product/${deal.id}`} key={deal.id} className="deal-card">

              <div className="deal-image-wrapper">
                <img src={deal.image} alt={deal.title} className="deal-image" />

                <span className="discount-tag">{deal.date}</span>

                {deal.imageBadges && (
                  <img src={deal.imageBadges} alt="Badge" className="mini-badge" />
                )}

              </div>

              <div className="deal-info">
                <h3 className="deal-title">{deal.title}</h3>

                <div className="rating">
                  <div className="stars">
                    {renderStars(deal.rating)}
                  </div>
                </div>

                <div className="price-section">

                  <div className="price-row">
                    <span className={`current-price ${!deal.discount || !deal.originalPrice ? 'no-discount' : ''}`}>
                      {formatPrice(calculateDiscountedPrice(deal.originalPrice, deal.discount))}<sup>₫</sup>
                    </span>
                  </div>

                  {deal.discount && deal.originalPrice && (
                    <div className="discount-row">
                      <span className="discount-percent">-{deal.discount}%</span>
                      <span className="original-price">{formatPrice(deal.originalPrice)}<sup>₫</sup></span>
                    </div>
                  )}
                </div>

                {deal.madeIn && (
                  <div className="made-in">{deal.madeIn}</div>
                )}


                <div className="deal-bottom-badges">
                  <div className="divider"></div>
                  <div className="badge-row">
                    {deal.badge && (
                      <img src="../img_giao_ngay.png" alt="now" />
                    )}
                    {deal.shippingBadge && (
                      <span className="shipping-info">{deal.shippingBadge}</span>
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

export default TopDeals;
