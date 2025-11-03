import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../store/cartSlice";
import Header from "../components/Header/Header";
import { suggestedProductsData } from "../data/suggestedProductsData";
import { topDealsData } from "../data/topDealsData";
import { flashSaleData } from "../data/flashSaleData";
import { hotInternationalData } from "../data/hotInternationalData";
import { youMayLikeData } from "../data/youMayLikeData";
import { calculateDiscountedPrice, formatPrice } from "../utils/priceUtils";
import "./ProductDetailPage.css";

const ProductDetailPage = () => {
  const { productId } = useParams();
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });

  // Tìm sản phẩm từ tất cả data sources
  const findProduct = (id) => {
    const numId = parseInt(id);
    // const numId = title;


    // Tìm trong suggested products (data chuẩn nhất)
    let product = suggestedProductsData.find((p) => p.id === numId);

    // Nếu không tìm thấy, tìm trong các nguồn khác và map sang format chuẩn
    if (!product) {
      // Tìm trong TopDeals
      const topDeal = topDealsData.find((p) => p.id === numId);
      if (topDeal) {
        product = {
          id: topDeal.id,
          name: topDeal.title,
          image: topDeal.image,
          originalPrice: topDeal.originalPrice,
          discount: topDeal.discount,
          rating: topDeal.rating,
          badgeIcon: topDeal.imageBadges,
          deliveryTime: topDeal.shippingBadge || "Giao siêu tốc 2h",
          madeIn: topDeal.madeIn,
          isFreeShip: "img_giao_ngay.png",
        };
      }
    }

    if (!product) {
      // Tìm trong FlashSale
      const flashSale = flashSaleData.find((p) => p.id === numId);
      if (flashSale) {
        product = {
          id: flashSale.id,
          name: "Flash Sale Product",
          image: flashSale.image,
          originalPrice: flashSale.originalPrice,
          discount: flashSale.discount,
          rating: 4.5,
          deliveryTime: "Giao siêu tốc 2h",
          isFreeShip: "img_giao_ngay.png",
        };
      }
    }

    if (!product) {
      // Tìm trong HotInternational
      const hotInt = hotInternationalData.find((p) => p.id === numId);
      if (hotInt) {
        product = {
          id: hotInt.id,
          name: hotInt.title,
          image: hotInt.image,
          originalPrice: hotInt.originalPrice,
          discount: hotInt.discount,
          rating: hotInt.rating,
          deliveryTime: "Giao siêu tốc 2h",
          madeIn: hotInt.madeIn,
          isFreeShip: "img_giao_ngay.png",
        };
      }
    }

    if (!product) {
      // Tìm trong YouMayLike
      const youMayLike = youMayLikeData.find((p) => p.id === numId);
      if (youMayLike) {
        product = {
          id: youMayLike.id,
          name: youMayLike.name, // YouMayLike sử dụng "name" chứ không phải "title"
          image: youMayLike.image,
          originalPrice: youMayLike.originalPrice,
          discount: youMayLike.discount,
          rating: youMayLike.rating,
          deliveryTime: youMayLike.shippingBadge || "Giao siêu tốc 2h",
          madeIn: youMayLike.madeIn,
          badgeIcon: youMayLike.badgeIcon, // Sửa từ imageBadges sang badgeIcon
          isFreeShip: "img_giao_ngay.png",
        };
      }
    }

    return product;
  };

  const product = findProduct(productId);

  if (!product) {
    return (
      <div className="product-detail-page">
        <Header />
        <div className="product-not-found">
          <h2>Không tìm thấy sản phẩm</h2>
          <Link to="/" className="back-home-link">
            ← Quay về trang chủ
          </Link>
        </div>
      </div>
    );
  }

  // Tính giá sau giảm giá
  const finalPrice = calculateDiscountedPrice(
    product.originalPrice,
    product.discount
  );

  // Xử lý tăng số lượng
  const handleIncrease = () => {
    setQuantity((prev) => prev + 1);
  };

  // Xử lý giảm số lượng
  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  // Xử lý thêm vào giỏ hàng
  const handleAddToCart = () => {
    // Thêm sản phẩm vào giỏ hàng (nếu trùng sẽ tự động tăng số lượng)
    dispatch(
      addToCart({
        id: product.id,
        name: product.name,
        image: product.image,
        price: finalPrice,
        originalPrice: product.originalPrice,
        discount: product.discount,
        quantity: quantity,
      })
    );

    // Hiển thị thông báo thành công
    setNotification({
      show: true,
      message: "Đã thêm sản phẩm vào giỏ hàng",
      type: "success",
    });
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "" });
    }, 1000);
  };

  // Render sao đánh giá
  const renderStars = (rating) => {
    if (!rating) return null;
    const stars = [];
    const fullStars = Math.floor(rating);

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <span key={`full-${i}`} className="star filled">
          ★
        </span>
      );
    }

    const emptyStars = 5 - fullStars;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <span key={`empty-${i}`} className="star">
          ★
        </span>
      );
    }

    return stars;
  };

  return (
    <div className="product-detail-page">
      <Header />

      {/* Breadcrumb */}
      <div className="breadcrumb-container">
        <div className="breadcrumb">
          <Link to="/">Trang chủ</Link>
          <span className="separator">›</span>
          <span className="current">{product.name}</span>
        </div>
      </div>

      {/* Product Detail Container */}
      <div className="product-detail-container">
        <div className="product-main-info">
          {/* Left: Product Images */}
          <div className="product-images">
            <div className="main-image">
              <img src={product.image} alt={product.name} />
            </div>
            <div className="thumbnail-images">
              <div className="thumbnail active">
                <img src={product.image} alt={product.name} />
              </div>
              {/* Có thể thêm nhiều ảnh thumbnail ở đây */}
            </div>
          </div>

          {/* Right: Product Info */}
          <div className="product-info-detail">
            {/* Badge */}
            {product.badgeIcon && (
              <div className="product-badge-container">
                <img
                  src={product.badgeIcon}
                  alt="Badge"
                  className="product-badge-icon-detail"
                />
              </div>
            )}

            {/* Product Name */}
            <h1 className="product-name-detail">{product.name}</h1>

            {/* Rating & Sold */}
            <div className="rating-section">
              {product.rating && (
                <>
                  <div className="rating-stars-detail">
                    {renderStars(product.rating)}
                  </div>
                  <span className="rating-number">{product.rating}</span>
                  <span className="separator-dot">•</span>
                  <span className="sold-count">Đã bán 15k</span>
                </>
              )}
            </div>

            {/* Price Section */}
            <div className="price-section-detail">
              <div className="current-price-detail">
                {formatPrice(finalPrice)}
                <sup>₫</sup>
              </div>
              {product.discount && product.discount > 0 && (
                <div className="price-discount-info">
                  <span className="discount-badge">-{product.discount}%</span>
                  <span className="original-price-detail">
                    {formatPrice(product.originalPrice)}
                    <sup>₫</sup>
                  </span>
                </div>
              )}
            </div>

            {/* Delivery Info */}
            <div className="delivery-info-section">
              <div className="info-row">
                <span className="info-label">Thông tin vận chuyển</span>
              </div>
              <div className="delivery-detail">
                <img
                  src="/img_giao_ngay.png"
                  alt="delivery"
                  className="delivery-icon"
                />
                <div className="delivery-text">
                  <p className="delivery-main">
                    {product.deliveryTime || "Giao siêu tốc 2h"}
                  </p>
                  <p className="delivery-sub">
                    Freeship 10k đơn từ 45k, Freeship 25k đơn từ 100k
                  </p>
                </div>
              </div>
            </div>

            {/* Made In */}
            {product.madeIn && (
              <div className="made-in-section">
                <span className="info-label">Xuất xứ:</span>
                <span className="made-in-value">{product.madeIn}</span>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="quantity-section">
              <span className="quantity-label">Số Lượng</span>
              <div className="quantity-selector">
                <button className="quantity-btn" onClick={handleDecrease}>
                  -
                </button>
                <input
                  type="text"
                  className="quantity-input"
                  value={quantity}
                  readOnly
                />
                <button className="quantity-btn" onClick={handleIncrease}>
                  +
                </button>
              </div>
            </div>

            {/* Total Price */}
            <div className="total-price-section">
              <span className="total-label">Tạm tính</span>
              <span className="total-price">
                {formatPrice(finalPrice * quantity)}
                <sup>₫</sup>
              </span>
            </div>

            {/* Action Buttons */}
            <div className="action-buttons">
              <button className="btn-buy-now">Mua ngay</button>

              <button className="btn-add-to-cart" onClick={handleAddToCart}>
                Thêm vào giỏ
              </button>
            </div>
          </div>
        </div>

        {/* Product Description */}
        <div className="product-description-section">
          <h2 className="section-title">Đặc điểm nổi bật</h2>
          <div className="description-content">
            <ul>
              <li>✓ Sản phẩm chính hãng 100%</li>
              <li>✓ Bảo hành {product.madeIn ? "chính hãng" : "toàn quốc"}</li>
              <li>✓ Giao hàng nhanh chóng</li>
              <li>✓ Đổi trả trong 30 ngày</li>
              <li>✓ Hỗ trợ khách hàng 24/7</li>
            </ul>
          </div>
        </div>

        {/* Similar Products */}
        <div className="similar-products-section">
          <h2 className="section-title">Sản phẩm tương tự</h2>
          <div className="similar-products-grid">
            {suggestedProductsData.slice(0, 6).map((item) => (
              <Link
                to={`/product/${item.id}`}
                key={item.id}
                className="similar-product-card"
              >
                <div className="similar-product-image">
                  <img src={item.image} alt={item.name} />
                </div>
                <div className="similar-product-info">
                  <h3 className="similar-product-name">{item.name}</h3>
                  <div className="similar-product-price">
                    <span className="price">
                      {formatPrice(
                        calculateDiscountedPrice(
                          item.originalPrice,
                          item.discount
                        )
                      )}
                      <sup>₫</sup>
                    </span>
                    {item.discount && item.discount > 0 && (
                      <span className="discount">-{item.discount}%</span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Notification */}
      {notification.show && (
        <div className={`add-to-cart-notification ${notification.type}`}>
          <div className="notification-content">
            <span className="notification-icon">
              {notification.type === "success" ? "✓" : "ⓘ"}
            </span>
            <span>{notification.message}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailPage;
