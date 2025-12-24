import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
// import { FaStar } from "react-icons/fa";
// import { topDealsData } from "../../data/topDealsData";
import { fetchProductsByPage, setPageIndex } from "../../store/listingSlice";
import { PrevArrow, NextArrow } from "../shared/NavigationArrows";
import { calculateDiscountedPrice, formatPrice } from "../../utils/priceUtils";
import "../shared/NavigationArrows.css";
import "./TopDeals.css";

const TopDeals = () => {
  const dispatch = useDispatch();
  const { products, status, pageIndex } = useSelector((state) => state.listing);
  const [direction, setDirection] = useState('next');
  
  useEffect(() => {
    if (products.length === 0) {
      dispatch(fetchProductsByPage({ pageIndex: 1, pageSize: 18 }));
    }
  }, [dispatch, products.length]);

  const itemsPerPage = 6;
  const totalPages = Math.ceil(products.length / itemsPerPage);
  
  const startIndex = (pageIndex - 1) * itemsPerPage;
  const deals = products.slice(startIndex, startIndex + itemsPerPage);

  const handlePrev = () => {
    if (pageIndex > 1) {
      setDirection('prev');
      dispatch(setPageIndex(pageIndex - 1)); 
    }
  };

  const handleNext = () => {
    if (pageIndex < totalPages) {
      setDirection('next');
      dispatch(setPageIndex(pageIndex + 1)); 
    }
  };

  if (status === "pending") {
    return <div className="top-deals">Đang tải dữ liệu...</div>;
  }

  if (status === "failed") {
    return <div className="top-deals">Không thể tải dữ liệu sản phẩm.</div>;
  }

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating || 0);
    const hasHalfStar = (rating || 0) % 1 !== 0;
    const emptyStars = 5 - Math.ceil(rating || 0);

    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={`full-${i}`} className="star filled">★</span>);
    }
    if (hasHalfStar) {
      stars.push(<span key="half" className="star half">★</span>);
    }
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
        <Link to="/view-all-top-deals" className="view-all">
          Xem tất cả
        </Link>
      </div>

      <div className="deals-grid-wrapper" >

        {totalPages > 1 && pageIndex > 1 && (
          <PrevArrow onClick={handlePrev} />
        )}

        <div className={`deals-grid slide-${direction}`}   key={pageIndex}  >
          {deals.map((deal) => (
            <Link to={`/product/${deal.id}`}  key={deal.id} className="deal-card">
              <div className="deal-image-wrapper">
                <img 
                  src={deal.image || "https://salt.tikicdn.com/cache/750x750/ts/product/ac/65/4e/e21a92395ae8a7a1c2af3da945d76944.jpg.webp"} 
                  alt={deal.title} 
                  className="deal-image"
                  ></img>
                
                <span className="discount-tag">{deal.date || "Hot"}</span>
                {deal.imageBadges && <img src={deal.imageBadges} alt="Badge" className="mini-badge" />}
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
                    <span className={`current-price ${!deal.discount || deal.discount <= 0 ? 'no-discount' : ''}`}>
                      {formatPrice(calculateDiscountedPrice(deal.originalPrice, deal.discount))}<sup>₫</sup>
                    </span>
                  </div>
                  
                  {deal.discount > 0 && (
                    <div className="discount-row">
                      <span className="discount-percent">- {deal.discount}%</span>
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
                    <img src="../img_giao_ngay.png" alt="now" />
                    <span className="shipping-info">{deal.shippingBadge}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      
        {totalPages > 1 && startIndex + itemsPerPage < products.length && (
          <NextArrow onClick={handleNext} />
        )}
      </div>
    </div>
  );
};

export default TopDeals;
