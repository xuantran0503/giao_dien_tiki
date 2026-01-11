# 📚 GIẢI THÍCH TOÀN BỘ CODE VÀ CÁCH HOẠT ĐỘNG CỦA `listingSlice.ts`

---

## 🎯 MỤC ĐÍCH CỦA FILE NÀY

File `listingSlice.ts` là một **Redux Slice** quản lý toàn bộ state và logic liên quan đến **danh sách sản phẩm** (product listing) trong ứng dụng Tiki Clone.

### **Chức năng chính:**

1. ✅ Gọi API để lấy danh sách sản phẩm từ backend
2. ✅ Quản lý trạng thái loading/success/error
3. ✅ Chuyển đổi dữ liệu từ API sang format mà UI hiểu được
4. ✅ Xử lý phân trang (pagination)
5. ✅ Cung cấp actions để components có thể dispatch

---

## 🏗️ KIẾN TRÚC TỔNG QUAN

```
┌─────────────────────────────────────────────────────────────┐
│                    listingSlice.ts                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. IMPORTS & TYPES                                         │
│     - Redux Toolkit functions                               │
│     - TypeScript interfaces                                 │
│                                                             │
│  2. CONSTANTS                                               │
│     - Backend URL                                           │
│     - Blank image fallback                                  │
│                                                             │
│  3. HELPER FUNCTIONS                                        │
│     - extractProductsFromResponse()                         │
│     - buildImageUrl()                                       │
│     - getImageUrl()                                         │
│     - transformProductData()                                │
│                                                             │
│  4. ASYNC THUNK                                             │
│     - fetchProductsByPage()                                 │
│       → Gọi API                                             │
│       → Xử lý response                                      │
│       → Transform data                                      │
│                                                             │
│  5. SLICE CONFIGURATION                                     │
│     - Initial state                                         │
│     - Reducers (sync actions)                               │
│     - Extra reducers (async actions)                        │
│                                                             │
│  6. EXPORTS                                                 │
│     - Actions                                               │
│     - Reducer                                               │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 📦 PHẦN 1: IMPORTS VÀ TYPES

### **Code:**

```typescript
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { topDealsData } from "../data/topDealsData";

const USE_MOCK_DATA = false;

export interface Product {
  id: string | number;
  title: string;
  originalPrice: number;
  discount: number;
  rating: number;
  image: string;
  imageBadges?: string;
  shippingBadge?: string;
  date?: string;
  madeIn?: string | null;
}

export interface ListingState {
  products: Product[];
  status: "idle" | "pending" | "succeeded" | "failed";
  error: string | null;
  pageIndex: number;
  pageSize: number;
}
```

### **Giải thích:**

#### **1.1. Redux Toolkit Imports**

- `createSlice`: Tạo Redux slice với reducers và actions
- `createAsyncThunk`: Tạo async action để gọi API
- `PayloadAction`: Type cho action có payload

#### **1.2. Axios**

- Thư viện HTTP client để gọi API
- Dễ sử dụng hơn `fetch`, tự động parse JSON

#### **1.3. Mock Data**

- `topDealsData`: Dữ liệu giả để fallback khi API lỗi
- `USE_MOCK_DATA`: Flag để bật/tắt mock mode

#### **1.4. Product Interface**

Định nghĩa cấu trúc của 1 sản phẩm:

| Field           | Type               | Bắt buộc | Mô tả           |
| --------------- | ------------------ | -------- | --------------- |
| `id`            | `string \| number` | ✅       | ID sản phẩm     |
| `title`         | `string`           | ✅       | Tên sản phẩm    |
| `originalPrice` | `number`           | ✅       | Giá gốc         |
| `discount`      | `number`           | ✅       | % giảm giá      |
| `rating`        | `number`           | ✅       | Đánh giá (0-5)  |
| `image`         | `string`           | ✅       | URL ảnh         |
| `imageBadges`   | `string`           | ❌       | Badge trên ảnh  |
| `shippingBadge` | `string`           | ❌       | Badge giao hàng |
| `date`          | `string`           | ❌       | "Hot", "New"    |
| `madeIn`        | `string \| null`   | ❌       | Xuất xứ         |

#### **1.5. ListingState Interface**

Định nghĩa Redux state cho listing:

```typescript
{
    products: [],              // Mảng sản phẩm
    status: "idle",           // Trạng thái API call
    error: null,              // Thông báo lỗi
    pageIndex: 1,             // Trang hiện tại
    pageSize: 20              // Số sản phẩm/trang
}
```

**Status có 4 giá trị:**

- `"idle"`: Chưa gọi API
- `"pending"`: Đang gọi API (loading)
- `"succeeded"`: API thành công
- `"failed"`: API thất bại

---

## 🔧 PHẦN 2: CONSTANTS

### **Code:**

```typescript
const BACKEND_BASE_URL = "http://192.168.2.112:9092";
const BLANK_IMAGE =
  "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
