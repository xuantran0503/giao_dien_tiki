# 📄 Giải Thích Chi Tiết: checkoutSlice.js

## 📌 Tổng Quan
File `checkoutSlice.js` là Redux slice dùng để quản lý trạng thái checkout (đơn hàng). Nó lưu dữ liệu checkout vào Redux store **và** localStorage để persist dữ liệu khi reload page.

---

## 📝 Chi Tiết Từng Dòng Code

### 1️⃣ Import Modules
```javascript
import { createSlice, createSelector } from "@reduxjs/toolkit";
```
**Giải thích:**
- `createSlice`: Redux Toolkit API để tạo slice (reducer + actions)
- `createSelector`: Reselect library để tạo memoized selectors (tối ưu performance)

---

### 2️⃣ Load From localStorage
```javascript
const loadCheckoutFromStorage = () => {
  try {
    const saved = localStorage.getItem("checkout_history");
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error("Error loading checkout from localStorage:", error);
  }
  return {
    data: null,
    history: [],
    lastUpdated: 0,
    lastReset: 0,
  };
};
```
**Giải thích:**
- **Mục đích:** Khi app khởi động, load dữ liệu từ localStorage nếu có
- **Bước 1:** Lấy item từ localStorage
  - `localStorage.getItem("checkout_history")`: Lấy string JSON
- **Bước 2:** Parse JSON
  - `JSON.parse(saved)`: Chuyển string thành object
  - Wrapped trong `try/catch` để xử lý lỗi
- **Bước 3:** Trả về default state nếu không có data hoặc error xảy ra
  ```javascript
  {
    data: null,              // Đơn hàng mới nhất
    history: [],             // Lịch sử tất cả đơn hàng (mảng)
    lastUpdated: 0,          // Timestamp lần cập nhật cuối
    lastReset: 0             // Timestamp lần reset cuối (dùng để filter)
  }
  ```

---

### 3️⃣ Initial State
```javascript
const initialState = loadCheckoutFromStorage();
```
**Giải thích:**
- Set initial state = data từ localStorage (nếu có) hoặc default state
- Khi app start lần đầu:
  - localStorage rỗng → dùng default state
- Khi reload page sau khi đã đặt hàng:
  - Load từ localStorage → restore lịch sử đơn hàng

---

### 4️⃣ Create Slice
```javascript
const checkoutSlice = createSlice({
  name: "checkout",
  initialState,
  reducers: {
```
**Giải thích:**
- `name: "checkout"`: Tên slice (actions sẽ là `checkout/saveCheckout`, etc.)
- `initialState`: State ban đầu
- `reducers`: Object chứa các reducer functions

---

### 5️⃣ saveCheckout Reducer
```javascript
saveCheckout: (state, action) => {
  const entry = action.payload;
  // Ensure history is always an array before pushing
  if (!state.history || !Array.isArray(state.history)) {
    state.history = [];
  }
  // Đảm bảo luôn có createdAt để filter hoạt động đúng
  if (!entry.createdAt) {
    entry.createdAt = Date.now();
  }
  state.history.push(entry);
  state.data = entry;
  state.lastUpdated = Date.now();

  // Lưu vào localStorage
  localStorage.setItem("checkout_history", JSON.stringify(state));
},
```
**Giải thích:**

#### Mục đích
- Lưu 1 đơn hàng mới vào history và cập nhật state

#### Bước 1: Validate history array
```javascript
if (!state.history || !Array.isArray(state.history)) {
  state.history = [];
}
```
- Đảm bảo `state.history` luôn là mảng (không null/undefined)
- Nếu không phải mảng → reset thành `[]`

#### Bước 2: Validate createdAt timestamp
```javascript
if (!entry.createdAt) {
  entry.createdAt = Date.now();
}
```
- Nếu `entry` không có `createdAt` → thêm timestamp hiện tại
- `Date.now()`: Milliseconds từ 1/1/1970 đến bây giờ (ví dụ: 1700123456789)
- **Mục đích:** Dùng để filter lịch sử sau khi reset

