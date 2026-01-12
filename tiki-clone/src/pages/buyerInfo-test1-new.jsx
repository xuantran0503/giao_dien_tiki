import { useSelector, useDispatch } from "react-redux";
import { useMemo } from "react";
import { clearCheckoutHistory } from "../store/checkoutSlice";
import { selectSelectedAddress } from "../store/addressSlice";
import { Link } from "react-router-dom";
import { formatPrice } from "../utils/priceUtils";
import "./BuyerInfo.css";
import Header from "../components/Header/Header";

// Helper functions moved outside component to prevent recreation
const getOrderAddress = (order, selectedAddress) => {
  const parseDeliveryAddress = (deliveryAddress) => {
    if (!deliveryAddress || typeof deliveryAddress !== "string") {
      return { detailedAddress: "N/A", generalAddress: "N/A" };
    }

    const parts = deliveryAddress.split("\n");

    if (parts.length >= 2) {
      let detailedAddress = parts[0];
      let generalAddress = parts[1];

      if (detailedAddress.includes("Địa chỉ chi tiết: ")) {
        detailedAddress = detailedAddress
          .replace("Địa chỉ chi tiết: ", "")
          .trim();
      }
      if (generalAddress.includes("Địa chỉ: ")) {
        generalAddress = generalAddress.replace("Địa chỉ: ", "").trim();
      }

      return { detailedAddress, generalAddress };
    } else {
      return {
        detailedAddress: deliveryAddress,
        generalAddress: selectedAddress || "N/A",
      };
    }
  };

  const parsed = parseDeliveryAddress(order?.deliveryAddress);
  return {
    detailedAddress: parsed.detailedAddress,
    generalAddress: parsed.generalAddress,
  };
};

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);

  return date.toLocaleString("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};

const BuyerInfo = () => {
  const dispatch = useDispatch();
  const history = useSelector((state) => state.checkout.history);
  const selectedAddress = useSelector(selectSelectedAddress);

  // Use useMemo to avoid reversing and mapping on every render
  const reversedHistory = useMemo(() => {
    if (!history) return [];
    return history.slice().reverse();
  }, [history]);

  const handleClear = () => {
    if (window.confirm("Bạn có chắc chắn muốn xóa toàn bộ lịch sử mua hàng?")) {
      dispatch(clearCheckoutHistory());
    }
  };

  return (
    <div className="buyer-info">
      <Header />

      <div className="buyer-info-container">
        <div className="buyer-info-header">
          <h2 className="buyer-info-title">
            Lịch sử đơn hàng{" "}
            {history && history.length > 0 && (
              <span
                style={{
                  fontSize: "16px",
                  fontWeight: "normal",
                  color: "#666",
                }}
              >
                ({history.length} đơn hàng)
              </span>
            )}
          </h2>

          {history && history.length > 0 && (
            <button onClick={handleClear} className="clear-history-btn">
              Xóa lịch sử
            </button>
          )}
        </div>

        {!history || history.length === 0 ? (
          <div className="empty-state">
            <p className="empty-state-text">Chưa có đơn hàng nào.</p>
            <Link to="/" className="continue-shopping-link">
              Tiếp tục mua sắm
            </Link>
          </div>
        ) : (
          <div className="order-list">
            {reversedHistory.map((order, idx) => {
                if (!order || typeof order !== "object") return null;

                const products = order.items || [];
                const customerInfo = order.customerInfo || {};
                const { detailedAddress, generalAddress } = getOrderAddress(
                  order,
                  selectedAddress
                );

                return (
                  <div key={order.id || idx} className="order-card">
                    <div className="order-header">
                      <div className="order-id">
                        <strong>Mã đơn hàng: {order.id}</strong>
                      </div>
                      {/* <div className={`order-status status-${order.status}`}>
                    {getStatusText(order.status)}
                  </div> */}
                    </div>

                    <div className="order-info">
                      <div className="order-date">
                        <span>Ngày đặt: {formatDate(order.orderDate)}</span>
                      </div>
                      {/* <div className="payment-method">
                    <span>Thanh toán: {order.paymentMethod}</span>
                  </div> */}
                    </div>

                    <div className="order-body">
                      <div className="customer-info">
                        <h4 className="section-title">Thông tin người nhận</h4>
                        <div className="info-group">
                          <div>
                            <strong>Họ tên:</strong>{" "}
                            {customerInfo.fullName || "N/A"}
                          </div>
                          <div>
                            <strong>SĐT:</strong> {customerInfo.phone || "N/A"}
                          </div>
                          <div>
                            <strong>Email:</strong>{" "}
                            {customerInfo.email || "N/A"}
                          </div>
                          <div>
                            <strong>Địa chỉ chi tiết:</strong> {detailedAddress}
                          </div>
                          <div>
                            <strong>Địa chỉ:</strong> {generalAddress}
                            {/* {isSnapshot && order.addressSnapshot?.timestamp && (
                          <span style={{ fontSize: '12px', color: '#666', marginLeft: '8px' }}>
                            (Tại thời điểm: {formatDate(order.addressSnapshot.timestamp)})
                          </span>

                        )} */}
                          </div>
                          {customerInfo.note && (
                            <div>
                              <strong>Ghi chú:</strong> {customerInfo.note}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Product List */}
                      <div className="product-list-section">
                        <h4 className="section-title">
                          Sản phẩm ({products.length})
                        </h4>
                        <div className="product-list">
                          {products.map((product, pIdx) => (
                            <div key={pIdx} className="product-item">
                              <img
                                src={product.image || null}
                                alt={product.name}
                                style={{
                                  width: "60px",
                                  height: "60px",
                                  objectFit: "cover",
                                  borderRadius: "4px",
                                  border: "1px solid #eee",
                                }}
                              />
                              <div className="product-details">
                                <div className="product-name">
                                  {product.name}
                                </div>
                                <div className="product-quantity">
                                  Số lượng:{" "}
                                  <strong className="quantity-value">
                                    {product.quantity}
                                  </strong>
                                </div>
                              </div>
                              <div className="product-price">
                                Giá: {formatPrice(product.price)}
                                <sup>₫</sup>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="order-footer">
                      <div>
                        <span className="order-total-label">Tổng tiền: </span>
                        <span className="order-total-value">
                          {formatPrice(order.totalAmount)}
                          <sup>₫</sup>
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
};

export default BuyerInfo;
