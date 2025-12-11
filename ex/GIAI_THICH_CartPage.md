# 📄 Giải Thích Chi Tiết: CartPage.jsx

## 📌 Tổng Quan
File `CartPage.jsx` là trang giỏ hàng chính. Nó hiển thị danh sách sản phẩm, cho phép người dùng chọn/xóa/thay đổi số lượng, và khi click checkout sẽ mở form để nhập thông tin người mua.

---

## 📝 Chi Tiết Từng Dòng Code

### 1️⃣ Import Modules
```javascript
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { removeFromCart, removeManyFromCart, updateQuantity } from "../store/cartSlice";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import { addToCart } from "../store/cartSlice";
import { topDealsData } from "../data/topDealsData";
import { calculateDiscountedPrice, formatPrice } from "../utils/priceUtils";
import "./CartPage.css";
import { PrevArrow, NextArrow } from "../components/shared/NavigationArrows";
import CheckoutForm from "../components/CheckoutForm/CheckoutForm";
```
**Giải thích:**
- `useState`: Hook để quản lý local state (selectedItems, showCheckoutForm, currentPage)
- `Link`: React Router component để navigation
- `useSelector`: Hook Redux để lấy cart items từ store
- `useDispatch`: Hook Redux để gửi actions
- **Actions từ cartSlice:**
  - `removeFromCart`: Xóa 1 sản phẩm
  - `removeManyFromCart`: Xóa nhiều sản phẩm
  - `updateQuantity`: Thay đổi số lượng
  - `addToCart`: Thêm sản phẩm vào giỏ
- Các components & utilities khác: Header, Footer, CheckoutForm, formatPrice, calculateDiscountedPrice

---

### 2️⃣ Component Function & Hooks
```javascript
const CartPage = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);

  const [selectedItems, setSelectedItems] = useState([]);
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
```
**Giải thích:**
- `cartItems`: Lấy danh sách sản phẩm từ Redux store (`state.cart.items`)
- `selectedItems`: State để lưu danh sách ID của sản phẩm được chọn (mặc định rỗng)
- `showCheckoutForm`: State boolean để show/hide CheckoutForm modal (mặc định false)

---

### 3️⃣ Handle Select All
```javascript
const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedItems(cartItems.map((item) => item.id));
      console.log('Selected items:', cartItems.map((item) => item.id));
    } else {
      setSelectedItems([]);
    }
  };
```
**Giải thích:**
- Khi user tick vào checkbox "Select All"
- Nếu `checked` = true: 
  - `cartItems.map((item) => item.id)`: Lấy tất cả ID từ cart items
  - `setSelectedItems(...)`: Set vào state selectedItems
- Nếu `checked` = false: `setSelectedItems([])` → xóa tất cả selections

---

### 4️⃣ Handle Select Single Item
```javascript
const handleSelectItem = (id) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((itemId) => itemId !== id));
      console.log('Bo Selected item voi id:', id);
    } else {
      setSelectedItems([...selectedItems, id]);
      console.log('Selected items:', id);
    }
  };
```
**Giải thích:**
- Toggle selection của 1 sản phẩm
- Nếu **đã chọn** (`selectedItems.includes(id)` = true):
  - `filter((itemId) => itemId !== id)`: Loại bỏ ID này khỏi mảng
  - Kết quả: Bỏ chọn sản phẩm
- Nếu **chưa chọn**:
  - `[...selectedItems, id]`: Spread array cũ + thêm ID mới
  - Kết quả: Chọn sản phẩm

---

### 5️⃣ Handle Increase Quantity
```javascript
const handleIncrease = (id, currentQuantity) => {
    dispatch(updateQuantity({ id, quantity: currentQuantity + 1 }));
    console.log('Tang so luong cho item voi id:', id);
  };
```
**Giải thích:**
- Click nút `+` để tăng số lượng
- `updateQuantity({ id, quantity: currentQuantity + 1 })`: Dispatch action với:
  - `id`: ID sản phẩm
  - `quantity`: Số lượng mới (cộng thêm 1)
- Reducer trong cartSlice sẽ xử lý update

---

### 6️⃣ Handle Decrease Quantity
```javascript
const handleDecrease = (id, currentQuantity) => {
    if (currentQuantity > 1) {
      dispatch(updateQuantity({ id, quantity: currentQuantity - 1 }));
      console.log('Giam so luong cho item voi id:', id);
    }
  };
```
**Giải thích:**
- Click nút `-` để giảm số lượng
- **Điều kiện:** `if (currentQuantity > 1)` 
  - Chỉ cho phép giảm nếu số lượng > 1
  - Ngăn người dùng giảm xuống 0
- Nếu điều kiện thỏa → dispatch action `updateQuantity` với quantity - 1

