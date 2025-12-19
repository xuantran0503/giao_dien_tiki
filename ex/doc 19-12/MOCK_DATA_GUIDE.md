# Giải Thích Cơ Chế Hoạt Động: Mock Data & API Phân Trang

Tài liệu này giải thích chi tiết cách hệ thống xử lý dữ liệu sản phẩm trong dự án Tiki Clone khi đang ở chế độ phát triển (Development Mode).

---

## 1. Mock Data là gì?

**Mock Data** là dữ liệu giả lập được lưu trữ ngay trong mã nguồn thay vì tải về từ máy chủ (Server).

- **Nguồn dữ liệu:** File `src/data/topDealsData.js`.
- **Mục đích:** Giúp lập trình viên tiếp tục xây dựng giao diện (UI) và tính năng mà không phụ thuộc vào Backend, đồng thời tránh các lỗi mạng như 404 hoặc CORS khi chạy trên `localhost`.

---

## 2. Quy trình xử lý trong `listingSlice.ts`

Đây là nơi "bộ não" của hệ thống quyết định lấy dữ liệu từ đâu.

### Biến điều hướng `USE_MOCK_DATA`

Trong file này có một biến cờ (flag):

```typescript
const USE_MOCK_DATA = true;
```

- Nếu `true`: Hệ thống chạy hoàn toàn bằng dữ liệu mẫu.
- Nếu `false`: Hệ thống sẽ thử gọi API thật từ server Tiki.

### Hàm `fetchProductsByPage` (Action)

Hàm này sử dụng `createAsyncThunk` để xử lý bất đồng bộ:

1. **Kiểm tra cờ:** Nếu là chế độ Mock, nó sẽ kích hoạt lệnh `await new Promise(...)` để giả lập việc chờ đợi phản hồi từ mạng trong 0.6 giây.
2. **Trả về dữ liệu:** Sau đó, nó trả về nội dung của file `topDealsData`.
3. **Cơ chế dự phòng (Fallback):** Ngay cả khi bạn tắt Mock (`false`) nhưng API thật bị lỗi, khối `catch` sẽ tự động kích hoạt để trả về dữ liệu mẫu, đảm bảo ứng dụng không bao giờ bị "chết" màn hình.

---

## 3. Cách hiển thị và Phân trang trong `TopDeals.jsx`

Component này không quan tâm dữ liệu là thật hay giả, nó chỉ tập trung vào việc hiển thị những gì nhận được từ Redux Store.

### Lấy dữ liệu

```javascript
const { products, pageIndex } = useSelector((state) => state.listing);
```

### Logic Phân trang "Ảo" (Local Pagination)

Vì Mock Data trả về toàn bộ danh sách (ví dụ 24 sản phẩm), nhưng giao diện chỉ hiển thị 6 cái một lần, chúng ta áp dụng công thức tính toán vị trí cắt mảng:

1. **`startIndex`**: `(pageIndex - 1) * itemsPerPage`.
   - Trang 1: `(1-1)*6 = 0` (Bắt đầu từ phần tử đầu tiên).
   - Trang 2: `(2-1)*6 = 6` (Bắt đầu từ phần tử thứ 7).
2. **`deals`**: `products.slice(startIndex, startIndex + 6)`. Lấy ra đúng 6 phần tử để hiển thị trên một hàng.

### Điều khiển chuyển trang

Khi bạn nhấn nút mũi tên:

- Hệ thống gửi lệnh `setPageIndex(pageIndex + 1)` lên Redux.
- Redux cập nhật số trang mới.
- React thấy dữ liệu thay đổi, tự động tính toán lại `startIndex` và cắt lại mảng sản phẩm. Hiệu ứng slide sẽ tự động chạy theo.

---

## 4. Lợi ích của cơ chế này

1. **Không bị gián đoạn:** Bạn có thể code Offline hoặc code khi API bị lỗi mà vẫn nhìn thấy sản phẩm.
2. **Tốc độ:** Dữ liệu hiện ra rất nhanh, không mất nhiều thời gian tải từ server.
3. **Dễ kiểm soát:** Bạn có thể tự vào file `topDealsData.js` sửa tên, giá hoặc ảnh sản phẩm để xem giao diện phản ứng thế nào.
4. **Chuẩn hóa:** Khi có API thật, bạn chỉ cần đổi tên trường dữ liệu trong Slice là toàn bộ giao diện sẽ tự động hoạt động với dữ liệu thật mà không cần sửa code ở từng Component.
