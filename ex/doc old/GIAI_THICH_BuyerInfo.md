# 📄 Giải Thích Chi Tiết: BuyerInfo.jsx

## 📌 Tổng Quan
File `BuyerInfo.jsx` là trang hiển thị lịch sử đơn hàng. Nó đọc dữ liệu từ Redux (được lưu bởi CheckoutForm) và hiển thị các đơn hàng đã đặt với thông tin người mua và danh sách sản phẩm.

---

## 📝 Chi Tiết Từng Dòng Code

### 1️⃣ Import Modules
```javascript
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectCheckoutHistory, clearCheckoutHistory, syncFromStorage } from '../store/checkoutSlice';
import { Link } from 'react-router-dom';
import { formatPrice } from '../utils/priceUtils';
import './BuyerInfo.css';
```
**Giải thích:**
- `useEffect`: Hook để chạy side effect (listen storage changes)
- `useSelector, useDispatch`: Redux hooks
- **Selectors & actions từ checkoutSlice:**
  - `selectCheckoutHistory`: Selector memoized để lấy lịch sử đơn hàng
  - `clearCheckoutHistory`: Action để xóa toàn bộ lịch sử
  - `syncFromStorage`: Action để sync dữ liệu từ localStorage (cross-tab)
- `Link`: React Router navigation
- `formatPrice`: Utility format tiền
- CSS: Styling cho component

---

### 2️⃣ Component Function & Hooks
```javascript
const BuyerInfo = () => {
  const dispatch = useDispatch();
  const history = useSelector(selectCheckoutHistory);
```
**Giải thích:**
- `dispatch`: Gửi actions đến Redux store
- `history`: Lấy checkout history từ Redux store
  - Dùng `selectCheckoutHistory` selector (memoized)
  - Chỉ lấy đơn hàng được tạo sau lần reset cuối cùng

---

### 3️⃣ Sync Across Tabs (useEffect)
```javascript
useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'checkout_history') {
        try {
          const checkoutState = JSON.parse(e.newValue);
          if (checkoutState) {
            dispatch(syncFromStorage(checkoutState));
          }
        } catch (err) {
          console.error('Failed to sync from storage:', err);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [dispatch]);
```
**Giải thích:**
- **Mục đích:** Khi user mở 2 tabs:
  - Tab A: Đặt hàng → lưu localStorage
  - Tab B: Lắng nghe sự kiện 'storage' → sync dữ liệu mới

- **Storage Event:**
  - `window.addEventListener('storage', handleStorageChange)`: Lắng nghe thay đổi localStorage
  - Event được triggered khi localStorage thay đổi **ở tab khác**

- **Handler:**
  - `e.key === 'checkout_history'`: Kiểm tra key, chỉ xử lý checkout history
  - `JSON.parse(e.newValue)`: Parse JSON từ localStorage
  - `dispatch(syncFromStorage(...))`: Dispatch action để cập nhật Redux store
  - `try/catch`: Xử lý lỗi parse

- **Cleanup:**
  - `return () => window.removeEventListener(...)`: Bỏ listener khi component unmount (tránh memory leak)

---

### 4️⃣ Handle Clear History
```javascript
const handleClear = () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa toàn bộ lịch sử mua hàng?')) {
      // Dispatch action - reducer sẽ tự động xóa localStorage
      dispatch(clearCheckoutHistory());
      console.log('✓ Đã xóa lịch sử checkout');
    }
  };
```
**Giải thích:**
- **Xác nhận trước khi xóa:**
  - `window.confirm(...)`: Hiển thị dialog xác nhận
  - Nếu user click "OK" → tiếp tục xóa
  - Nếu click "Cancel" → dừng lại

- **Xóa dữ liệu:**
  - `dispatch(clearCheckoutHistory())`: Dispatch action
  - Reducer sẽ:
    - Clear mảng history ở Redux
    - **Tự động xóa localStorage** (checkoutSlice đã implement)
  - Kết quả: Lịch sử bị xóa ở cả Redux và localStorage

---

