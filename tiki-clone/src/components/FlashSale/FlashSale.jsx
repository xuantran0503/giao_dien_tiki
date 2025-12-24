import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { PrevArrow, NextArrow } from "../shared/NavigationArrows";
import { flashSaleData } from "../../data/flashSaleData";
import { calculateDiscountedPrice, formatPrice } from "../../utils/priceUtils";
import "./FlashSale.css";
import "../shared/NavigationArrows.css";

const FlashSale = () => {
  
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {

    const calculateTimeLeft = () => {
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      const currentSecond = now.getSeconds();

      // Các khung giờ sale (giờ bắt đầu)
      const saleHours = [0, 8, 12, 16, 18, 22];

      // Tìm khung giờ sale tiếp theo
      let nextSaleHour = saleHours.find(hour => hour > currentHour);
      
      // Nếu không tìm thấy (đã qua khung cuối cùng trong ngày), lấy khung đầu tiên ngày mai
      if (nextSaleHour === undefined) {
        nextSaleHour = saleHours[0];
      }

      // Tính thời gian kết thúc
      const endTime = new Date(now);
      
      // Nếu nextSaleHour nhỏ hơn hoặc bằng currentHour, nghĩa là sang ngày mới
      if (nextSaleHour <= currentHour) {
        endTime.setDate(endTime.getDate() + 1);
      }
      
      endTime.setHours(nextSaleHour, 0, 0, 0);

      const diff = endTime.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft({ hours, minutes, seconds });
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  const [currentPage, setCurrentPage] = useState(0);
  const [direction, setDirection] = useState('next');
  const itemsPerPage = 6;
  const totalPages = Math.ceil(flashSaleData.length / itemsPerPage);

  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const flashSaleProducts = flashSaleData.slice(startIndex, endIndex);

  const handlePrev = () => {
    setDirection('prev');
    setCurrentPage((current) => (current > 0 ? current - 1 : totalPages - 1));
  };

  const handleNext = () => {
    setDirection('next');
    setCurrentPage((current) => (current < totalPages - 1 ? current + 1 : 0));
  };

  return (
    <div className="flash-sale">
      <div className="flash-sale-header">

        <div className="header-left">
          <div className="flash-sale-title">
            <span className="flash-text">Flash Sale</span>

            <div className="time-badges">
              <span className="time-badge active">
                {String(timeLeft.hours).padStart(2, '0')}
              </span>
              <span className="time-separator">:</span>
              <span className="time-badge">
                {String(timeLeft.minutes).padStart(2, '0')}
              </span>
              <span className="time-separator">:</span>
              <span className="time-badge">
                {String(timeLeft.seconds).padStart(2, '0')}
              </span>
            </div>

          </div>
        </div>

        <Link to="/flash-sale" className="view-all">
          Xem tất cả
        </Link>
      </div>

      <div className="flash-sale-grid-wrapper">
        <PrevArrow onClick={handlePrev} />
        <div className={`flash-sale-grid slide-${direction}`} key={currentPage}>
          {flashSaleProducts.map((product) => (
            <Link to={`/product/${product.id}`} key={product.id} className="flash-sale-card">
              <div className="flash-sale-image">
                <img src={product.image} alt="Product" />
                {product.discount > 0 && <span className="flash-discount-badge">-{product.discount}%</span>}
              </div>

              <div className="flash-sale-info">

                <div className="flash-price-section">
                  <span className={`flash-current-price ${!product.discount || product.discount <= 0 ? 'no-discount' : ''}`}>
                    {formatPrice(calculateDiscountedPrice(product.originalPrice, product.discount))}<sup>₫</sup>
                  </span>
                </div>

                <div className="flash-progress-section">
                  <div className="flash-progress-bar">
                    <div
                      className="flash-progress-fill"
                      style={{ width: `${product.soldPercent}%` }}
                    ></div>
                  </div>
                  <span className="flash-sold-text">Vừa mở bán</span>
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

export default FlashSale;
