# Áp Dụng "Lifecycle of Reactive Effects" vào Dự Án

Tài liệu này tóm tắt kiến thức từ [React Docs: Lifecycle of Reactive Effects](https://react.dev/learn/lifecycle-of-reactive-effects) và cách chúng ta đã áp dụng nó để sửa lỗi trong dự án Tiki Clone.

## 1. Tư Duy Cốt Lõi: Đồng Bộ Hóa (Synchronization)
Trước đây chúng ta thường nghĩ `useEffect` chạy khi component "sinh ra" (mount) hoặc "chết đi" (unmount).
Tư duy mới chính xác hơn là: **`useEffect` dùng để ĐỒNG BỘ HÓA hệ thống bên ngoài (API, Database, DOM) với reactive state hiện tại.**

*   **Bắt đầu đồng bộ (Start Synchronizing):** Hàm trong `useEffect`.
*   **Ngừng đồng bộ (Stop Synchronizing):** Hàm `return` (Cleanup function).

---

## 2. Áp Dụng Vào Danh Sách Sản Phẩm (Top Deals / Listing)

**Bài toán:** Hiển thị danh sách sản phẩm tương ứng với trang hiện tại (`pageIndex`).

*   **Reactive Value:** `pageIndex` (Biến thay đổi).
*   **Hành động:** Khi `pageIndex` thay đổi, ta cần "Bắt đầu đồng bộ" lại bằng cách gọi API lấy dữ liệu trang mới.

```javascript
// TopDeals.jsx
const { pageIndex } = useSelector(state => state.listing);

useEffect(() => {
  // 1. START SYNCHRONIZING
  // Gọi API để đồng bộ dữ liệu với pageIndex hiện tại
  dispatch(fetchProductsByPage({ pageIndex: pageIndex, pageSize: 18 }));

  // Với danh sách đơn giản, thường không cần cleanup phức tạp trừ khi muốn cancel request.
}, [pageIndex, dispatch]); // <--- Dependency: Chạy lại mỗi khi pageIndex thay đổi
```

---

## 3. Áp Dụng Vào Chi Tiết Sản Phẩm (Product Detail) - Quan trọng!

**Bài toán:** Hiển thị chi tiết sản phẩm theo `productId`.

*   **Vấn đề cũ:** Khi chuyển từ sản phẩm A sang B, hoặc tắt đi bật lại, dữ liệu cũ (A) vẫn còn trong Redux Store -> Gây hiển thị sai lệch hoặc lỗi "nháy" thông tin.
*   **Giải pháp:** Sử dụng **Cleanup Function** để "Ngừng đồng bộ" với sản phẩm cũ trước khi bắt đầu với sản phẩm mới.

```javascript
// ProductDetailPage.jsx
const { productId } = useParams();

useEffect(() => {
  // 1. START SYNCHRONIZING (Bắt đầu với ID mới)
  if (productId) {
    dispatch(fetchProductById(productId));
  }

  // 2. STOP SYNCHRONIZING (Dọn dẹp cái cũ)
  // React sẽ chạy hàm này TRƯỚC KHI effect chạy lại (khi ID đổi)
  // HOẶC khi component bị hủy (unmount).
  return () => {
    // Xóa sạch dữ liệu trong Store để tránh hiển thị rác
    dispatch(clearCurrentProduct());
  };

}, [productId, dispatch]); 
```

### Tại sao cần bước 2 (Cleanup)?
Nếu không có bước này:
1. Bạn đang xem Iphone (Redux đang lưu thông tin Iphone).
2. Bạn bấm sang Samsung.
3. Trong lúc chờ API Samsung tải về (1-2s), giao diện vẫn hiển thị thông tin Iphone cũ.
4. => Người dùng tưởng web bị lỗi hoặc mua nhầm hàng.

Với Cleanup:
1. Bạn bấm sang Samsung.
2. `cleanup` chạy -> Xóa thông tin Iphone -> Giao diện hiển thị "Đang tải...".
3. API Samsung về -> Hiển thị Samsung. -> **Trải nghiệm đúng đắn**.

---

## 4. Tổng Kết
*   Luôn khai báo đầy đủ các biến phụ thuộc (dependencies) trong `[]`.
*   Nếu Effect của bạn "đăng ký" cái gì đó (API, Event), hãy luôn "hủy đăng ký" (Cleanup) ở hàm return.
*   Với Redux Global State, Cleanup là bước sống còn để tránh xung đột dữ liệu giữa các trang.
