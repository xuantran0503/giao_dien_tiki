import React, { useState, useEffect } from "react";
import "./FlashSale.css";

const FlashSale = () => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    // Tính thời gian đến khung giờ Flash Sale tiếp theo (mỗi 2 giờ)
    const calculateTimeLeft = () => {
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      const currentSecond = now.getSeconds();

      // Các khung giờ Flash Sale: 0h, 2h, 4h, 6h, 8h, 10h, 12h, 14h, 16h, 18h, 20h, 22h
      const saleHours = [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22];
      
      // Tìm khung giờ tiếp theo
      let nextSaleHour = saleHours.find(hour => hour > currentHour);
      if (!nextSaleHour) {
        nextSaleHour = saleHours[0]; // Nếu qua 22h thì lấy 0h ngày mai
      }

      // Tính số giờ, phút, giây còn lại
      let hoursLeft = nextSaleHour - currentHour;
      if (hoursLeft <= 0) hoursLeft += 24;
      
      let minutesLeft = 59 - currentMinute;
      let secondsLeft = 59 - currentSecond;

      if (secondsLeft < 0) {
        secondsLeft += 60;
        minutesLeft -= 1;
      }

      if (minutesLeft < 0) {
        minutesLeft += 60;
        hoursLeft -= 1;
      }

      setTimeLeft({
        hours: hoursLeft,
        minutes: minutesLeft,
        seconds: secondsLeft
      });
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  const flashSaleProducts = [
    {
      id: 1,
      image: "https://salt.tikicdn.com/cache/280x280/media/catalog/producttmp/80/b9/75/829e0d96e6675f28dc46757a27120354.jpg.webp",
      discount: 50,
      price: 84500,
      soldPercent: 10
    },
    {
      id: 2,
      image: "https://salt.tikicdn.com/cache/280x280/media/catalog/producttmp/b7/ff/12/56dee306682b71fac4efc03552449c7e.jpg.webp",
      discount: 5,
      price: 43500,
      soldPercent: 10    
    },
    {
      id: 3,
      image: "https://salt.tikicdn.com/cache/280x280/ts/product/19/b6/c5/62822fe4e5aed62702967b002d8c47a9.jpg.webp",
      discount: 23,
      price: 14339000,
      soldPercent: 10
    },
    {
      id: 4,
      image: "https://salt.tikicdn.com/cache/280x280/media/catalog/product/c/a/cac_mon_an_chay_a_1.jpg.webp",
      discount: 46,
      price: 130000,
      soldPercent: 10
    },
    {
      id: 5,
      image: "https://salt.tikicdn.com/cache/280x280/ts/product/10/cb/5a/b4323bfc94fef6d5b26dfbd3d566262c.png.webp",
      discount: 6,
      price: 3090400,
      soldPercent: 10
    },
    {
      id: 6,
      image: "https://salt.tikicdn.com/cache/280x280/ts/product/f2/f5/4d/0a2169695cc3b333878ca132c854476b.jpg.webp",
      discount: 40,
      price: 1664000,
      soldPercent: 10
    }
  ];

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN").format(price);
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

        <a href="/flash-sale" className="view-all">
          Xem tất cả
        </a>
      </div>

      <div className="flash-sale-grid">
        {flashSaleProducts.map((product) => (
          <div key={product.id} className="flash-sale-card">
            <div className="flash-sale-image">
              <img src={product.image} alt="Product" />
              <span className="flash-discount-badge">-{product.discount}%</span>
            </div>

            <div className="flash-sale-info">
              <div className="flash-price-section">
                <span className="flash-current-price">
                  {formatPrice(product.price)}<sup>₫</sup>
                </span>
              </div>

              <div className="flash-progress-section">
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${product.soldPercent}%` }}
                  ></div>
                </div>
                <span className="sold-text">Vừa mở bán</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FlashSale;
