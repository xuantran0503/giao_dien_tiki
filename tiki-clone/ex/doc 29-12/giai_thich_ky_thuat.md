# Hướng dẫn Kỹ thuật - React, Redux & Storage

Tài liệu này giải thích các khái niệm quan trọng về quản lý dữ liệu trong ứng dụng React của bạn.

---

## 1. Phân biệt Local State, Redux Store và LocalStorage

Đây là ba nơi phổ biến để lưu trữ dữ liệu, nhưng chúng có mục đích và hành vi hoàn toàn khác nhau:

| Đặc điểm | Local State (`useState`) | Redux Store (Global State) | LocalStorage (Browser Storage) |
| :--- | :--- | :--- | :--- |
| **Phạm vi** | Chỉ trong **một component**. | Toàn bộ **ứng dụng**. | Toàn bộ **trình duyệt** (cùng domain). |
| **Lưu trữ** | RAM (Bộ nhớ tạm). | RAM (Bộ nhớ tạm). | Ổ cứng/SSD (Bộ nhớ bền vững). |
| **Khi F5 (Refresh)** | **Mất sạch**. | **Mất sạch** (trừ khi dùng Redux Persist). | **Vẫn còn nguyên**. |
| **Chia sẻ tab** | Không thể. | Không thể (mỗi tab là một instance Redux riêng). | **Có thể** (Tab A sửa, Tab B thấy ngay). |
| **Tốc độ** | Cực nhanh. | Nhanh. | Chậm hơn (do phải truy cập ổ đĩa). |

### Chi tiết về "Local Store"
Thông thường, khi nói "Local Store", người ta thường ám chỉ **LocalStorage**. 
- Trong dự án của bạn, bạn đang dùng **Redux Persist** để "đẩy" dữ liệu từ **Redux Store** xuống **LocalStorage** (để khi F5 không bị mất giỏ hàng).
- Đó là lý do tại sao khi bạn mở Tab A và Tab B, giỏ hàng thì giống nhau (vì đọc từ LocalStorage), nhưng thông tin sản phẩm (`currentProduct`) thì khác nhau (vì nó chỉ nằm trên RAM của từng Tab).

---

## 2. Tại sao `currentProduct` bị lỗi "Null nhưng vẫn hiển thị"?

### Nguyên nhân: Sự xung đột giữa Local State và Redux Store
Trong file `ProductDetailPage.jsx`, bạn đang làm như sau:
1. Lấy dữ liệu từ Redux (`listingProduct`).
2. Copy nó vào Local State (`product`) thông qua `useEffect`.

**Vấn đề xảy ra khi:**
- Bạn chuyển sang một sản phẩm khác. Redux được lệnh xóa dữ liệu cũ (`currentProduct = null`).
- Nhưng trong `useEffect` của bạn có dòng `if (listingProduct)`. Khi `listingProduct` là `null`, điều kiện này **SAI**, dẫn đến Local State `product` **không được cập nhật**.
- Hệ quả: Giao diện vẫn "khư khư" giữ dữ liệu cũ của sản phẩm trước đó trong khi Redux đã trống rỗng.

---

## 3. Cách sửa lỗi triệt để

Để dữ liệu luôn đồng nhất, bạn cần thực hiện **Cleanup** (Dọn dẹp) khi người dùng rời khỏi trang chi tiết:

```javascript
// Trong ProductDetailPage.jsx
useEffect(() => {
  if (productId) {
    dispatch(fetchProductById(productId));
  }
  
  // Hàm này sẽ chạy khi Component bị xóa khỏi màn hình (Unmount)
  return () => {
    dispatch(clearCurrentProduct()); // Đưa Redux về null
    setProduct(null);                // Đưa Local State về null
  };
}, [dispatch, productId]);
```

---

## 4. Tìm hiểu về `useEffect` và Vòng đời

`useEffect` hoạt động theo quy trình:
1. **Render**: Vẽ giao diện dựa trên State hiện tại.
2. **Cleanup (nếu có)**: Chạy hàm `return` của lần Effect trước đó.
3. **Run Effect**: Chạy logic bên trong hàm `useEffect` của lần này.

**Tại sao cần Cleanup?**
Giống như việc bạn mượn sách thư viện, đọc xong bạn phải trả. Cleanup giúp:
- Xóa các bộ đếm thời gian (`setTimeout`, `setInterval`).
- Hủy các đăng ký sự kiện (Event Listener).
- **Reset dữ liệu cũ** để trang sau không bị dính dữ liệu của trang trước.
