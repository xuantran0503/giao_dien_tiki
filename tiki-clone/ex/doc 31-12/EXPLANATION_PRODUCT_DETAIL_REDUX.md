# Giải thích cơ chế Redux và hiện tượng dữ liệu trong Chi tiết sản phẩm

Tài liệu này giải thích các vấn đề bạn đang gặp phải liên quan đến `currentProduct` trong `listingSlice` và cách nó tương tác với Giao diện (UI).

---

### 1. Tại sao `currentProduct` trong Redux bằng `null` nhưng UI vẫn hiển thị dữ liệu?

Đây là hiện tượng thường gặp do cơ chế **Cleanup (Dọn dẹp)** của React.

- **Cơ chế:** Trong file `ProductDetailPage.jsx`, có một hàm `useEffect` với đoạn code cleanup ở cuối:
  ```javascript
  useEffect(() => {
    if (productId) {
      dispatch(fetchProductById(productId));
    }
    return () => {
      dispatch(clearCurrentProduct()); // <--- ĐÂY LÀ NGUYÊN NHÂN
    };
  }, [dispatch, productId]);
  ```
- **Giải thích:** Khi bạn chuyển từ sản phẩm A sang sản phẩm B, hoặc khi bạn thoát trang, hàm `clearCurrentProduct()` sẽ ngay lập tức biến `currentProduct` trong Redux thành `null`.
- **Tại sao UI vẫn hiện?**
  - **Khoảng trễ hiển thị:** Redux DevTools cập nhật trạng thái `null` ngay khi hành động `clear` được thực thi. Tuy nhiên, React có thể mất vài mili giây để render lại giao diện.
  - **Redux DevTools Snapshot:** Đôi khi bạn đang nhìn vào "Action cuối cùng" (Clear) trong DevTools nên thấy nó là `null`, nhưng thực tế UI có thể đã "chụp" được dữ liệu từ giây trước đó hoặc đang hiển thị dữ liệu từ mảng danh sách (`products`).

---

### 2. Tại sao khi F5 (Refresh) thì `currentProduct` lại có dữ liệu đúng?

- **Quy trình khép kín:** Khi bạn F5, toàn bộ ứng dụng được tải lại từ đầu.
  1.  `currentProduct` bắt đầu từ trạng thái mặc định là `null`.
  2.  `useEffect` chạy lần đầu tiên, nhận được `productId` từ URL.
  3.  Lệnh `dispatch(fetchProductById(productId))` được gửi đi.
  4.  API trả về dữ liệu -> Redux cập nhật dữ liệu này vào `currentProduct`.
- **Kết luận:** F5 là một quy trình "sạch", không bị ảnh hưởng bởi các hành động chuyển tiếp trang hay dữ liệu cũ còn sót lại từ sản phẩm trước, nên nó luôn hiển thị đúng.

---

### 3. Tại sao `currentProduct` không khớp với UI nhưng vẫn "Thêm vào giỏ hàng" thành công?

Đây là phần thú vị nhất và có 2 lý do chính:

#### A. Do cơ chế Sync tab (Đồng bộ giữa các tab)

Trong dự án của bạn có file `syncTabs.ts` và sử dụng `redux-persist`.

- **Tình huống:** Bạn mở 2 tab. Tab 1 xem "iPhone", Tab 2 xem "Samsung".
- **Hiện tượng:** Tab 2 tải xong "Samsung", nó lưu vào `localStorage`. Tab 1 lắng nghe thấy sự thay đổi và tự cập nhật Redux của nó thành "Samsung".
- **Kết quả:** Lúc này, Tab 1 hiển thị UI là "iPhone" (vì React chưa render lại kịp hoặc dữ liệu render cũ đang được giữ trong biến cục bộ) nhưng Redux bên trong lại là "Samsung".

#### B. Tại sao "Thêm vào giỏ hàng" vẫn thành công (và đúng sản phẩm trên UI)?

Trong `ProductDetailPage.jsx`, biến `product` được tính toán như sau:

```javascript
const product = currentProduct ? { ...currentProduct, ... } : null;
```

Và hàm thêm giỏ hàng sử dụng biến `product` này:

```javascript
const handleAddToCart = () => {
  dispatch(addToCart({ id: product.id, name: product.name, ... }));
}
```

- **Tính đóng gói (Closure):** Khi React render một "frame", nó giữ giá trị của biến `product` cho frame đó. Ngay cả khi Redux Store bên dưới đã thay đổi thành "Samsung", nhưng nếu cái click của bạn rơi vào frame render cũ của "iPhone", hàm `handleAddToCart` vẫn đang "nhớ" thông tin của "iPhone" và gửi đúng dữ liệu đó vào giỏ hàng.
- **Tính độc lập:** Giỏ hàng (`cartSlice`) và Chi tiết sản phẩm (`listingSlice`) là 2 ngăn kéo riêng biệt. Việc ngăn kéo Chi tiết bị sai/null không ảnh hưởng đến việc ngăn kéo Giỏ hàng ghi nhận một hành động thêm mới thành công.

---

### Tổng kết

- **`null` khi chuyển trang:** Là do hàm `clearCurrentProduct` để tránh "rác" dữ liệu.
- **Refresh có dữ liệu:** Là quy trình tải mới hoàn toàn từ API.
- **Không khớp nhưng vẫn thêm được:** Là do sự chênh lệch thời gian giữa trạng thái Redux (Global) và biến cục bộ trong Component (Local) tại thời điểm bạn click chuột.