---

### 7️⃣ Handle Checkout Click
```javascript
const handleCheckoutClick = () => {
    console.log('Checkout clicked, selectedItems:', selectedItems);
    setShowCheckoutForm(true);
  };
```
**Giải thích:**
- Click nút "Checkout" → mở form modal
- `setShowCheckoutForm(true)`: Set state để hiển thị CheckoutForm component

---

### 8️⃣ Handle Checkout Submit
```javascript
const handleCheckoutSubmit = (formData) => {
    console.log('Selected Items:', selectedItems);
    console.log("thông tin người mua hàng", formData);
    
    // Lưu danh sách sản phẩm cần xóa trước khi state thay đổi
    const itemsToRemove = [...selectedItems];
    console.log('Items to remove:', itemsToRemove);
    
    // Xóa tất cả sản phẩm đã chọn khỏi giỏ hàng cùng một lúc
    dispatch(removeManyFromCart(itemsToRemove));
    
    setSelectedItems([]);
  
    setShowCheckoutForm(false);

    // Hiển thị thông báo thành công
    alert('Đặt hàng thành công! Bạn có thể xem lịch sử đơn hàng trong menu ở cạnh icon giỏ hàng.');
  };
```
**Giải thích:**
- Được gọi khi CheckoutForm được submit (từ parent prop)
- `formData`: Dữ liệu form (fullName, phone, email, addressDetail, note)
- **Bước 1:** Lưu `selectedItems` vào `itemsToRemove` (vì state sắp bị reset)
- **Bước 2:** Dispatch `removeManyFromCart(itemsToRemove)` → xóa tất cả selected items khỏi cart
- **Bước 3:** Clear selections + ẩn form
- **Bước 4:** Hiển thị alert thành công

---

### 9️⃣ Handle Checkout Cancel
```javascript
const handleCheckoutCancel = () => {
    setShowCheckoutForm(false);
  };
```
**Giải thích:**
- Click nút "Hủy" trong CheckoutForm
- `setShowCheckoutForm(false)` → ẩn form, quay lại giỏ hàng

---

### 🔟 Handle Remove Item
```javascript
const handleRemove = (id) => {
    dispatch(removeFromCart(id));
    setSelectedItems(selectedItems.filter((itemId) => itemId !== id));
    console.log('Removed item with id:', id);
  };
```
**Giải thích:**
- Click icon thùng rác để xóa sản phẩm
- **Bước 1:** `removeFromCart(id)` → xóa item khỏi Redux cart
- **Bước 2:** `filter(...)` → xóa ID khỏi selectedItems state (nếu nó đang selected)

---

### 1️⃣1️⃣ Calculate Subtotal
```javascript
const calculateSubtotal = () => {
    return cartItems
      .filter((item) => selectedItems.includes(item.id))
      .reduce((total, item) => {
        return total + item.originalPrice * item.quantity;
      }, 0);
  };
```
**Giải thích:**
- **Chỉ tính cho items được chọn** (`filter` theo selectedItems)
- `reduce((total, item) => ...)`: Cộng lại:
  - `item.originalPrice * item.quantity`: Giá gốc × số lượng
  - `total`: Tích lũy tổng
  - `0`: Giá trị ban đầu
- **Kết quả:** Tổng tiền hàng (trước giảm giá)

---

### 1️⃣2️⃣ Calculate Total (After Discount)
```javascript
const calculateTotal = () => {
    return cartItems
      .filter((item) => selectedItems.includes(item.id))
      .reduce((total, item) => total + item.price * item.quantity, 0);
  };
```
**Giải thích:**
- Tương tự calculateSubtotal, nhưng dùng `item.price` (giá sau giảm giá)
- **Kết quả:** Tổng tiền cần thanh toán (đã giảm giá)

---

### 1️⃣3️⃣ Calculate Discount Amount
```javascript
const subtotal = calculateSubtotal();
const total = calculateTotal();
const discount = subtotal - total;
```
**Giải thích:**
- `discount = subtotal - total`: Tiền tiết kiệm được
- Ví dụ: Subtotal 1,000,000, Total 750,000 → Discount 250,000

---

### 1️⃣4️⃣ Handle Add Similar Product to Cart
```javascript
const handleAddSimilarProductToCart = (item) => {
    const itemFinalPrice = calculateDiscountedPrice(
      item.originalPrice,
      item.discount
    );

    dispatch(
      addToCart({
        id: item.id,
        name: item.title,
        image: item.image,
        price: itemFinalPrice,
        originalPrice: item.originalPrice,
        discount: item.discount,
        quantity: 1,
      })
    );
  };
```
**Giải thích:**
- Khi user muốn thêm 1 sản phẩm từ "Hàng tương tự" vào giỏ
- **Bước 1:** Tính giá sau giảm giá: `calculateDiscountedPrice(originalPrice, discount)`
- **Bước 2:** Dispatch `addToCart` với object:
  - `id, name, image`: Thông tin sản phẩm
  - `price`: Giá đã giảm
  - `originalPrice, discount`: Giá gốc và % giảm
  - `quantity: 1`: Thêm 1 sản phẩm

