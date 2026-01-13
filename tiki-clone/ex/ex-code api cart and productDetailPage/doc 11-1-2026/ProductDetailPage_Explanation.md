# Giải Thích Chi Tiết File ProductDetailPage.jsx

Tài liệu này giải thích chi tiết ý nghĩa và cách vận hành của từng dòng code trong file `ProductDetailPage.jsx`.

---

## 1. Các Thư Viện và Component Được Import (Dòng 1 - 13)

- `useState, useEffect`: Hook của React để quản lý state và vòng đời component.
- `useParams`: Lấy các tham số từ URL (ví dụ: `productId`).
- `Link, useLocation`: Các công cụ điều hướng và truy cập thông tin URL hiện tại.
- `useDispatch, useSelector`: Kết nối với Redux Store để gửi action và lấy dữ liệu.
- `addItemToCart, fetchCartDetail`: Các action để quản lý giỏ hàng từ `cartSlice`.
- `fetchProductById, clearCurrentProduct`: Các action để lấy thông tin sản phẩm từ `listingSlice`.
- `Header, Footer, CheckoutForm`: Các component giao diện dùng chung.
- `PrevArrow, NextArrow`: Mũi tên điều hướng cho phần sản phẩm tương tự.
- `suggestedProductsData`: Dữ liệu mẫu cho các sản phẩm gợi ý.
- `calculateDiscountedPrice, formatPrice`: Các hàm tiện ích để tính toán và định dạng giá tiền.
- `ProductDetailPage.css`: File styling riêng cho trang này.

---

## 2. Khởi Tạo Component và Lấy Dữ Liệu Từ Redux (Dòng 15 - 38)

- **Dòng 16-18**: Sử dụng `useDispatch` để kích hoạt action và `useSelector` để lấy dữ liệu `listing` (thông tin sản phẩm đang xem).
- **Dòng 21-26**: Xác định trạng thái của API (`pending`, `succeeded`, `idle`) để hiển thị giao diện loading tương ứng.
- **Dòng 28**: Lấy `productId` từ thanh địa chỉ (URL).
- **Dòng 29-38**: Logic lấy thông tin sản phẩm từ giỏ hàng nếu người dùng mở tab mới hoặc từ `location.state`. Điều này giúp ứng dụng hoạt động mượt mà ngay cả khi API chưa kịp trả về dữ liệu.
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

---

## 3. Khởi Tạo State Local (Dòng 40 - 47)

- `quantity`: Số lượng sản phẩm người dùng chọn (mặc định là 1).
- `notification`: Quản lý thông báo hiện ra khi thêm vào giỏ hàng thành công/thất bại.
- `showCheckoutForm`: Biến boolean để ẩn/hiện form thanh toán khi nhấn "Mua ngay".
- `currentPage`: Quản lý trang hiện tại của phần "Sản phẩm tương tự".

---

## 4. Các Hiệu Ứng useEffect (Dòng 50 - 73)

- **Dòng 50-73**: Các logic chuẩn hóa dữ liệu `product` được đưa lên đầu để đảm bảo tính sẵn sàng trước khi các hàm `useEffect` chạy.
- **Dòng 76-92 (useEffect Lấy Dữ Liệu Tối Ưu)**: 
    - **Cơ chế thông minh**: Trang web sẽ kiểm tra nguồn gốc của truy cập. Nếu bạn đi từ **Giỏ hàng** (`location.state`), hệ thống sẽ **không gọi API Listing** vì ID từ giỏ hàng là Service ID, gọi sẽ bị lỗi 400.
    - **Kiểm tra trong kho**: Nếu không có state, nó sẽ kiểm tra xem sản phẩm đã có trong `cartItems` của Redux chưa. Nếu đã có đầy đủ thông tin, nó cũng sẽ bỏ qua việc gọi API để tiết kiệm tài nguyên và giữ Console sạch sẽ.
    - **Trải nghiệm**: Người dùng thấy dữ liệu ngay lập tức mà không thấy lỗi đỏ trong tab Network.
