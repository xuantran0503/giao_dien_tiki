# Giải thích chi tiết: cartSlice.ts

## Tổng quan
File `cartSlice.ts` quản lý toàn bộ state và logic của giỏ hàng trong ứng dụng Tiki Clone. Đây là một Redux slice được tạo bởi Redux Toolkit, chịu trách nhiệm:
- Thêm/xóa/cập nhật sản phẩm trong giỏ
- Tính toán tổng số lượng và tổng tiền
- Đồng bộ giỏ hàng giữa các tabs
- Xử lý checkout

---

## Phần 1: Imports và Interfaces

### Dòng 1: Import Redux Toolkit

```typescript
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
```

**Giải thích:**
- `createSlice`: Function tạo Redux slice (bao gồm reducer và actions)
- `PayloadAction`: Type generic cho actions có data (payload)

---

### Dòng 3-11: Interface CartItem

```typescript
export interface CartItem {
  id: number;
  name: string;
  image: string;
  price: number;
  originalPrice: number;
  discount: number;
  quantity: number;
}
```

**Giải thích chi tiết:**

| Property | Type | Mô tả | Ví dụ |
|----------|------|-------|-------|
| `id` | number | ID duy nhất của sản phẩm | 12345 |
| `name` | string | Tên sản phẩm | "iPhone 15 Pro Max" |
| `image` | string | URL hình ảnh | "https://..." |
| `price` | number | Giá bán hiện tại (sau giảm giá) | 29990000 |
| `originalPrice` | number | Giá gốc (trước giảm giá) | 34990000 |
| `discount` | number | % giảm giá | 15 |
| `quantity` | number | Số lượng trong giỏ | 2 |

**Tại sao export:**
- Các component khác cần import để type check
- Checkout slice cũng sử dụng interface này

**Ví dụ sử dụng:**
```typescript
const item: CartItem = {
  id: 1,
  name: "iPhone 15 Pro Max",
  image: "https://salt.tikicdn.com/...",
  price: 29990000,
  originalPrice: 34990000,
  discount: 15,
  quantity: 2
};
```

---

### Dòng 13-16: Interface CartState

```typescript
export interface CartState {
  items: CartItem[];
  totalQuantity: number;
}
```

**Giải thích:**

**1. Cấu trúc state:**
```typescript
{
  items: [
    { id: 1, name: "iPhone", quantity: 2, ... },
    { id: 2, name: "AirPods", quantity: 1, ... }
  ],
  totalQuantity: 3  // 2 + 1
}
```

**2. Tại sao cần totalQuantity riêng?**
- Tính toán sẵn để hiển thị badge trên icon giỏ hàng
- Tránh phải loop qua items mỗi lần render
- Performance optimization

**3. Tại sao không lưu totalAmount?**
- Total amount cần tính real-time (giá có thể thay đổi)
- Dùng selector để tính khi cần

---

### Dòng 18-21: Initial State

```typescript
const initialState: CartState = {
  items: [],
  totalQuantity: 0,
};
```

**Giải thích:**
- State ban đầu khi app mới khởi động
- Giỏ hàng trống
- Redux-persist sẽ override state này nếu có data trong localStorage

---

## Phần 2: Slice Definition

### Dòng 23-26: createSlice cơ bản

```typescript
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
```

**Giải thích:**

**1. `name: "cart"`**
- Tên của slice, sẽ dùng làm prefix cho action types
- Action type sẽ có dạng: `cart/addToCart`, `cart/removeFromCart`

**2. `initialState`**
- State khởi tạo ban đầu

**3. `reducers`**
- Object chứa tất cả reducer functions
- Mỗi reducer sẽ tự động tạo ra một action creator

---

### REDUCER 1: addToCart (Dòng 27-48)

```typescript
addToCart: (state, action: PayloadAction<CartItem>) => {
  const newItem = action.payload;
  const existingItem = state.items.find((item) => item.id === newItem.id);

  if (existingItem) {
    // Nếu sản phẩm đã có, cộng thêm số lượng
    existingItem.quantity += newItem.quantity;
    state.totalQuantity += newItem.quantity;
  } else {
    // Nếu chưa có, thêm mới vào giỏ hàng
    state.items.push({
      id: newItem.id,
      name: newItem.name,
      image: newItem.image,
      price: newItem.price,
      originalPrice: newItem.originalPrice,
      discount: newItem.discount,
      quantity: newItem.quantity,
    });
    state.totalQuantity += newItem.quantity;
  }
},
```

