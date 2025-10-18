import React from "react";
import { FaStar } from "react-icons/fa";
import "./HotInternational.css";

const HotInternational = () => {
  const products = [
    {
      id: 1,
      image: "https://salt.tikicdn.com/cache/750x750/ts/product/12/3b/37/0054011296181b439110b5a1eaa613f4.png.webp",
      title: "Kem dưỡng trắng dạng gel giúp cải thiện thâm nám",
      price: 240350,
      originalPrice: 350000,
      discount: 31,
      rating: 4.5,
      badge: "NOW",
      shippingBadge: "Giao siêu tốc 2h",
      madeIn: "Made in Japan"
    },
    {
      id: 2,
      image: "https://salt.tikicdn.com/cache/750x750/ts/product/05/9b/6b/b4f605313e6065e7171f090220487edf.jpg.webp",
      title: "Bộ nồi chảo cán rời 3 món Tefal Ingenio Daily Chef",
      price: 2336000,
      originalPrice: 3000000,
      discount: 22,
      rating: 5,
      shippingBadge: "Giao thứ 4, 22/10",
      madeIn: "Made in France"
    },
    {
      id: 3,
      image: "https://salt.tikicdn.com/cache/750x750/ts/product/75/3b/77/49bbaebce88dfa733840ec07e795bd2b.png.webp",
      title: "Vòng đeo tay tránh muỗi KINCHO 30 cái Hương thảo mộc",
      price: 194718,
      originalPrice: 215000,
      discount: 9,
      
      badge: "NOW",
      shippingBadge: "Giao siêu tốc 2h",
      madeIn: "Made in Japan"
    },
    {
      id: 4,
      image: "https://salt.tikicdn.com/cache/750x750/ts/product/5c/96/79/8ada9e069d709ed484e0f44dbea85acd.jpg.webp",
      title: "Kem Chống Nắng Make p:rem Vật Lý Kiềm Dầu Kh...",
      price: 320800,
      originalPrice: 480000,
      discount: 33,
      rating: 4.7,
      badge: "DELIVERY",
      shippingBadge: "Giao chiều mai",
      madeIn: "Made in Korea"
    },
    {
      id: 5,
      image: "https://salt.tikicdn.com/cache/750x750/ts/product/af/b4/0d/bceb3100fd16db99f883612c47fb48c5.png.webp",
      title: "Serum Dưỡng Trắng Da, Cấp Ẩm Ba Tầng Angel's...",
      price: 359000,
      
      badge: "NOW",
      shippingBadge: "Giao siêu tốc 2h",
      madeIn: "Made in Korea"
    },
    {
      id: 6,
      image: "https://salt.tikicdn.com/cache/750x750/ts/product/03/0e/01/3555e6eb541dd4174fd15a535b36b0f6.png.webp",
      title: "Gel rửa mặt giảm mụn Eucerin Pro Acne Cleansi...",
      price: 173052,
      originalPrice: 209000,
      discount: 17,
      rating: 4.6,
      shippingBadge: "Giao thứ 4, 22/10",
      madeIn: "Made in Germany"
    }
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
    <div className="hot-international">
      <div className="hot-international-header">
        <h2 className="hot-international-title">Hàng ngoại giá hot</h2>
        <a href="/international-products" className="view-all">
          Xem tất cả
        </a>
      </div>

      <div className="hot-international-grid">
        {products.map((product) => (
          <div key={product.id} className="hot-product-card">
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
                    {formatPrice(product.price)}<sup>₫</sup>
                  </span>
                </div>

                {product.discount && product.originalPrice && (
                  <div className="discount-row">
                    <span className="discount-percent">-{product.discount}%</span>
                    <span className="original-price">{formatPrice(product.originalPrice)}<sup>₫</sup></span>
                  </div>
                )}
              </div>

              {product.madeIn && (
                <div className="made-in">{product.madeIn}</div>
              )}

              <div className="hot-product-bottom-badges">
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
          </div>
        ))}
      </div>
    </div>
  );
};

export default HotInternational;