```

### **Giải thích:**

#### **2.1. BACKEND_BASE_URL**

- URL gốc của backend server
- Dùng để ghép với relative image paths
- **Lưu ý:** Đây là IP local, khi deploy production cần đổi

#### **2.2. BLANK_IMAGE**

- Ảnh trắng 1x1 pixel dạng base64
- Dùng khi không có ảnh sản phẩm
- Tránh broken image icon (❌)

**Tại sao dùng base64:**

- Không cần HTTP request
- Luôn available (offline)
- Nhẹ (chỉ vài bytes)

---

## 🛠️ PHẦN 3: HELPER FUNCTIONS

### **3.1. extractProductsFromResponse()**

#### **Code:**

```typescript
function extractProductsFromResponse(responseData: any): any[] {
  const dataBlock = responseData?.Data || responseData?.data || responseData;

  const products =
    dataBlock?.Result ||
    dataBlock?.result ||
    dataBlock?.Items ||
    dataBlock?.items ||
    (Array.isArray(dataBlock) ? dataBlock : []);

  return products;
}
```

#### **Mục đích:**

Lấy mảng sản phẩm từ API response, xử lý nhiều cấu trúc khác nhau

#### **Cách hoạt động:**

**Bước 1:** Lấy data block

```typescript
responseData?.Data; // Chuẩn 1: { Data: { Result: [...] } }
responseData?.data; // Chuẩn 2: { data: { Result: [...] } }
responseData; // Chuẩn 3: { Result: [...] }
```

**Bước 2:** Lấy mảng sản phẩm

```typescript
dataBlock?.Result; // Chuẩn 1: { Result: [...] }
dataBlock?.result; // Chuẩn 2: { result: [...] }
dataBlock?.Items; // Chuẩn 3: { Items: [...] }
dataBlock?.items; // Chuẩn 4: { items: [...] }
Array.isArray(dataBlock) ? dataBlock : []; // Chuẩn 5: [...]
```

#### **Ví dụ:**

```typescript
// Input 1:
{ Data: { Result: [product1, product2] } }
→ Output: [product1, product2]

// Input 2:
{ data: { items: [product1, product2] } }
→ Output: [product1, product2]

// Input 3:
[product1, product2]
→ Output: [product1, product2]

// Input 4:
{ SomeOtherField: "..." }
→ Output: []
```

---

### **3.2. buildImageUrl()**

#### **Code:**

```typescript
function buildImageUrl(url?: string): string {
  if (!url) return BLANK_IMAGE;
  if (url.startsWith("http")) return url;

  const cleanPath = url.replace(/^\/+/, "");
  return `${BACKEND_BASE_URL}/${cleanPath}`;
}
```

#### **Mục đích:**

Xây dựng URL ảnh đầy đủ từ path

#### **Cách hoạt động:**

**Case 1:** Không có URL

```typescript
buildImageUrl(undefined)
→ BLANK_IMAGE
```

**Case 2:** URL đầy đủ (có http/https)

```typescript
buildImageUrl("https://example.com/image.jpg")
→ "https://example.com/image.jpg"
```

**Case 3:** Relative path

```typescript
buildImageUrl("/uploads/product.jpg")
→ "http://192.168.2.112:9092/uploads/product.jpg"

