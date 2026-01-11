# Giải thích chi tiết file `src/store/checkoutSlice.js`

File này quản lý trạng thái (state) liên quan đến việc thanh toán và lịch sử đơn hàng bằng Redux Toolkit.

## 1. Import

```javascript
import { createSlice } from "@reduxjs/toolkit";
```

- `createSlice`: Hàm tiện ích của Redux Toolkit giúp tạo ra reducer và actions cùng một lúc, giảm bớt code boilerplate.

## 2. Hàm Helper `getStoredState`

```javascript
const getStoredState = () => {
  try {
    return (
      JSON.parse(localStorage.getItem("checkout_history")) || {
        history: [],
        data: null,
      }
    );
  } catch {
    return { history: [], data: null };
  }
};
```

- Mục đích: Lấy dữ liệu lịch sử đơn hàng đã lưu trong `localStorage` (bộ nhớ trình duyệt) để khi reload trang không bị mất.
- `localStorage.getItem("checkout_history")`: Lấy chuỗi JSON đã lưu.
- `JSON.parse(...)`: Chuyển chuỗi JSON thành object JavaScript.
- Nếu không có dữ liệu hoặc lỗi (try/catch), trả về object mặc định: `{ history: [], data: null }`.

## 3. Tạo Slice `checkoutSlice`

```javascript
const checkoutSlice = createSlice({
  name: "checkout",
  initialState: getStoredState(),
  reducers: {
    // ... các reducers
  },
});
```

- `name`: Tên định danh cho slice này là "checkout".
- `initialState`: Trạng thái ban đầu, được lấy từ hàm `getStoredState()` (tức là lấy từ localStorage nếu có).

## 4. Các Reducers (Hàm xử lý thay đổi state)

### 4.1. `saveCheckout`

```javascript
    saveCheckout: (state, action) => {
      const newOrder = action.payload;

      const latestHistory = getStoredState().history;

      state.history = [...latestHistory, newOrder]; // cập nhật lịch sử
      state.data = newOrder; // lưu đơn hàng mới nhất vào state

      localStorage.setItem("checkout_history", JSON.stringify(state));
    },
```

- Dùng khi người dùng đặt hàng thành công.
- `action.payload`: Chứa thông tin đơn hàng mới (`newOrder`).
- `getStoredState().history`: Lấy lịch sử hiện tại từ localStorage để đảm bảo dữ liệu mới nhất (tránh trường hợp state Redux chưa kịp cập nhật hoặc bị lệch).
- `state.history = [...latestHistory, newOrder]`: Tạo mảng lịch sử mới bằng cách nối mảng cũ với đơn hàng mới.
- `state.data`: Lưu đơn hàng vừa đặt vào biến `data` (có thể dùng để hiển thị trang "Đặt hàng thành công").
- `localStorage.setItem(...)`: Lưu toàn bộ state mới vào localStorage để bền vững dữ liệu.

### 4.2. `clearCheckoutHistory`

```javascript
    clearCheckoutHistory: (state) => {
      state.history = [];
      state.data = null;
      localStorage.setItem("checkout_history", JSON.stringify(state));
    },
```

- Dùng khi người dùng muốn xóa toàn bộ lịch sử mua hàng.
- Gán `history` về mảng rỗng `[]`.
- Gán `data` về `null`.
- Cập nhật lại localStorage.

### 4.3. `syncFromStorage`

```javascript
    syncFromStorage: (state, action) => {
      const { history, data } = action.payload || {};
      state.history = history || []; // Nếu storage trống → gán giá trị mặc định
      state.data = data || null; // Nếu storage có dữ liệu → Redux nhận lại đầy đủ
    },
```

- Dùng để đồng bộ dữ liệu giữa các tab trình duyệt hoặc khi localStorage thay đổi từ bên ngoài.
- Cập nhật state của Redux bằng dữ liệu truyền vào từ `action.payload`.

## 5. Export Actions

```javascript
export const { saveCheckout, clearCheckoutHistory, syncFromStorage } =
  checkoutSlice.actions;
```

- Xuất các action creators để các component khác (như `CheckoutForm`, `BuyerInfo`) có thể `dispatch`.

## 6. Export Selectors

```javascript
export const selectCheckoutHistory = (state) => state.checkout?.history || [];
```

- Hàm selector giúp lấy dữ liệu `history` từ Redux state một cách an toàn.
- `state.checkout`: Truy cập vào slice checkout.
- `?.history`: Lấy thuộc tính history (dùng `?.` để tránh lỗi nếu state.checkout là null/undefined).
- `|| []`: Nếu không có dữ liệu thì trả về mảng rỗng.

## 7. Export Reducer

```javascript
export default checkoutSlice.reducer;
```

- Xuất reducer chính để gắn vào `store` chung của ứng dụng (thường ở file `store.js` hoặc `index.js`).
