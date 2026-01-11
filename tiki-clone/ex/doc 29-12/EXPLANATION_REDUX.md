# GIẢI THÍCH CHI TIẾT VỀ REDUX VÀ TRẠNG THÁI SẢN PHẨM (CURRENT PRODUCT)

Tài liệu này giải thích các hiện tượng "lạ" mà bạn quan sát được trong quá trình phát triển trang chi tiết sản phẩm với Redux.

---

## 1. Tại sao currentProduct lúc thì có dữ liệu, lúc thì lại `null`?

Hiện tượng này xảy ra do cơ chế của thư viện **`redux-persist`** mà bạn đang sử dụng.

### Nguyên nhân:

- Trong file `store.ts`, bạn cấu hình `persistConfig` với một danh sách **Whitelist** (những gì được lưu lại khi F5): `["cart", "address", "checkout"]`.
- Vì `listing` (nơi giữ `currentProduct`) **KHÔNG** nằm trong whitelist này, nên mỗi khi Redux thực hiện quá trình lưu trữ (thường xảy ra ngay sau khi bạn `dispatch` một action như thêm vào giỏ hàng), hệ thống sẽ khôi phục lại trạng thái mặc định cho các phần không nằm trong whitelist.
- **Kết quả:** `listing.currentProduct` bị reset về giá trị khởi tạo là `null`.

---

## 2. Tại sao Redux hiển thị `null` nhưng Giao diện vẫn hiện đúng dữ liệu?

Đây là kết quả của việc sử dụng **Local State (Bản sao tạm thời)** bên trong Component.

### Cơ chế hoạt động:

1.  Khi bạn vừa mở trang, API trả về dữ liệu -> Redux có dữ liệu -> `currentProduct` có giá trị.
2.  Trong code `ProductDetailPage.jsx`, chúng ta có đoạn:
    ```javascript
    useEffect(() => {
      if (listingProduct) {
        setProduct({ ...listingProduct }); // Chụp ảnh dữ liệu Redux bỏ vào Local State
      }
    }, [listingProduct]);
    ```
3.  **Local State (`product`)** bây giờ hoạt động như một "bức ảnh" (snapshot). Dù sau đó Redux gốc có bị xóa về `null` (do Rehydrate ở mục 1), thì biến `product` trong component vẫn giữ nguyên giá trị đã chụp.
4.  **Giao diện render dựa trên Local State**, nên nó vẫn hiển thị đúng thông tin sản phẩm.

---

## 3. Tại sao Redux hiển thị sai sản phẩm (nhưng giao diện vẫn đúng)?

Đây là vấn đề về **Multiple Tabs (Nhiều tab)** và cách công cụ **Redux DevTools** hoạt động.

### Giải thích:

- **Mỗi Tab là một vũ trụ riêng:** Mỗi tab trình duyệt chạy một bộ nhớ RAM riêng và một Store Redux riêng.
- **Sự lệch pha của DevTools:** Tiện ích Redux DevTools đôi khi bị "kẹt" ở tab cuối cùng bạn mở. Nếu bạn đang ở Tab A (Đĩa tròn) nhưng DevTools đang kết nối với Tab B (Đĩa vuông), bạn sẽ thấy dữ liệu Redux (Đĩa vuông) hoàn toàn không khớp với giao diện bạn đang nhìn (Đĩa tròn).
- **Dữ liệu không đồng bộ:** Vì sản phẩm không được đồng bộ giữa các tab (khác với Giỏ hàng), nên Tab A không hề biết Tab B vừa đổi sản phẩm. RAM của Tab A vẫn giữ "Đĩa tròn" một cách an toàn.

---

## 4. Tại sao dữ liệu sai/null mà vẫn thêm "ĐÚNG" vào giỏ hàng?

Chìa khóa nằm ở việc **hành động xảy ra tại đâu thì lấy dữ liệu tại đó**.

### Luồng xử lý:

1.  Khi bạn bấm "Thêm vào giỏ", hàm `handleAddToCart` được gọi.
2.  Hàm này lấy dữ liệu từ biến `product` (Local State - Thứ mà chúng ta đã xác nhận là luôn đúng ở mục 2).
3.  Nó đóng gói dữ liệu đó vào Action và gửi lên Redux.
4.  Lúc này, Store của tab hiện tại sẽ xử lý và cập nhật vào giỏ hàng. Dữ liệu giỏ hàng sau đó mới được đồng bộ sang các tab khác thông qua file `syncTabs.ts`.

---

## 💡 Tổng kết

- **Giao diện đúng** vì dùng Local State (Bản sao).
- **Thêm vào giỏ hàng đúng** vì lấy dữ liệu từ Local State.
- **Redux bị null** vì không được cấu hình lưu trữ (ghi đè bởi rehydrate).
- **Redux bị sai lệch** vì DevTools hiển thị instance của tab khác hoặc do bộ nhớ đệm của extension.

**Lời khuyên:** Khi debug với nhiều tab, hãy luôn kiểm tra ô chọn **Instance** ở phía trên cùng của Redux DevTools để đảm bảo bạn đang xem đúng dữ liệu của tab hiện tại.