buildImageUrl("//uploads/product.jpg")  // Có // ở đầu
→ "http://192.168.2.112:9092/uploads/product.jpg"  // Đã xóa //
```

#### **Regex `/^\/+/`:**

- `^` = Đầu chuỗi
- `\/+` = Một hoặc nhiều dấu `/`
- Xóa tất cả `/` thừa ở đầu

---

### **3.3. getImageUrl()**

#### **Code:**

```typescript
function getImageUrl(item: any): string {
  if (item.Image) {
    return buildImageUrl(item.Image);
  }

  if (item.Images?.length > 0) {
    const firstImage = item.Images[0];
    const imageUrl = firstImage.Url || firstImage.url;
    return buildImageUrl(imageUrl);
  }

  return BLANK_IMAGE;
}
```

#### **Mục đích:**

Lấy URL ảnh từ item API, ưu tiên `Image`, fallback sang `Images[0]`

#### **Cách hoạt động:**

**Priority 1:** Field `Image`

```typescript
item = { Image: "/uploads/product.jpg" }
→ buildImageUrl("/uploads/product.jpg")
→ "http://192.168.2.112:9092/uploads/product.jpg"
```

**Priority 2:** Mảng `Images[0]`

```typescript
item = { Images: [{ Url: "/uploads/product.jpg" }] }
→ buildImageUrl("/uploads/product.jpg")
→ "http://192.168.2.112:9092/uploads/product.jpg"
```

**Priority 3:** Không có ảnh

```typescript
item = { Name: "Product" }
→ BLANK_IMAGE
```

#### **Optional Chaining `?.`:**

```typescript
item.Images?.length > 0
// Tương đương:
if (item.Images && item.Images.length > 0) { ... }
```

---

### **3.4. transformProductData()**

#### **Code:**

```typescript
function transformProductData(item: any): Product {
  return {
    id: item.Id || item.id,
    title: item.Name || item.name || "Sản phẩm",
    image: getImageUrl(item),
    originalPrice: item.Price || item.OriginalPrice || 0,
    discount: item.DiscountPercentage || item.Discount || 0,
    rating: 5,
    shippingBadge: "Giao nhanh 2h",
    date: "Hot",
  };
}
```

#### **Mục đích:**

Chuyển đổi dữ liệu từ API sang Product interface

#### **Mapping:**

| API Field                            | Product Field   | Fallback          |
| ------------------------------------ | --------------- | ----------------- |
| `Id` hoặc `id`                       | `id`            | -                 |
| `Name` hoặc `name`                   | `title`         | `"Sản phẩm"`      |
| `Image` hoặc `Images[0]`             | `image`         | `BLANK_IMAGE`     |
| `Price` hoặc `OriginalPrice`         | `originalPrice` | `0`               |
| `DiscountPercentage` hoặc `Discount` | `discount`      | `0`               |
| -                                    | `rating`        | `5` (hardcode)    |
| -                                    | `shippingBadge` | `"Giao nhanh 2h"` |
| -                                    | `date`          | `"Hot"`           |

#### **Ví dụ transformation:**

**Input từ API:**

```json
{
  "Id": "123",
  "Name": "iPhone 15 Pro Max",
  "Price": 30000000,
  "DiscountPercentage": 15,
  "Image": "/uploads/iphone.jpg"
}
```

**Output sau transform:**

```json
{
  "id": "123",
  "title": "iPhone 15 Pro Max",
  "originalPrice": 30000000,
  "discount": 15,
  "rating": 5,
  "image": "http://192.168.2.112:9092/uploads/iphone.jpg",
  "shippingBadge": "Giao nhanh 2h",
  "date": "Hot"
}
```

---

## 🚀 PHẦN 4: ASYNC THUNK - fetchProductsByPage()

### **Code đầy đủ:**

```typescript
export const fetchProductsByPage = createAsyncThunk(
  "listing/fetchProductsByPage",
  async (
    params: { pageIndex: number; pageSize: number },
    { rejectWithValue }
  ) => {
    if (USE_MOCK_DATA) {
      return topDealsData;
    }

    try {
      const FULL_URL =
        "http://192.168.2.112:9092/api-end-user/listing/get-by-page";
      const payload = {
        PageIndex: params.pageIndex,
        PageSize: params.pageSize,
        Orderby: "CreatedDate desc",
        AId: "da1e0cd8-f73b-4da2-acf2-8ddc621bcf75",
        LanguageCode: "vi",
        CurrencyCode: "VND",
      };

      const response = await axios.post(FULL_URL, payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      const products = extractProductsFromResponse(response.data);

      if (!products || products.length === 0) {
        console.warn("Không tìm thấy sản phẩm từ API, sử dụng mock data");
        return topDealsData;
      }

      return products.map(transformProductData);
    } catch (error: any) {
      return rejectWithValue(error.message || "API Error");
    }
  }
);
```

### **Giải thích chi tiết:**

#### **4.1. Tên action**

```typescript
"listing/fetchProductsByPage";
```

Tạo ra 3 action types:

- `listing/fetchProductsByPage/pending`
- `listing/fetchProductsByPage/fulfilled`
- `listing/fetchProductsByPage/rejected`

#### **4.2. Parameters**

```typescript
params: {
  pageIndex: number;
  pageSize: number;
}
```

**Cách gọi:**

```typescript
dispatch(fetchProductsByPage({ pageIndex: 1, pageSize: 20 }));
```

#### **4.3. Mock data mode**

```typescript
if (USE_MOCK_DATA) {
  return topDealsData;
}
```

Nếu `USE_MOCK_DATA = true`, trả về dữ liệu giả ngay lập tức

#### **4.4. API Request**

**URL:**

```
http://192.168.2.112:9092/api-end-user/listing/get-by-page
```

**Method:** POST

**Headers:**

```json
{
  "Content-Type": "application/json"
}
```

**Body (payload):**

```json
{
  "PageIndex": 1,
  "PageSize": 20,
  "Orderby": "CreatedDate desc",
  "AId": "da1e0cd8-f73b-4da2-acf2-8ddc621bcf75",
  "LanguageCode": "vi",
  "CurrencyCode": "VND"
}
```

**Ý nghĩa các field:**

- `PageIndex`: Trang số mấy (1, 2, 3...)
- `PageSize`: Số sản phẩm mỗi trang
- `Orderby`: Sắp xếp theo ngày tạo giảm dần
- `AId`: Application ID (do backend cung cấp)
- `LanguageCode`: Ngôn ngữ (vi = tiếng Việt)
- `CurrencyCode`: Tiền tệ (VND = Việt Nam Đồng)

#### **4.5. Xử lý response**

**Bước 1:** Extract products

```typescript
const products = extractProductsFromResponse(response.data);
```

**Bước 2:** Validate

```typescript
if (!products || products.length === 0) {
  console.warn("Không tìm thấy sản phẩm từ API, sử dụng mock data");
  return topDealsData;
}
```

**Bước 3:** Transform data

```typescript
return products.map(transformProductData);
```

#### **4.6. Error handling**

```typescript
catch (error: any) {
    return rejectWithValue(error.message || "API Error");
}
```

**Các lỗi có thể xảy ra:**

- Network error (không có internet)
- Timeout
- Server error (500, 502, 503)
- CORS error
- Invalid JSON response

---

## 🔄 PHẦN 5: SLICE CONFIGURATION

### **Code:**

```typescript
const listingSlice = createSlice({
  name: "listing",
  initialState,
  reducers: {
    setPageIndex: (state, action: PayloadAction<number>) => {
      state.pageIndex = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductsByPage.pending, (state) => {
        state.status = "pending";
        state.error = null;
      })
      .addCase(fetchProductsByPage.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.products = action.payload;
      })
      .addCase(fetchProductsByPage.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) || "Failed to fetch products";
      });
  },
});
```

### **Giải thích:**

#### **5.1. Slice name**

```typescript
name: "listing";
```

State sẽ được truy cập qua: `state.listing`

#### **5.2. Initial state**

```typescript
{
    products: [],
    status: "idle",
    error: null,
    pageIndex: 1,
    pageSize: 20
}
```

#### **5.3. Synchronous reducers**

```typescript
reducers: {
    setPageIndex: (state, action: PayloadAction<number>) => {
        state.pageIndex = action.payload;
    },
}
```

**Cách dùng:**

```typescript
dispatch(setPageIndex(2)); // Chuyển sang trang 2
```

**Redux Toolkit Immer:**

- Có thể mutate `state` trực tiếp
- Không cần `return { ...state, pageIndex: action.payload }`

#### **5.4. Async reducers (extraReducers)**

**Case 1: Pending (Đang gọi API)**

```typescript
.addCase(fetchProductsByPage.pending, (state) => {
    state.status = "pending";
    state.error = null;
})
```

**State changes:**

```typescript
{
    products: [...],      // Giữ nguyên
    status: "pending",    // Đang loading
    error: null,          // Xóa lỗi cũ
    pageIndex: 1,
    pageSize: 20
}
```

**Case 2: Fulfilled (API thành công)**

```typescript
.addCase(fetchProductsByPage.fulfilled, (state, action) => {
    state.status = "succeeded";
    state.products = action.payload;
})
```

**State changes:**

```typescript
{
    products: [product1, product2, ...],  // Cập nhật data mới
    status: "succeeded",                   // Thành công
    error: null,
    pageIndex: 1,
    pageSize: 20
}
```

**Case 3: Rejected (API thất bại)**

```typescript
.addCase(fetchProductsByPage.rejected, (state, action) => {
    state.status = "failed";
    state.error = (action.payload as string) || "Failed to fetch products";
})
```

**State changes:**

```typescript
{
    products: [],                    // Giữ nguyên hoặc rỗng
    status: "failed",                // Thất bại
    error: "Network error",          // Thông báo lỗi
    pageIndex: 1,
    pageSize: 20
}
```

---

## 📤 PHẦN 6: EXPORTS

### **Code:**

```typescript
export const { setPageIndex } = listingSlice.actions;
export default listingSlice.reducer;
```

### **Giải thích:**

#### **6.1. Export actions**

```typescript
export const { setPageIndex } = listingSlice.actions;
```

**Cách dùng trong component:**

```typescript
import { setPageIndex } from "./store/listingSlice";

