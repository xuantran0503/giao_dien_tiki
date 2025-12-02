# Giải thích chi tiết file `checkoutSlice.js`

## Mục đích
File này định nghĩa **Redux Toolkit Slice** để quản lý trạng thái checkout (giỏ hàng, thông tin người mua) và lưu trữ lịch sử đơn hàng vào localStorage.

---

## Phần 1: Import

```javascript
import { createSlice } from "@reduxjs/toolkit";
```

- `createSlice`: hàm từ Redux Toolkit để tạo slice (chứa state, reducers, actions).
- Giúp viết Redux code ngắn gọn hơn so với Redux cổ điển.

---

## Phần 2: Hàm `getStoredState()`

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

### Ý nghĩa
- **Lấy dữ liệu checkout từ localStorage** (bộ nhớ trình duyệt).
- Nếu có dữ liệu trước đó → trả về nó.
- Nếu không có hoặc lỗi → trả về giá trị mặc định.

### Chi tiết từng bước

```javascript
JSON.parse(localStorage.getItem("checkout_history"))
//  ↑ chuyển string thành object
//                  ↑ lấy từ browser storage
```

### Ví dụ

**Lần đầu tiên (chưa có lịch sử):**
```javascript
getStoredState()
// → { history: [], data: null }
```

**Lần thứ 2 (sau khi lưu 2 đơn hàng):**
```javascript
localStorage = {
  "checkout_history": '[
    { fullName: "Trần A", phone: "0987654321", createdAt: 1701388800000 },
    { fullName: "Nguyễn B", phone: "0912345678", createdAt: 1701302400000 }
  ]'
}

getStoredState()
// → { 
//     history: [
//       { fullName: "Trần A", phone: "0987654321", createdAt: 1701388800000 },
//       { fullName: "Nguyễn B", phone: "0912345678", createdAt: 1701302400000 }
//     ],
//     data: null (hay object cuối cùng được lưu)
//   }
```

### Tại sao dùng try-catch
- Nếu localStorage bị hỏng hoặc có dữ liệu invalid → JSON.parse sẽ throw lỗi.
- `catch` bắt lỗi và trả về giá trị mặc định thay vì crash app.

---

## Phần 3: Tạo Slice

```javascript
const checkoutSlice = createSlice({
  name: "checkout",
  initialState: getStoredState(),
  reducers: { ... }
});
```

### Các tham số

| Tham số | Ý nghĩa |
|--------|---------|
| `name` | Tên slice (dùng để tạo action types: `checkout/saveCheckout`, etc.) |
| `initialState` | State ban đầu (lấy từ localStorage nếu có, không thì dùng mặc định) |
| `reducers` | Object chứa các hàm xử lý để thay đổi state |

---

## Phần 4: Reducers (Hàm xử lý state)

### 4.1 `saveCheckout` - Lưu đơn hàng mới

```javascript
saveCheckout: (state, action) => {
  const newOrder = action.payload;

  const latestHistory = getStoredState().history;

  state.history = [...latestHistory, newOrder];
  state.data = newOrder;

  localStorage.setItem("checkout_history", JSON.stringify(state));
}
```

#### Chi tiết từng dòng

**Dòng 1: Lấy dữ liệu submit**
```javascript
const newOrder = action.payload;
// newOrder = { fullName: "Trần A", phone: "0987654321", ... }
```

**Dòng 2-3: Lấy lịch sử từ storage**
```javascript
const latestHistory = getStoredState().history;
// latestHistory = [{ order_cũ_1 }, { order_cũ_2 }]
```

**Dòng 4-5: Cập nhật state**
```javascript
state.history = [...latestHistory, newOrder];
// history = [{ order_cũ_1 }, { order_cũ_2 }, { newOrder }]

state.data = newOrder;
// data = { fullName: "Trần A", phone: "0987654321", ... }
```

**Dòng 6: Lưu vào localStorage**
```javascript
localStorage.setItem("checkout_history", JSON.stringify(state));
// Lưu state dạng JSON string vào browser storage
// Nếu trang reload → dữ liệu vẫn còn
```

#### Ví dụ hoạt động

```
User submit form checkout
        ↓
dispatch(saveCheckout({
  fullName: "Trần A",
  phone: "0987654321",
  email: "trana@email.com",
  addressDetail: "123 Trần Hưng Đạo, HN",
  createdAt: 1701388800000
}))
        ↓
saveCheckout reducer chạy:
  - latestHistory = [] (hoặc những đơn cũ)
  - state.history = [{ newOrder }]
  - state.data = { newOrder }
  - localStorage = { newOrder }
        ↓
Đơn hàng được lưu vào localStorage
Trang reload vẫn giữ dữ liệu
```

---

### 4.2 `clearCheckoutHistory` - Xóa toàn bộ lịch sử

```javascript
clearCheckoutHistory: (state) => {
  state.history = [];
  state.data = null;
  localStorage.setItem("checkout_history", JSON.stringify(state));
}
```

- Xóa tất cả đơn hàng từ state.
- Xóa từ localStorage.
- Nếu trang reload → không có dữ liệu nào.