- **Dòng 95-99 (Cleanup)**: Khi người dùng rời khỏi trang, component sẽ dọn dẹp (xóa) sản phẩm hiện tại trong Redux. Điều này cực kỳ quan trọng để đảm bảo khi vào một sản phẩm khác, dữ liệu cũ không bị hiển thị nhầm.
- **Dòng 102-116 (Cơ chế tự sửa lỗi - ID Mapping)**: 
    - **Vấn đề:** Một sản phẩm có `productId` (ID gốc trong kho) và `id` (ID dùng để hiển thị/URL). Hai ID này đôi khi khác nhau tùy theo chiến dịch (Flash Sale, Top Deals).
    - **Cách vận hành:** Khi tải xong sản phẩm, code sẽ lưu cặp ID này vào `localStorage` (`product_mapping`).
    - **Mục đích:** Giúp ứng dụng luôn biết cách tìm ra `id` (để tạo link) dựa trên `productId` (để gọi API), đảm bảo người dùng không bao giờ gặp lỗi "404 Not Found" khi truy cập ngược từ giỏ hàng.

// Cơ chế tự sửa lỗi: Lưu mapping giữa Service ID và Listing ID
useEffect(() => {
  // BƯỚC 1: Kiểm tra điều kiện
  if (currentProduct && currentProduct.productId && currentProduct.id) {
     
     // BƯỚC 2: Lấy danh sách mapping cũ từ bộ nhớ trình duyệt (localStorage)
     const mappedIds = JSON.parse(localStorage.getItem('product_mapping') || '{}');
     
     // BƯỚC 3: So sánh và cập nhật
     if (mappedIds[currentProduct.productId] !== currentProduct.id) {
       // Nếu Service ID này chưa có Listing ID ổn định, hoặc ID đã thay đổi
       mappedIds[currentProduct.productId] = currentProduct.id;
       
       // BƯỚC 4: Lưu lại vào localStorage
       localStorage.setItem('product_mapping', JSON.stringify(mappedIds));
     }
  }
}, [currentProduct]); // Chạy lại mỗi khi thông tin sản phẩm thay đổi
2. Tại sao cần đoạn code này? (Ý nghĩa thực tế)
Trong dự án này, một sản phẩm thường có 2 loại ID dễ gây nhầm lẫn:

Service ID (productId): Là ID thật của sản phẩm trong kho dữ liệu (DB). Dùng để thực hiện các lệnh logic như "Thêm vào giỏ hàng", "Tính phí vận chuyển".
Listing ID (id): Là ID hiển thị trên thanh địa chỉ URL. Một sản phẩm (một cái điện thoại iPhone) có thể có nhiều Listing ID khác nhau tùy vào việc nó đang nằm trong "Flash Sale", "Top Deals" hay "Trang chủ".
Vấn đề: Khi người dùng click vào một sản phẩm từ Giỏ hàng hoặc một link cũ, hệ thống có thể chỉ có productId. Nếu không biết id tương ứng, hệ thống sẽ không biết đường dẫn URL chính xác để hiển thị trang chi tiết.
3. Cách nó vận hành (Từng bước)
Ghi nhớ: Mỗi khi bạn mở một trang chi tiết sản phẩm thành công (API trả về currentProduct), đoạn code này sẽ "nhìn" vào cả 2 ID của sản phẩm đó.
Đăng ký: Nó lưu vào localStorage một cuốn sổ tay (mapping) theo dạng: Service_ID : Listing_ID.
Ví dụ: {"PROD_001": "LIST_999"}
Tự sửa lỗi: Nếu lần sau hệ thống cần tìm Listing ID dựa trên Service ID, nó chỉ cần mở "cuốn sổ" product_mapping này ra tra cứu thay vì phải gọi API hỏi lại server.
Cập nhật: Nếu sản phẩm đó đổi Listing ID mới (ví dụ vào đợt Sale mới), dòng if (mappedIds[...] !== ...) sẽ phát hiện sự khác biệt và tự động cập nhật lại thông tin mới nhất.

---

## 5. Chuẩn Hóa Dữ Liệu Sản Phẩm (Dòng 75 - 99)

Đoạn code này tạo ra một đối tượng `product` thống nhất từ nhiều nguồn:
1. Thông tin từ API (`listingProduct`).
2. Nếu không có API, thử lấy từ giỏ hàng (`cartItem`).
3. Chuẩn hóa các trường dữ liệu như `name` (từ `name` hoặc `title`), `originalPrice`, `currentPrice`... để phần giao diện (JSX) bên dưới luôn dùng đúng tên trường.