dispatch(setPageIndex(3));
```

#### **6.2. Export reducer**

```typescript
export default listingSlice.reducer;
```

**Cách dùng trong store.js:**

```typescript
import listingReducer from "./listingSlice";

const store = configureStore({
  reducer: {
    listing: listingReducer,
    cart: cartReducer,
    // ...
  },
});
```

---

## 🎬 FLOW HOẠT ĐỘNG HOÀN CHỈNH

### **Scenario: User mở trang chủ**

```
┌─────────────────────────────────────────────────────────────┐
│ 1. COMPONENT MOUNT                                          │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. DISPATCH ACTION                                          │
│    dispatch(fetchProductsByPage({ pageIndex: 1, pageSize: 20 })) │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. REDUX: PENDING STATE                                     │
│    state.status = "pending"                                 │
│    state.error = null                                       │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. COMPONENT RE-RENDER                                      │
│    if (status === "pending") return <Loading />             │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ 5. API CALL                                                 │
│    axios.post(URL, payload)                                 │
└─────────────────────────────────────────────────────────────┘
                            │
                ┌───────────┴───────────┐
                │                       │
                ▼                       ▼
┌───────────────────────┐   ┌───────────────────────┐
│ 6a. SUCCESS           │   │ 6b. ERROR             │
│ response.data         │   │ Network error         │
└───────────────────────┘   └───────────────────────┘
                │                       │
                ▼                       ▼
