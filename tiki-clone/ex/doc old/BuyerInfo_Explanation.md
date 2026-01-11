# Giải thích chi tiết file `src/pages/BuyerInfo.jsx`

File này là trang hiển thị "Thông tin người mua" hoặc chính xác hơn là "Lịch sử đơn hàng" của người dùng.

## 1. Import

```javascript
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  selectCheckoutHistory,
  clearCheckoutHistory,
  syncFromStorage,
} from "../store/checkoutSlice";
import { Link } from "react-router-dom";
import { formatPrice } from "../utils/priceUtils";
import "./BuyerInfo.css";
```

- `useSelector`: Hook để lấy dữ liệu từ Redux store.
- `Link`: Component của `react-router-dom` để tạo liên kết chuyển trang (như thẻ `<a>` nhưng không reload trang).
- `formatPrice`: Hàm tiện ích để định dạng số tiền (ví dụ: 100000 -> 100.000).
- Các import từ `checkoutSlice` để tương tác với dữ liệu đơn hàng.

## 2. Component và Hooks

```javascript
const BuyerInfo = () => {
  const dispatch = useDispatch();
  const history = useSelector(selectCheckoutHistory);
```

- `history`: Lấy danh sách lịch sử đơn hàng từ Redux store thông qua selector `selectCheckoutHistory`.

## 3. Đồng bộ dữ liệu (Sync Storage)

```javascript
useEffect(() => {
  const handleStorageChange = (e) => {
    if (e.key === "checkout_history") {
      try {
        const checkoutState = JSON.parse(e.newValue);
        if (checkoutState) {
          dispatch(syncFromStorage(checkoutState));
        }
      } catch (err) {
        console.error("Failed to sync from storage:", err);
      }
    }
  };
  window.addEventListener("storage", handleStorageChange);
  return () => window.removeEventListener("storage", handleStorageChange);
}, [dispatch]);
```

- `useEffect`: Chạy một lần khi component được mount.
- Mục đích: Lắng nghe sự kiện `storage` của trình duyệt. Sự kiện này kích hoạt khi `localStorage` bị thay đổi ở một **tab khác** của cùng trình duyệt.
- Nếu key thay đổi là `checkout_history`, nó sẽ parse dữ liệu mới và dispatch action `syncFromStorage` để cập nhật Redux store của tab hiện tại. Điều này giúp đồng bộ dữ liệu nếu người dùng mở nhiều tab.

## 4. Hàm Xóa Lịch Sử

```javascript
const handleClear = () => {
  if (window.confirm("Bạn có chắc chắn muốn xóa toàn bộ lịch sử mua hàng?")) {
    dispatch(clearCheckoutHistory());
  }
};
```

- Hiển thị hộp thoại xác nhận (`confirm`). Nếu người dùng chọn OK, gọi action `clearCheckoutHistory` để xóa hết đơn hàng.

## 5. Giao diện (JSX) - Header

```javascript
  return (
    <div className="buyer-info-container">
      <div className="buyer-info-header">
        <h2 className="buyer-info-title">
          📋 Lịch sử đơn hàng {history && history.length > 0 && (
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
```

- Hiển thị tiêu đề "Lịch sử đơn hàng".
- Nếu có đơn hàng (`history.length > 0`), hiển thị thêm số lượng đơn hàng và nút "Xóa lịch sử".

## 6. Trạng thái Trống (Empty State)

```javascript
      {!history || history.length === 0 ? (
        <div className="empty-state">
          <p className="empty-state-text">Chưa có đơn hàng nào.</p>
          <Link to="/" className="continue-shopping-link">
            Tiếp tục mua sắm
          </Link>
        </div>
      ) : (
```

- Nếu `history` không có dữ liệu, hiển thị thông báo "Chưa có đơn hàng nào" và nút link quay về trang chủ (`/`).

## 7. Danh sách Đơn hàng (Order List)

```javascript
        <div className="order-list">
          {history.slice().reverse().map((entry, idx) => {
            const products = entry.meta?.products || [];
            const totalOrderValue = products.reduce((sum, p) => sum + (p.price * p.quantity), 0);

            return (
              <div key={idx} className="order-card">
```

- `history.slice().reverse()`: Tạo bản sao và đảo ngược danh sách để hiển thị đơn hàng **mới nhất lên đầu**.
- `.map(...)`: Duyệt qua từng đơn hàng (`entry`) để render ra giao diện.
- `products`: Lấy danh sách sản phẩm từ `entry.meta.products`.
- `totalOrderValue`: Tính tổng tiền đơn hàng bằng cách cộng dồn (giá \* số lượng) của từng sản phẩm.

### 7.1. Header của từng Đơn hàng (Tổng tiền)

```javascript
<div className="order-header">
  <div>
    <span className="order-total-label">Tổng tiền: </span>
    <span className="order-total-value">
      {formatPrice(totalOrderValue)}
      <sup>₫</sup>
    </span>
  </div>
</div>
```

- Hiển thị tổng tiền của đơn hàng đó.

### 7.2. Thông tin Người nhận

```javascript
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
```

- Hiển thị các thông tin cá nhân người mua (Họ tên, SĐT, Email, Địa chỉ...) lấy từ `entry`.

### 7.3. Danh sách Sản phẩm trong Đơn

```javascript
{
  /* Product List */
}
<div className="product-list-section">
  <h4 className="section-title">🛍️ Sản phẩm ({products.length})</h4>
  <div className="product-list">
    {products.map((product, pIdx) => (
      <div key={pIdx} className="product-item">
        <img
          src={product.image}
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
          <div className="product-name">{product.name}</div>
          <div className="product-quantity">
            Số lượng:{" "}
            <strong className="quantity-value">{product.quantity}</strong>
          </div>
        </div>
        <div className="product-price">
          {formatPrice(product.price)}
          <sup>₫</sup>
        </div>
      </div>
    ))}
  </div>
</div>;
```

- Duyệt qua mảng `products` của đơn hàng đó để hiển thị từng sản phẩm (Ảnh, Tên, Số lượng, Giá).

## 8. Kết thúc

```javascript
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
```

- Đóng các thẻ div và export component.
