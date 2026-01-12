import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../src/store/cartSlice";
import Header from "../src/components/Header/Header";
import Footer from "../src/components/Footer/Footer";
import CheckoutForm from "../src/components/CheckoutForm/CheckoutForm";
import AddressSelector from "../src/components/AddressSelector/AddressSelector";
import { PrevArrow, NextArrow } from "../src/components/shared/NavigationArrows";
import { suggestedProductsData } from "../src/data/suggestedProductsData";
import { topDealsData } from "../src/data/topDealsData";
import { flashSaleData } from "../src/data/flashSaleData";
import { hotInternationalData } from "../src/data/hotInternationalData";
import { youMayLikeData } from "../src/data/youMayLikeData";
import { calculateDiscountedPrice, formatPrice } from "../src/utils/priceUtils";
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

  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);

  // Tìm sản phẩm từ tất cả data sources
  const findProduct = (id) => {
    const numId = parseInt(id);

    let product = suggestedProductsData.find((p) => p.id === numId);

    if (!product) {
      const topDeal = topDealsData.find((p) => p.id === numId);
      if (topDeal) {
        product = {
          id: topDeal.id,
          name: topDeal.title,
          image: topDeal.image,
          originalPrice: topDeal.originalPrice,
          discount: topDeal.discount,
          rating: topDeal.rating,
          sold: topDeal.sold,
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
          name: flashSale.name,
          image: flashSale.image,
          originalPrice: flashSale.originalPrice,
          discount: flashSale.discount,
          rating: flashSale.rating,
          sold: flashSale.sold,
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
          sold: hotInt.sold,
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
          sold: youMayLike.sold,
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

  // if (!product) {
  //   return (
  //     <div className="product-detail-page">
  //       <Header />
  //       <div className="product-not-found">
  //         <h2>Không tìm thấy sản phẩm</h2>
  //         <Link to="/" className="back-home-link">
  //           Quay về trang chủ
  //         </Link>
  //       </div>
  //     </div>
  //   );
  // }

  // Tính giá sau giảm giá
  const finalPrice = calculateDiscountedPrice(
    product.originalPrice,
    product.discount
  );

  const handleIncrease = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

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

    // Hiển thị thông báo
    setNotification({
      show: true,
      message: `Đã thêm ${quantity} ${product.name} vào giỏ hàng!`,
      type: "success",
    });

    // Tự động ẩn thông báo sau 3 giây
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "" });
    }, 3000);
  };

  const handleBuyNow = () => {
    console.log('Buy now clicked');
    setShowCheckoutForm(true);
    console.log('showCheckoutForm set to true');
  };

  const handleCheckoutSubmit = (formData) => {
    console.log('Thông tin người mua:', formData);
    console.log('Sản phẩm mua ngay:', product);
    console.log('Số lượng:', quantity);
    // Xử lý logic đặt hàng ở đây
    alert('Đặt hàng thành công! Chúng tôi sẽ liên hệ với bạn sớm.');
    setShowCheckoutForm(false);
  };

  const handleCheckoutCancel = () => {
    setShowCheckoutForm(false);
  };

  // Hàm thêm sản phẩm tương tự vào giỏ
  const handleAddSimilarProductToCart = (item, e) => {
    // Ngăn chặn điều hướng khi click nút
    // e.preventDefault();
    // e.stopPropagation();

    const itemFinalPrice = calculateDiscountedPrice(
      item.originalPrice,
      item.discount
    );

    dispatch(
      addToCart({
        id: item.id,
        name: item.name,
        image: item.image,
        price: itemFinalPrice,
        originalPrice: item.originalPrice,
        discount: item.discount,
        quantity: 1,
      })
    );

    setNotification({
      show: true,
      message: "Đã thêm sản phẩm vào giỏ hàng",
      type: "success",
    });

    setTimeout(() => {
      setNotification({ show: false, message: "", type: "" });
    }, 1000);
  };

  const itemsPerPage = 6;
  // Tính toán pagination
  const totalPages = Math.ceil(suggestedProductsData.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = suggestedProductsData.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    // Cuộn lên phần sản phẩm tương tự
    // document.querySelector(".similar-products-section")?.scrollIntoView({
    //   behavior: "smooth",
    //   block: "start",
    // });
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <span key={i} className="star filled">
          ★
        </span>
      );
    }
    if (hasHalfStar) {
      stars.push(
        <span key="half" className="star half">
          ★
        </span>
      );
    }
    const emptyStars = 5 - Math.ceil(rating);
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

      <div className="breadcrumb-container">
        <div className="breadcrumb">
          <Link to="/">Trang chủ</Link>
          <span className="separator">{">"}</span>
          <span className="current">{product.name}</span>
        </div>
      </div>

      <div className="product-detail-container">
        <div className="product-main-info">
          <div className="product-images">
            <div className="main-image">
              <img src={product.image} alt={product.name} />
            </div>
            <div className="thumbnail-images">
              <div className="thumbnail active">
                <img src={product.image} alt={product.name} />
              </div>
            </div>
          </div>

          {/* Right: Product Info */}
          <div className="product-info-detail">
            {product.imageBadges && (
              <div className="product-badge-container">
                <img
                  src={product.imageBadges}
                  alt="Badge"
                  className="product-badge-icon-detail"
                />
              </div>
            )}

            <h1 className="product-name-detail">{product.name}</h1>

            <div className="rating-section">
              {product.rating && (
                <>
                  <span className="rating-number">{product.rating}</span>
                  <div className="rating-stars-detail">
                    {renderStars(product.rating)}
                  </div>
                  <span className="separator-dot">•</span>
                  {product.sold && (
                    <span className="sold-count">
                      Đã bán {product.sold.toLocaleString("vi-VN")}
                    </span>
                  )}
                  {!product.sold && (
                    <span className="sold-count">Đã bán sản phẩm</span>
                  )}
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

            <div className="delivery-info-section">
              <div className="info-row">
                <span className="info-label">Thông tin vận chuyển</span>
              </div>
              <div className="delivery-detail">
                {/* <img
                  src="/img_giao_ngay.png"
                  alt="delivery"
                  className="delivery-icon"
                /> */}

                <div className="delivery-address-section">
                  <AddressSelector
                    forceOpen={isAddressModalOpen}
                    onClose={() => setIsAddressModalOpen(false)}
                  />

                  <button
                    className="btn-change-address"
                    onClick={() => setIsAddressModalOpen(true)}
                  >
                    Đổi
                  </button>
                </div>

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
                <button
                  className="quantity-btn"
                  onClick={handleDecrease}
                // disabled={item.quantity <= 1}
                //  disabled={quantity <= 1}
                //   aria-disabled={quantity <= 1}
                >
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
              <button className="btn-buy-now" onClick={handleBuyNow}>Mua ngay</button>

              <button className="btn-add-to-cart" onClick={handleAddToCart}>
                Thêm vào giỏ
              </button>

              <button className="btn-add-to-cart">Mua trả góp - trả sau</button>
            </div>
          </div>
        </div>

        {/* Product Description */}
        {/* <div className="product-description-section">
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
        </div> */}

        {/* Similar Products */}
        <div className="similar-products-section">
          <h2 className="section-title">Sản phẩm tương tự</h2>

          <div className="similar-products-wrapper">
            {/* Navigation Arrows */}
            {totalPages > 1 && currentPage > 1 && (
              <PrevArrow onClick={handlePrevPage} />
            )}

            <div className="similar-products-grid">
              {currentItems.map((item) => (
                <div key={item.id} className="similar-product-card-wrapper">
                  <Link
                    to={`/product/${item.id}`}
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
                        <div className="discount-price-container">
                          {item.discount && item.discount > 0 && (
                            <span className="discount">-{item.discount}%</span>
                          )}

                          {item.originalPrice !== item.price && (
                            <span className="original-price">
                              {formatPrice(item.originalPrice)}
                              <sup>₫</sup>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                  <button
                    className="btn-add-to-cart-similar"
                    onClick={(e) => handleAddSimilarProductToCart(item, e)}
                  >
                    Thêm vào giỏ
                  </button>
                </div>
              ))}
            </div>

            {totalPages > 1 && currentPage < totalPages && (
              <NextArrow onClick={handleNextPage} />
            )}
          </div>
        </div>
      </div>

      {/* Notification */}
      {notification.show && (
        <div className={`add-to-cart-notification ${notification.type}`}>
          <div className="notification-content">
            <span className="notification-icon">
              {notification.type === "success"}
            </span>
            <span>{notification.message}</span>
          </div>
        </div>
      )}

      <Footer />

      {showCheckoutForm && (
        <CheckoutForm
          onSubmit={handleCheckoutSubmit}
          onCancel={handleCheckoutCancel}
        />
      )}
    </div>
  );
};

export default ProductDetailPage;
