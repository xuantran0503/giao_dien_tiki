import React from "react";
import { FaStar } from "react-icons/fa";
import { AiFillLike } from "react-icons/ai";
import "./TopDeals.css";

const TopDeals = () => {
  const deals = [
    {
      id: 1,
      image: "https://salt.tikicdn.com/cache/750x750/ts/product/b3/f2/38/70278a86e56e3d524b8638e577ecd7a3.png.webp",
      title: "Sách Sự Trỗi Dậy Và Suy Tàn Của Các Cường Quốc...",
      price: 351385,
      originalPrice: 566000,
      discount: 33,
      rating: 4.5,
      badge: "NOW",
      shippingBadge: "Giao siêu tốc 2h",
      date: "15.10",
      madeIn: null,
      imageBadges: "https://salt.tikicdn.com/ts/upload/21/c9/ce/ecf520f4346274799396496b3cbbf7d8.png",
    },
    {
      id: 2,
      image: "https://salt.tikicdn.com/cache/750x750/ts/product/c3/3f/2b/0a42ce3a97fc8567a567dda4a39aed6b.jpg.webp",
      title: "Máy tính bảng iPad",
      price: 15000000,
      originalPrice: 2500000,
      discount: 15,
      rating: 5,
      shippingBadge: "Giao chủ nhật, 19/10"
      ,
      date: "15.10",
      madeIn: null,
      imageBadges: "https://salt.tikicdn.com/ts/upload/12/e2/4a/c5226426ee9429b0050449ae5403c9cf.png",
    },
    {
      id: 3,
      image: "/img_sach_hary_potter.jpg",
      title: "Lịch sử phật giáo",
      price: 166000,
      rating: 5,
      badge: "NOW",
      shippingBadge: "Giao siêu tốc 2h",
      date: "15.10",
      madeIn: null,
      imageBadges: "img_freeship1.png",
    },
    {
      id: 4,
      image: "https://salt.tikicdn.com/cache/750x750/ts/product/8e/bf/ab/51c2dc3b4e46455a958e39bd8ae8e415.png.webp",
      title: "Bộ Sản Phẩm Dưỡng Trắng Da Mặt Sakura Nhật Bản (Toner 150ml + Serum 30ml + Kem Dưỡng 50g)",
      price: 599000,
      originalPrice: 899000,
      discount: 47,
      rating: 4.7,
      shippingBadge: "Giao thứ 2, 20/10",
      date: "15.10",
      madeIn: "Made in Singapore",
      imageBadges: "img_topdeal_freextra3.png",
    },
    {
      id: 5,
      image: "https://salt.tikicdn.com/cache/750x750/ts/product/0b/fb/e0/8b6b96db507c4d58a84c021a2f10bd34.png.webp",
      title: "Kem Chống Nắng Anessa  100ml + Serum 30ml + Kem Dưỡng 50g",
      price: 450000,
      rating: 4.9,
      badge: "NOW",
      shippingBadge: "Giao siêu tốc 2h",
      date: "15.10",
      madeIn: "Made in Indonesia",
      imageBadges: "img_freeship1.png",
    },
    {
      id: 6,
      image: "https://salt.tikicdn.com/cache/750x750/ts/product/81/bc/7b/e816f29fc6e20711f8dc9da9bde3cfa0.jpg.webp",
      title: "Serum Vitamin C ",
      price: 290000,
      rating: 4.9,
      badge: "NOW",
      shippingBadge: "Giao siêu tốc 2h",
      date: "15.10",
      madeIn: "Made in Indonesia",
      imageBadges: "img_topdeal_freextra3.png",
    }
    // ,
    // {
    //   id: 7,
    //   image: "/img1.png",
    //   title: "Serum Vitamin C Sáng Da Chống Lão Hóa The Ordinary Vitamin C Suspension 23% + HA Spheres 2% 30ml",
    //   price: 290000,
    //   originalPrice: 450000,
    //   discount: 35,
    //   rating: 4.9,
    //   badge: "NOW",
    //   shippingBadge: "Giao siêu tốc 2h",
    //   date: "15.10",
    //   madeIn: "Made in Indonesia",
    // },
    // {
    //   id: 8,
    //   image: "/img1.png",
    //   title: "Serum Vitamin C Sáng Da Chống Lão Hóa The Ordinary Vitamin C Suspension 23% + HA Spheres 2% 30ml",
    //   price: 290000,
    //   originalPrice: 450000,
    //   discount: 35,
    //   rating: 4.9,
    //   badge: "NOW",
    //   shippingBadge: "Giao siêu tốc 2h",
    //   date: "15.10",
    //   madeIn: null,
    // },
    // {
    //   id: 9,
    //   image: "/img1.png",
    //   title: "Serum Vitamin C Sáng Da Chống Lão Hóa The Ordinary Vitamin C Suspension 23% + HA Spheres 2% 30ml",
    //   price: 290000,
    //   originalPrice: 450000,
    //   discount: 35,
    //   rating: 4.9,
    //   badge: "NOW",
    //   shippingBadge: "Giao siêu tốc 2h",
    //   date: "15.10",
    //   madeIn: null,
    // },
    // {
    //   id: 10,
    //   image: "/img1.png",
    //   title: "Serum Vitamin C Sáng Da Chống Lão Hóa The Ordinary Vitamin C Suspension 23% + HA Spheres 2% 30ml",
    //   price: 290000,
    //   originalPrice: 450000,
    //   discount: 35,
    //   rating: 4.9,
    //   badge: "NOW",
    //   shippingBadge: "Giao siêu tốc 2h",
    //   date: "15.10",
    //   madeIn: null,
    // },
    // {
    //   id: 11,
    //   image: "/img1.png",
    //   title: "Serum Vitamin C Sáng Da Chống Lão Hóa The Ordinary Vitamin C Suspension 23% + HA Spheres 2% 30ml",
    //   price: 290000,
    //   originalPrice: 450000,
    //   discount: 35,
    //   rating: 4.9,
    //   badge: "NOW",
    //   shippingBadge: "Giao siêu tốc 2h",
    //   date: "15.10",
    //   madeIn: null,
    // },
    // {
    //   id: 12,
    //   image: "/img1.png",
    //   title: "Serum Vitamin C Sáng Da Chống Lão Hóa The Ordinary Vitamin C Suspension 23% + HA Spheres 2% 30ml",
    //   price: 290000,
    //   originalPrice: 450000,
    //   discount: 35,
    //   rating: 4.9,
    //   badge: "NOW",
    //   shippingBadge: "Giao siêu tốc 2h",
    //   date: "15.10",
    //   madeIn: "Made in China",
    // }
  ];

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN").format(price);
  };

  const renderStars = (rating) => {
    return Array(5).fill(0).map((_, i) => (
      <FaStar
        key={i}
        className={`star ${i < Math.floor(rating) ? 'filled' : ''}`}
      />
    ));
  };

  return (
    <div className="top-deals">
      <div className="deals-header">
        <div className="header-left">
          <img src="../img_top_deal_sieu_re.png" alt="top deal siêu rẻ" />
        </div>
        <a href="#" className="view-all">
          Xem tất cả
        </a>
      </div>

      <div className="deals-grid">
        {deals.map((deal) => (
          <div key={deal.id} className="deal-card">

            <div className="deal-image-wrapper">
              <img src={deal.image} alt={deal.title} className="deal-image" />

              <span className="discount-tag">{deal.date}</span>

              {deal.imageBadges && (
                // <div className="image-badges"></div>

                < img src={deal.imageBadges} alt="Badge" className="mini-badge" />

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
                    {formatPrice(deal.price)}<sup>₫</sup>
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
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopDeals;
