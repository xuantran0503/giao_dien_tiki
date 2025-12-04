import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { clearCheckoutHistory } from '../store/checkoutSlice';
import { Link } from 'react-router-dom';
import { formatPrice } from '../utils/priceUtils';
import './BuyerInfo.css';

const BuyerInfo = () => {
  const dispatch = useDispatch();
  
  const history = useSelector(state => state.checkout.history);
  // console.log(history)

  const handleClear = () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa toàn bộ lịch sử mua hàng?')) {
      dispatch(clearCheckoutHistory());
    }
  };

  return (
    <div className="buyer-info-container">
      <div className="buyer-info-header">
        <h2 className="buyer-info-title">
          Lịch sử đơn hàng {history && history.length > 0 && (
            <span style={{ fontSize: '16px', fontWeight: 'normal', color: '#666' }}>
              ({history.length} đơn hàng)
            </span>
          )}
        </h2>

        {history && history.length > 0 && (
          <button 
            onClick={handleClear}
            className="clear-history-btn"
          >
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
          {history.slice().reverse().map((entry, idx) => {
            // const products = entry.meta?.products || [];
            const products = entry.meta.products;
            const totalOrderValue = products.reduce((sum, p) => sum + (p.price * p.quantity), 0);

            return (
              <div key={idx} className="order-card">
                
                <div className="order-body">
                  {/* Customer Info */}
                  <div className="customer-info">
                    <h4 className="section-title">Thông tin người nhận</h4>
                    <div className="info-group">
                      <div><strong>Họ tên:</strong> {entry.fullName}</div>
                      <div><strong>SĐT:</strong> {entry.phone}</div>
                      <div><strong>Email:</strong> {entry.email}</div>
                      <div><strong>Địa chỉ:</strong> {entry.addressDetail}</div>
                      {entry.note && <div><strong>Ghi chú:</strong> {entry.note}</div>}
                    </div>
                  </div>

                  {/* Product List */}
                  <div className="product-list-section">
                    <h4 className="section-title">Sản phẩm ({products.length})</h4>
                    <div className="product-list">
                      {products.map((product, pIdx) => (
                        <div key={pIdx} className="product-item">
                          <img 
                            src={product.image} 
                            alt={product.name} 
                            style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #eee' }}
                          />
                          <div className="product-details">
                            <div className="product-name">{product.name}</div>
                            <div className="product-quantity">
                              Số lượng: <strong className="quantity-value">{product.quantity}</strong>
                            </div>
                          </div>
                          <div className="product-price">
                            Giá: {formatPrice(product.price)}<sup>₫</sup>
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
                      {formatPrice(totalOrderValue)}<sup>₫</sup>
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BuyerInfo;
