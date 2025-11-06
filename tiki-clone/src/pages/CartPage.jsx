import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { removeFromCart, updateQuantity } from "../store/cartSlice";
import Header from "../components/Header/Header";
import { formatPrice } from "../utils/priceUtils";
import "./CartPage.css";

const CartPage = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  const totalQuantity = useSelector((state) => state.cart.totalQuantity);

  const [selectedItems, setSelectedItems] = useState(//selectedItems la danh sach san pham da chon  
    cartItems.map((item) => item.id) //mac dinh chon tat ca san pham trong gio hang
  );

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedItems(cartItems.map((item) => item.id));
    } else {
      setSelectedItems([]);
    }
  };
  
  const handleSelectItem = (id) => {
    if (selectedItems.includes(id)) { //neu da chon thi bo ra khoi danh sach bang filter
      setSelectedItems(selectedItems.filter((itemId) => itemId !== id));
    } else {//neu chua chon thi them vao
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
        const originalPrice = item.originalPrice ;
        return total + originalPrice * item.quantity;
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
          <div className="suggested-grid">
            {/* Có thể thêm sản phẩm gợi ý ở đây */}
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