#### Bước 3: Thêm vào history
```javascript
state.history.push(entry);
```
- Thêm đơn hàng mới vào cuối mảng history
- `history = [{ ... }, { ... }, { ... newly pushed }]`

#### Bước 4: Cập nhật data & lastUpdated
```javascript
state.data = entry;
state.lastUpdated = Date.now();
```
- `state.data`: Lưu đơn hàng mới nhất (để quick access)
- `state.lastUpdated`: Update timestamp (dùng để sync cross-tab)

#### Bước 5: Lưu localStorage
```javascript
localStorage.setItem("checkout_history", JSON.stringify(state));
```
- Convert state object → JSON string
- Lưu vào localStorage với key `checkout_history`
- **Mục đích:** Persist dữ liệu khi page reload
- **Trigger:** Event 'storage' sẽ được triggered ở tab khác (nếu có)

---

### 6️⃣ clearCheckoutHistory Reducer
```javascript
clearCheckoutHistory: (state) => {
  const now = Date.now();
  state.history = [];
  state.data = null;
  state.lastUpdated = now;
  state.lastReset = now;

  // Xóa khỏi localStorage
  localStorage.setItem("checkout_history", JSON.stringify(state));
},
```
**Giải thích:**

#### Mục đích
- Xóa toàn bộ lịch sử đơn hàng

#### Bước 1-4: Clear state
```javascript
const now = Date.now();
state.history = [];          // Xóa lịch sử
state.data = null;           // Xóa đơn hàng mới nhất
state.lastUpdated = now;     // Cập nhật thời gian
state.lastReset = now;       // Set reset time
```
- `history = []`: Reset mảng history thành rỗng
- `data = null`: Không có đơn hàng nào
- `lastReset = now`: **Quan trọng** - dùng để filter history trong selector
  - Selector sẽ chỉ hiển thị items có `createdAt > lastReset`
  - Nên các đơn hàng cũ sẽ bị ẩn

#### Bước 5: Lưu localStorage
```javascript
localStorage.setItem("checkout_history", JSON.stringify(state));
```
- Lưu state mới (với history rỗng) vào localStorage
- **Kết quả:** localStorage bị xóa sạch

---

### 7️⃣ syncFromStorage Reducer
```javascript
syncFromStorage: (state, action) => {
  const incoming = action.payload;

  if (incoming) {
    const incomingTime = incoming.lastUpdated || 0;
    const currentTime = state.lastUpdated || 0;

    // Merge logic: Always take the latest reset time
    const incomingReset = incoming.lastReset || 0;
    const currentReset = state.lastReset || 0;
    state.lastReset = Math.max(incomingReset, currentReset);

    // Only sync full state if incoming data is strictly newer
    if (incomingTime > currentTime) {
      state.history = Array.isArray(incoming.history)
        ? incoming.history
        : [];
      state.data = incoming.data;
      state.lastUpdated = incomingTime;
    }
  }
},
```
**Giải thích:**

#### Mục đích
- Sync dữ liệu từ localStorage khi có 'storage' event (cross-tab)
- Đảm bảo 2 tabs luôn có dữ liệu mới nhất

#### Bước 1: Validate incoming
```javascript
if (incoming) {
  // ...
}
```
- Chỉ xử lý nếu có dữ liệu incoming (từ storage event)

#### Bước 2: Extract timestamps
```javascript
const incomingTime = incoming.lastUpdated || 0;
const currentTime = state.lastUpdated || 0;
```
- Lấy thời gian update:
  - `incomingTime`: Thời gian update của tab khác
  - `currentTime`: Thời gian update của tab hiện tại
- Dùng `|| 0` để handle null/undefined (default = 0)

#### Bước 3: Merge reset times
```javascript
const incomingReset = incoming.lastReset || 0;
const currentReset = state.lastReset || 0;
state.lastReset = Math.max(incomingReset, currentReset);
```
- **Logic:** Lấy reset time mới nhất từ cả 2 tab
- `Math.max()`: Chọn giá trị lớn hơn
- **Ví dụ:**
  - Tab A: `lastReset = 1700000000`
  - Tab B: `lastReset = 1700000100` (reset sau)
  - Kết quả: `lastReset = 1700000100` (reset time mới nhất)