**Giải thích từng bước:**

**Bước 1: Nhận data từ action**
```typescript
const newItem = action.payload;
// newItem = { id: 1, name: "iPhone", quantity: 2, ... }
```

**Bước 2: Kiểm tra sản phẩm đã tồn tại chưa**
```typescript
const existingItem = state.items.find((item) => item.id === newItem.id);
```
- Tìm sản phẩm có cùng ID trong giỏ
- Nếu tìm thấy: `existingItem` = object sản phẩm
- Nếu không: `existingItem` = undefined

**Bước 3a: Nếu sản phẩm ĐÃ có trong giỏ**
```typescript
if (existingItem) {
  existingItem.quantity += newItem.quantity;
  state.totalQuantity += newItem.quantity;
}
```
- Cộng thêm số lượng vào sản phẩm có sẵn
- Cập nhật tổng số lượng

**Ví dụ:**
```typescript
// State trước:
{ items: [{ id: 1, name: "iPhone", quantity: 1 }], totalQuantity: 1 }

// Action: addToCart({ id: 1, name: "iPhone", quantity: 2, ... })

// State sau:
{ items: [{ id: 1, name: "iPhone", quantity: 3 }], totalQuantity: 3 }
```

**Bước 3b: Nếu sản phẩm CHƯA có trong giỏ**
```typescript
else {
  state.items.push({
    id: newItem.id,
    name: newItem.name,
    // ... tất cả properties
  });
  state.totalQuantity += newItem.quantity;
}
```
- Thêm sản phẩm mới vào mảng items
- Cập nhật tổng số lượng

**Ví dụ:**
```typescript
// State trước:
{ items: [], totalQuantity: 0 }

// Action: addToCart({ id: 1, name: "iPhone", quantity: 1, ... })

// State sau:
{ 
  items: [{ id: 1, name: "iPhone", quantity: 1, ... }], 
  totalQuantity: 1 
}
```

**Câu hỏi thường gặp:**

**Q: Tại sao không dùng `state.items = [...state.items, newItem]`?**
A: Redux Toolkit dùng Immer, cho phép mutate trực tiếp. `push()` đơn giản hơn và performance tốt hơn.

**Q: Tại sao phải copy tất cả properties thay vì push(newItem)?**
A: Để đảm bảo immutability và tránh reference issues. Tuy nhiên, có thể viết ngắn gọn hơn:
```typescript
state.items.push({ ...newItem });
```

---

### REDUCER 2: removeFromCart (Dòng 50-65)

```typescript
removeFromCart: (state, action: PayloadAction<number>) => {
  const id = action.payload;

  const existingItem = state.items.find(
    (item) => String(item.id) === String(id)
  );

  if (existingItem) {
    state.totalQuantity -= existingItem.quantity;
    state.items = state.items.filter(
      (item) => String(item.id) !== String(id)
    );
  } else {
    console.log("KHÔNG TÌM THẤY sản phẩm để xóa!");
  }
},
```

**Giải thích chi tiết:**

**Bước 1: Lấy ID cần xóa**
```typescript
const id = action.payload; // payload là number, ví dụ: 123
```

**Bước 2: Tìm sản phẩm**
```typescript
const existingItem = state.items.find(
  (item) => String(item.id) === String(id)
);
```

**❓ Tại sao phải String(item.id) === String(id)?**

**Vấn đề:** ID có thể là number hoặc string tùy nguồn data:
```typescript
// Từ database: id = 123 (number)
// Từ URL params: id = "123" (string)
// 123 !== "123" → false
```

**Giải pháp:** Convert cả hai về string để so sánh:
```typescript
String(123) === String("123") // true
```

**Bước 3: Xóa sản phẩm**
```typescript
if (existingItem) {
  // Trừ quantity khỏi tổng
  state.totalQuantity -= existingItem.quantity;
  
  // Lọc bỏ item có id trùng khớp
  state.items = state.items.filter(
    (item) => String(item.id) !== String(id)
  );
}
```

