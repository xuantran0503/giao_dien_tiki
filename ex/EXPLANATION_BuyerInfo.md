# Giải thích chi tiết BuyerInfo.jsx

## Tổng quan
File này là một React component hiển thị lịch sử đơn hàng của người dùng. Component đọc dữ liệu từ Redux store và hỗ trợ đồng bộ dữ liệu giữa nhiều tab trình duyệt.

---

## Giải thích từng dòng code

### Import các thư viện (Dòng 1-6)
```javascript
import React, { useEffect } from 'react';
```
- Import React và hook `useEffect`
- `useEffect`: Dùng để xử lý side effects (lắng nghe sự kiện storage)

```javascript
import { useSelector, useDispatch } from 'react-redux';
```
- `useSelector`: Đọc dữ liệu từ Redux store
- `useDispatch`: Gửi action đến Redux store

```javascript
import { selectCheckoutHistory, clearCheckoutHistory, syncFromStorage } from '../store/checkoutSlice';
```
- Import các selector và action từ Redux slice:
  - `selectCheckoutHistory`: Selector lấy danh sách lịch sử đơn hàng
  - `clearCheckoutHistory`: Action xóa toàn bộ lịch sử
  - `syncFromStorage`: Action đồng bộ dữ liệu từ localStorage

```javascript
import { Link } from 'react-router-dom';
```
- Import component `Link` để tạo liên kết điều hướng

```javascript
import { formatPrice } from '../utils/priceUtils';
```
- Import hàm `formatPrice` để format giá tiền (thêm dấu phân cách hàng nghìn)

```javascript
import './BuyerInfo.css';
```
- Import file CSS

---

### Khai báo Component (Dòng 8)
```javascript
const BuyerInfo = () => {
```
- Tạo functional component không nhận props

---

### Khởi tạo hooks (Dòng 9-10)
```javascript
const dispatch = useDispatch();
```
- Tạo hàm dispatch để gửi action

```javascript
const history = useSelector(selectCheckoutHistory);
```
- Đọc danh sách lịch sử đơn hàng từ Redux store
- Sử dụng selector `selectCheckoutHistory` (đã được memoize để tối ưu performance)

---

### useEffect - Đồng bộ cross-tab (Dòng 12-33)
```javascript
useEffect(() => {
```
- Hook chạy sau khi component mount
- Dùng để lắng nghe sự kiện thay đổi localStorage

```javascript
const handleStorageChange = (e) => {
```
- Hàm xử lý khi localStorage thay đổi
- `e`: Event object chứa thông tin về thay đổi

```javascript
if (e.key === 'persist:root') {
```
- Kiểm tra xem key thay đổi có phải là `persist:root` không
- `persist:root`: Key mà redux-persist sử dụng để lưu toàn bộ Redux state

```javascript
try {
    const rootState = JSON.parse(e.newValue);
```
- Parse giá trị mới từ localStorage thành object
- `e.newValue`: Giá trị mới của key `persist:root`

```javascript
if (rootState && rootState.checkout) {
    const checkoutState = JSON.parse(rootState.checkout);
```
- Kiểm tra xem có phần `checkout` trong state không
- Parse `checkout` thành object (redux-persist lưu dạng JSON string lồng nhau)

```javascript
dispatch(syncFromStorage(checkoutState));
```
- Dispatch action `syncFromStorage` với dữ liệu checkout mới
- Cập nhật Redux store với dữ liệu từ tab khác

```javascript
} catch (err) {
    console.error('Failed to sync from storage:', err);
}
```
- Bắt lỗi nếu parse JSON thất bại

```javascript
window.addEventListener('storage', handleStorageChange);
```
- Đăng ký lắng nghe sự kiện `storage`
- Sự kiện này được trigger khi localStorage thay đổi từ **tab khác**

```javascript
return () => window.removeEventListener('storage', handleStorageChange);
```
- Cleanup function: Gỡ bỏ event listener khi component unmount
- Tránh memory leak

```javascript
}, [dispatch]);
```
- Dependency array: Chỉ chạy lại effect khi `dispatch` thay đổi (thực tế không bao giờ thay đổi)

---

### Hàm xóa lịch sử (Dòng 35-39)
```javascript
const handleClear = () => {
```
- Hàm xử lý khi người dùng click nút "Xóa lịch sử"

```javascript
if (window.confirm('Bạn có chắc chắn muốn xóa toàn bộ lịch sử mua hàng?')) {
```
- Hiển thị hộp thoại xác nhận
- Trả về `true` nếu user click OK, `false` nếu click Cancel

```javascript
dispatch(clearCheckoutHistory());
```
- Nếu user xác nhận, dispatch action `clearCheckoutHistory`
- Action này sẽ:
  - Xóa toàn bộ `history` array
  - Set `lastReset` = thời gian hiện tại
  - Các đơn hàng cũ sẽ bị filter ra khỏi danh sách

---

### Render JSX (Dòng 41-134)

#### Container (Dòng 42)
```javascript
<div className="buyer-info-container">
```
- Container chính của trang

#### Header (Dòng 43-59)
```javascript
<div className="buyer-info-header">
    <h2 className="buyer-info-title">
        📋 Lịch sử đơn hàng {history && history.length > 0 && (
            <span style={{ fontSize: '16px', fontWeight: 'normal', color: '#666' }}>
                ({history.length} đơn hàng)
            </span>
        )}
    </h2>
```
- Tiêu đề trang với icon 📋
- Hiển thị số lượng đơn hàng nếu có (ví dụ: "📋 Lịch sử đơn hàng (3 đơn hàng)")

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
- Chỉ hiển thị nút "Xóa lịch sử" khi có đơn hàng
- Click vào sẽ gọi `handleClear`