#### Bước 4: Sync nếu incoming mới hơn
```javascript
if (incomingTime > currentTime) {
  state.history = Array.isArray(incoming.history)
    ? incoming.history
    : [];
  state.data = incoming.data;
  state.lastUpdated = incomingTime;
}
```
- **Điều kiện:** Chỉ sync nếu incoming data **strictly newer** (`>`, không `>=`)
- **Validate history:**
  - `Array.isArray(incoming.history) ? incoming.history : []`
  - Nếu là array → dùng trực tiếp
  - Nếu không → dùng mảng rỗng (tránh error)
- **Cập nhật:**
  - `state.history`: Thay bằng incoming history
  - `state.data`: Thay bằng incoming data (đơn hàng mới nhất)
  - `state.lastUpdated`: Update timestamp

#### Example: Cross-Tab Sync
```
Time 1: Tab A dispatch saveCheckout()
  → localStorage.setItem("checkout_history", {...history: [A1, A2]})
  → Trigger 'storage' event ở Tab B

Time 2: Tab B nhận 'storage' event
  → dispatch syncFromStorage({...history: [A1, A2]})
  → incomingTime = lúc Time 1 > currentTime (Tab B chưa có)
  → Sync: state.history = [A1, A2]
  → Tab B re-render: hiển thị đơn hàng mới từ Tab A
```

---

### 8️⃣ Export Reducers
```javascript
export const { saveCheckout, clearCheckoutHistory, syncFromStorage } =
  checkoutSlice.actions;
```
**Giải thích:**
- Destructure & export actions từ slice
- Các actions này được tạo tự động bởi `createSlice`
- **Ví dụ:**
  ```javascript
  dispatch(saveCheckout({fullName: "...", phone: "...", ...}))
  dispatch(clearCheckoutHistory())
  dispatch(syncFromStorage({...}))
  ```

---

### 9️⃣ selectCheckout Selector
```javascript
export const selectCheckout = (state) => state.checkout && state.checkout.data;
```
**Giải thích:**
- Simple selector để lấy đơn hàng mới nhất
- `state.checkout && state.checkout.data`:
  - `state.checkout`: Lấy checkout slice
  - Nếu không exist → trả về falsy (short-circuit)
  - Nếu exist → lấy `.data`
- **Dùng khi:** Component chỉ cần đơn hàng cuối cùng

---

### 🔟 selectCheckoutState Selector
```javascript
const selectCheckoutState = (state) => state.checkout || {};
```
**Giải thích:**
- Helper selector để lấy toàn bộ checkout state
- `|| {}`: Nếu không exist → trả về object rỗng (tránh error)
- **Mục đích:** Input cho createSelector memoized selector

---

### 1️⃣1️⃣ selectCheckoutHistory Memoized Selector
```javascript
export const selectCheckoutHistory = createSelector(
  [selectCheckoutState],
  (checkout) => {
    const { history, lastReset } = checkout;
    if (!history || !Array.isArray(history)) return [];
    if (!lastReset) return history;
    return history.filter((item) => (item.createdAt || 0) > lastReset);
  }
);
```
**Giải thích:**

#### Mục đích
- Memoized selector để lấy filtered lịch sử
- **Filtering logic:** Chỉ trả về đơn hàng tạo **sau** lần reset cuối
- **Memoization:** Nếu input không thay đổi → trả về cached result (tối ưu re-render)

#### Input Selector
```javascript
[selectCheckoutState]
```
- Memoize dựa trên output của `selectCheckoutState`

#### Recompute Function
```javascript
(checkout) => { ... }
```
- Được gọi khi `selectCheckoutState` output thay đổi

#### Logic Details
```javascript
const { history, lastReset } = checkout;
```
- Destructure `history` và `lastReset` từ state

```javascript
if (!history || !Array.isArray(history)) return [];
```
- Nếu history không phải array → trả về `[]`

