# Giải thích chi tiết checkoutSlice.js

## Tổng quan
File này là Redux Toolkit slice quản lý state của checkout (đơn hàng). Slice này xử lý việc lưu trữ, xóa lịch sử đơn hàng và đồng bộ dữ liệu giữa nhiều tab trình duyệt.

---

## Giải thích từng dòng code

### Import (Dòng 1)
```javascript
import { createSlice, createSelector } from "@reduxjs/toolkit";
```
- `createSlice`: Hàm tạo Redux slice (bao gồm reducer và actions)
- `createSelector`: Hàm tạo memoized selector (tối ưu performance)

---

### Initial State (Dòng 3-8)
```javascript
const initialState = {
```
- Định nghĩa state ban đầu của slice

```javascript
data: null,
```
- `data`: Lưu thông tin đơn hàng mới nhất
- Giá trị: Object chứa thông tin người mua + sản phẩm, hoặc `null` nếu chưa có

```javascript
history: [],
```
- `history`: Mảng lưu trữ tất cả các đơn hàng đã đặt
- Mỗi phần tử là một object đơn hàng

```javascript
lastUpdated: 0,
```
- `lastUpdated`: Timestamp lần cập nhật state gần nhất
- Dùng để so sánh khi đồng bộ giữa các tab (tab nào có timestamp mới hơn sẽ được ưu tiên)

```javascript
lastReset: 0,
```
- `lastReset`: Timestamp lần xóa lịch sử gần nhất
- Dùng để filter ra các đơn hàng cũ (đơn hàng có `createdAt < lastReset` sẽ bị ẩn)

---

### Create Slice (Dòng 10-54)
```javascript
const checkoutSlice = createSlice({
```
- Tạo Redux slice với `createSlice`

```javascript
name: "checkout",
```
- Tên của slice, sẽ được dùng làm prefix cho action types
- Ví dụ: action type sẽ là `checkout/saveCheckout`

```javascript
initialState,
```
- Truyền initial state đã định nghĩa ở trên

```javascript
reducers: {
```
- Object chứa các reducer functions

---

### Reducer: saveCheckout (Dòng 14-20)
```javascript
saveCheckout: (state, action) => {
```
- Reducer xử lý action lưu đơn hàng mới
- `state`: Current state (được Immer proxy, có thể mutate trực tiếp)
- `action`: Action object, `action.payload` chứa dữ liệu đơn hàng

```javascript
const entry = action.payload;
```
- Lấy dữ liệu đơn hàng từ payload
- `entry` chứa: `{ fullName, phone, email, addressDetail, note, meta, createdAt }`

```javascript
state.history.push(entry);
```
- Thêm đơn hàng mới vào cuối mảng `history`
- Nhờ Immer, có thể mutate trực tiếp mà không cần spread operator

```javascript
state.data = entry;
```
- Cập nhật `data` thành đơn hàng mới nhất

```javascript
state.lastUpdated = Date.now();
```
- Cập nhật timestamp lần sửa đổi gần nhất
- Dùng để đồng bộ cross-tab

---

### Reducer: clearCheckoutHistory (Dòng 22-31)
```javascript
clearCheckoutHistory: (state) => {
```
- Reducer xử lý action xóa toàn bộ lịch sử

```javascript
const now = Date.now();
```
- Lấy timestamp hiện tại

```javascript
return {
    ...state,
    history: [],
    data: null,
    lastUpdated: now,
    lastReset: now,
};
```
- **Lưu ý**: Reducer này **return** object mới thay vì mutate `state`
- Lý do: Đảm bảo Redux nhận biết được sự thay đổi (tạo reference mới)
- Các thay đổi:
  - `history`: Xóa sạch thành mảng rỗng
  - `data`: Set về `null`
  - `lastUpdated`: Cập nhật timestamp
  - `lastReset`: Đánh dấu thời điểm xóa (quan trọng!)

**Vai trò của `lastReset`:**
- Khi xóa lịch sử, `lastReset` được set = thời gian hiện tại
- Selector `selectCheckoutHistory` sẽ filter ra các đơn hàng có `createdAt > lastReset`
- Ngay cả khi có tab khác sync lại đơn hàng cũ, chúng vẫn bị ẩn vì `createdAt < lastReset`

---

### Reducer: syncFromStorage (Dòng 33-52)
```javascript
syncFromStorage: (state, action) => {
```
- Reducer xử lý đồng bộ dữ liệu từ localStorage (tab khác)

```javascript
const incoming = action.payload;
```
- `incoming`: State checkout từ tab khác

```javascript
if (incoming) {
```
- Kiểm tra xem có dữ liệu incoming không

```javascript
const incomingTime = incoming.lastUpdated || 0;
const currentTime = state.lastUpdated || 0;
```
- Lấy timestamp của dữ liệu incoming và current
- Dùng `|| 0` để xử lý trường hợp undefined

```javascript
const incomingReset = incoming.lastReset || 0;
const currentReset = state.lastReset || 0;
state.lastReset = Math.max(incomingReset, currentReset);
```
- **Merge logic cho `lastReset`**: Luôn lấy giá trị lớn nhất
- Lý do: Nếu một tab xóa lịch sử (lastReset mới), tab khác phải nhận giá trị này
- Điều này đảm bảo tất cả tab đều ẩn các đơn hàng cũ

```javascript
if (incomingTime > currentTime) {
```
- Chỉ sync dữ liệu nếu incoming **mới hơn** current
- Tránh trường hợp dữ liệu cũ ghi đè lên dữ liệu mới

```javascript
state.history = incoming.history || [];
state.data = incoming.data;
state.lastUpdated = incomingTime;
```
- Cập nhật state với dữ liệu từ tab khác
- `incoming.history || []`: Fallback về mảng rỗng nếu undefined

