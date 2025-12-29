# Phân tích trạng thái `currentProduct` trong Redux

Tài liệu này giải thích chi tiết về vòng đời của biến `currentProduct` trong ứng dụng của bạn, lý do nó thay đổi từ `null` sang có dữ liệu và ngược lại, cũng như nguyên nhân gây ra hiện tượng mất dữ liệu đột ngột khi mở nhiều tab.

---

## 1. Khi nào `currentProduct` chuyển từ `null` sang có dữ liệu?

**Thời điểm:** Ngay khi bạn truy cập vào trang Chi tiết sản phẩm (`ProductDetailPage`).

**Cơ chế hoạt động:**

- Trong `ProductDetailPage.jsx`, hàm `useEffect` lắng nghe sự thay đổi của biến `productId` từ URL.
- Khi `productId` xuất hiện hoặc thay đổi, nó sẽ kích hoạt 2 hành động (actions):
  1. `fetchProductById(productId)`: Gửi yêu cầu lấy dữ liệu sản phẩm từ danh sách thường.
  2. `fetchFlashSaleProductById(productId)`: Gửi yêu cầu lấy dữ liệu từ danh sách Flash Sale.
- Khi một trong hai (hoặc cả hai) API trả về kết quả thành công, Redux Reducer sẽ cập nhật trạng thái `currentProduct` từ `null` thành đối tượng chứa dữ liệu sản phẩm.

---

## 2. Khi nào `currentProduct` chuyển từ có dữ liệu sang `null`?

Có 2 trường hợp chính được thiết lập trong mã nguồn của bạn:

### A. Tự động xóa khi rời khỏi trang (Cleanup Function)

Tại dòng 48 trong `ProductDetailPage.jsx`, có một hàm dọn dẹp (cleanup) bên trong `useEffect`:

```javascript
useEffect(() => {
  // ... (logic fetch dữ liệu)
  return () => {
    dispatch(clearCurrentProduct()); // Lệnh xóa data
  };
}, [dispatch, productId]);
```

- **Tại sao cần xóa?** Để đảm bảo khi người dùng quay lại hoặc xem sản phẩm khác, họ không nhìn thấy dữ liệu của sản phẩm cũ trong tích tắc trước khi sản phẩm mới tải xong.

### B. Khi chuyển đổi giữa các sản phẩm

Nếu bạn đang ở trang sản phẩm A và click vào một sản phẩm B (ví dụ trong phần "Sản phẩm tương tự"):

- React sẽ "unmount" (hủy) hiệu ứng của sản phẩm A.
- Hàm cleanup sẽ chạy và thực hiện `clearCurrentProduct()` -> sản phẩm A bị xóa (`null`).
- Sau đó hiệu ứng mới cho sản phẩm B mới bắt đầu chạy để tải dữ liệu B.

---

## 3. Tại sao `currentProduct` bị mất (`null`) khi thực hiện thao tác khác?

Đây là phần trả lời cho hiện tượng bạn quan sát được (ví dụ: đang xem sản phẩm này nhưng dữ liệu lại biến mất khi bạn thao tác thêm vào giỏ hàng hoặc mở nhiều tab).

### Nguyên nhân 1: Đồng bộ hóa giữa các tab (Cross-tab Sync)

Dự án của bạn có sử dụng cơ chế đồng bộ trạng thái giữa các tab (`setupCrossTabSync` trong `syncTabs.ts`).

- **Hiện tượng:** Khi bạn thực hiện hành động (như thêm vào giỏ hàng) ở Tab A, `localStorage` sẽ thay đổi.
- **Vấn đề:** Tab B (trang chi tiết sản phẩm) sẽ nhận tín hiệu và tự động cập nhật lại toàn bộ Redux Store từ `localStorage`.
- **Hậu quả:** Trong `store.ts`, bạn chỉ cấu hình "whitelist" lưu `cart`, `address`, `checkout`. Các phần khác như `listing` (nơi lưu `currentProduct`) **KHÔNG được lưu**. Khi Tab B đồng bộ, nó có thể ghi đè trạng thái hiện tại bằng trạng thái mặc định (trạng thái ban đầu là `null`), dẫn đến việc bạn thấy sản phẩm bị mất.

### Nguyên nhân 2: "Race Condition" giữa 2 nguồn dữ liệu

Bạn đang lấy dữ liệu từ 2 nguồn: `listingProduct` và `flashSaleProduct`.

- Logic gộp trạng thái: `let product = listingProduct || flashSaleProduct;`
- Nếu vì lý do nào đó (ví dụ: mạng chậm hoặc logic reset), một trong hai nguồn này bị xóa hoặc về trạng thái `pending` đột ngột, nó có thể làm Component render lại với giá trị biến mất nếu logic kiểm tra không chặt chẽ.

### Nguyên nhân 3: Tác động của hàm `addToCart`

Thao tác thêm vào giỏ hàng (`dispatch(addToCart(...))`) làm thay đổi `cartSlice`. Vì Redux là một kho dữ liệu chung, bất kỳ sự thay đổi nào ở một Slice cũng có thể khiến các Component đang kết nối với Store (bằng `useSelector`) thực hiện Re-render. Nếu trong quá trình Re-render đó, logic `useEffect` bị kích hoạt lại sai thời điểm, dữ liệu có thể bị xóa tạm thời.

---

## 4. Gợi ý khắc phục

1. **Kiểm tra đồng bộ Tab:** Thử tạm thời tắt lệnh `setupCrossTabSync(store);` trong `store.ts` để xác nhận xem đây có phải là thủ phạm chính không.
2. **Quản lý Cleanup:** Trong `ProductDetailPage.jsx`, bạn có thể thêm điều kiện vào hàm cleanup hoặc sử dụng một biến ref để kiểm tra xem Component có thực sự bị hủy hay không trước khi xóa dữ liệu.
3. **Persist logic:** Nếu muốn sản phẩm hiện tại không bị mất khi đồng bộ tab, bạn có thể cân nhắc đưa `listing` vào `whitelist` của `redux-persist` (tuy nhiên cách này có thể làm tốn bộ nhớ `localStorage`).

---

_Tài liệu phân tích hệ thống Tiki-Clone._
