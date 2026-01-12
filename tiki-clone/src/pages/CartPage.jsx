import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  addItemToCart,
  fetchCartDetail,
  removeItemFromCart,
  clearAllCartItems,
  updateCartItemQuantity,
  clearCart,
} from "../store/cartSlice";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import { topDealsData } from "../data/topDealsData";
import { calculateDiscountedPrice, formatPrice } from "../utils/priceUtils";
import "./CartPage.css";
import { PrevArrow, NextArrow } from "../components/shared/NavigationArrows";
import CheckoutForm from "../components/CheckoutForm/CheckoutForm";
import { useAppDispatch, useAppSelector } from "../store/hooks";

const CartPage = () => {
  const dispatch = useAppDispatch();

  const cartItems = useAppSelector((state) => state.cart.items);
  const cartId = useAppSelector((state) => state.cart.cartId);

  const [selectedItems, setSelectedItems] = useState([]);
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [editingQuantity, setEditingQuantity] = useState(null);
  const [quantityInput, setQuantityInput] = useState("");
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });

  useEffect(() => {
    if (cartId) {
      dispatch(fetchCartDetail(cartId));
    }
    return () => {
      dispatch(clearCart());
    };
  }, [dispatch, cartId]);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedItems(cartItems.map((item) => item.cartItemId));
      console.log(
        "Selected items:",
        cartItems.map((item) => item.cartItemId)
      );
    } else {
      setSelectedItems([]);
      console.log("Cleared all selected items");
    }
  };

  const handleSelectItem = (cartItemId) => {
    if (selectedItems.includes(cartItemId)) {
      //neu da chon thi bo ra khoi danh sach bang filter
      setSelectedItems(selectedItems.filter((id) => id !== cartItemId));
      console.log("Huy chon item voi cartItemId:", cartItemId);
    } else {
      //neu chua chon thi them vao
      setSelectedItems([...selectedItems, cartItemId]);
      console.log("Chon item voi cartItemId:", cartItemId);
    }
  };

  const handleIncrease = (productId, cartItemId, currentQuantity) => {
    const item = cartItems.find((i) => i.cartItemId === cartItemId);
    if (item) {
      dispatch(
        updateCartItemQuantity({
          productId: productId,
          cartItemId: cartItemId,
          quantity: currentQuantity + 1,
          price: item.price,
        })
      );
      console.log("Tang so luong cho item voi cartItemId:", cartItemId);
    }
  };

  const handleDecrease = (productId, cartItemId, currentQuantity) => {
    const item = cartItems.find((i) => i.cartItemId === cartItemId);
    if (!item) return;

    if (currentQuantity > 1) {
      dispatch(
        updateCartItemQuantity({
          productId: productId,
          cartItemId: cartItemId,
          quantity: currentQuantity - 1,
          price: item.price,
        })
      );
      console.log("Giam so luong cho item voi cartItemId:", cartItemId);
    } else {
      if (
        window.confirm(
          "Số lượng sản phẩm bằng 1. Bạn có muốn xóa sản phẩm khỏi giỏ hàng?"
        )
      ) {
        dispatch(removeItemFromCart({ cartItemId, productId }));
        setSelectedItems(selectedItems.filter((id) => id !== cartItemId));
      }
    }
  };

  // console.log("cart item product id", cartItems.productId);

  const handleQuantityClick = (id, quantity) => {
    setEditingQuantity(id);
    setQuantityInput(quantity.toString());
  };

  const handleQuantityChange = (e) => {
    setQuantityInput(e.target.value);
  };

  const handleQuantityBlur = (productId, cartItemId) => {
    const newQuantity = parseInt(quantityInput) || 1;
    const item = cartItems.find((i) => i.cartItemId === cartItemId);
    if (newQuantity > 0 && item) {
      dispatch(
        updateCartItemQuantity({
          productId: productId,
          cartItemId: cartItemId,
          quantity: newQuantity,
          price: item.price,
        })
      );
    }
    setEditingQuantity(null);
    setQuantityInput("");
  };

  const handleQuantityKeyPress = (e, productId, cartItemId) => {
    if (e.key === "Enter") {
      handleQuantityBlur(productId, cartItemId);
    } else if (e.key === "Escape") {
      setEditingQuantity(null);
      setQuantityInput("");
    }
  };

  const handleCheckoutClick = () => {
    console.log("Checkout clicked, selectedItems:", selectedItems);
    console.log(
      "Selected cart items for checkout:",
      cartItems.filter((item) => selectedItems.includes(item.cartItemId))
    );

    setShowCheckoutForm(true);
  };

  const handleCheckoutSubmit = async (checkoutData) => {
    console.log("Add completed:", checkoutData);

    // Xóa các sản phẩm đã mua khỏi giỏ hàng
    for (const cartItemId of selectedItems) {
      const item = cartItems.find((i) => i.cartItemId === cartItemId);
      if (item) {
        await dispatch(
          removeItemFromCart({ cartItemId, productId: item.productId })
        );
      }
    }

    setSelectedItems([]);
    setShowCheckoutForm(false);

    setNotification({
      show: true,
      message: "Đặt hàng thành công! Cảm ơn bạn đã mua sắm tại Tiki.",
      type: "success",
    });

    setTimeout(() => {
      setNotification({ show: false, message: "", type: "" });
    }, 4000);
  };

  const handleCheckoutCancel = () => {
    setShowCheckoutForm(false);
  };

  const handleCheckoutClose = () => {
    // console.log('Closing checkout form from callback');
    setShowCheckoutForm(false);
  };

  const handleRemove = async (productId, cartItemId) => {
    if (
      window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?")
    ) {
      console.log("Starting remove for cartItemId:", cartItemId);
      const result = await dispatch(
        removeItemFromCart({ cartItemId, productId })
      );

      if (removeItemFromCart.fulfilled.match(result)) {
        // Cập nhật lại danh sách được chọn ngay lập tức
        setSelectedItems((prev) => prev.filter((id) => id !== cartItemId));
        console.log("Removed from UI success:", cartItemId);
      } else {
        alert("Không thể xóa sản phẩm. Vui lòng thử lại!");
      }
    }
  };

  // Xóa các sản phẩm đã chọn
  const handleClearSelected = async () => {
    if (selectedItems.length === 0) {
      if (window.confirm("Bạn có chắc chắn muốn xóa toàn bộ giỏ hàng?")) {
        dispatch(clearAllCartItems());
        setSelectedItems([]);
      }
      return;
    }

    if (
      window.confirm(
        `Bạn có chắc chắn muốn xóa ${selectedItems.length} sản phẩm đã chọn khỏi giỏ hàng?`
      )
    ) {
      try {
        if (selectedItems.length === cartItems.length) {
          dispatch(clearAllCartItems());
        } else {
          // Use Promise.all for parallel deletion
          const deletePromises = selectedItems.map((cartItemId) => {
            const item = cartItems.find((i) => i.cartItemId === cartItemId);
            if (item) {
              return dispatch(
                removeItemFromCart({ cartItemId, productId: item.productId })
              );
            }
            return Promise.resolve();
          });

          await Promise.all(deletePromises);
        }
        setSelectedItems([]);
        console.log("Đã xóa các sản phẩm đã chọn");
      } catch (error) {
        console.error("Lỗi khi xóa sản phẩm:", error);
        alert("Có lỗi xảy ra khi xóa sản phẩm.");
      }
    }
  };

  const calculateSubtotal = () => {
    return cartItems
      .filter((item) => selectedItems.includes(item.cartItemId))
      .reduce((total, item) => {
        return total + item.originalPrice * item.quantity;
      }, 0);
  };

  const calculateTotal = () => {
    return cartItems
      .filter((item) => selectedItems.includes(item.cartItemId))
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
    // if (!item.productId) {
    //   console.error("Similar product has no backend productId");
    //   return;
    // }
    dispatch(
      addItemToCart({
        productId: item.productId.toString(),
        name: item.title,
        image: item.image,
        price: itemFinalPrice,
        originalPrice: item.originalPrice,
        discount: item.discount,
        quantity: 1,
      })
    );
  };

  const [currentPage, setCurrentPage] = useState(1);

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
                <div className="cart-select-left">
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
                </div>

                <div className="cart-columns">
                  <span className="col-price">Đơn giá</span>
                  <span className="col-quantity">Số lượng</span>
                  <span className="col-total">Thành tiền</span>
                  <span className="col-action">
                    <button
                      className="btn-clear-all"
                      onClick={handleClearSelected}
                      title="Xóa các sản phẩm đã chọn"
                    >
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"
                          fill="currentColor"
                        />
                      </svg>
                      <span>
                        {selectedItems.length > 0
                          ? "Xóa SP đã chọn"
                          : "Xóa tất cả"}
                      </span>
                    </button>
                  </span>
                </div>
              </div>

              {/* Cart Items */}
              <div className="cart-items">
                {cartItems.map((item) => (
                  <div key={item.cartItemId} className="cart-item">
                    <div className="cart-item-left">
                      <label className="checkbox-container">
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(item.cartItemId)}
                          onChange={() => handleSelectItem(item.cartItemId)}
                        />
                        <span className="checkmark"></span>
                      </label>

                      <Link
                        to={`/product/${item.listingId || item.id}`}
                        state={{ cartItem: item }}
                        className="item-image-link"
                      >
                        <img
                          src={
                            item.image ||
                            "https://salt.tikicdn.com/cache/750x750/ts/product/ac/65/4e/e21a92395ae8a7a1c2af3da945d76944.jpg.webp"
                          }
                          alt={item.name}
                          className="item-image"
                        />
                      </Link>

                      <div className="item-info">
                        <Link
                          to={`/product/${item.listingId || item.id}`}
                          state={{ cartItem: item }}
                          className="item-name"
                        >
                          {item.name}
                        </Link>
                      </div>
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
                      <div className="qty-selector">
                        <button
                          className="qty-btn"
                          onClick={() =>
                            handleDecrease(
                              item.productId,
                              item.cartItemId,
                              item.quantity
                            )
                          }
                          // disabled={item.quantity <= 1}
                        >
                          -
                        </button>

                        {editingQuantity === item.productId ? (
                          <input
                            type="number"
                            className="qty-input editing"
                            value={quantityInput}
                            style={{
                              width: `${
                                Math.max(2, String(quantityInput).length) + 1
                              }ch`,
                            }}
                            onChange={handleQuantityChange}
                            onBlur={() =>
                              handleQuantityBlur(
                                item.productId,
                                item.cartItemId
                              )
                            }
                            onKeyDown={(e) =>
                              handleQuantityKeyPress(
                                e,
                                item.productId,
                                item.cartItemId
                              )
                            }
                            autoFocus
                            min="1"
                          />
                        ) : (
                          <input
                            type="text"
                            className="qty-input"
                            value={item.quantity}
                            onClick={() =>
                              handleQuantityClick(item.productId, item.quantity)
                            }
                            readOnly
                            style={{
                              cursor: "pointer",
                              width: `${
                                Math.max(2, String(item.quantity).length) + 1
                              }ch`,
                            }}
                          />
                        )}

                        <button
                          className="qty-btn"
                          onClick={() =>
                            handleIncrease(
                              item.productId,
                              item.cartItemId,
                              item.quantity
                            )
                          }
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="item-total">
                      {formatPrice(item.price * item.quantity)}
                      <sup>₫</sup>
                    </div>

                    <button
                      className="item-remove"
                      onClick={() =>
                        handleRemove(item.productId, item.cartItemId)
                      }
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
                      <span>Xóa</span>
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
              onClick={handleCheckoutClick}
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
                        <span className="rating-stars">
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

      {showCheckoutForm && (
        <CheckoutForm
          onSubmit={handleCheckoutSubmit}
          onCancel={handleCheckoutCancel}
          onClose={handleCheckoutClose}
          meta={{
            items: cartItems.filter((item) =>
              selectedItems.includes(item.cartItemId)
            ),
            totalAmount: cartItems
              .filter((item) => selectedItems.includes(item.cartItemId))
              .reduce((total, item) => total + item.price * item.quantity, 0),
          }}
        />
      )}

      {/* Notification */}
      {notification.show && (
        <div className={`add-to-cart-notification ${notification.type}`}>
          <div className="notification-content">
            <span className="notification-icon">
              {notification.type === "success" ? "✓" : "✕"}
            </span>
            <span>{notification.message}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
