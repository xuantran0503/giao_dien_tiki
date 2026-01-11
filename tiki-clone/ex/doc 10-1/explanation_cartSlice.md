# Hướng dẫn Chuyên sâu: cartSlice.ts

File này là "bộ não" quản lý toàn bộ vòng đời của giỏ hàng, từ lúc người dùng thêm sản phẩm cho đến khi thanh toán.

## 1. Phân tích Các Biến Cấu hình (Dòng 5-8)
- `API_BASE`: Đây là "cửa ngõ" để kết nối với máy chủ. Mọi yêu cầu gửi đi đều bắt đầu bằng địa chỉ này.
- `A_ID`: Mã định danh ứng dụng. Server dùng mã này để biết đơn hàng/giỏ hàng này thuộc về nền tảng nào (ví dụ: Mobile App hay Website).
- `getCartId()`: Một hàm tiện ích giúp truy cập `localStorage`. Vì giỏ hàng cần được giữ lại kể cả khi bạn F5 trang, chúng ta lưu nó vào bộ nhớ trình duyệt thay vì chỉ lưu trong biến.

## 2. Bí mật đằng sau Regex bóc tách ID (Dòng 152-160)
Đây là phần logic nâng cao để giải quyết sự không nhất quán giữa các API:
```typescript
const match = item.Uri.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i);
```
- **Vấn đề**: API Giỏ hàng trả về `item.ProductId` là ID của "Biến thể dịch vụ" (ví dụ: vé cho trẻ em của một khu vui chơi). Nhưng trang chi tiết cần "ID của Sản phẩm tổng quát" (Listing ID).
- **Giải pháp**: Chúng ta soi vào trường `Uri` (ví dụ: `/product/afa45f79...`). Regex này tìm kiếm định dạng chuỗi UUID (8-4-4-4-12 ký tự).
- **Kết quả**: Biến `listingId` giờ đây chứa mã chuẩn xác để khi người dùng nhấn vào ảnh sản phẩm trong giỏ, họ luôn quay lại đúng trang gốc.

## 3. Quy trình Thêm sản phẩm (addItemToCart - Dòng 39)
Đây là một quy trình 3 bước (Quy trình nối đuôi):
1. **Gửi Payload**: Gửi mã dịch vụ (`ItemId`) và số lượng (`Count`) lên Server.
2. **Xử lý CartId**: 
   - Nếu là khách hàng mới, Server trả về một `CartId` mới. Chúng ta ngay lập tức lưu nó vào `localStorage`.
   - Các lần sau, chúng ta gửi kèm `CartId` này để Server biết cộng dồn vào giỏ hàng cũ.
3. **Đồng bộ hóa**: Ngay sau khi thêm thành công, code tự động gọi `dispatch(fetchCartDetail)` để lấy lại danh sách mới nhất. Điều này giúp tổng tiền hàng trên header nhảy số ngay lập tức.

## 4. Quản lý Trạng thái (ExtraReducers - Dòng 289)
Redux Toolkit tự động tạo ra 3 trạng thái cho mỗi API call:
- `pending`: Khi vừa bấm nút, ứng dụng chuyển sang trạng thái này. Bạn có thể dùng nó để hiện biểu tượng quay tròn (spinner).
- `fulfilled`: Server trả về dữ liệu thành công. Dòng `state.items = action.payload` sẽ đổ dữ liệu vào Store để giao diện vẽ lại.
- `rejected`: Khi mất mạng hoặc Server lỗi. `state.error` sẽ lưu thông báo lỗi để hiện lên màn hình cho người dùng biết.
