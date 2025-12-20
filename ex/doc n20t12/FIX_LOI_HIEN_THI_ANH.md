# 🐛 LỖI HIỂN THỊ ẢNH - NGUYÊN NHÂN VÀ CÁCH FIX

## ❌ VẤN ĐỀ

Ảnh sản phẩm không hiển thị, trong Network tab thấy các request ảnh bị **404 (Not Found)**:

```
❌ http://localhost:3000/cache/images/4748183b-6ee1.jpg  → 404
❌ http://localhost:3000/cache/images/17d3b5201-5ee1.jpg → 404
❌ http://localhost:3000/cache/images/17d3b5202-6ee1.jpg → 404
```

## 🔍 NGUYÊN NHÂN

### **Trước khi bỏ `buildImageUrl()`:**

```typescript
function buildImageUrl(url?: string): string {
  if (!url) return BLANK_IMAGE;
  if (url.startsWith("http")) return url;

  const cleanPath = url.replace(/^\/+/, "");
  return `${BACKEND_BASE_URL}/${cleanPath}`;  // ⭐ Ghép backend URL
}

// API trả về:
item.Image = "/cache/images/4748183b-6ee1.jpg"

// Sau khi xử lý:
imageUrl = "http://192.168.2.112:9092/cache/images/4748183b-6ee1.jpg" ✅
```

### **Sau khi bỏ `buildImageUrl()`:**

```typescript
// Dùng trực tiếp
imageUrl = item.Image;  // ❌ Chỉ là relative path

// API trả về:
item.Image = "/cache/images/4748183b-6ee1.jpg"

// Kết quả:
imageUrl = "/cache/images/4748183b-6ee1.jpg"  ❌

// Browser hiểu thành:
"http://localhost:3000/cache/images/4748183b-6ee1.jpg"  ❌ SAI!
```

## 🎯 TẠI SAO LẠI SAI?

### **Relative Path vs Absolute URL:**

| API trả về                   | Không có buildImageUrl                          | Có buildImageUrl                                    |
| ---------------------------- | ----------------------------------------------- | --------------------------------------------------- |
| `/cache/images/abc.jpg`      | `http://localhost:3000/cache/images/abc.jpg` ❌ | `http://192.168.2.112:9092/cache/images/abc.jpg` ✅ |
| `cache/images/abc.jpg`       | `http://localhost:3000/cache/images/abc.jpg` ❌ | `http://192.168.2.112:9092/cache/images/abc.jpg` ✅ |
| `http://example.com/abc.jpg` | `http://example.com/abc.jpg` ✅                 | `http://example.com/abc.jpg` ✅                     |

**Vấn đề:**

- API backend chạy ở: `http://192.168.2.112:9092`
- Frontend chạy ở: `http://localhost:3000`
- Khi dùng relative path `/cache/images/abc.jpg`, browser tự động ghép với domain hiện tại (localhost:3000)
- Nhưng ảnh thực tế nằm ở backend (192.168.2.112:9092)

## ✅ GIẢI PHÁP

### **Cần PHẢI có `buildImageUrl()` để:**

1. **Ghép backend URL** với image path
2. **Xử lý các trường hợp:**
   - Relative path: `/cache/images/abc.jpg` → `http://192.168.2.112:9092/cache/images/abc.jpg`
   - Full URL: `http://example.com/abc.jpg` → Giữ nguyên
   - Undefined/null: → BLANK_IMAGE

### **Code đã fix:**

```typescript
const BACKEND_BASE_URL = "http://192.168.2.112:9092";

function buildImageUrl(url?: string): string {
  if (!url) return BLANK_IMAGE;
  if (url.startsWith("http")) return url; // Đã là full URL

  // Xóa dấu / ở đầu và ghép với backend URL
  const cleanPath = url.replace(/^\/+/, "");
  return `${BACKEND_BASE_URL}/${cleanPath}`;
}

function transformProductData(item: any): Product {
  let imageUrl = BLANK_IMAGE;

  if (item.Image) {
    imageUrl = buildImageUrl(item.Image); // ⭐ Dùng buildImageUrl
  } else if (item.Images?.length > 0) {
    const firstImage = item.Images[0];
    const imgPath = firstImage.Url || firstImage.url;
    imageUrl = buildImageUrl(imgPath); // ⭐ Dùng buildImageUrl
  }

  return {
    // ...
    image: imageUrl,
    // ...
  };
}
```

## 🔄 FLOW HOẠT ĐỘNG

```
API Response:
{
  "Image": "/cache/images/4748183b-6ee1.jpg"
}
    ↓
buildImageUrl("/cache/images/4748183b-6ee1.jpg")
    ↓
1. Kiểm tra: !url? → NO
2. Kiểm tra: url.startsWith("http")? → NO
3. Xóa / ở đầu: "cache/images/4748183b-6ee1.jpg"
4. Ghép: "http://192.168.2.112:9092" + "/" + "cache/images/4748183b-6ee1.jpg"
    ↓
Result: "http://192.168.2.112:9092/cache/images/4748183b-6ee1.jpg" ✅
    ↓
Browser request: http://192.168.2.112:9092/cache/images/4748183b-6ee1.jpg
    ↓
Backend trả về ảnh ✅
```

## 📋 CHECKLIST SAU KHI FIX

- [x] Thêm lại `buildImageUrl()` function
- [x] Thêm constant `BACKEND_BASE_URL`
- [x] Sử dụng `buildImageUrl()` trong `transformProductData()`
- [ ] **TODO:** Refresh browser và kiểm tra ảnh hiển thị
- [ ] **TODO:** Kiểm tra Network tab - các request phải là `http://192.168.2.112:9092/...`

## 🎯 KẾT LUẬN

### **Bài học:**

**KHÔNG THỂ** bỏ `buildImageUrl()` vì:

1. ❌ API trả về **relative path**, không phải full URL
2. ❌ Browser sẽ ghép với localhost thay vì backend URL
3. ❌ Ảnh sẽ bị 404

**CẦN PHẢI** có `buildImageUrl()` để:

1. ✅ Ghép backend URL với image path
2. ✅ Xử lý cả relative path và full URL
3. ✅ Fallback về BLANK_IMAGE khi không có ảnh

### **Quy tắc:**

> **Nếu API trả về relative path → BẮT BUỘC phải có function ghép URL**

### **Khi nào có thể bỏ `buildImageUrl()`?**

Chỉ khi API **luôn luôn** trả về **full URL**:

```json
{
  "Image": "http://192.168.2.112:9092/cache/images/abc.jpg"
}
```

Trong trường hợp này:

```typescript
imageUrl = item.Image; // ✅ OK vì đã là full URL
```

---

## 🚀 NEXT STEPS

1. **Refresh browser** (Ctrl + F5)
2. **Kiểm tra Network tab:**
   - Các request phải là: `http://192.168.2.112:9092/cache/images/...`
   - Status phải là: `200 OK` (không phải 404)
3. **Kiểm tra ảnh hiển thị đúng**

---

**🎉 Sau khi fix, ảnh sẽ hiển thị bình thường!**
