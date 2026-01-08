# Phân Tích Luồng Hoạt Động Chức Năng Giỏ Hàng (Cart Functionality)

Tài liệu này giải thích chi tiết cách chức năng giỏ hàng hoạt động qua từng file để giúp bạn dễ dàng debug và sửa lỗi.

## 1. `src/store/cartSlice.ts` - Bộ Não & Giao Tiếp API

Đây là file quan trọng nhất, nơi quản lý toàn bộ dữ liệu (state) của giỏ hàng và thực hiện các gọi API tới server.

### Các thành phần chính:

- **State (Dữ liệu lưu trữ):**

  - `items`: Danh sách sản phẩm trong giỏ.
  - `status`: Trạng thái gọi API (`idle`, `pending`, `succeeded`, `failed`).
  - `cartId`: ID định danh của giỏ hàng (lưu trong LocalStorage để giữ giỏ hàng khi F5).

- **Actions (Hành động - Async Thunks):**
  - `addItemToCart`:
    - **Chức năng:** Gửi yêu cầu thêm sản phẩm lên Server.
    - **Payload (Dữ liệu gửi đi):** Đây là chỗ bạn đang sửa. Nó cần khớp chính xác với những gì Backend yêu cầu.
    - **Code hiện tại:**
      ```typescript
      const payload = {
        CartId: cartId,
        ItemId: params.productId, // Quan trọng: API cần ItemId
        Count: params.quantity, // Quan trọng: API cần Count
        UsingDate: [now.toISOString()], // Vừa được bỏ comment
        AId: A_ID,
      };
      ```
  - `fetchCartDetail`:
    - **Chức năng:** Lấy danh sách sản phẩm từ Server về để hiển thị.
    - **Lưu ý:** Sau khi `addItemToCart` thành công, code thường gọi luôn hàm này để cập nhật lại danh sách mới nhất.
  - `removeItemFromCart`: Xóa 1 sản phẩm.
  - `updateCartItemQuantity`: Tăng/giảm số lượng.

### Cách debug tại đây:

- Kiểm tra tab **Network** trong Developer Tools khi nhấn thêm giỏ hàng. Nếu thấy đỏ (lỗi), xem **Payload** gửi đi có đúng các trường `ItemId`, `Count` không. Xem **Response** tab để biết Server báo lỗi gì (ví dụ: "ProductId required" hay "Service not exist").

---

## 2. `src/pages/ProductDetailPage.jsx` - Nơi Kích Hoạt (Trigger)

Đây là giao diện trang chi tiết sản phẩm, nơi người dùng bấm nút "Thêm vào giỏ hàng".

### Luồng hoạt động:

1.  **Người dùng chọn số lượng:** Biến `quantity` được set qua nút +/-.
2.  **Sự kiện Click `handleAddToCart`:**
    - Hàm này thu thập thông tin sản phẩm đang xem (`product`).
    - **Quan trọng:** Nó chuẩn bị dữ liệu gọi là `params` để đưa cho `cartSlice`.
    - **Code xử lý ID:**
      ```javascript
      dispatch(
        addItemToCart({
          // Sử dụng productId nếu có, nếu không thì dùng id
          // Đây là chỗ dễ gây lỗi nếu dữ liệu sản phẩm (product) bị thiếu productId
          productId: product.productId ?? product.id,
          quantity: quantity,
          // ... các thông tin khác (price, name, image) dùng cho hiển thị tạm thời hoặc logic UI
        })
      );
      ```
3.  **Phản hồi UI:**
    - Nếu `dispatch` thành công (`.fulfilled`), hiện thông báo xanh ("Đã thêm...").
    - Nếu thất bại (`.rejected`), hiện thông báo đỏ.

### Cách debug tại đây:

- Nếu bấm nút mà không thấy gì xảy ra hoặc lỗi ngay lập tức: Kiểm tra xem biến `product` có dữ liệu chưa? `product.id` hoặc `product.productId` có log ra đúng không?

---

## 3. `src/pages/CartPage.jsx` - Hiển Thị & Quản Lý

Đây là trang xem giỏ hàng, nơi người dùng xem lại, xóa hoặc sửa số lượng.

### Luồng hoạt động:

1.  **Lấy dữ liệu:** Sử dụng `useAppSelector(state => state.cart.items)` để lấy danh sách từ Redux Store (đã được `fetchCartDetail` nạp vào).
2.  **Hiển thị:** Duyệt qua mảng `cartItems` để render HTML.
3.  **Tương tác:**
    - **Tăng/Giảm:** Gọi `dispatch(updateCartItemQuantity(...))`.
    - **Xóa:** Gọi `dispatch(removeItemFromCart(...))`.

### Lưu ý quan trọng về ID:

- Trong `cartSlice`, dữ liệu từ API trả về (`fetchCartDetail`) được map lại:
  ```javascript
  cartItemId: item.CartItemId,
  productId: item.ItemId,
  ```
- Vì vậy, trong `CartPage.jsx`, bạn phải dùng đúng `item.productId` để định danh sản phẩm khi gọi các hàm sửa/xóa. (Bạn đã sửa lỗi này ở bước trước).

---

## Tóm tắt quy trình luồng dữ liệu "Thêm vào giỏ":

1.  **Người dùng** bấm "Thêm vào giỏ" tại `ProductDetailPage`.
2.  `ProductDetailPage` gọi `dispatch(addItemToCart({ productId: "123", quantity: 1, ... }))`.
3.  **Redux (`cartSlice`)** nhận lệnh, chạy hàm `addItemToCart`.
4.  `addItemToCart` tạo Payload chuẩn `{ CartId, ItemId: "123", Count: 1, ... }`.
5.  `addItemToCart` dùng `axios` POST payload này lên Server API.
6.  **Server** xử lý và trả về kết quả.
    - **Thành công:** `cartSlice` gọi tiếp `fetchCartDetail` để tải danh sách mới nhất -> UI `CartPage` tự cập nhật.
    - **Thất bại:** `cartSlice` lưu lỗi vào `state.error` -> UI `ProductDetailPage` hiện thông báo lỗi.