#### Empty State (Dòng 61-67)
```javascript
{!history || history.length === 0 ? (
    <div className="empty-state">
        <p className="empty-state-text">Chưa có đơn hàng nào.</p>
        <Link to="/" className="continue-shopping-link">
            Tiếp tục mua sắm
        </Link>
    </div>
```
- Hiển thị khi chưa có đơn hàng nào
- Link "Tiếp tục mua sắm" dẫn về trang chủ

#### Danh sách đơn hàng (Dòng 68-132)
```javascript
) : (
    <div className="order-list">
```
- Hiển thị khi có đơn hàng

```javascript
{history.slice().reverse().map((entry, idx) => {
```
- `slice()`: Tạo bản sao của array (không mutate array gốc)
- `reverse()`: Đảo ngược thứ tự (đơn hàng mới nhất lên đầu)
- `map()`: Render từng đơn hàng

```javascript
const products = entry.meta?.products || [];
```
- Lấy danh sách sản phẩm từ `entry.meta.products`
- Nếu không có, dùng array rỗng

```javascript
const totalOrderValue = products.reduce((sum, p) => sum + (p.price * p.quantity), 0);
```
- Tính tổng giá trị đơn hàng
- `reduce`: Cộng dồn `price * quantity` của từng sản phẩm

#### Order Card (Dòng 75)
```javascript
<div key={idx} className="order-card">
```
- Card hiển thị 1 đơn hàng
- `key={idx}`: React key để tối ưu rendering

#### Order Header (Dòng 77-88)
```javascript
<div className="order-header">
    <div>
        <span className="order-date-label">Ngày đặt: </span>
        <span className="order-date-value">{new Date(entry.createdAt).toLocaleString()}</span>
    </div>
```
- Hiển thị ngày đặt hàng
- `new Date(entry.createdAt).toLocaleString()`: Chuyển timestamp thành chuỗi ngày giờ dễ đọc

```javascript
<div>
    <span className="order-total-label">Tổng tiền: </span>
    <span className="order-total-value">
        {formatPrice(totalOrderValue)}<sup>₫</sup>
    </span>
</div>
```
- Hiển thị tổng tiền
- `formatPrice`: Format số tiền (thêm dấu phân cách)
- `<sup>₫</sup>`: Ký hiệu đồng ở dạng superscript

#### Order Body (Dòng 90)
```javascript
<div className="order-body">
```
- Phần thân của card, chứa thông tin chi tiết

#### Customer Info (Dòng 92-101)
```javascript
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
- Hiển thị thông tin người nhận
- Chỉ hiển thị ghi chú nếu có (`entry.note &&`)

#### Product List (Dòng 103-126)
```javascript
<div className="product-list-section">
    <h4 className="section-title">🛍️ Sản phẩm ({products.length})</h4>
```
- Tiêu đề với icon 🛍️ và số lượng sản phẩm

```javascript
<div className="product-list">
    {products.map((product, pIdx) => (
```
- Map qua từng sản phẩm để render

```javascript
<div key={pIdx} className="product-item">
    <img 
        src={product.image} 
        alt={product.name} 
        style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #eee' }}
    />
```
- Hiển thị ảnh sản phẩm
- `objectFit: 'cover'`: Ảnh sẽ fill đầy khung mà không bị méo

```javascript
<div className="product-details">
    <div className="product-name">{product.name}</div>
    <div className="product-quantity">
        Số lượng: <strong className="quantity-value">{product.quantity}</strong>
    </div>
</div>
```
- Hiển thị tên và số lượng sản phẩm

```javascript
<div className="product-price">
    {formatPrice(product.price)}<sup>₫</sup>
</div>
```
- Hiển thị giá sản phẩm

---

### Export Component (Dòng 137)
```javascript
export default BuyerInfo;
```
- Export component

---

## Luồng hoạt động

### 1. Hiển thị lịch sử
1. Component mount
2. `useSelector` đọc `history` từ Redux
3. Render danh sách đơn hàng (mới nhất lên đầu)

### 2. Đồng bộ cross-tab
1. User mở tab A và tab B
2. User thêm đơn hàng ở tab A
3. Redux-persist lưu vào localStorage
4. Tab B nhận sự kiện `storage`
5. Tab B dispatch `syncFromStorage`
6. Tab B cập nhật UI với dữ liệu mới

### 3. Xóa lịch sử
1. User click "Xóa lịch sử"
2. Hiện hộp thoại xác nhận
3. Nếu OK, dispatch `clearCheckoutHistory`
4. Redux cập nhật:
   - `history = []`
   - `lastReset = Date.now()`
5. Selector `selectCheckoutHistory` filter ra các đơn hàng cũ
6. UI hiển thị "Chưa có đơn hàng nào"

---

## Tóm tắt

- **Mục đích**: Hiển thị lịch sử đơn hàng
- **Dữ liệu**: Đọc từ Redux store qua selector `selectCheckoutHistory`
- **Tính năng**:
  - Hiển thị danh sách đơn hàng (mới nhất lên đầu)
  - Xóa toàn bộ lịch sử
  - Đồng bộ dữ liệu giữa nhiều tab
- **Cross-tab sync**: Lắng nghe sự kiện `storage` để cập nhật khi tab khác thay đổi dữ liệu