### 5️⃣ Return JSX - Main Container
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
```
**Giải thích:**
- **Container:** Wrapper chính (`buyer-info-container`)
- **Header:** Tiêu đề với icon
- **Hiển thị số lượng:**
  - `{history && history.length > 0 && ...}`: Chỉ hiển thị nếu có lịch sử
  - `({history.length} đơn hàng)`: Số lượng đơn hàng
  - `style={{ ... }}`: Inline CSS để style nhỏ hơn + màu xám

---

### 6️⃣ Clear Button
```javascript
{history && history.length > 0 && (
  <button 
    onClick={handleClear}
    className="clear-history-btn"
  >
    Xóa lịch sử
  </button>
)}
```
**Giải thích:**
- Chỉ hiển thị nút khi có lịch sử (`history.length > 0`)
- Click → Gọi `handleClear` để xóa dữ liệu

---

### 7️⃣ Empty State
```javascript
{!history || history.length === 0 ? (
    <div className="empty-state">
      <p className="empty-state-text">Chưa có đơn hàng nào.</p>
      <Link to="/" className="continue-shopping-link">
        Tiếp tục mua sắm
      </Link>
    </div>
  ) : (
    // ... render order list
  )
}
```
**Giải thích:**
- **Nếu không có lịch sử:**
  - Hiển thị thông báo "Chưa có đơn hàng nào"
  - Nút "Tiếp tục mua sắm" link về trang chủ (route `/`)
- **Nếu có lịch sử:**
  - Render danh sách đơn hàng (phần else)

---

### 8️⃣ Order List Loop
```javascript
<div className="order-list">
  {history.slice().reverse().map((entry, idx) => {
```
**Giải thích:**
- `history.slice().reverse()`: 
  - `slice()`: Tạo copy mảng (để không mutate original)
  - `reverse()`: Đảo ngược thứ tự → **đơn hàng mới nhất ở trên**
- `map((entry, idx) => ...)`: Loop từng đơn hàng
  - `entry`: Object chứa thông tin 1 đơn hàng
  - `idx`: Index (0, 1, 2, ...)

---

### 9️⃣ Calculate Order Total
```javascript
const products = entry.meta?.products || [];
const totalOrderValue = products.reduce((sum, p) => sum + (p.price * p.quantity), 0);
```
**Giải thích:**
- `entry.meta?.products || []`:
  - `?.` (optional chaining): Nếu `entry.meta` null/undefined → trả về undefined (không error)
  - `|| []`: Nếu không có products → dùng mảng rỗng
  - Kết quả: Mảng sản phẩm hoặc []

- **Tính tổng tiền:**
  - `reduce((sum, p) => sum + (p.price * p.quantity), 0)`:
    - Loop từng sản phẩm
    - Cộng: `sum + (price × quantity)`
    - Giá trị ban đầu: 0
  - **Kết quả:** Tổng tiền cho cả đơn hàng

---

### 🔟 Order Card - Header
```javascript
<div key={idx} className="order-card">
  {/* Order Header */}
  <div className="order-header">
    <div>
      <span className="order-total-label">Tổng tiền: </span>
      <span className="order-total-value">
        {formatPrice(totalOrderValue)}<sup>₫</sup>
      </span>
    </div>
  </div>
```
**Giải thích:**
- **key={idx}:** Unique key cho React list (lưu ý: dùng idx nếu list không thay đổi thứ tự)
- **Order header:** Hiển thị tổng tiền cho đơn hàng
  - `formatPrice(totalOrderValue)`: Format tiền (ví dụ: 1,500,000)
  - `<sup>₫</sup>`: Ký hiệu ₫ ở trên

---

### 1️⃣1️⃣ Order Body - Customer Info
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
**Giải thích:**
- **Section title:** "Thông tin người nhận"
- **Hiển thị thông tin:** Từ object `entry` (dữ liệu form):
  - `entry.fullName`: Họ và tên
  - `entry.phone`: Số điện thoại
  - `entry.email`: Email
  - `entry.addressDetail`: Địa chỉ
  - `entry.note`: Ghi chú (chỉ hiển thị nếu có)
    - `{entry.note && <div>...</div>}`: Conditional rendering

---

### 1️⃣2️⃣ Order Body - Product List
```javascript
{/* Product List */}
<div className="product-list-section">
  <h4 className="section-title">🛍️ Sản phẩm ({products.length})</h4>
  <div className="product-list">
    {products.map((product, pIdx) => (
      <div key={pIdx} className="product-item">
```
**Giải thích:**
- **Section title:** "🛍️ Sản phẩm" + số lượng
- **Product loop:**
  - `products.map(...)`: Loop từng sản phẩm
  - `key={pIdx}`: Key là product index
  - `product`: Object sản phẩm

---

### 1️⃣3️⃣ Product Item - Image
```javascript
<img 
  src={product.image} 
  alt={product.name} 
  style={{ 
    width: '60px', 
    height: '60px', 
    objectFit: 'cover', 
    borderRadius: '4px', 
    border: '1px solid #eee' 
  }}
/>
```
**Giải thích:**
- **Inline style:**
  - `width/height: 60px`: Ảnh vuông 60×60
  - `objectFit: 'cover'`: Cắt ảnh để lấp khung
  - `borderRadius: 4px`: Góc bo tròn
  - `border: 1px solid #eee`: Border nhẹ

---

### 1️⃣4️⃣ Product Item - Details
```javascript
<div className="product-details">
  <div className="product-name">{product.name}</div>
  <div className="product-quantity">
    Số lượng: <strong className="quantity-value">{product.quantity}</strong>
  </div>
</div>
```
**Giải thích:**
- **Product name:** Tên sản phẩm
- **Quantity:** Số lượng được đặt
  - Dùng `<strong>` để bold số lượng

---

### 1️⃣5️⃣ Product Item - Price
```javascript
<div className="product-price">
  {formatPrice(product.price)}<sup>₫</sup>
</div>
```
**Giải thích:**
- **Giá 1 sản phẩm:**
  - `formatPrice(product.price)`: Format tiền (không × quantity)
  - `<sup>₫</sup>`: Ký hiệu ₫ ở trên

---

## 🔄 Data Flow

### 📊 Dữ liệu từ Redux
```javascript
Reducer (checkoutSlice) State:
{
  data: { ... },           // Đơn hàng mới nhất
  history: [              // Lịch sử tất cả đơn hàng
    {
      fullName: "Trần Văn A",
      phone: "0383477786",
      email: "trana@example.com",
      addressDetail: "123 Nguyễn Văn B, Hà Nội",
      note: "Giao nhanh",
      meta: {
        products: [
          { id: 1, name: "iPhone 13", price: 15000000, quantity: 1, image: "..." },
          { id: 2, name: "AirPods", price: 3000000, quantity: 2, image: "..." }
        ]
      },
      createdAt: 1700000000000
    },
    { ... } // Đơn hàng khác
  ],
  lastUpdated: 1700000000000,
  lastReset: 0
}
```

### 🔀 Selector Filter Logic
```javascript
selectCheckoutHistory = createSelector(
  [selectCheckoutState],
  (checkout) => {
    const { history, lastReset } = checkout;
    if (!history || !Array.isArray(history)) return [];
    if (!lastReset) return history;
    // Chỉ trả về đơn hàng được tạo AFTER lastReset
    return history.filter((item) => (item.createdAt || 0) > lastReset);
  }
);
```
**Giải thích:**
- Memoized selector để tối ưu re-render
- **Logic:**
  - Nếu `lastReset = 0` (chưa reset) → trả về tất cả history
  - Nếu `lastReset > 0` → chỉ trả về items được tạo **sau** `lastReset`
  - **Mục đích:** Khi user click "Xóa lịch sử", reducer set `lastReset = Date.now()`
    - Các đơn hàng cũ sẽ bị filter out
    - Các đơn hàng mới sẽ hiển thị

---

## 💾 Storage & Cross-Tab Sync

### localStorage
```javascript
// checkoutSlice reducer:
localStorage.setItem("checkout_history", JSON.stringify(state));
```
**Mục đích:** Persist dữ liệu khi reload page

### Cross-Tab Sync
```javascript
// Tab A:
- User đặt hàng → dispatch saveCheckout()
- Reducer lưu localStorage

// Tab B:
- Listen 'storage' event
- Nếu checkout_history thay đổi → dispatch syncFromStorage()
- Reducer cập nhật state
- Component re-render → hiển thị đơn hàng mới
```

---

## 🎯 Use Cases

### ✅ User đặt hàng thành công
1. CheckoutForm submit
2. Redux saveCheckout → lưu history + localStorage
3. BuyerInfo page load → đọc từ Redux → hiển thị đơn hàng mới

### ✅ User mở 2 tabs
1. Tab A: Đặt hàng → saveCheckout()
2. Tab B: Bị trigger 'storage' event → syncFromStorage()
3. Tab B tự động cập nhật hiển thị

### ✅ User refresh page
1. Page reload
2. Redux initial state load từ localStorage (trong `loadCheckoutFromStorage()`)
3. BuyerInfo hiển thị lịch sử đã lưu

### ✅ User xóa lịch sử
1. Click nút "Xóa lịch sử"
2. Dispatch clearCheckoutHistory()
3. Reducer clear history + xóa localStorage
4. Page re-render → hiển thị "Chưa có đơn hàng nào"