**Ví dụ minh họa:**
```typescript
// State trước:
{
  items: [
    { id: 1, name: "iPhone", quantity: 2 },
    { id: 2, name: "AirPods", quantity: 1 }
  ],
  totalQuantity: 3
}

// Action: removeFromCart(1)

// State sau:
{
  items: [
    { id: 2, name: "AirPods", quantity: 1 }
  ],
  totalQuantity: 1  // 3 - 2
}
```

**Bước 4: Error handling**
```typescript
else {
  console.log("KHÔNG TÌM THẤY sản phẩm để xóa!");
}
```
- Log để debug
- Trong production có thể thay bằng error tracking service

---

### REDUCER 3: removeSelectBuysFromCart (Dòng 67-80)

```typescript
removeSelectBuysFromCart: (state, action: PayloadAction<number[]>) => {
  const idsToRemove = action.payload;
  // Chuyển đổi tất cả ID sang string để so sánh chính xác
  const stringIdsToRemove = idsToRemove.map(String);

  state.items = state.items.filter(
    (item) => !stringIdsToRemove.includes(String(item.id))
  );

  state.totalQuantity = state.items.reduce(
    (total, item) => total + item.quantity,
    0
  );
},
```

**Giải thích chi tiết:**

**Mục đích:**
- Xóa nhiều sản phẩm cùng lúc (sau khi checkout)
- Dùng khi user chọn nhiều items và bấm "Mua hàng"

**Bước 1: Nhận mảng IDs**
```typescript
const idsToRemove = action.payload; 
// Ví dụ: [1, 2, 5]
```

**Bước 2: Convert tất cả sang string**
```typescript
const stringIdsToRemove = idsToRemove.map(String);
// [1, 2, 5] → ["1", "2", "5"]
```

**Tại sao?** Đảm bảo so sánh chính xác với item.id (có thể là number hoặc string)

**Bước 3: Filter items**
```typescript
state.items = state.items.filter(
  (item) => !stringIdsToRemove.includes(String(item.id))
);
```

**Logic:**
- `stringIdsToRemove.includes(String(item.id))`: item có trong list cần xóa?
- `!...`: Giữ lại items KHÔNG có trong list

**Ví dụ:**
```typescript
// State trước:
items: [
  { id: 1, name: "iPhone", quantity: 1 },
  { id: 2, name: "AirPods", quantity: 2 },
  { id: 3, name: "MacBook", quantity: 1 },
  { id: 5, name: "iPad", quantity: 1 }
]

// Action: removeSelectBuysFromCart([1, 2, 5])

// State sau:
items: [
  { id: 3, name: "MacBook", quantity: 1 }
]
```

**Bước 4: Tính lại totalQuantity**
```typescript
state.totalQuantity = state.items.reduce(
  (total, item) => total + item.quantity,
  0
);
```

**Tại sao dùng reduce()?**
- Sau khi xóa nhiều items, cách dễ nhất là tính lại toàn bộ
- reduce() cộng dồn quantity của tất cả items còn lại

**Break down reduce:**
```typescript
// items = [{ quantity: 1 }, { quantity: 2 }, { quantity: 3 }]

// Lần 1: total = 0, item.quantity = 1 → return 0 + 1 = 1
// Lần 2: total = 1, item.quantity = 2 → return 1 + 2 = 3
// Lần 3: total = 3, item.quantity = 3 → return 3 + 3 = 6
// Kết quả: totalQuantity = 6
```

---

### REDUCER 4: updateQuantity (Dòng 82-91)

```typescript
updateQuantity: (state, action: PayloadAction<{ id: number; quantity: number }>) => {
  const { id, quantity } = action.payload;
  const existingItem = state.items.find((item) => item.id === id);

  if (existingItem && quantity > 0) {
    const diff = quantity - existingItem.quantity;
    existingItem.quantity = quantity;
    state.totalQuantity += diff;
  }
},
```

**Giải thích chi tiết:**

**Mục đích:**
- Cập nhật số lượng sản phẩm trong giỏ
- Dùng khi user thay đổi quantity trong Cart page

**Bước 1: Destructure payload**
```typescript
const { id, quantity } = action.payload;
// Ví dụ: { id: 1, quantity: 5 }
```

**Bước 2: Tìm sản phẩm**
```typescript
const existingItem = state.items.find((item) => item.id === id);
```

**Bước 3: Validation và update**
```typescript
if (existingItem && quantity > 0) {
```

**Tại sao check `quantity > 0`?**
- Ngăn user set quantity = 0 hoặc số âm
- Nếu muốn xóa, phải dùng removeFromCart