---

### Export Actions (Dòng 56-57)
```javascript
export const { saveCheckout, clearCheckoutHistory, syncFromStorage } =
  checkoutSlice.actions;
```
- Export các action creators
- Redux Toolkit tự động tạo action creators từ reducer names
- Ví dụ: `saveCheckout(payload)` sẽ tạo action `{ type: 'checkout/saveCheckout', payload }`

---

### Selector: selectCheckout (Dòng 59)
```javascript
export const selectCheckout = (state) => state.checkout && state.checkout.data;
```
- Selector lấy đơn hàng mới nhất
- `state.checkout &&`: Kiểm tra xem checkout slice có tồn tại không
- Trả về `state.checkout.data` hoặc `undefined`

---

### Memoized Selector: selectCheckoutHistory (Dòng 61-72)

#### Helper Selector (Dòng 62)
```javascript
const selectCheckoutState = (state) => state.checkout || {};
```
- Selector lấy toàn bộ checkout state
- Fallback về object rỗng nếu undefined

#### Memoized Selector (Dòng 64-72)
```javascript
export const selectCheckoutHistory = createSelector(
```
- Tạo memoized selector với `createSelector`
- **Memoization**: Chỉ tính toán lại khi input thay đổi

```javascript
[selectCheckoutState],
```
- Input selectors: Mảng các selector
- Output của `selectCheckoutState` sẽ được truyền vào hàm transform

```javascript
(checkout) => {
```
- Transform function: Nhận output của input selectors

```javascript
const { history, lastReset } = checkout;
```
- Destructure `history` và `lastReset` từ checkout state

```javascript
if (!history || !Array.isArray(history)) return [];
```
- Kiểm tra `history` có phải là array không
- Nếu không, trả về mảng rỗng

```javascript
if (!lastReset) return history;
```
- Nếu chưa từng xóa lịch sử (`lastReset = 0`), trả về toàn bộ history

```javascript
return history.filter((item) => (item.createdAt || 0) > lastReset);
```
- **Filter logic**: Chỉ giữ lại các đơn hàng có `createdAt > lastReset`
- Đơn hàng được tạo **sau** lần xóa gần nhất sẽ được hiển thị
- Đơn hàng cũ (trước khi xóa) sẽ bị ẩn

**Tại sao dùng `createSelector`?**
- Tránh re-render không cần thiết
- Nếu dùng selector thông thường, mỗi lần component re-render, `filter` sẽ tạo mảng mới
- React sẽ nghĩ reference thay đổi → trigger re-render
- `createSelector` cache kết quả, chỉ tính lại khi `checkout` state thay đổi

---

### Export Reducer (Dòng 74)
```javascript
export default checkoutSlice.reducer;
```
- Export reducer để thêm vào Redux store
- Trong `store.js`: `checkout: checkoutReducer`

---

## Luồng hoạt động

### 1. Lưu đơn hàng
```
User submit form
→ dispatch(saveCheckout(payload))
→ Reducer thêm vào history, cập nhật data, lastUpdated
→ Redux-persist lưu vào localStorage
→ Tab khác nhận sự kiện storage
→ Tab khác dispatch(syncFromStorage)
→ Tab khác cập nhật UI
```

### 2. Xóa lịch sử
```
User click "Xóa lịch sử"
→ dispatch(clearCheckoutHistory())
→ Reducer:
  - history = []
  - data = null
  - lastReset = Date.now()
  - lastUpdated = Date.now()
→ Selector filter ra đơn hàng cũ (createdAt < lastReset)
→ UI hiển thị "Chưa có đơn hàng"
→ Ngay cả khi tab khác sync lại đơn hàng cũ, chúng vẫn bị ẩn
```

### 3. Đồng bộ cross-tab
```
Tab A: Thêm đơn hàng
→ lastUpdated = T1
→ Redux-persist lưu vào localStorage

Tab B: Nhận sự kiện storage
→ dispatch(syncFromStorage(checkoutState))
→ Reducer so sánh:
  - incoming.lastUpdated (T1) > current.lastUpdated (T0)
  - → Sync dữ liệu
→ Tab B cập nhật UI với đơn hàng mới
```

---

## Giải quyết vấn đề "đơn hàng cũ xuất hiện lại"

### Vấn đề
- User xóa lịch sử ở Tab A
- Tab B vẫn giữ dữ liệu cũ trong memory
- Tab B sync lại → Đơn hàng cũ xuất hiện trở lại

### Giải pháp: `lastReset`
1. Khi xóa, set `lastReset = Date.now()`
2. Tab B sync nhận được `lastReset` mới
3. Reducer merge: `state.lastReset = Math.max(incoming, current)`
4. Selector filter: `item.createdAt > lastReset`
5. Đơn hàng cũ (createdAt < lastReset) bị ẩn vĩnh viễn

---

## Tóm tắt

- **Mục đích**: Quản lý state đơn hàng trong Redux
- **State**:
  - `data`: Đơn hàng mới nhất
  - `history`: Tất cả đơn hàng
  - `lastUpdated`: Timestamp cập nhật (cho cross-tab sync)
  - `lastReset`: Timestamp xóa lịch sử (filter đơn hàng cũ)
- **Actions**:
  - `saveCheckout`: Lưu đơn hàng mới
  - `clearCheckoutHistory`: Xóa lịch sử
  - `syncFromStorage`: Đồng bộ từ tab khác
- **Selectors**:
  - `selectCheckout`: Lấy đơn hàng mới nhất
  - `selectCheckoutHistory`: Lấy lịch sử (đã filter, memoized)
- **Tính năng đặc biệt**:
  - Cross-tab sync với timestamp comparison
  - Filter đơn hàng cũ với `lastReset`
  - Memoized selector tối ưu performance