#### Ví dụ
```
Trước: state = { history: [{ A }, { B }], data: { B } }
        ↓
dispatch(clearCheckoutHistory())
        ↓
Sau: state = { history: [], data: null }
```

---

### 4.3 `syncFromStorage` - Đồng bộ hóa từ storage

```javascript
syncFromStorage: (state, action) => {
  const history = action.payload.history;
  const data = action.payload.data;

  state.history = history;
  state.data = data;
}
```

#### Ý nghĩa
- Dùng để **đồng bộ dữ liệu giữa các tab** của trình duyệt.
- Khi tab A thay đổi localStorage → tab B sẽ được thông báo qua event `storage`.
- Tab B gọi `syncFromStorage` để cập nhật Redux state của nó.

#### Ví dụ flow

```
Tab A: User submit checkout
        ↓
localStorage.setItem("checkout_history", ...)
        ↓
Event 'storage' được trigger
        ↓
Tab B nhận được event
        ↓
dispatch(syncFromStorage({ history, data }))
        ↓
Tab B Redux state được cập nhật
```

---

## Phần 5: Export Actions

```javascript
export const { saveCheckout, clearCheckoutHistory, syncFromStorage } =
  checkoutSlice.actions;
```

- Redux Toolkit tự động tạo **action creators** từ tên reducers.
- Bạn có thể gọi chúng trong components:

```javascript
// Trong component
import { saveCheckout, clearCheckoutHistory } from '../store/checkoutSlice';

dispatch(saveCheckout(data));
dispatch(clearCheckoutHistory());
```

---

## Phần 6: Export Reducer

```javascript
export default checkoutSlice.reducer;
```

- Export reducer để đăng ký vào Redux store:

```javascript
// Trong store.js
import checkoutReducer from './checkoutSlice';

const rootReducer = combineReducers({
  checkout: checkoutReducer,  // ← đăng ký tại đây
  cart: cartReducer,
});
```

---

## Tóm tắt State Structure

```javascript
state.checkout = {
  history: [
    { fullName: "A", phone: "0987654321", email: "a@email.com", ..., createdAt: 1701388800000 },
    { fullName: "B", phone: "0912345678", email: "b@email.com", ..., createdAt: 1701302400000 }
  ],
  data: { fullName: "A", phone: "0987654321", ... }  // Đơn hàng mới nhất
}
```

---

## Luồng dữ liệu (Data Flow)

```
1. App khởi động
   ↓
2. getStoredState() kiểm tra localStorage
   ├─ Nếu có → lấy dữ liệu cũ
   └─ Nếu không → dùng mặc định
   ↓
3. initialState = dữ liệu lấy được
   ↓
4. Redux store được tạo với state này
   ↓
5. Component hiển thị dữ liệu từ state
   ↓
6. User submit checkout
   ↓
7. dispatch(saveCheckout(newOrder))
   ↓
8. saveCheckout reducer:
   - Lấy lịch sử cũ từ storage
   - Thêm newOrder vào history
   - Cập nhật state
   - Lưu vào localStorage
   ↓
9. Component rerender với state mới
   ↓
10. Trang reload → getStoredState() lấy lại từ localStorage
```

---

## Các use case

**Use case 1: Người dùng lần đầu mở app**
- localStorage trống → getStoredState() trả về { history: [], data: null }
- Trang hiển thị "Không có lịch sử mua hàng"

**Use case 2: Sau khi submit checkout lần 1**
- state.history = [{ order_1 }]
- localStorage lưu dữ liệu
- Trang reload → dữ liệu vẫn có

**Use case 3: Submit lần 2**
- state.history = [{ order_1 }, { order_2 }]
- localStorage cập nhật

**Use case 4: Mở 2 tab cùng lúc, submit ở tab A**
- Tab A: lưu vào localStorage
- Tab B nhận event storage → gọi syncFromStorage để cập nhật

**Use case 5: Xóa lịch sử**
- dispatch(clearCheckoutHistory())
- state = { history: [], data: null }
- localStorage = {}
- Trang reload → trống

---

## Lợi ích của cách thiết kế này

1. **Persistent Storage** - Dữ liệu không mất khi reload.
2. **Multi-tab Sync** - Các tab cùng trình duyệt đồng bộ dữ liệu.
3. **Error Handling** - try-catch tránh crash khi localStorage bị hỏng.
4. **Clean Code** - Redux Toolkit giúp code ngắn gọn hơn.
5. **Scalable** - Dễ thêm reducers khác (thêm field, action mới).

---

## Cải tiến có thể làm thêm

1. **Giới hạn lịch sử** - Chỉ giữ 50 đơn hàng gần nhất (tránh localStorage quá lớn).
2. **Thêm status** - Theo dõi "pending", "completed", "cancelled".
3. **Validation** - Kiểm tra dữ liệu trước khi lưu.
4. **Encrypt** - Mã hóa dữ liệu nhạy cảm trước khi lưu localStorage.
5. **TTL** - Xóa dữ liệu cũ hơn N ngày.
