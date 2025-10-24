// Script để thêm dữ liệu mẫu vào localStorage cho lịch sử tìm kiếm
// Chạy script này trong Console của browser (F12 -> Console)

const sampleSearchHistory = [
  "combo 3 bịch cà phê nescafe",
  "iphone 17 promax",
  "Apple Flagship Store"
];

localStorage.setItem("searchHistory", JSON.stringify(sampleSearchHistory));
console.log("✅ Đã thêm lịch sử tìm kiếm mẫu!");
console.log("Hãy reload trang để xem kết quả");

// Hoặc reload trang tự động
// window.location.reload();