**Bước 4: Tính diff thông minh**
```typescript
const diff = quantity - existingItem.quantity;
existingItem.quantity = quantity;
state.totalQuantity += diff;
```

**Tại sao không tính lại toàn bộ totalQuantity?**

**Cách KHÔNG tối ưu:**
```typescript
existingItem.quantity = quantity;
state.totalQuantity = state.items.reduce((t, item) => t + item.quantity, 0);
// Phải loop qua TẤT CẢ items
```

**Cách TỐI ƯU (như code):**
```typescript
const diff = quantity - existingItem.quantity;
// Chỉ tính hiệu số
state.totalQuantity += diff;
// Cộng/trừ vào tổng
```

**Ví dụ minh họa:**
```typescript
// State trước:
{
  items: [
    { id: 1, name: "iPhone", quantity: 2 },
    { id: 2, name: "AirPods", quantity: 3 }
  ],
  totalQuantity: 5
}

// Action: updateQuantity({ id: 1, quantity: 5 })

// Tính toán:
// diff = 5 - 2 = 3
// totalQuantity = 5 + 3 = 8

// State sau:
{
  items: [
    { id: 1, name: "iPhone", quantity: 5 },
    { id: 2, name: "AirPods", quantity: 3 }
  ],
  totalQuantity: 8
}
```

**Edge cases:**

```typescript
// Case 1: Giảm quantity
updateQuantity({ id: 1, quantity: 1 })
// diff = 1 - 2 = -1
// totalQuantity = 5 + (-1) = 4 ✅

// Case 2: quantity = 0 (sẽ KHÔNG chạy vì có check quantity > 0)
updateQuantity({ id: 1, quantity: 0 })
// Không làm gì cả ✅

// Case 3: ID không tồn tại
updateQuantity({ id: 999, quantity: 5 })
// existingItem = undefined, không làm gì ✅
```

---

### REDUCER 5: clearCart (Dòng 93-96)

```typescript
clearCart: (state) => {
  state.items = [];
  state.totalQuantity = 0;
},
```

**Giải thích:**

**Mục đích:**
- Xóa toàn bộ giỏ hàng
- Dùng sau khi đặt hàng thành công
- Hoặc khi user muốn clear giỏ hàng

**Cách hoạt động:**
- Reset items về mảng rỗng
- Reset totalQuantity về 0

**Ví dụ sử dụng:**
```typescript
function CheckoutPage() {
  const dispatch = useAppDispatch();
  
  const handleCheckoutSuccess = () => {
    // Lưu order vào database
    // ...
    
    // Xóa giỏ hàng
    dispatch(clearCart());
    
    // Chuyển đến trang success
    navigate('/order-success');
  };
}
```

**Lưu ý:**
- Redux-persist sẽ lưu state rỗng vào localStorage
- Nếu muốn xóa chỉ một số items, dùng `removeSelectBuysFromCart`

---

### REDUCER 6: syncCart (Dòng 98-101)

```typescript
syncCart: (state, action: PayloadAction<CartState>) => {
  state.items = action.payload.items;
  state.totalQuantity = action.payload.totalQuantity;
},
```

**Giải thích chi tiết:**

**Mục đích:**
- Đồng bộ giỏ hàng giữa nhiều tabs
- Dùng với localStorage hoặc BroadcastChannel

**Cách hoạt động:**
- Nhận toàn bộ CartState từ tab khác
- Override state hiện tại

**Tại sao cần?**

**Vấn đề:** Mở nhiều tabs cùng lúc:
```
Tab 1: User thêm iPhone vào giỏ
Tab 2: Giỏ hàng vẫn trống ❌
```

**Giải pháp:** Sync tabs
```typescript
// Tab 1: Thêm sản phẩm
dispatch(addToCart(iphone));

// Lắng nghe localStorage change
window.addEventListener('storage', (e) => {
  if (e.key === 'cart') {
    const newCartState = JSON.parse(e.newValue);
    dispatch(syncCart(newCartState));
  }
});

// Tab 2: Tự động update ✅
```

**Flow hoàn chỉnh:**

