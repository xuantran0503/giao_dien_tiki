# Giải Thích Chi Tiết File cartSlice.ts

Tài liệu này giải thích chi tiết ý nghĩa và cách vận hành của từng dòng code trong file `cartSlice.ts` - nơi quản lý toàn bộ logic giỏ hàng của ứng dụng.

---

## 1. Khai Báo và Khởi Tạo (Dòng 1 - 35)

- **Dòng 1-3**: Import các công cụ từ Redux Toolkit (`createSlice`, `createAsyncThunk`) và thư viện `axios` để gọi API.
- **Dòng 5-6**: Khai báo địa chỉ Server (`API_BASE`) và Mã đối tác (`A_ID`). Đây là các tham số cố định cần thiết để giao tiếp với Backend.
- **Dòng 8**: Hàm `getCartId` dùng để lấy mã giỏ hàng từ bộ nhớ trình duyệt (`localStorage`). Việc này giúp người dùng không bị mất giỏ hàng khi load lại trang.
- **Dòng 10-28**: 
    - Định nghĩa cấu trúc `CartItem`: Bao gồm nhiều loại ID (`id`, `listingId`, `productId`, `cartItemId`). Trong đó `listingId` cực kỳ quan trọng để người dùng có thể nhấn vào sản phẩm trong giỏ hàng và quay lại đúng trang chi tiết.
    - Định nghĩa `CartState`: Trạng thái của giỏ hàng gồm danh sách sản phẩm, trạng thái tải (`idle`, `pending`...), lỗi và `cartId`.
- **Dòng 30-35**: Khởi tạo giá trị ban đầu cho giỏ hàng.

---

## 2. API: Thêm Sản Phẩm Vào Giỏ Hàng (Dòng 39 - 110)

Đây là hàm `addItemToCart` xử lý việc gửi sản phẩm lên Server.
- **Dòng 54-58**: Sử dụng `getState()` để kiểm tra xem sản phẩm đã có sẵn trong giỏ hàng (`state.cart.items`) chưa.
- **Dòng 61-73 (Trường hợp đã có)**: Nếu sản phẩm đã tồn tại, ứng dụng sẽ tự động tính toán số lượng mới (cũ + thêm mới) và gọi API bằng phương thức `PUT` (`update-item`). Việc này giúp tránh lỗi "Sản phẩm đã tồn tại" từ Backend.
- **Dòng 76-105 (Trường hợp chưa có)**: Nếu sản phẩm chưa tồn tại, ứng dụng sẽ gọi API bằng phương thức `POST` (`item`) để thêm mới.
- **Lưu ý về UsingDate**: Trường `UsingDate` được gửi dưới dạng một mảng (Array) `[new Date().toISOString()]` để khớp đúng với yêu cầu nghiêm ngặt của Backend (Swagger).
- **Dòng 92-100**: Nếu Server trả về một `CartId` mới, lập tức lưu vào `localStorage` và cập nhật vào hệ thống Redux.

---

## 3. API: Lấy Chi Tiết Giỏ Hàng (Dòng 114 - 179)

Hàm `fetchCartDetail` là "trái tim" của giỏ hàng, giúp đồng bộ dữ liệu từ Server về giao diện.
- **Dòng 121-124**: Gọi lệnh `GET` để lấy toàn bộ dữ liệu giỏ hàng.
- **Dòng 134**: `items.reverse()` đảo ngược danh sách để các sản phẩm vừa thêm mới nhất sẽ hiện lên trên cùng.
- **Dòng 152-159 (Logic Regex Quan Trọng)**: 
    - Sử dụng biểu thức chính quy (Regex) để tìm chuỗi có dạng mã UUID (dài 36 ký tự) trong trường `Uri`.
    - **Tại sao?** Vì đôi khi Server không trả về ID hiển thị (`ListingId`) trực tiếp, chúng ta phải bóc tách nó từ đường dẫn sản phẩm để đảm bảo chức năng "Click vào ảnh trong giỏ hàng để xem chi tiết" hoạt động chính xác.
- **Dòng 161-174**: Ánh xạ (Map) dữ liệu thô từ Server sang cấu trúc `CartItem` mà ứng dụng dễ sử dụng hơn.

---

## 4. API: Các Chức Năng Xóa và Cập Nhật (Dòng 183 - 269)

- **`removeItemFromCart`**: Xóa một sản phẩm cụ thể dựa trên `cartItemId` và `productId`.
- **`clearAllCartItems`**: Xóa sạch toàn bộ sản phẩm trong giỏ hàng (thường dùng sau khi thanh toán hoặc khi người dùng muốn làm trống giỏ).
- **`updateCartItemQuantity`**: Cập nhật số lượng sản phẩm (ví dụ khi nhấn dấu + hoặc - trong trang giỏ hàng).

*Lưu ý: Tất cả các hàm này đều gọi `fetchCartDetail` sau khi xử lý thành công để đảm bảo dữ liệu luôn mới nhất.*

---

## 5. Định Nghĩa Slice và Reducers (Dòng 271 - 367)

Đây là nơi Redux lưu trữ và thay đổi dữ liệu thực tế:
- **`reducers`**: Các hàm xử lý dữ liệu đồng bộ (như `setCartId`, `clearCart`).
- **`extraReducers` (Redux Thunk)**: Xử lý các trạng thái của API:
    - `pending`: Đang thực hiện (hiện loading).
    - `fulfilled`: Thành công (cập nhật dữ liệu mới vào `state.items`).
    - `rejected`: Thất bại (lưu thông báo lỗi).

---

## 6. Selectors và Exports (Dòng 370 - 383)

- **`selectCartTotal`**: Một hàm cực kỳ tiện lợi tự động tính tổng tiền của cả giỏ hàng dựa trên `price * quantity`.
- **`selectCartItemById`**: Giúp kiểm tra nhanh xem một sản phẩm nhất định đã có trong giỏ hàng chưa.
- **Dòng 383**: Export `reducer` để đăng ký vào Store trung tâm của ứng dụng.

---

## 7. Các Lưu Ý Kỹ Thuật

1. **Mapping ID**: File này xử lý rất kỹ các loại ID khác nhau để đảm bảo dữ liệu nhất quán giữa Giỏ hàng và Trang chi tiết.
2. **Persistence**: Sử dụng `localStorage` kết hợp với Redux để duy trì trạng thái giỏ hàng kể cả khi đóng trình duyệt.
3. **Data Sync**: Luôn thực hiện logic "Viết xong -> Đọc lại" (gọi `fetch` sau khi `update/add`) để đảm bảo dữ liệu trên màn hình khớp hoàn toàn với Backend.
