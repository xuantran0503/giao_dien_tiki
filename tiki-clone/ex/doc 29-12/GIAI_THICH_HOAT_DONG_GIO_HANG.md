# Giải thích hoạt động của CartSlice và CartPage

Tài liệu này giải thích chi tiết cách chức năng Giỏ hàng hoạt động trong dự án của bạn, bao gồm việc quản lý dữ liệu (Redux Store) và hiển thị giao diện (CartPage).

## 1. CartSlice (`store/cartSlice.ts`)

`cartSlice` là nơi quản lý toàn bộ dữ liệu (state) của giỏ hàng. Nó được thiết kế để hỗ trợ cả 2 cơ chế:
1.  **Cập nhật Offline (Synchronous)**: Thay đổi dữ liệu ngay lập tức trên trình duyệt (đang được sử dụng chính).
2.  **Cập nhật Online (Asynchronous/API)**: Đồng bộ dữ liệu với Server (đã được khai báo sẵn các hàm `createAsyncThunk` nhưng UI hiện tại đang ưu tiên gọi action đồng bộ).

### A. Cấu trúc dữ liệu (`initialState`)
```typescript
interface CartState {
  items: CartItem[]; // Danh sách sản phẩm trong giỏ
  totalQuantity: number; // Tổng số lượng sản phẩm
  status: "idle" | "pending" | "succeeded" | "failed"; // Trạng thái gọi API
  error: string | null;
}
```

### B. Các Actions chính (Reducers)
Các action này xử lý dữ liệu **ngay lập tức** tại Redux store mà không gọi API. Đây là những hàm đang được `CartPage` sử dụng.

1.  **`addToCart`**:
    *   Kiểm tra xem sản phẩm đã có trong giỏ chưa.
    *   Nếu có: Cộng dồn số lượng.
    *   Nếu chưa: Thêm mới vào mảng `items`.
2.  **`updateQuantity`**:
    *   Tìm sản phẩm theo `id`.
    *   Cập nhật số lượng mới.
    *   Tính toán lại `totalQuantity` cho toàn bộ giỏ.
3.  **`removeFromCart`**:
    *   Xóa một sản phẩm cụ thể khỏi mảng `items`.
4.  **`removeSelectBuysFromCart`**:
    *   Nhận vào một mảng các ID sản phẩm đã chọn (khi người dùng checkout thành công hoặc bấm xóa nhiều).
    *   Lọc bỏ tất cả các items có ID nằm trong danh sách này.

### C. Các API Thunks (Async Actions)
Trong file `cartSlice.ts` có sẵn các hàm gọi API (như `addItemToCart`, `fetchCartDetail`, `removeItemFromCart`).
*   **Tác dụng**: Giúp đồng bộ giỏ hàng với server để khi user đăng nhập ở máy khác vẫn thấy giỏ hàng.
*   **Lưu ý**: Hiện tại trong `CartPage.jsx`, code đang `import` và `dispatch` các action ở mục B (Sync) nhiều hơn. Nếu bạn muốn kích hoạt tính năng đồng bộ Server hoàn toàn, bạn cần thay thế việc gọi `updateQuantity` bằng `dispatch(updateCartItemQuantity(...))` (ví dụ vậy).

---

## 2. CartPage (`pages/CartPage.jsx`)

Đây là giao diện hiển thị và tương tác với người dùng.

### A. Lấy dữ liệu (Connect Redux)
```javascript
const cartItems = useAppSelector((state) => state.cart.items);
```
*   `CartPage` luôn lắng nghe `state.cart.items`. Bất cứ khi nào bạn `dispatch` action thay đổi giỏ hàng, `CartPage` sẽ tự động render lại để hiển thị danh sách mới nhất.

### B. Quy trình xử lý sự kiện

#### 1. Tăng/Giảm số lượng (`handleIncrease` / `handleDecrease`)
*   **Hành động**: User bấm nút `+` hoặc `-`.
*   **Code**: Gọi `dispatch(updateQuantity({ id, quantity: current + 1 }))`.
*   **Luồng đi**:
    *   UI bắt sự kiện Click.
    *   Dispatch Action Sync về Redux.
    *   `cartSlice` tính toán lại quantity.
    *   Redux State thay đổi -> `CartPage` re-render số mới.

#### 2. Chọn sản phẩm (`handleSelectItem` / `handleSelectAll`)
*   **Logic này nằm ở Local State** (`useState`), không lưu trên Redux.
    *   `const [selectedItems, setSelectedItems] = useState([])`: Chứa danh sách ID các sản phẩm đang được tick chọn.
*   **Tính toán tổng tiền**:
    *   Hàm `calculateTotal()` sẽ lọc `cartItems` lấy những item có ID nằm trong `selectedItems` để cộng tổng tiền. Vì vậy, chỉ những món đang chọn mới được tính vào "Tổng tiền thanh toán".

#### 3. Xóa sản phẩm (`handleRemove` / `handleClearSelected`)
*   **Xóa 1 món**: Gọi `dispatch(removeFromCart(id))`.
*   **Xóa nhiều món (đã chọn)**:
    *   Lấy danh sách `selectedItems`.
    *   Gọi `dispatch(removeSelectBuysFromCart(selectedItems))`.
    *   Sau đó reset `selectedItems` về rỗng.

#### 4. Thanh toán (`handleCheckoutSubmit`)
*   Khi Form Checkout submit thành công:
    1.  Lấy danh sách các sản phẩm đã chọn mua (`itemsToRemove`).
    2.  Gọi `dispatch(removeSelectBuysFromCart(itemsToRemove))` để xóa chúng khỏi giỏ hàng (vì đã mua xong).
    3.  Thực tế, bước này nên có thêm việc gọi API tạo đơn hàng (Create Order) trước khi xóa khỏi giỏ local.

---

## 3. Tóm tắt luồng dữ liệu (Data Flow)

1.  **User Action** (Click nút) -> **CartPage Event Handler**.
2.  -> **Dispatch Action** (ví dụ `updateQuantity`) lên Redux Store.
3.  -> **CartSlice Reducer** chạy logic cập nhật mảng `items`.
4.  -> **Redux Store** cập nhật State mới.
5.  -> **CartPage** nhận thấy thay đổi (thông qua `useSelector`) -> **Re-render** giao diện.

Đây là mô hình **One-way Data Flow** chuẩn của React-Redux.