┌───────────────────────┐   ┌───────────────────────┐
│ 7a. EXTRACT PRODUCTS  │   │ 7b. REJECT            │
│ extractProductsFrom   │   │ rejectWithValue()     │
│ Response()            │   │                       │
└───────────────────────┘   └───────────────────────┘
                │                       │
                ▼                       ▼
┌───────────────────────┐   ┌───────────────────────┐
│ 8a. TRANSFORM DATA    │   │ 8b. REDUX: FAILED     │
│ products.map(         │   │ state.status="failed" │
│   transformProduct    │   │ state.error="..."     │
│   Data)               │   │                       │
└───────────────────────┘   └───────────────────────┘
                │                       │
                ▼                       ▼
┌───────────────────────┐   ┌───────────────────────┐
│ 9a. REDUX: SUCCEEDED  │   │ 9b. COMPONENT RENDER  │
│ state.status=         │   │ if (status==="failed")│
│   "succeeded"         │   │   return <Error />    │
│ state.products=[...]  │   │                       │
└───────────────────────┘   └───────────────────────┘
                │
                ▼
┌─────────────────────────────────────────────────────────────┐
│ 10. COMPONENT RE-RENDER                                     │
│     if (status === "succeeded")                             │
│       return <ProductList products={products} />            │
└─────────────────────────────────────────────────────────────┘
```

---

## 💻 CÁCH SỬ DỤNG TRONG COMPONENT

### **Example: TopDeals.jsx**

```javascript
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductsByPage, setPageIndex } from "../../store/listingSlice";

