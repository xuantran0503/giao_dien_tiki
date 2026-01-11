# 🔍 DEBUG LỖI HIỂN THỊ ẢNH - HƯỚNG DẪN CHI TIẾT

## 🎯 TÌNH HUỐNG HIỆN TẠI

Từ screenshot, mình thấy:

- ✅ URL request **ĐÚNG**: `http://192.168.2.112:9092/share/download_17d3096196.jpg`
- ❌ Response: **404 Not Found**
- ❌ Server: **Microsoft-IIS/10.0**

**Kết luận:**

- Code frontend **ĐÚNG** (đã ghép URL đúng)
- Vấn đề nằm ở **BACKEND** (file không tồn tại hoặc path sai)

---

## 🔍 CÁC NGUYÊN NHÂN CÓ THỂ

### **1. API trả về path sai**

API có thể trả về:

```json
{
  "Image": "/share/download_17d3096196.jpg"
}
```

Nhưng file thực tế nằm ở:

```
/cache/images/17d3096196.jpg
```

### **2. File không tồn tại trên server**

Backend chưa upload ảnh hoặc ảnh đã bị xóa.

### **3. Backend chưa config static file serving**

IIS chưa được config để serve static files từ thư mục `/share/`.

### **4. CORS hoặc permission issues**

Backend chặn request từ frontend.

---

## 🛠️ CÁCH DEBUG

### **Bước 1: Kiểm tra API Response**

Mình đã thêm console.log vào code. Bây giờ:

1. **Mở browser**
2. **Refresh trang** (Ctrl + F5)
3. **Mở DevTools → Console**
4. **Xem các log:**

```javascript
📦 Full API Response: { ... }
📦 Data.Result: [ ... ]
📦 First Product: { ... }
📦 First Product Image: "/share/download_17d3096196.jpg"  ← Kiểm tra path này
📦 First Product Images: [ ... ]
✨ Transformed First Product: { ... }
✨ Transformed Image URL: "http://192.168.2.112:9092/share/download_17d3096196.jpg"
```

### **Bước 2: Kiểm tra cấu trúc API response**

Trong Console, expand `📦 First Product` và kiểm tra:

```javascript
{
  Id: "123",
  Name: "Sản phẩm A",
  Image: "/share/download_17d3096196.jpg",  ← Path này có đúng không?
  Images: [
    { Url: "/cache/images/abc.jpg" },
    { Url: "/cache/images/def.jpg" }
  ],
  Price: 100000,
  ...
}
```

**Câu hỏi cần trả lời:**

- ❓ Field `Image` có giá trị gì?
- ❓ Field `Images` có tồn tại không?
- ❓ Path có đúng với file trên server không?

### **Bước 3: Test URL trực tiếp**

Copy URL từ Network tab:

```
http://192.168.2.112:9092/share/download_17d3096196.jpg
```

**Mở trực tiếp trong browser:**

1. Paste URL vào address bar
2. Enter

**Kết quả:**

- ✅ **200 OK** → File tồn tại, vấn đề ở code frontend
- ❌ **404 Not Found** → File không tồn tại, vấn đề ở backend
- ❌ **403 Forbidden** → Permission issue
- ❌ **CORS error** → Backend chưa config CORS

### **Bước 4: Kiểm tra backend**

Nếu bạn có quyền truy cập backend:

1. **SSH vào server** (hoặc truy cập file system)
2. **Kiểm tra thư mục:**
   ```bash
   cd /path/to/backend
   ls -la share/
   ```
3. **Tìm file:**
   ```bash
   find . -name "download_17d3096196.jpg"
   ```

---

## 💡 CÁC GIẢI PHÁP

### **Giải pháp 1: Sửa path trong API response**

Nếu API trả về path sai, cần sửa backend để trả về đúng path.

**Backend cần trả về:**

```json
{
  "Image": "/actual/correct/path/to/image.jpg"
}
```

### **Giải pháp 2: Dùng ảnh từ mảng Images**

Nếu field `Image` sai nhưng `Images` array đúng:

```typescript
function transformProductData(item: any): Product {
  let imageUrl = BLANK_IMAGE;

  // Ưu tiên Images array thay vì Image
  if (item.Images?.length > 0) {
    const firstImage = item.Images[0];
    const imgPath = firstImage.Url || firstImage.url;
    imageUrl = buildImageUrl(imgPath);
  } else if (item.Image) {
    imageUrl = buildImageUrl(item.Image);
  }

  // ... rest of code
}
```

