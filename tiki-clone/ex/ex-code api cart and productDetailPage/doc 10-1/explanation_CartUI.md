# Hướng dẫn Chuyên sâu: Giao diện Bộ chọn số lượng (UI/UX)

Sự thay đổi từ "Kích thước cố định" sang "Kích thước động" là một bước tiến lớn về trải nghiệm người dùng trong dự án này.

## 1. Logic Co giãn Động (CartPage.jsx)
Chúng ta sử dụng một công thức toán học ngay trong thẻ HTML:
```javascript
width: `${Math.max(2, String(quantity).length) + 1}ch`
```
- `String(quantity).length`: Đếm xem số lượng có bao nhiêu chữ số. Ví dụ: `100` có 3 chữ số.
- `Math.max(2, ...)`: Đảm bảo ô nhập không bao giờ nhỏ hơn 2 ký tự, tránh việc nhìn quá hẹp khi số lượng là 1 hay 2.
- `+ 1ch`: Thêm một khoảng đệm (padding) bằng độ rộng của 1 chữ số để con số không bị dính sát vào đường kẻ viền.
- **Kết quả**: Giao diện "biết thở", tự nở ra khi cần và cực kỳ tiết kiệm không gian khi số lượng ít.

## 2. Quản lý trạng thái Chỉnh sửa (In-place Editing)
- Khi bạn nhìn thấy con số, đó là một thẻ `input` ở chế độ `readOnly` (chỉ đọc).
- Khi bạn **Click** vào con số:
  1. `setEditingQuantity(id)`: Kích hoạt chế độ chỉnh sửa.
  2. Input biến thành kiểu `number`, bàn phím số (trên điện thoại) sẽ hiện lên.
- Khi bạn **Bấm ra ngoài** (`onBlur`) hoặc **Nhấn Enter**:
  - Hệ thống lấy con số bạn vừa nhập, so sánh xem có hợp lệ không (> 0).
  - Gửi lệnh `updateCartItemQuantity` lên Server.
  - Tắt chế độ chỉnh sửa.

## 3. Tối ưu hóa CSS (CartPage.css)
- **Hộp bao (qty-selector)**: Dùng `display: flex`. Điều này cực kỳ quan trọng vì nó giúp 3 phần tử (Nút trừ - Ô số - Nút cộng) luôn nằm thẳng hàng hoàn hảo.
- **Dấu cộng/trừ (`.qty-btn`)**: 
  - Kích thước `32x32px` được tính toán dựa trên "Kích thước ngón tay" tiêu chuẩn trong thiết kế UI.
  - `transition: all 0.2s`: Khi bạn di chuột vào, nút sẽ đổi màu nhẹ nhàng trong 0.2 giây chứ không đổi ngay lập tức, tạo cảm giác cao cấp.
- **Ẩn Spin Button**: Trình duyệt thường hiện 2 mũi tên lên/xuống rất nhỏ và xấu trong ô input number. Code CSS `appearance: none` đã xóa bỏ chúng để chúng ta có một giao diện sạch sẽ, đồng nhất giữa Chrome, Firefox và Safari.

## 4. Xử lý "Xóa thông minh"
- Nếu bạn nhấn nút `-` khi số lượng đang là `1`, code không gửi lệnh giảm xuống `0`. Thay vào đó, nó mở một `window.confirm`.
- Đây là một kỹ thuật UX bảo vệ: Tránh việc người dùng vô tình xóa mất sản phẩm chỉ vì lỡ tay bấm nút giảm quá nhiều lần.