```javascript
if (!lastReset) return history;
```
- Nếu chưa reset bao giờ (`lastReset = 0`) → trả về toàn bộ history

```javascript
return history.filter((item) => (item.createdAt || 0) > lastReset);
```
- Filter: Chỉ lấy items có `createdAt > lastReset`
- `(item.createdAt || 0)`: Nếu không có `createdAt` → dùng 0
- **Kết quả:** Lịch sử từ sau lần reset cuối cùng

#### Example
```javascript
// State:
{
  history: [
    { fullName: "A", createdAt: 1700000000 },
    { fullName: "B", createdAt: 1700000100 },
    { fullName: "C", createdAt: 1700000200 }
  ],
  lastReset: 1700000050
}

// Filter:
- Item A: 1700000000 > 1700000050? NO ❌
- Item B: 1700000100 > 1700000050? YES ✅
- Item C: 1700000200 > 1700000050? YES ✅

// Result: [B, C]
```

---

### 1️⃣2️⃣ Export Default Reducer
```javascript
export default checkoutSlice.reducer;
```
**Giải thích:**
- Export reducer function từ slice
- Dùng khi setup Redux store (configureStore)
  ```javascript
  // store.js
  import checkoutReducer from './checkoutSlice';
  
  const store = configureStore({
    reducer: {
      checkout: checkoutReducer  // ← Đây
    }
  });
  ```

---

## 📊 State Structure
```javascript
{
  checkout: {
    data: {
      fullName: "Trần Văn A",
      phone: "0383477786",
      email: "trana@gmail.com",
      addressDetail: "123 Nguyễn Văn B, Hà Nội",
      note: "Giao nhanh",
      meta: {
        products: [...]
      },
      createdAt: 1700000000000
    },
    history: [
      { /* order 1 */ },
      { /* order 2 */ },
      { /* order 3 */ }
    ],
    lastUpdated: 1700000000000,
    lastReset: 0
  }
}
```

---

## 🔄 Data Flow Diagram

```
┌─────────────────────────────────────┐
│      CheckoutForm.jsx               │
│  (User submit form with data)       │
└────────────────┬────────────────────┘
                 │
                 ▼
        dispatch(saveCheckout(data))
                 │
                 ▼
    ┌────────────────────────────────┐
    │  checkoutSlice reducer         │
    │  - Validate history & createdAt│
    │  - Push entry to history       │
    │  - Set state.data              │
    │  - Update lastUpdated          │
    │  - Save to localStorage        │
    └────────────┬───────────────────┘
                 │
                 ▼
    localStorage.setItem("checkout_history", ...)
                 │
                 ├─→ Same Tab (CartPage):
                 │   - Redux state updated
                 │   - BuyerInfo can read from Redux
                 │
                 └─→ Other Tab (if open):
                     - 'storage' event triggered
                     - dispatch(syncFromStorage(...))
                     - Other tab's Redux updated
                     - Other tab's BuyerInfo re-renders
```

---

## 💡 Key Features

### ✅ Persistence
- Dữ liệu tự động lưu localStorage
- Reload page vẫn giữ lịch sử

### ✅ Cross-Tab Sync
- 2 tabs luôn có dữ liệu nhất quán
- 'storage' event kích hoạt sync

### ✅ Reset-Safe Filtering
- `lastReset` timestamp để filter cũ
- User xóa lịch sử → `lastReset` update
- Selector tự động filter items cũ

### ✅ Memoized Selector
- Tối ưu performance (không re-compute nếu input không đổi)
- Tránh unnecessary re-renders

---

## 🎯 Usage in Components

### ✅ CheckoutForm
```javascript
dispatch(saveCheckout(payload))
```

### ✅ CartPage
```javascript
dispatch(removeManyFromCart(itemsToRemove))
// Sau khi checkout thành công
```

### ✅ BuyerInfo
```javascript
const history = useSelector(selectCheckoutHistory);
dispatch(clearCheckoutHistory());
dispatch(syncFromStorage(checkoutState));
```