---

### 1️⃣5️⃣ Pagination Setup
```javascript
const [currentPage, setCurrentPage] = useState(1);
const itemsPerPage = 6;
const totalPages = Math.ceil(topDealsData.length / itemsPerPage);
const indexOfLastItem = currentPage * itemsPerPage;
const indexOfFirstItem = indexOfLastItem - itemsPerPage;
const currentItems = topDealsData.slice(indexOfFirstItem, indexOfLastItem);
```
**Giải thích:**
- `currentPage`: Page hiện tại (bắt đầu = 1)
- `itemsPerPage`: 6 sản phẩm mỗi trang
- `totalPages = Math.ceil(topDealsData.length / 6)`: Tổng số trang
- **Tính vị trí:**
  - `indexOfLastItem = 1 * 6 = 6` (trang 1)
  - `indexOfFirstItem = 6 - 6 = 0`
  - `currentItems = slice(0, 6)`: Items từ vị trí 0 đến 5
- **Trang 2:** `indexOfLastItem = 2 * 6 = 12`, `indexOfFirstItem = 6`, `currentItems = slice(6, 12)`

---

### 1️⃣6️⃣ Pagination Handlers
```javascript
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
```
**Giải thích:**
- `handlePageChange`: Set page mới
- `handlePrevPage`: Giảm page (nếu > 1)
- `handleNextPage`: Tăng page (nếu < totalPages)
- Chỉ cho phép navigate khi có page hợp lệ

---

### 1️⃣7️⃣ Render Stars (Rating)
```javascript
const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i} className="star filled">★</span>);
    }
    if (hasHalfStar) {
      stars.push(<span key="half" className="star half">★</span>);
    }
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<span key={`empty-${i}`} className="star">★</span>);
    }
    return stars;
  };
```
**Giải thích:**
- Chuyển rating (ví dụ 4.5) thành stars hiển thị
- **Bước 1:** Đếm fullStars
  - `Math.floor(4.5)` = 4
  - Loop thêm 4 ★ (filled)
- **Bước 2:** Kiểm tra nửa sao
  - `4.5 % 1 !== 0` → true (có nửa sao)
  - Thêm 1 ★ (half)
- **Bước 3:** Sao trống
  - `5 - Math.ceil(4.5) = 5 - 5 = 0`
  - Không thêm sao trống
- **Kết quả:** ★★★★½ (4 sao + nửa sao)

---

### 1️⃣8️⃣ Return JSX - Main Structure
```javascript
return (
    <div className="cart-page">
      <Header />
      <div className="cart-container">
        <div className="cart-main">
          <div className="cart-header">
            <h1>GIỎ HÀNG</h1>
          </div>
```
**Giải thích:**
- Layout chính:
  - `cart-page`: Container page
  - `Header`: Navbar top
  - `cart-container`: Main container
  - `cart-main`: Khu vực chính (left side)
  - `cart-header`: Tiêu đề "GIỎ HÀNG"

---

### 1️⃣9️⃣ Empty Cart Message
```javascript
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
    // ... render items
  )
}
```
**Giải thích:**
- Nếu `cartItems` rỗng:
  - Hiển thị thông báo "Giỏ hàng trống"
  - Nút "Tiếp tục mua sắm" link về trang chủ
- Nếu có items → render danh sách

---

### 2️⃣0️⃣ Select All Checkbox
```javascript
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
```
**Giải thích:**
- Checkbox để chọn tất cả items
- `checked={selectedItems.length === cartItems.length && cartItems.length > 0}`:
  - Checked khi: tất cả items đều được chọn AND có ít nhất 1 item
- `onChange={handleSelectAll}`: Gọi handler khi toggle
- Hiển thị số lượng items: `({cartItems.length} sản phẩm)`

---

### 2️⃣1️⃣ Cart Items Loop
```javascript
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
```
**Giải thích:**
- Loop từng item trong cartItems
- **key={item.id}**: Unique key cho React (needed for lists)
- **Checkbox cho item:**
  - `checked={selectedItems.includes(item.id)}`: Checked nếu item ID có trong selectedItems
  - `onChange={() => handleSelectItem(item.id)}`: Gọi toggle handler

---

