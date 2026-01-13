# Giải Thích Chi Tiết Dòng 29-38 Trong ProductDetailPage.jsx

Đoạn code này chịu trách nhiệm **truy xuất dữ liệu dự phòng** cho sản phẩm. Nó giúp trang chi tiết sản phẩm hiển thị thông tin ngay lập tức hoặc khi API gặp sự cố bằng cách tận dụng dữ liệu từ giỏ hàng hoặc từ trang trước truyền sang.

---

### Dòng 29: Lấy dữ liệu từ Redux Store
```javascript
const { items: cartItems } = useSelector((state) => state.cart);
```
- **Hành động:** Sử dụng `useSelector` để lấy mảng `items` từ slice `cart` trong Redux.
- **Ý nghĩa:** `cartItems` chứa danh sách tất cả sản phẩm người dùng đã thêm vào giỏ hàng. Chúng ta lấy danh sách này để tìm kiếm thông tin nếu cần thiết.

### Dòng 30: Khởi tạo location
```javascript
const location = useLocation();
```
- **Hành động:** Sử dụng hook `useLocation` của thư viện `react-router-dom`.
- **Ý nghĩa:** Biến `location` chứa thông tin về URL hiện tại và các dữ liệu ẩn được truyền kèm khi chuyển trang thông qua hàm `navigate()`.

### Dòng 31: Lấy dữ liệu từ State chuyển trang
```javascript
const cartItemFromState = location.state?.cartItem;
```
- **Hành động:** Truy cập vào thuộc tính `state` của `location`.
- **Ý nghĩa:** Khi người dùng nhấn vào một sản phẩm từ trang Giỏ hàng hoặc một trang danh sách, lập trình viên có thể truyền toàn bộ object sản phẩm sang trang mới để hiện thị ngay lập tức. 
- **Đặc điểm:** Dữ liệu này rất nhanh nhưng sẽ **biến mất** nếu người dùng nhấn F5 (tải lại trang) hoặc copy link sang tab khác.

### Dòng 33-36: Tìm kiếm sản phẩm trong giỏ hàng (Cơ chế dự phòng)
```javascript
// Tìm sản phẩm trong giỏ hàng nếu mở tab mới (không có state)
const cartItemFromStore = cartItems.find(item => 
  item.productId === productId || item.listingId === productId || item.id === productId
);
```
- **Hành động:** Sử dụng hàm `.find()` để duyệt qua danh sách giỏ hàng.
- **Ý nghĩa:** Nếu người dùng F5, `location.state` bị mất, chúng ta sẽ tìm trong giỏ hàng xem có sản phẩm nào có ID trùng với `productId` trên URL không.
- **Tại sao kiểm tra 3 điều kiện (`||`)?**
    1. `item.productId`: ID định danh sản phẩm từ dịch vụ.
    2. `item.listingId`: ID của bản ghi hiển thị trên sàn.
    3. `item.id`: ID nội bộ trong giỏ hàng.
    => Việc kiểm tra cả 3 đảm bảo dù dữ liệu đến từ nguồn nào (API khác nhau) thì vẫn có khả năng cao tìm thấy sản phẩm.

### Dòng 38: Hợp nhất và xác định dữ liệu cuối cùng
```javascript
const cartItem = cartItemFromState || cartItemFromStore;
```
- **Ý nghĩa:** Biến `cartItem` sẽ lưu giữ thông tin sản phẩm tìm thấy. 
- **Thứ tự ưu tiên:** Ưu tiên dữ liệu từ `state` truyền sang (vì nó đầy đủ hơn). Nếu không có (do F5), nó mới dùng dữ liệu tìm được trong giỏ hàng (`store`).

---

### Tổng kết: Tại sao đoạn code này quan trọng?
1. **Tốc độ (Speed):** Hiển thị thông tin sản phẩm ngay lập tức từ `location.state` mà không cần đợi API `fetchProductById` phản hồi (thường mất 0.5 - 1s).
2. **Độ tin cậy (Resilience):** Nếu API bị lỗi 404 hoặc 400, trang web vẫn không bị trắng hoặc báo lỗi "Không tìm thấy sản phẩm" nếu sản phẩm đó đã có sẵn trong giỏ hàng của người dùng.
3. **Trải nghiệm người dùng (UX):** Giúp quá trình chuyển trang cảm giác mượt mà và liền mạch hơn.
