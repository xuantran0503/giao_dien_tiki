# 📖 Giải thích `keyword?: string` trong TypeScript

## 🎯 Định nghĩa

```typescript
params: { pageIndex: number; pageSize: number; keyword?: string }
```

### Dấu `?` = **Optional Property** (Thuộc tính tùy chọn)

| Property    | Bắt buộc? | Kiểu dữ liệu          | Giá trị nếu không truyền |
| ----------- | --------- | --------------------- | ------------------------ |
| `pageIndex` | ✅ Có     | `number`              | ❌ Lỗi nếu không có      |
| `pageSize`  | ✅ Có     | `number`              | ❌ Lỗi nếu không có      |
| `keyword`   | ❌ Không  | `string \| undefined` | `undefined`              |

---

## 📝 So sánh

### **Không có dấu `?` (Bắt buộc):**

```typescript
params: {
  pageIndex: number;
  pageSize: number;
  keyword: string;
}

// ✅ OK
dispatch(fetchProductsByPage({ pageIndex: 1, pageSize: 20, keyword: "abc" }));

// ❌ LỖI: Property 'keyword' is missing
dispatch(fetchProductsByPage({ pageIndex: 1, pageSize: 20 }));
```

### **Có dấu `?` (Tùy chọn):**

```typescript
params: { pageIndex: number; pageSize: number; keyword?: string }

// ✅ OK - Có keyword
dispatch(fetchProductsByPage({ pageIndex: 1, pageSize: 20, keyword: "abc" }));

// ✅ OK - Không có keyword
dispatch(fetchProductsByPage({ pageIndex: 1, pageSize: 20 }));
```

---

## 🔧 Cách sử dụng trong code

### **Ví dụ 1: Kiểm tra trước khi dùng**

```typescript
export const fetchProductsByPage = createAsyncThunk(
  "listing/fetchProductsByPage",
  async (params: { pageIndex: number; pageSize: number; keyword?: string }) => {
    const payload: any = {
      PageIndex: params.pageIndex,
      PageSize: params.pageSize,
      Orderby: "CreatedDate desc",
      AId: "da1e0cd8-f73b-4da2-acf2-8ddc621bcf75",
      LanguageCode: "vi",
      CurrencyCode: "VND",
    };

    // Chỉ thêm keyword vào payload nếu nó tồn tại
    if (params.keyword) {
      payload.Keyword = params.keyword;
    }

    const response = await axios.post(FULL_URL, payload);
    return response.data;
  }
);
```

### **Ví dụ 2: Sử dụng Default Value**

```typescript
async (params) => {
  // Nếu không có keyword, dùng chuỗi rỗng
  const searchKeyword = params.keyword || "";

  console.log("Tìm kiếm:", searchKeyword);
};
```

### **Ví dụ 3: Sử dụng Optional Chaining**

```typescript
async (params) => {
  // Chỉ gọi .toLowerCase() nếu keyword tồn tại
  const lowerKeyword = params.keyword?.toLowerCase();

  console.log(lowerKeyword); // "abc" hoặc undefined
};
```

---

## 🎨 Ứng dụng thực tế: Tích hợp SearchBar

### **Trong SearchBar.tsx:**

```typescript
import { fetchProductsByPage } from "../../store/listingSlice";

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useDispatch();

  const handleSearch = () => {
    if (searchTerm.trim()) {
      // Tìm kiếm với keyword
      dispatch(
        fetchProductsByPage({
          pageIndex: 1,
          pageSize: 20,
          keyword: searchTerm, // ⭐ Truyền keyword
        })
      );
    } else {
      // Lấy tất cả sản phẩm
      dispatch(
        fetchProductsByPage({
          pageIndex: 1,
          pageSize: 20,
          // ⭐ Không truyền keyword
        })
      );
    }
  };

  return (
    <input
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      onKeyPress={(e) => e.key === "Enter" && handleSearch()}
    />
  );
};
```

### **Trong TopDeals.jsx:**

```javascript
useEffect(() => {
  // Lấy tất cả sản phẩm (không có keyword)
  dispatch(
    fetchProductsByPage({
      pageIndex: 1,
      pageSize: 18,
    })
  );
}, []);
```

---

## 🔍 Các cách khai báo tương đương

### **Cách 1: Inline (đang dùng)**

```typescript
params: { pageIndex: number; pageSize: number; keyword?: string }
```

### **Cách 2: Interface**

```typescript
interface FetchProductsParams {
    pageIndex: number;
    pageSize: number;
    keyword?: string;
}

async (params: FetchProductsParams) => { ... }
```

### **Cách 3: Type Alias**

```typescript
type FetchProductsParams = {
    pageIndex: number;
    pageSize: number;
    keyword?: string;
}

async (params: FetchProductsParams) => { ... }
```

---

## ⚠️ Lưu ý quan trọng

### **1. `keyword?: string` ≠ `keyword: string | undefined`**

Mặc dù về mặt type checking chúng giống nhau, nhưng:

```typescript
// Với keyword?: string
const params1 = { pageIndex: 1, pageSize: 20 }; // ✅ OK

// Với keyword: string | undefined
const params2 = { pageIndex: 1, pageSize: 20 }; // ❌ Lỗi: thiếu keyword
const params3 = { pageIndex: 1, pageSize: 20, keyword: undefined }; // ✅ OK
```

### **2. Kiểm tra trước khi sử dụng**

```typescript
// ❌ SAI: Có thể bị lỗi nếu keyword = undefined
const length = params.keyword.length;

// ✅ ĐÚNG: Kiểm tra trước
if (params.keyword) {
  const length = params.keyword.length;
}

// ✅ ĐÚNG: Dùng optional chaining
const length = params.keyword?.length;
```

### **3. Default value**

```typescript
// Cách 1: Trong function
const keyword = params.keyword || "default";

// Cách 2: Destructuring với default
const { pageIndex, pageSize, keyword = "default" } = params;
```

---

## 📊 Tóm tắt

| Khía cạnh        | Giải thích                                         |
| ---------------- | -------------------------------------------------- |
| **Ý nghĩa**      | Property tùy chọn, có thể có hoặc không            |
| **Kiểu dữ liệu** | `string \| undefined`                              |
| **Khi gọi**      | Có thể bỏ qua property này                         |
| **Khi dùng**     | Phải kiểm tra `if (params.keyword)` hoặc dùng `?.` |
| **Use case**     | Tìm kiếm, filter, các tham số không bắt buộc       |

---

## 🎯 Kết luận

`keyword?: string` cho phép:

- ✅ Linh hoạt khi gọi function (có hoặc không có keyword)
- ✅ Tái sử dụng function cho nhiều mục đích (get all / search)
- ✅ Type-safe với TypeScript
- ✅ Dễ mở rộng thêm filter khác

**→ Đây là best practice trong TypeScript!**
