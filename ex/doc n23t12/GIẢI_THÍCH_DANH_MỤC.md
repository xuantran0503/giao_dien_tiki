# Hướng dẫn chi tiết: Tính năng Danh mục sản phẩm (API Integration)

Tài liệu này giải thích chi tiết các thay đổi và cấu trúc mới được triển khai để kết nối hệ thống với API danh mục.

---

## 1. Quản lý trạng thái (Redux Store)

### File: `src/store/categorySlice.ts`
Đây là "trái tim" của tính năng danh mục, xử lý việc gọi API và lưu trữ dữ liệu tập trung.

*   **`fetchAllCategories`**: 
    *   Gọi API `GET /classification/get-all`.
    *   **Xử lý dữ liệu**: Chuyển đổi dữ liệu từ API (`DisplayName`, `Id`, `Image`) sang định dạng chuẩn của ứng dụng.
    *   **Xử lý hình ảnh**: Tự động kiểm tra nếu đường dẫn ảnh là tương đối (ví dụ: `/share/download/...`), hệ thống sẽ tự chèn thêm tiền tố `http://192.168.2.112:9092` để ảnh hiển thị được.
*   **`fetchChildCategories`**: 
    *   Gọi API `GET /classification/{id}/get-children`.
    *   Dữ liệu được lưu vào một Object `childCategories` theo dạng: `{ parentId: [danh_sách_con] }`. Điều này giúp cache dữ liệu, nếu lần sau quay lại cùng một danh mục sẽ không cần gọi API nữa.
*   **`initialState`**: Quản lý trạng thái `status` (idle, pending, succeeded, failed) để hiển thị thông báo "Đang tải..." trên giao diện.

---

## 2. Giao diện Sidebar (Thanh danh mục bên trái)

### File: `src/components/Banner/Banner.jsx`
Trước đây danh mục ở đây bị fix cứng (coded), tôi đã chuyển nó sang dữ liệu động:

*   **Tự động tải**: Khi trang chủ load, `Banner` sẽ kiểm tra nếu kho dữ liệu Redux chưa có danh mục, nó sẽ tự động kích hoạt `fetchAllCategories`.
*   **Hiển thị động**: Danh sách được `map` trực tiếp từ API. Nếu API chỉ trả về 4 mục, Sidebar sẽ chỉ hiện đúng 4 mục.
*   **Xử lý ảnh lỗi**: Sử dụng thuộc tính `onError` để hiển thị một hình ảnh mặc định nếu link ảnh từ API bị hỏng.

---

## 3. Giao diện Mini Icons (Danh mục trung tâm)

### File: `src/components/MiniCategories/MiniCategories.jsx`
Phần này kết hợp giữa dữ liệu cũ và dữ liệu mới:

*   **Kết hợp dữ liệu**: Giữ lại 10 mục khuyến mãi gốc (Tiki VIP, Sáng nay rẻ...) và nối tiếp bằng danh sách danh mục lấy từ API.
*   **Tối ưu hóa Network**: Tôi đã gỡ bỏ lệnh gọi API trùng lặp ở đây. Dữ liệu sẽ được "hưởng sái" từ `Banner` đã gọi trước đó qua Redux, giúp tab Network của trình duyệt chỉ hiện 1 request duy nhất.

### File: `src/components/MiniCategories/MiniCategories.css`
*   **Chống vỡ giao diện**: Khi danh mục từ API có tên quá dài (ví dụ: "Thiết bị điện gia dụng nhà bếp thông minh"), CSS mới sẽ tự động ngắt dòng và dùng dấu ba chấm (`...`) sau 2 dòng để đảm bảo các icon luôn đều nhau.
*   **Cuộn ngang**: Nếu có quá nhiều danh mục, người dùng có thể kéo ngang trên điện thoại hoặc máy tính.

---

## 4. Trang chi tiết danh mục (Category Page)

### File: `src/pages/CategoryPage.jsx`
Trang này được kích hoạt khi người dùng nhấn vào bất kỳ danh mục nào.

*   **Breadcrumbs**: Hiển thị đường dẫn "Trang chủ > Tên danh mục".
*   **Tải danh mục con**: Khi vào trang, hệ thống dựa vào `categoryId` trên URL để gọi API lấy toàn bộ danh mục cấp dưới và hiển thị dưới dạng lưới (Grid).

---

## 5. Cấu hình Route

### File: `src/App.tsx`
*   Thay đổi Route từ `/category/:categoryName` sang `/category/:categoryId`.
*   Việc sử dụng `id` thay vì `name` trên URL giúp ứng dụng gọi API chính xác tuyệt đối theo định danh của hệ thống Backend.

---

## Tóm tắt quy trình hoạt động:
1. Người dùng vào trang chủ -> `Banner` gọi API lấy 4 danh mục chính.
2. Dữ liệu đổ vào Redux Store.
3. Sidebar (trái) và Mini Icons (giữa) cùng lấy dữ liệu từ Store để hiển thị.
4. Người dùng nhấn vào 1 danh mục -> Chuyển sang `CategoryPage`.
5. `CategoryPage` gọi API lấy danh mục con tương ứng với ID đó.
