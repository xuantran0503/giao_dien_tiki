# Phân Tích & Giải Thích Vấn Đề: Nút Chuyển Trang Bị "Dính Chùm"

## 1. Nguyên nhân hiện tượng (Tại sao?)
Khi bạn bấm nút chuyển trang ở **Top Deals** mà **Flash Sale** cũng bị chuyển theo (hoặc ngược lại), nguyên nhân là do:
**Cả hai component cùng sử dụng chung một biến trạng thái (state) từ Redux Store.**

Cụ thể:
- Trong **Redux Store**, bạn có một slice (ví dụ `listingSlice`) chứa biến `pageIndex` dùng để theo dõi trang hiện tại.
- Cả `TopDeals` và `FlashSale` đều:
  1. Lấy biến `pageIndex` này về: `const { pageIndex } = useSelector(...)`
  2. Khi bấm Next/Prev, cả hai đều gửi lệnh (dispatch) để thay đổi biến `pageIndex` này.
  
👉 **Hệ quả**: Vì `pageIndex` là biến toàn cục (global), nên khi nó thay đổi từ 1 -> 2, **tất cả** các component đang lắng nghe nó đều sẽ cập nhật và hiển thị trang 2.

---

## 2. Giải pháp khắc phục (Làm như thế nào?)
Để tách biệt chúng, mỗi danh sách sản phẩm phải có một bộ đếm trang **riêng biệt**, không liên quan đến nhau.

Có 2 cách phổ biến:

### Cách 1: Sử dụng Local State (Khuyên dùng cho UI đơn giản)
Thay vì lưu `pageIndex` trên Redux (thùng chứa chung), hãy lưu nó ngay bên trong chính component đó bằng `useState`.
- **TopDeals** sẽ có `useState` của riêng nó.
- **FlashSale** sẽ có `useState` của riêng nó.
- Khi thay đổi `pageIndex` của TopDeals, biến của FlashSale không hề bị ảnh hưởng.

**Ví dụ Code (FlashSale.jsx hiện tại):**
```javascript
// Sử dụng state nội bộ, chỉ tồn tại trong component này
const [currentPage, setCurrentPage] = useState(0);

const handleNext = () => {
  // Chỉ thay đổi currentPage nội bộ
  setCurrentPage(prev => prev + 1); 
};
```
✅ **Ưu điểm**: Đơn giản, dễ hiểu, các component độc lập hoàn toàn.

### Cách 2: Tách biệt Redux Slice
Nếu bắt buộc phải dùng Redux, bạn phải tạo ra 2 biến trong store:
- `topDealsPageIndex`
- `flashSalePageIndex`
Hoặc tạo 2 slice riêng biệt: `topDealsSlice` và `flashSaleSlice`.

---

## 3. Tổng kết
Hiện tại, tôi đã sửa **Flash Sale** chuyển sang dùng **Cách 1 (Local State)**. 
- Top Deals vẫn đang dùng Redux (`state.listing.pageIndex`).
- Flash Sale dùng `useState` (`currentPage`).

👉 Do đó, hai bên đã **hoàn toàn tách biệt** và sẽ không còn hiện tượng chuyển trang dính theo nhau nữa.