### 2️⃣2️⃣ Item Image & Link
```javascript
<Link to={`/product/${item.id}`} className="item-image-link">
  <img
    src={item.image}
    alt={item.name}
    className="item-image"
  />
</Link>
```
**Giải thích:**
- Link tới trang chi tiết sản phẩm: `/product/{id}`
- Hiển thị ảnh sản phẩm (clickable)

---

### 2️⃣3️⃣ Item Info & Price
```javascript
<div className="item-info">
  <Link to={`/product/${item.id}`} className="item-name">
    {item.name}
  </Link>
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
```
**Giải thích:**
- **Item name:** Link đến trang chi tiết
- **Giá:**
  - Nếu có giãn giá (originalPrice ≠ price):
    - Hiển thị giá gốc (strikethrough)
  - Luôn hiển thị giá hiện tại (đã giãm giá)
- `formatPrice()`: Format số tiền (ví dụ: 1000000 → 1.000.000)
- `<sup>₫</sup>`: Đưa ký hiệu ₫ lên trên

---

### 2️⃣4️⃣ Quantity Controls
```javascript
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
```
**Giải thích:**
- **Nút `-`:**
  - `disabled={item.quantity <= 1}`: Vô hiệu khi qty = 1 (không cho giảm xuống 0)
  - Click: Gọi `handleDecrease`
- **Input qty:**
  - `readOnly`: Không cho edit trực tiếp (chỉ dùng buttons)
  - Hiển thị số lượng hiện tại
- **Nút `+`:**
  - Click: Gọi `handleIncrease`

---

### 2️⃣5️⃣ Item Total & Remove
```javascript
<div className="item-total">
  {formatPrice(item.price * item.quantity)}
  <sup>₫</sup>
</div>

<button
  className="item-remove"
  onClick={() => handleRemove(item.id)}
>
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path
      d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"
      fill="currentColor"
    />
  </svg>
</button>
```
**Giải thích:**
- **Item total:** Tiền cho 1 item (price × quantity)
- **Remove button:**
  - Icon thùng rác (SVG)
  - Click: Gọi `handleRemove` để xóa item khỏi cart

---

### 2️⃣6️⃣ Sidebar - Order Summary
```javascript
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
```
**Giải thích:**
- Sidebar chỉ hiển thị khi có items (`{cartItems.length > 0 &&}`)
- **Tóm tắt đơn hàng:**
  - Tổng tiền hàng (subtotal)
  - Tiền giảm giá (discount)
  - Format với `formatPrice()` và ký hiệu ₫

---

### 2️⃣7️⃣ Total & Checkout Button
```javascript
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

<button 
  className="btn-checkout" 
  onClick={handleCheckoutClick}
  disabled={selectedItems.length === 0}
>
  Checkout
</button>
```
**Giải thích:**
- **Tổng tiền thanh toán:** Hiển thị total (giá sau giảm)
- **Nút Checkout:**
  - `disabled={selectedItems.length === 0}`: Vô hiệu khi chưa chọn items
  - Click: Gọi `handleCheckoutClick` → mở form modal

---

### 2️⃣8️⃣ CheckoutForm Modal
```javascript
{showCheckoutForm && (
  <CheckoutForm
    onSubmit={handleCheckoutSubmit}
    onCancel={handleCheckoutCancel}
    meta={{ products: cartItems.filter((item) => selectedItems.includes(item.id)) }}
  />
)}
```
**Giải thích:**
- Hiển thị CheckoutForm khi `showCheckoutForm = true`
- **Props:**
  - `onSubmit={handleCheckoutSubmit}`: Handler khi form submit
  - `onCancel={handleCheckoutCancel}`: Handler khi click hủy
  - `meta={{ products: ... }}`: Danh sách sản phẩm được chọn (để CheckoutForm lưu vào history)
    - `cartItems.filter(...)`: Lọc chỉ lấy items có ID trong selectedItems

---

## 🔄 Flow Tóm Tắt
1. User xem giỏ hàng (CartPage load)
2. User chọn items bằng checkboxes
3. User nhập số lượng (± buttons)
4. Sidebar tự động tính tổng tiền
5. User click Checkout
6. CheckoutForm modal mở lên
7. User nhập thông tin người mua
8. Click "Xác nhận đặt hàng"
9. CartPage nhận callback:
   - Xóa selected items khỏi cart
   - Hiển thị alert thành công
   - Reset selectedItems
   - Ẩn form modal

---

## 💾 Redux Integration
- **Lấy dữ liệu:** `useSelector((state) => state.cart.items)` → cartItems
- **Dispatch actions:**
  - `removeFromCart(id)`: Xóa 1 item
  - `removeManyFromCart(ids)`: Xóa nhiều items
  - `updateQuantity({ id, quantity })`: Thay đổi qty
  - `addToCart({...})`: Thêm sản phẩm tương tự
