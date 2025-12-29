# Phân Tích Luồng Dữ Liệu: Chi Tiết Sản Phẩm & Giỏ Hàng

Tài liệu này giải thích cách ứng dụng của bạn tương tác với API và quản lý dữ liệu thông qua Redux Toolkit cho hai tính năng quan trọng nhất.

---

## 1. Luồng Chi Tiết Sản Phẩm (Product Detail Flow)

### Bước 1: Lấy ID từ URL
Khi bạn truy cập `/product/123`, React Router sẽ bắt lấy số `123` thông qua hook `useParams()`.

### Bước 2: Gọi API qua Async Thunk
Trong `ProductDetailPage.jsx`, một `useEffect` sẽ kích hoạt:
```javascript
dispatch(fetchProductById(productId));
```
Hàm này nằm trong `listingSlice.ts`. Nó thực hiện:
- Gửi request GET tới: `${API_BASE}/api-end-user/listing/${id}`.
- **Xử lý giá (Quan trọng)**: API trả về nhiều mức giá (`MinPrice`, `MaxPrice`). Hàm `ProductPrices` trong slice sẽ tính toán để tìm ra `originalPrice` và `currentPrice` (giá sau giảm) để hiển thị.

### Bước 3: Cập nhật Redux & Local State
- Khi API trả về thành công, `currentProduct` trong Redux Store sẽ được cập nhật.
- `ProductDetailPage.jsx` lắng nghe sự thay đổi này và dùng một `useEffect` khác để copy dữ liệu vào Local State (`product`) để render ra giao diện.

---

## 2. Luồng Giỏ Hàng (Cart Flow)

Giỏ hàng của bạn hiện tại đang chạy theo cơ chế "Hybrid" (Kết hợp):

### A. Thao tác Local (Tức thời)
Khi bạn nhấn "Thêm vào giỏ", hàm `addToCart` (reducer bình thường) được gọi.
- Nó kiểm tra xem ID sản phẩm đã có trong giỏ chưa.
- Nếu có: Tăng số lượng (`quantity`).
- Nếu chưa: Thêm mới item vào mảng `items`.
- **Ưu điểm**: Phản hồi cực nhanh, người dùng thấy giỏ hàng nhảy số ngay lập tức.

### B. Thao tác API (Đồng bộ máy chủ)
Bạn cũng có các Async Thunk như `addItemToCart`, `updateCartItemQuantity`:
- Gửi dữ liệu lên Server để lưu trữ vĩnh viễn vào tài khoản người dùng.
- Sử dụng phương thức `PUT` tới các endpoint: `/update-item`, `/remove-item`,...

### C. Redux Persist (Lưu trữ trình duyệt)
Trong `store.ts`, `cart` nằm trong `whitelist`. Điều này nghĩa là:
- Mỗi khi giỏ hàng thay đổi, Redux Persist tự động lưu toàn bộ mảng `items` vào **LocalStorage**.
- Khi bạn F5 trang web, Redux sẽ đọc từ LocalStorage và đổ lại vào Store. Giỏ hàng không bao giờ bị mất.

---

## 3. Tại sao có sự lệch dữ liệu (Inconsistency)?

Như bạn đã thấy, đôi khi dữ liệu hiển thị không khớp với Redux. Đây là quy trình dẫn đến lỗi đó:

1.  **Tab A** mở Sản phẩm 1 -> Redux `currentProduct` = Sản phẩm 1.
2.  **Tab B** mở Sản phẩm 2 -> Redux `currentProduct` = Sản phẩm 2.
3.  Vì Redux Store là chung cho cả ứng dụng (nhưng riêng cho từng Tab), nên lúc này Tab A vẫn đang hiển thị Sản phẩm 1 (do Local State giữ), nhưng nếu nó soi vào Redux thì sẽ thấy `null` hoặc dữ liệu của Sản phẩm 2 (nếu bạn dùng chung Tab).

**Giải quyết**: Luôn sử dụng hàm `cleanup` để xóa dữ liệu cũ khi chuyển trang và đảm bảo mỗi trang Detail chỉ tin vào Local State sau khi đã fetch xong.

---

## 4. Tóm tắt các Endpoint API đang dùng

| Tính năng | API Endpoint | Phương thức | Slice xử lý |
| :--- | :--- | :--- | :--- |
| Chi tiết sản phẩm | `/api-end-user/listing/{id}` | GET | `listingSlice` |
| Thêm vào giỏ | `/api-end-user/cart/cart-public/update-item` | PUT | `cartSlice` |
| Lấy giỏ hàng | `/api-end-user/cart/cart-public/{id}` | GET | `cartSlice` |
| Xóa item | `/api-end-user/cart/cart-public/remove-item` | PUT | `cartSlice` |
| Xóa hết giỏ | `/api-end-user/cart/cart-public/clear-item` | PUT | `cartSlice` |