---

## 6. Xử Lý Trạng Thái Giao Diện (Dòng 102 - 140)

- **Dòng 102-112**: Nếu đang tải API và chưa có dữ liệu dự phòng, hiển thị màn hình "Đang tải...".
- **Dòng 116-140**: Nếu sau khi tải xong mà vẫn không tìm thấy sản phẩm, hiển thị thông báo "Sản phẩm không có sẵn" và nút quay về trang chủ.

---

## 7. Các Hàm Xử Lý Sự Kiện (Dòng 148 - 212)

- `handleIncrease / handleDecrease`: Tăng/Giảm số lượng sản phẩm (không cho phép nhỏ hơn 1).
- `handleAddToCart`: Gửi action `addItemToCart` tới Redux. Nếu thành công, hiển thị thông báo "Success", nếu lỗi hiển thị thông báo lỗi.
- `handleBuyNow`: Mở form `CheckoutForm` để người dùng mua hàng trực tiếp mà không cần vào trang giỏ hàng.
- `handleCheckoutSubmit`: Xử lý khi người dùng hoàn tất đặt hàng trong form.
- `handleCheckoutCancel`: Đóng form thanh toán khi người dùng nhấn hủy.

---

## 8. Xử Lý Sản Phẩm Tương Tự & Phân Trang (Dòng 215 - 273)

- `handleAddSimilarProductToCart`: Cho phép thêm nhanh các sản phẩm gợi ý bên dưới vào giỏ hàng.
- **Logic Phân Trang**: Tính toán `indexOfLastItem`, `indexOfFirstItem` để cắt mảng dữ liệu mẫu `suggestedProductsData` và hiển thị đúng 6 sản phẩm mỗi trang.
- `handlePageChange / handlePrevPage / handleNextPage`: Điều khiển chuyển trang cho phần gợi ý.

---

## 9. Hàm Tiện Ích Giao Diện (Dòng 275 - 303)

- `renderStars(rating)`: Một hàm thông minh tự động tạo ra các ngôi sao (đầy, nửa, hoặc rỗng) dựa trên điểm đánh giá của sản phẩm (ví dụ: 4.5 sao).

---

## 10. Phần Giao Diện JSX (Dòng 305 - 614)

Đây là nơi cấu trúc HTML/React được xây dựng:
- **Breadcrumb**: Đường dẫn điều hướng (Trang chủ > Tên sản phẩm).
- **Trái - Hình ảnh**: Hiển thị ảnh chính và danh sách ảnh phụ.
- **Phải - Thông tin**:
    - Tên sản phẩm, đánh giá, số lượng đã bán.
    - Giá tiền và phần trăm giảm giá (sử dụng `formatPrice` để hiển thị 1.000.000₫).
    - Thông tin vận chuyển.
    - Bộ chọn số lượng (+/-).
    - Giá tạm tính (Giá x Số lượng).
    - Cụm nút hành động (Mua ngay, Thêm vào giỏ).
- **Mô tả sản phẩm**: Sử dụng `dangerouslySetInnerHTML` để hiển thị mô tả định dạng HTML từ API.
- **Sản phẩm tương tự**: Grid hiển thị các thẻ sản phẩm kèm nút thêm nhanh vào giỏ.
- **Notification**: Thông báo "Toast" nhỏ hiện lên góc màn hình.
- **CheckoutForm**: Overlay hiện lên che màn hình khi người dùng chọn "Mua ngay".

---

## 11. Các Điểm Kỹ Thuật Quan Trọng

1. **Redux Integration**: Dùng Redux để đồng bộ giỏ hàng và dữ liệu sản phẩm trên toàn ứng dụng.
2. **Data Resilience**: Code có khả năng lấy dữ liệu từ 2 nguồn (API hoặc Giỏ hàng) để tránh lỗi trắng trang.
3. **URL Sync**: Luôn đồng bộ hóa giao diện với `productId` trên URL.
4. **Performance**: Chỉ hiển thị loading khi thực sự cần thiết, dọn dẹp bộ nhớ khi rời trang để app chạy nhanh hơn.
