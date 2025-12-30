import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { PrevArrow, NextArrow } from "../shared/NavigationArrows";
// import { flashSaleData } from "../../data/flashSaleData";
import { calculateDiscountedPrice, formatPrice } from "../../utils/priceUtils";
import {
  fetchFlashSaleProducts,
  selectFlashSaleProducts,
  selectFlashSaleStatus,
  selectFlashSalePageIndex,
  setFlashSalePageIndex,
} from "../../store/flashSaleSlice";
import "./FlashSale.css";
import "../shared/NavigationArrows.css";

const FlashSale = () => {
  const dispatch = useDispatch();
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // Khai báo direction cho animation
  const [direction, setDirection] = useState("next");

  const apiProducts = useSelector(selectFlashSaleProducts);
  const apiStatus = useSelector(selectFlashSaleStatus);
  const pageIndex = useSelector(selectFlashSalePageIndex);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const currentHour = now.getHours();
      const saleHours = [0, 9, 12, 18, 22];
      let nextSaleHour = saleHours.find((hour) => hour > currentHour);

      if (nextSaleHour === undefined) {
        nextSaleHour = saleHours[0];
      }

      const endTime = new Date(now);
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

  useEffect(() => {
    if (apiProducts.length === 0) {
      dispatch(fetchFlashSaleProducts({ pageIndex: 1, pageSize: 18 }));
    }
  }, [dispatch, apiProducts.length]);

  // Kiểm tra status và return sớm nếu cần
  if (apiStatus === "pending") {
    return <div className="flash-sale">Đang tải dữ liệu...</div>;
  }

  if (apiStatus === "failed") {
    return <div className="flash-sale">Không thể tải dữ liệu sản phẩm.</div>;
  }
  
  const flashSaleDataSource = apiProducts;
  const itemsPerPage = 6;
  const totalPages = Math.ceil(flashSaleDataSource.length / itemsPerPage);

  const startIndex = (pageIndex - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const flashSaleProducts = flashSaleDataSource.slice(startIndex, endIndex);

  const handlePrev = () => {
    if (pageIndex > 1) {
      setDirection("prev");
      dispatch(setFlashSalePageIndex(pageIndex - 1));
    }
  };

  const handleNext = () => {
    if (pageIndex < totalPages) {
      setDirection("next");
      dispatch(setFlashSalePageIndex(pageIndex + 1));
    }
  };

  return (
    <div className="flash-sale">
      <div className="flash-sale-header">
        <div className="header-left">
          <div className="flash-sale-title">
            <span className="flash-text">Flash Sale</span>

            <div className="time-badges">
              <span className="time-badge active">
                {String(timeLeft.hours).padStart(2, "0")}
              </span>
              <span className="time-separator">:</span>
              <span className="time-badge">
                {String(timeLeft.minutes).padStart(2, "0")}
              </span>
              <span className="time-separator">:</span>
              <span className="time-badge">
                {String(timeLeft.seconds).padStart(2, "0")}
              </span>
            </div>
          </div>
        </div>

        <Link to="/flash-sale" className="view-all">
          Xem tất cả
        </Link>
      </div>

      <div className="flash-sale-grid-wrapper">
        {totalPages > 1 && pageIndex > 1 && <PrevArrow onClick={handlePrev} />}
        <div className={`flash-sale-grid slide-${direction}`} key={pageIndex}>
          {flashSaleProducts.map((product) => (
            <Link
              to={`/product/${product.id}`}
              key={product.id}
              className="flash-sale-card"
            >
              <div className="flash-sale-image">
                <img
                  src={
                    product.image ||
                    "https://salt.tikicdn.com/cache/280x280/media/catalog/producttmp/80/b9/75/829e0d96e6675f28dc46757a27120354.jpg.webp"
                  }
                  alt="Product"
                />
                {product.discount > 0 && (
                  <span className="flash-discount-badge">
                    -{product.discount}%
                  </span>
                )}
              </div>

              <div className="flash-sale-info">
                <div className="flash-price-section">
                  <span
                    className={`flash-current-price ${
                      !product.discount || product.discount <= 0
                        ? "no-discount"
                        : ""
                    }`}
                  >
                    {formatPrice(
                      product.currentPrice ||
                        calculateDiscountedPrice(
                          product.originalPrice,
                          product.discount
                        )
                    )}
                    <sup>₫</sup>
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
        {totalPages > 1 && startIndex + itemsPerPage < apiProducts.length && (
          <NextArrow onClick={handleNext} />
        )}
      </div>
    </div>
  );
};

export default FlashSale;
