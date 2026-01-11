# Giải thích về Lỗi Xung đột Phân trang trong Redux

## 1. Vấn đề bạn gặp phải

Khi bạn bấm chuyển trang ở phần **Top Deals**, phần **Flash Sale** cũng bị nhảy trang theo (hoặc ngược lại).

## 2. Nguyên nhân (Xung đột Action)

Trong Redux, các Action được gửi đi (`dispatch`) theo cơ chế **Global**.

- Cả `listingSlice` (Top Deals) và `flashSaleSlice` (Flash Sale) đều định nghĩa một reducer tên là `setPageIndex`.
- Khi bạn gọi `export const { setPageIndex } = ...`, Redux Toolkit tạo ra một Action có kiểu (type) là `"listing/setPageIndex"` và `"flashSale/setPageIndex"`.
- **Tuy nhiên**, nếu bạn vô tình đặt tên Action giống hệt nhau hoặc sử dụng nhầm Action của Slice này cho Component kia, Redux sẽ thực thi nhầm logic.
- Quan trọng hơn: Nếu hai Slice khác nhau nhưng lại dùng chung một **Action Type** (do copy-paste hoặc định nghĩa trùng lặp), cả hai phần trạng thái (state) sẽ cùng thay đổi khi có 1 Action được phát đi.

## 3. Giải pháp (Tách biệt định danh)

Tôi đã thực hiện "định danh riêng" cho mỗi phần để chúng không bao giờ đụng hàng:

1. **Trong `listingSlice.ts` (Top Deals):**

   - Đổi tên `setPageIndex` thành `setListingPageIndex`.
   - Bây giờ Action này chỉ tác động đến `state.listing`.

2. **Trong `flashSaleSlice.ts` (Flash Sale):**

   - Đổi tên `setPageIndex` thành `setFlashSalePageIndex`.
   - Bây giờ Action này chỉ tác động đến `state.flashSale`.

3. **Trong các Component:**
   - `TopDeals.jsx`: Chỉ gọi `setListingPageIndex`.
   - `FlashSale.jsx`: Chỉ gọi `setFlashSalePageIndex`.

## 4. Tại sao làm vậy lại giải quyết được?

Bằng cách này, khi bạn bấm "Next" ở Top Deals, Redux chỉ gửi đi một tín hiệu duy nhất là "Cập nhật trang cho Listing". Khối Flash Sale vì không "đăng ký" lắng nghe tín hiệu này nên nó sẽ đứng yên, không bị ảnh hưởng.

---

_Ghi chú: Luôn đặt tên Action kèm theo tên chức năng (ví dụ: `setCartPageIndex`, `setOrderPageIndex`) để tránh các lỗi logic khó tìm sau này._
