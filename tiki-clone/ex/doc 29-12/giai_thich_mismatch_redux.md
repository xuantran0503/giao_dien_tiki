# Giải Thích Hiện Tượng "Lệch Pha" Dữ Liệu (UI vs Redux)

Dựa trên ảnh chụp màn hình của bạn, đây là những gì đang thực sự xảy ra "dưới nắp máy":

---

## 1. Tại sao Giao diện (UI) và Redux lại khác nhau?

### Nguyên nhân 1: Nhầm lẫn giữa các Tab (Instance) - CỰC KỲ PHỔ BIẾN
Trong ảnh, tôi thấy bạn đang mở rất nhiều Tab Tiki. 
- Mỗi Tab trình duyệt là một **thế giới riêng** (Instance Redux riêng).
- Tuy nhiên, công cụ **Redux DevTools** đôi khi bị "kẹt" ở Tab cũ hoặc đang hiển thị dữ liệu của một Tab khác mà bạn vừa thao tác trước đó.
- **Cách kiểm tra**: Ở góc trên bên phải của Redux DevTools, hãy kiểm tra danh sách **Instances**. Đảm bảo bạn đang chọn đúng Instance ứng với Tab hiện tại (thường thì Instance sẽ có tên hoặc URL đi kèm).

### Nguyên nhân 2: Độ trễ của API và Race Condition
1. Bạn đang ở trang **Cốc có quai** (Dữ liệu Redux hiện có).
2. Bạn bấm sang trang **Tô Imari**.
3. Redux gửi lệnh lấy dữ liệu mới (`pending`).
4. **Nhưng**: Nếu API trả về chậm, hoặc vì một lý do nào đó (như Cache trình duyệt), Giao diện của bạn có thể đã lấy được dữ liệu từ một nguồn khác (hoặc lượt fetch cũ còn sót lại trong Local State) trong khi Redux chưa kịp cập nhật hoặc đang cập nhật dữ liệu của sản phẩm trước đó.

---

## 2. Tại sao bạn gọi UI là "Dữ liệu chuẩn"?

Trong trường hợp này, UI hiển thị đúng theo URL (`.../product/ac056...` là mã của Tô Imari). Điều này có nghĩa là:
- Hàm `fetchProductById` đã chạy.
- Nhưng có vẻ Redux DevTools đang hiển thị **kết quả của một Action cũ** (Action số 6 trong danh sách của bạn). 

**Hãy nhìn vào danh sách Action bên trái máy tính của bạn:**
- Action cuối cùng là `listing/fetchProductById/fulfilled`. 
- Nếu bạn click vào Action này, nó sẽ cho bạn thấy State **ngay tại thời điểm đó**. 
- Nếu Action đó là của sản phẩm "Cốc", thì dĩ nhiên nó hiện ra "Cốc". 

---

## 3. Cách để "Dữ liệu chuẩn" luôn nằm trong Redux

Để sửa lỗi này và đảm bảo Redux luôn đi đôi với UI, bạn cần thực hiện 2 việc (bạn đã bắt đầu làm):

1. **Cleanup triệt để**: Khi chuyển từ sản phẩm A sang B, phải xóa sạch dấu vết của A trong Redux ngay lập tức.
2. **Kiểm tra tính duy nhất (Identity)**: Trong hàm `fulfilled` của Redux, hãy đảm bảo rằng dữ liệu trả về có ID khớp với ID đang yêu cầu trên URL.

### Lời khuyên để Debug chính xác:
- **Mở tab Network**: Xem thực sự API đang trả về cái gì cho mã `ac056560...`. Nếu API trả về "Cốc" cho mã "Tô" thì lỗi nằm ở Backend (Server).
- **F5 lại trang**: Nếu sau khi F5 mà Redux và UI khớp nhau (cùng là Tô Imari), thì lỗi nằm ở quá trình chuyển trang (Navigation) và cập nhật State của React.

---

## 4. Giải thích về đoạn code Cleanup bạn vừa thêm

```javascript
return () => {
  dispatch(clearCurrentProduct()); // Lệnh này dọn dẹp Redux
  setProduct(null);                // Lệnh này dọn dẹp Giao diện (UI)
};
```
Đoạn code này cực kỳ quan trọng. Nó giúp cho khi bạn chuyển trang, "màn hình sẽ trắng" (hoặc hiện Loading) trong tích tắc trước khi hiện sản phẩm mới, thay vì hiện "râu ông nọ chắp cằm bà kia" như trong ảnh bạn gửi.