```typescript
// File: syncTabs.ts
export const setupCartSync = (store) => {
  window.addEventListener('storage', (event) => {
    if (event.key === 'persist:root') {
      const persistedData = JSON.parse(event.newValue);
      const cartData = JSON.parse(persistedData.cart);
      
      // Dispatch syncCart action
      store.dispatch(syncCart(cartData));
    }
  });
};

// File: store.ts
const store = configureStore({ ... });
setupCartSync(store);
```

**Ví dụ payload:**
```typescript
dispatch(syncCart({
  items: [
    { id: 1, name: "iPhone", quantity: 2, ... },
    { id: 2, name: "AirPods", quantity: 1, ... }
  ],
  totalQuantity: 3
}));
```

---

## Phần 3: Selectors (Dòng 106-111)

### Selector 1: selectCartItems

```typescript
export const selectCartItems = (state: { cart: CartState }) => state.cart.items;
```

**Giải thích:**
- Lấy danh sách tất cả items trong giỏ
- `state: { cart: CartState }`: State có shape `{ cart: {...} }`

**Sử dụng:**
```typescript
function CartPage() {
  const items = useAppSelector(selectCartItems);
  
  return (
    <div>
      {items.map(item => (
        <CartItem key={item.id} data={item} />
      ))}
    </div>
  );
}
```

---

### Selector 2: selectTotalQuantity

```typescript
export const selectTotalQuantity = (state: { cart: CartState }) => state.cart.totalQuantity;
```

**Sử dụng:**
```typescript
function CartIcon() {
  const totalQty = useAppSelector(selectTotalQuantity);
  
  return (
    <div className="cart-icon">
      <ShoppingCartIcon />
      {totalQty > 0 && <span className="badge">{totalQty}</span>}
    </div>
  );
}
```

---

### Selector 3: selectCartTotal

```typescript
export const selectCartTotal = (state: { cart: CartState }) =>
  state.cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
```

**Giải thích:**

**Mục đích:** Tính tổng tiền giỏ hàng

**Cách tính:**
```typescript
// items = [
//   { price: 100, quantity: 2 },  // = 200
//   { price: 50, quantity: 3 }     // = 150
// ]
// Total = 200 + 150 = 350

reduce((total, item) => total + (item.price * item.quantity), 0)
```

**Break down:**
```typescript
// Lần 1: total = 0, item = { price: 100, quantity: 2 }
//        return 0 + (100 * 2) = 200

// Lần 2: total = 200, item = { price: 50, quantity: 3 }
//        return 200 + (50 * 3) = 350

// Kết quả: 350
```

**Sử dụng:**
```typescript
function CartSummary() {
  const total = useAppSelector(selectCartTotal);
  
  return (
    <div className="cart-summary">
      <h3>Tổng tiền:</h3>
      <p className="total">{total.toLocaleString()}đ</p>
    </div>
  );
}
```

**Performance note:**
- Selector này tính toán mỗi lần component render
- Nếu items nhiều, nên dùng `reselect` để memoize:

```typescript
import { createSelector } from '@reduxjs/toolkit';

export const selectCartTotal = createSelector(
  [selectCartItems],
  (items) => items.reduce((total, item) => total + (item.price * item.quantity), 0)
);
// Chỉ tính lại khi items thay đổi
```

---

### Selector 4: selectCartItemById

```typescript
export const selectCartItemById = (state: { cart: CartState }, id: number) =>
  state.cart.items.find(item => item.id === id);
```

**Giải thích:**

**Mục đích:** Tìm một sản phẩm cụ thể trong giỏ theo ID

**Parameters:**
- `state`: Redux state
- `id`: ID sản phẩm cần tìm

**Return:**
- `CartItem | undefined`
- Nếu tìm thấy: return object sản phẩm
- Nếu không: return undefined

**Sử dụng:**
```typescript
function ProductCard({ productId }: { productId: number }) {
  const cartItem = useAppSelector(state => 
    selectCartItemById(state, productId)
  );
  
  const isInCart = !!cartItem;
  const quantityInCart = cartItem?.quantity || 0;
  
  return (
    <div className="product-card">
      <h3>Product {productId}</h3>
      {isInCart ? (
        <div>
          <p>Đã có trong giỏ: {quantityInCart}</p>
          <button onClick={() => handleUpdateQty(quantityInCart + 1)}>
            Thêm
          </button>
        </div>
      ) : (
        <button onClick={handleAddToCart}>
          Thêm vào giỏ
        </button>
      )}
    </div>
  );
}
```

