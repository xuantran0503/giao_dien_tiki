# Hướng dẫn Chuyên sâu: ProductDetailPage.jsx

Đây là trang phức tạp nhất về mặt logic hiển thị, vì nó phải xử lý sự giao thoa giữa dữ liệu từ API sản phẩm và dữ liệu từ Giỏ hàng.

## 1. Cơ chế Ghép nối Dữ liệu (Dòng 75-99)
Ứng dụng tạo ra một đối tượng ảo mang tên `product`. Đối tượng này được tổng hợp từ 2 nguồn:

### Nguồn A: API Chính thống (`currentProduct`)
- Nếu API trả về dữ liệu (id, name, price...), chúng ta ưu tiên dùng nó.
- Chúng ta dùng kỹ thuật `Spread Operator` (`...currentProduct`) để giữ lại toàn bộ các thuộc tính gốc từ server.

### Nguồn B: Cứu cánh từ Giỏ hàng (`cartItem`)
- **Tình huống**: Bạn đã thêm sản phẩm vào giỏ, sau đó bạn tắt máy, hôm sau bạn mở lại giỏ hàng và nhấn vào sản phẩm đó. Nếu lúc này API sản phẩm bị bảo trì hoặc lỗi, trang chi tiết sẽ bị trắng.
- **Giải pháp**: Chúng ta lấy ngược dữ liệu từ trong Giỏ hàng ra để hiển thị. Người dùng vẫn thấy tên, ảnh và giá mà họ đã lưu. Đây là tính năng "ngoại tuyến" một phần rất hữu ích.

## 2. Quản lý Vòng đời (useEffect)
- **Effect 1 (Khởi tạo)**: Chạy ngay khi mã sản phẩm (`productId`) thay đổi. Nó giống như lệnh "Đi lấy gói dữ liệu mới ngay".
- **Effect 2 (Dọn dẹp)**: Khi component bị hủy (người dùng chuyển trang), hàm trả về (`return () => ...`) sẽ chạy. Nó giống như lệnh "Xóa bảng" để chuẩn bị cho dữ liệu mới.

## 3. Chức năng Mua ngay vs Thêm vào giỏ
- **Thêm vào giỏ**: Sử dụng `dispatch(addItemToCart)`. Sau khi xong, nó hiện `Notification` (Dòng 581). Đây là một component "Portal" hiển thị nổi lên trên màn hình.
- **Mua ngay**: Nó không thêm vào giỏ mà trực tiếp mở `CheckoutForm` (Dòng 595). Chúng ta truyền toàn bộ thông tin sản phẩm vào biến `meta` của form thanh toán để người dùng trả tiền ngay lập tức.

## 4. Hiển thị Thông báo (Notification)
- Đây là một trạng thái động với 3 biến: `show` (hiện hay ẩn), `message` (nội dung), `type` (success màu xanh, error màu đỏ).
- Chúng ta sử dụng `setTimeout` (Dòng 189) để tự động đặt `show: false` sau 3 giây. Điều này giúp trải nghiệm người dùng tự nhiên hơn, không cần họ phải tự tay tắt thông báo.
