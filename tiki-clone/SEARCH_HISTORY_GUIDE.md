# Hướng dẫn Test Lịch Sử Tìm Kiếm

## Cách 1: Tìm kiếm thủ công
1. Mở ứng dụng tại http://localhost:3000
2. Click vào thanh tìm kiếm
3. Nhập từ khóa bất kỳ (ví dụ: "iphone 15")
4. Nhấn nút "Tìm kiếm" hoặc Enter
5. Click lại vào thanh tìm kiếm để xem lịch sử

## Cách 2: Thêm dữ liệu mẫu qua Console
1. Mở ứng dụng tại http://localhost:3000
2. Nhấn F12 để mở Developer Tools
3. Chuyển sang tab "Console"
4. Copy và paste đoạn code sau vào Console:

```javascript
const sampleSearchHistory = [
  "combo 3 bịch cà phê nescafe",
  "iphone 17 promax",
  "Apple Flagship Store",
  "áo khoác len dài",
  "giày boot nữ"
];
localStorage.setItem("searchHistory", JSON.stringify(sampleSearchHistory));
window.location.reload();
```

5. Nhấn Enter
6. Trang sẽ tự động reload và hiển thị lịch sử tìm kiếm

## Tính năng đã triển khai:
✅ Lưu tối đa 5 lịch sử tìm kiếm gần nhất
✅ Hiển thị lịch sử khi focus vào thanh tìm kiếm
✅ Click vào lịch sử để tìm kiếm lại
✅ Lịch sử được lưu trong localStorage (không mất khi reload)
✅ Icon tìm kiếm từ Tiki CDN
✅ Icon trending và category từ Tiki CDN
✅ Layout gọn gàng, không cần scroll
✅ Hover effects mượt mà

## Xóa lịch sử tìm kiếm:
Chạy lệnh sau trong Console:
```javascript
localStorage.removeItem("searchHistory");
window.location.reload();
```