### **Giải pháp 3: Fallback về placeholder**

Nếu không fix được backend, dùng placeholder images:

```typescript
function buildImageUrl(url?: string): string {
  if (!url) return BLANK_IMAGE;
  if (url.startsWith("http")) return url;

  const cleanPath = url.replace(/^\/+/, "");
  const fullUrl = `${BACKEND_BASE_URL}/${cleanPath}`;

  // Fallback về placeholder nếu ảnh không tồn tại
  return fullUrl;
}
```

Và thêm onError handler trong component:

```jsx
<img
  src={product.image}
  alt={product.title}
  onError={(e) => {
    e.target.src = "https://via.placeholder.com/300x300?text=No+Image";
  }}
/>
```

### **Giải pháp 4: Dùng mock data tạm thời**

Nếu backend chưa sẵn sàng:

```typescript
const USE_MOCK_DATA = true; // Bật mock data
```

---

## 📋 CHECKLIST DEBUG

### **Frontend:**

- [ ] Console.log hiển thị gì?
- [ ] `First Product Image` có giá trị gì?
- [ ] `Transformed Image URL` có đúng format không?
- [ ] Network tab request đến đúng URL không?

### **Backend:**

- [ ] File có tồn tại trên server không?
- [ ] Path trong API response có đúng không?
- [ ] IIS/Apache đã config serve static files chưa?
- [ ] CORS đã được config chưa?

### **Test:**

- [ ] Mở URL ảnh trực tiếp trong browser
- [ ] Kiểm tra response status (200/404/403)
- [ ] Kiểm tra response headers (CORS, Content-Type)

---

## 🎯 CÁC TRƯỜNG HỢP THƯỜNG GẶP

### **Case 1: API trả về relative path, file tồn tại**

```
API: { "Image": "/cache/images/abc.jpg" }
File exists: ✅ /var/www/cache/images/abc.jpg
Result: ✅ Ảnh hiển thị
```

### **Case 2: API trả về relative path, file KHÔNG tồn tại**

```
API: { "Image": "/share/download_abc.jpg" }
File exists: ❌ File not found
Result: ❌ 404 Not Found ← BẠN ĐANG Ở ĐÂY
```

### **Case 3: API trả về full URL**

```
API: { "Image": "http://cdn.example.com/abc.jpg" }
Result: ✅ Ảnh hiển thị (nếu CDN hoạt động)
```

### **Case 4: API không trả về Image field**

```
API: { "Name": "Product", "Price": 100000 }
Result: ⚪ Hiển thị BLANK_IMAGE
```

---

## 🚀 HÀNH ĐỘNG TIẾP THEO

### **Ngay bây giờ:**

1. **Refresh browser** và xem Console
2. **Copy các log** và gửi cho mình:

   ```
   📦 First Product Image: ???
   ✨ Transformed Image URL: ???
   ```

3. **Test URL trực tiếp:**
   - Copy: `http://192.168.2.112:9092/share/download_17d3096196.jpg`
   - Paste vào browser
   - Cho mình biết kết quả (200/404/403)

### **Nếu 404:**

→ **Vấn đề ở BACKEND**, cần:

- Kiểm tra file có tồn tại không
- Sửa API để trả về đúng path
- Hoặc upload ảnh lên server

### **Nếu 200:**

→ **Vấn đề ở FRONTEND**, cần:

- Kiểm tra lại code transform
- Kiểm tra CORS
- Kiểm tra cache

---

## 📞 CẦN THÊM THÔNG TIN

Để giúp bạn tốt hơn, mình cần biết:

1. **Console log output:**

   ```
   📦 First Product Image: ???
   📦 First Product Images: ???
   ✨ Transformed Image URL: ???
   ```

2. **Test URL trực tiếp:**

   - Kết quả khi mở `http://192.168.2.112:9092/share/download_17d3096196.jpg`
   - Status code? (200/404/403)

3. **Backend info:**
   - Bạn có quyền truy cập backend không?
   - File ảnh thực sự nằm ở đâu trên server?

---

**Hãy refresh browser, xem Console, và cho mình biết kết quả nhé! 🔍**
