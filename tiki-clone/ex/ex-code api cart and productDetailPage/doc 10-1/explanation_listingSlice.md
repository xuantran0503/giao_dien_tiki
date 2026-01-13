# Hướng dẫn Chuyên sâu: listingSlice.ts

File này không chỉ đơn thuần là lấy dữ liệu, mà còn chứa các thuật toán tính toán giá cả để đảm bảo khách hàng luôn thấy mức giá rẻ nhất hoặc đúng nhất.

## 1. Thuật toán tính giá (Hàm ProductPrices - Dòng 105)
Đây là phần logic "xương sống" để hiển thị giá sản phẩm:
- **Nguyên lý**: Một sản phẩm có thể có nhiều mức giá (MinPrice, MaxPrice) và nhiều mức khuyến mãi.
- **Dòng 108-114**: Code tìm kiếm mức giá khuyến mãi thấp nhất (`MinPromotionPrice`). Nếu không có, nó lấy mức giá gốc thấp nhất.
- **Dòng 118-120**: "Cầu chì bảo vệ" - Đảm bảo giá gốc (`originalPrice`) không bao giờ thấp hơn giá đang bán. Nếu Server trả về dữ liệu lỗi, code sẽ tự cân bằng lại.
- **Dòng 125-133**: Tính % giảm giá. Chúng ta dùng `Math.round` để làm tròn con số, giúp hiển thị đẹp hơn (ví dụ: -25% thay vì -24.89%).

## 2. Xử lý Ảnh linh hoạt (Dòng 151)
```typescript
image: item.Image.startsWith("http") ? item.Image : `${API_BASE}${item.Image}`
```
- **Tại sao?**: Trong cơ sở dữ liệu, đôi khi ảnh được lưu đầy đủ link, đôi khi chỉ là đường dẫn thư mục. 
- **Giải pháp**: Nếu thấy từ `http`, ứng dụng hiểu là link ngoài. Nếu không, nó tự ghép thêm tên miền máy chủ vào đầu. Điều này giúp loại bỏ hoàn toàn lỗi "ảnh chết" (404 Not Found).

## 3. Quản lý Bộ nhớ (clearCurrentProduct - Dòng 175)
Đây là kỹ thuật tối ưu UX (Trải nghiệm người dùng):
- Khi bạn xem TV Samsung, sau đó quay ra xem TV Sony. Nếu không có hàm này, trong khoảng 0.5 giây đầu tiên khi trang Sony đang tải, bạn sẽ vẫn thấy tên Samsung.
- `state.currentProduct = null`: Xóa sạch bộ nhớ đêm ngay khi người dùng thoát trang, giúp giao diện luôn sạch sẽ khi tải sản phẩm mới.

## 4. Tác vụ lấy danh sách (fetchProductsByPage)
- File này hỗ trợ phân trang (`PageIndex`, `PageSize`). Khi bạn kéo xuống cuối trang hoặc chuyển trang, code sẽ gửi yêu cầu lấy 18 sản phẩm tiếp theo.
- Toàn bộ dữ liệu này được lưu vào mảng `products`, giúp trang chủ có thể hiển thị hàng trăm sản phẩm mà không bị chậm.