**Lưu ý:**
- Selector nhận parameters (không giống 3 selectors trên)
- Phải wrap trong function khi dùng với useAppSelector

---

## Phần 4: Export Actions và Reducer

### Dòng 113-120: Export actions

```typescript
export const {
  addToCart,
  removeFromCart,
  removeSelectBuysFromCart,
  updateQuantity,
  clearCart,
  syncCart,
} = cartSlice.actions;
```

**Giải thích:**

**createSlice tự động tạo action creators:**
```typescript
// Code viết:
addToCart: (state, action) => { ... }

// Redux Toolkit tự tạo:
const addToCart = (payload) => ({
  type: 'cart/addToCart',
  payload: payload
});
```

**Sử dụng:**
```typescript
// Import
import { addToCart, removeFromCart } from './cartSlice';

// Dispatch
dispatch(addToCart({ 
  id: 1, 
  name: "iPhone", 
  quantity: 1,
  // ... 
}));

dispatch(removeFromCart(123));
```

**Action type tự động:**
```typescript
addToCart(item)
// → { type: 'cart/addToCart', payload: item }

removeFromCart(5)
// → { type: 'cart/removeFromCart', payload: 5 }
```

---

### Dòng 121: Export reducer

```typescript
export default cartSlice.reducer;
```

**Giải thích:**

**Mục đích:**
- Export reducer để đưa vào store
- Default export để import dễ dàng

**Sử dụng trong store.ts:**
```typescript
import cartReducer from './cartSlice';

const store = configureStore({
  reducer: {
    cart: cartReducer,  // ← Đây
    checkout: checkoutReducer,
    address: addressReducer,
  }
});
```

**Reducer là gì?**
- Function nhận (state, action) và return state mới
- Redux Toolkit đã combine tất cả reducer functions thành 1 reducer duy nhất

---

## Tổng kết

### Flow hoàn chỉnh: Thêm sản phẩm vào giỏ

```typescript
// 1. User click "Thêm vào giỏ"
<button onClick={handleAddToCart}>Thêm vào giỏ</button>

// 2. Component dispatch action
const handleAddToCart = () => {
  dispatch(addToCart({
    id: product.id,
    name: product.name,
    price: product.price,
    originalPrice: product.originalPrice,
    discount: product.discount,
    image: product.image,
    quantity: 1
  }));
};

// 3. Redux nhận action
{
  type: 'cart/addToCart',
  payload: { id: 1, name: "iPhone", ... }
}

// 4. Reducer xử lý
addToCart: (state, action) => {
  // Tìm xem đã có chưa
  // Nếu có: cộng quantity
  // Nếu chưa: push vào items
  // Cập nhật totalQuantity
}

// 5. State mới
{
  items: [...],
  totalQuantity: 5
}

// 6. Redux-persist lưu vào localStorage
localStorage.setItem('persist:root', JSON.stringify(state));

// 7. Components subscribe re-render
function CartIcon() {
  const totalQty = useAppSelector(selectTotalQuantity);
  // totalQty = 5 → Badge hiển thị "5"
}
```

### Best Practices

**1. Luôn dùng selectors:**
```typescript
// ❌ KHÔNG tốt
const items = useAppSelector(state => state.cart.items);

// ✅ TỐT
const items = useAppSelector(selectCartItems);
```

**2. Destructure payload:**
```typescript
// ✅ Dễ đọc
const { id, quantity } = action.payload;

// ❌ Khó đọc
existingItem.quantity = action.payload.quantity;
```

**3. Validate trước khi update:**
```typescript
if (existingItem && quantity > 0) {
  // Update
}
```

**4. Sử dụng đúng reducer:**
- Thêm 1 item: `addToCart`
- Xóa 1 item: `removeFromCart`
- Xóa nhiều items: `removeSelectBuysFromCart`
- Update quantity: `updateQuantity`
- Xóa tất cả: `clearCart`

### Kết luận

File `cartSlice.ts` là trái tim của shopping cart, quản lý:
- ✅ Tất cả CRUD operations cho giỏ hàng
- ✅ Tính toán tự động (totalQuantity)
- ✅ Đồng bộ đa tabs
- ✅ Type safety với TypeScript
- ✅ Integration với Redux Toolkit và redux-persist

**Quy tắc vàng:** Mọi thay đổi đến giỏ hàng PHẢI thông qua các actions của slice này!