const TopDeals = () => {
  const dispatch = useDispatch();

  // Lấy state từ Redux
  const { products, status, error, pageIndex } = useSelector(
    (state) => state.listing
  );

  // Gọi API khi component mount
  useEffect(() => {
    dispatch(fetchProductsByPage({ pageIndex: 1, pageSize: 20 }));
  }, [dispatch]);

  // Xử lý chuyển trang
  const handleNextPage = () => {
    dispatch(setPageIndex(pageIndex + 1));
    dispatch(
      fetchProductsByPage({
        pageIndex: pageIndex + 1,
        pageSize: 20,
      })
    );
  };

  // Render theo status
  if (status === "pending") {
    return <div>Đang tải...</div>;
  }

  if (status === "failed") {
    return <div>Lỗi: {error}</div>;
  }

  return (
    <div>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
      <button onClick={handleNextPage}>Trang tiếp</button>
    </div>
  );
};
```

---

## 🔍 DEBUGGING TIPS

### **1. Kiểm tra API response**

```typescript
const response = await axios.post(FULL_URL, payload);
console.log("📦 API Response:", response.data);
```

### **2. Kiểm tra extracted products**

```typescript
const products = extractProductsFromResponse(response.data);
console.log("📋 Extracted Products:", products);
```

### **3. Kiểm tra transformed data**

```typescript
const transformed = products.map(transformProductData);
console.log("✨ Transformed Data:", transformed);
```

### **4. Kiểm tra Redux state**

```typescript
const state = useSelector((state) => state.listing);
console.log("🔴 Redux State:", state);
```

### **5. Kiểm tra image URLs**

```typescript
const imgUrl = getImageUrl(item);
console.log("🖼️ Image URL:", imgUrl);
```

---

## ⚡ TỐI ƯU HÓA ĐÃ ÁP DỤNG

### **1. Tách Helper Functions**

✅ **Trước:**

```typescript
// 80 dòng code lộn xộn trong async thunk
```

✅ **Sau:**

```typescript
// 4 helper functions rõ ràng, dễ test
extractProductsFromResponse();
buildImageUrl();
getImageUrl();
transformProductData();
```

**Lợi ích:**

- Dễ đọc, dễ hiểu
- Dễ test riêng từng function
- Dễ maintain và debug
- Có thể reuse ở nơi khác

### **2. Single Responsibility Principle**

Mỗi function chỉ làm 1 việc:

- `extractProductsFromResponse`: Chỉ extract data
- `buildImageUrl`: Chỉ build URL
- `getImageUrl`: Chỉ lấy image URL
- `transformProductData`: Chỉ transform data

### **3. Defensive Programming**

```typescript
// Optional chaining
responseData?.Data;
item.Images?.length;

