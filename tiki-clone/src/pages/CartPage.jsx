import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { removeFromCart, updateQuantity } from "../store/cartSlice";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import { addToCart } from "../store/cartSlice";
import { suggestedProductsData } from "../data/suggestedProductsData";
import { topDealsData } from "../data/topDealsData";
import { flashSaleData } from "../data/flashSaleData";
import { hotInternationalData } from "../data/hotInternationalData";
import { youMayLikeData } from "../data/youMayLikeData";
import { calculateDiscountedPrice, formatPrice } from "../utils/priceUtils";
import "./CartPage.css";
import { PrevArrow, NextArrow } from "../components/shared/NavigationArrows";

const CartPage = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);

  const [selectedItems, setSelectedItems] = useState([]);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedItems(cartItems.map((item) => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (id) => {
    if (selectedItems.includes(id)) {
      //neu da chon thi bo ra khoi danh sach bang filter
      setSelectedItems(selectedItems.filter((itemId) => itemId !== id));
    } else {
      //neu chua chon thi them vao
      setSelectedItems([...selectedItems, id]);
    }
  };

  const handleIncrease = (id, currentQuantity) => {
    dispatch(updateQuantity({ id, quantity: currentQuantity + 1 }));
  };

  const handleDecrease = (id, currentQuantity) => {
    if (currentQuantity > 1) {
      dispatch(updateQuantity({ id, quantity: currentQuantity - 1 }));
    }
  };

  const handleRemove = (id) => {
    dispatch(removeFromCart(id));
    setSelectedItems(selectedItems.filter((itemId) => itemId !== id));
  };

  const calculateSubtotal = () => {
    return cartItems
      .filter((item) => selectedItems.includes(item.id))
      .reduce((total, item) => {
        return total + item.originalPrice * item.quantity;
      }, 0);
  };

  const calculateTotal = () => {
    return cartItems
      .filter((item) => selectedItems.includes(item.id))
      .reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const subtotal = calculateSubtotal();
  const total = calculateTotal();
  const discount = subtotal - total;

  // Hàm thêm sản phẩm tương tự vào giỏ
  const handleAddSimilarProductToCart = (item) => {
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
  };

  const [currentPage, setCurrentPage] = useState(1);
  // Tính toán chuyển slice
  const itemsPerPage = 6;
  const totalPages = Math.ceil(topDealsData.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = topDealsData.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
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
    <div className="cart-page">
      <Header />

      <div className="cart-container">
        <div className="cart-main">
          <div className="cart-header">
            <h1>GIỎ HÀNG</h1>
          </div>

          {cartItems.length === 0 ? (
            <div className="cart-empty">
              <div className="empty-cart-icon">🛒</div>
              <h2>Giỏ hàng trống</h2>
              <p>Hãy thêm sản phẩm vào giỏ hàng để tiếp tục mua sắm!</p>
              <Link to="/" className="btn-continue-shopping">
                Tiếp tục mua sắm
              </Link>
            </div>
          ) : (
            <>
              {/* Select All */}
              <div className="cart-select-all">
                <label className="checkbox-container">
                  <input
                    type="checkbox"
                    checked={
                      selectedItems.length === cartItems.length &&
                      cartItems.length > 0
                    }
                    onChange={handleSelectAll}
                  />
                  <span className="checkmark"></span>
                  <span className="select-all-text">
                    Tất cả ({cartItems.length} sản phẩm)
                  </span>
                </label>

                <div className="cart-columns">
                  <span className="col-price">Đơn giá</span>
                  <span className="col-quantity">Số lượng</span>
                  <span className="col-total">Thành tiền</span>
                  <span className="col-action"></span>
                </div>
              </div>

              {/* Cart Items */}
              <div className="cart-items">
                {cartItems.map((item) => (
                  <div key={item.id} className="cart-item">
                    <label className="checkbox-container">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item.id)}
                        onChange={() => handleSelectItem(item.id)}
                      />
                      <span className="checkmark"></span>
                    </label>

                    <Link
                      to={`/product/${item.id}`}
                      className="item-image-link"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="item-image"
                      />
                    </Link>

                    <div className="item-info">
                      <Link to={`/product/${item.id}`} className="item-name">
                        {item.name}
                      </Link>
                      {/* {item.originalPrice &&
                        item.originalPrice !== item.price && (
                          <div className="item-promotion">
                            Giá chưa áp dụng mã khuyến mãi
                          </div>
                        )} */}
                    </div>

                    <div className="item-price">
                      {item.originalPrice &&
                        item.originalPrice !== item.price && (
                          <span className="item-original-price">
                            {formatPrice(item.originalPrice)}
                            <sup>₫</sup>
                          </span>
                        )}
                      <span className="item-current-price">
                        {formatPrice(item.price)}
                        <sup>₫</sup>
                      </span>
                    </div>

                    <div className="item-quantity">
                      <button
                        className="qty-btn"
                        onClick={() => handleDecrease(item.id, item.quantity)}
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>

                      <input
                        type="text"
                        className="qty-input"
                        value={item.quantity}
                        readOnly
                      />

                      <button
                        className="qty-btn"
                        onClick={() => handleIncrease(item.id, item.quantity)}
                      >
                        +
                      </button>
                    </div>

                    <div className="item-total">
                      {formatPrice(item.price * item.quantity)}
                      <sup>₫</sup>
                    </div>

                    <button
                      className="item-remove"
                      onClick={() => handleRemove(item.id)}
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"
                          fill="currentColor"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Sidebar */}
        {cartItems.length > 0 && (
          <div className="cart-sidebar">
            <div className="delivery-info-card">
              <div className="delivery-header">
                <span className="delivery-label">Giao tới</span>
                <button className="btn-change-address">Thay đổi</button>
              </div>

              <div className="delivery-address">
                <strong>Trần Văn Xuân</strong> | 0383477786
                <p>Xóm 1, Xã Hải Sơn, Huyện Hải Hậu, Nam Định</p>
              </div>
              <div className="delivery-note">
                Lưu ý: Sử dụng địa chỉ nhận hàng trước sáp nhập
              </div>
            </div>

            <div className="promotion-card">
              <div className="promotion-header">
                <span className="promotion-icon">🎫</span>
                <span>Tiki Khuyến Mãi</span>
              </div>
              <div className="promotion-select">
                <span>Có thể chọn 2</span>
                <span className="promotion-info">ⓘ</span>
              </div>
              <div className="promotion-voucher">
                <div className="voucher-item">
                  <span className="voucher-icon">🎁</span>
                  <span className="voucher-text">Giảm 50K</span>
                  <button className="voucher-action">Bỏ Chọn</button>
                </div>
              </div>
            </div>

            <div className="order-summary">
              <div className="summary-row">
                <span>Tổng tiền hàng</span>
                <span className="summary-value">
                  {formatPrice(subtotal)}
                  <sup>₫</sup>
                </span>
              </div>
              <div className="summary-row">
                <span>Giảm giá trực tiếp</span>
                <span className="summary-value discount">
                  -{formatPrice(discount)}
                  <sup>₫</sup>
                </span>
              </div>

              {/* <div className="summary-row">
                <span>Mã khuyến mãi từ nhà bán</span>
                <span className="summary-value discount">
                  -17.440<sup>₫</sup>
                </span>
              </div> */}

              <div className="summary-divider"></div>
              <div className="summary-row total-row">
                <span>Tổng tiền thanh toán</span>
                <div className="total-amount-container">
                  <span className="total-amount">
                    {formatPrice(total)}
                    <sup>₫</sup>
                  </span>
                  <span className="vat-note">(Đã bao gồm VAT nếu có)</span>
                </div>
              </div>
            </div>

            <button
              className="btn-checkout"
              disabled={selectedItems.length === 0}
            >
              Mua Hàng ({selectedItems.length})
            </button>
          </div>
        )}
      </div>

      {/* Suggested Products */}
      {cartItems.length > 0 && (
        <div className="suggested-products-cart">
          <h2 className="suggested-title">Sản phẩm mua kèm</h2>

          <div className="similar-products-wrapper">
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
                      <h3 className="similar-product-name">{item.title}</h3>
                      <div>
                        <span class="rating-stars">
                          {renderStars(item.rating)}
                        </span>
                      </div>
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
                    onClick={() => handleAddSimilarProductToCart(item)}
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
      )}

      <Footer />
    </div>
  );
};

export default CartPage;