// Fallback values
item.Name || item.name || "Sản phẩm";
item.Price || item.OriginalPrice || 0;

// Array check
Array.isArray(dataBlock) ? dataBlock : [];
```

### **4. Constants**

```typescript
const BACKEND_BASE_URL = "...";
const BLANK_IMAGE = "...";
```

Dễ thay đổi khi deploy production

---

## 🚀 MỞ RỘNG TRONG TƯƠNG LAI

### **1. Thêm search/filter**

```typescript
params: {
    pageIndex: number;
    pageSize: number;
    keyword?: string;
    category?: string;
    priceRange?: { min: number; max: number };
}
```

### **2. Thêm caching**

```typescript
// Không gọi API lại nếu đã có data
if (state.products.length > 0 && !forceRefresh) {
  return state.products;
}
```

### **3. Thêm pagination metadata**

```typescript
interface ListingState {
  // ...
  totalPages: number;
  totalItems: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}
```

### **4. Thêm sorting**

```typescript
reducers: {
    setSortBy: (state, action) => {
        state.sortBy = action.payload;
    },
}
```

---

## 📊 BẢNG TÓM TẮT

| Thành phần                    | Mục đích                | Khi nào dùng       |
| ----------------------------- | ----------------------- | ------------------ |
| `Product`                     | Interface sản phẩm      | Định nghĩa type    |
| `ListingState`                | Interface Redux state   | Định nghĩa state   |
| `extractProductsFromResponse` | Lấy mảng từ API         | Xử lý response     |
| `buildImageUrl`               | Build URL ảnh           | Xử lý image path   |
| `getImageUrl`                 | Lấy URL ảnh từ item     | Transform data     |
| `transformProductData`        | Transform API → Product | Map data           |
| `fetchProductsByPage`         | Gọi API                 | Component dispatch |
| `setPageIndex`                | Đổi trang               | Pagination         |

---

## ✅ CHECKLIST KHI SỬA CODE

- [ ] Có thêm field mới? → Cập nhật `Product` interface
- [ ] API response đổi cấu trúc? → Sửa `extractProductsFromResponse`
- [ ] Backend URL đổi? → Sửa `BACKEND_BASE_URL`
- [ ] Cần thêm filter? → Thêm vào `params` của `fetchProductsByPage`
- [ ] Cần thêm action? → Thêm vào `reducers`
- [ ] Test API? → Dùng console.log trong helper functions

---

**🎉 KẾT LUẬN**

File `listingSlice.ts` là trung tâm quản lý danh sách sản phẩm, với kiến trúc rõ ràng:

1. **Helper functions** xử lý logic phức tạp
2. **Async thunk** gọi API và transform data
3. **Slice** quản lý state và reducers
4. **Exports** cung cấp actions cho components

Code đã được tối ưu hóa để dễ đọc, dễ maintain, và dễ mở rộng! 🚀
