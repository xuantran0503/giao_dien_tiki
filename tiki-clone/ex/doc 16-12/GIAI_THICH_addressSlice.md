# 📘 GIẢI THÍCH CHI TIẾT: addressSlice.ts

## 🎯 Mục đích của file

File này quản lý **state địa chỉ giao hàng** trong Redux store, bao gồm:

- Lấy dữ liệu tỉnh/thành phố từ API
- Quản lý địa chỉ được chọn
- Xử lý đồng bộ địa chỉ giữa các tab

---

## 📦 IMPORT DEPENDENCIES (Dòng 1-3)

```typescript
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
```

- **`createSlice`**: Tạo Redux slice (bao gồm reducer + actions)
- **`createAsyncThunk`**: Xử lý async operations (gọi API)
- **`PayloadAction`**: Type cho action có payload

```typescript
import { createSelector } from "reselect";
```

- **`createSelector`**: Tạo memoized selectors (tối ưu performance, tránh re-render không cần thiết)

```typescript
import axios from "axios";
```

- **`axios`**: Thư viện HTTP client để gọi API

---

## 🏗️ ĐỊNH NGHĨA TYPES (Dòng 5-38)

### 1. Interface City (Dòng 5-9)

```typescript
export interface City {
  code: number; // Mã tỉnh/thành phố (VD: 01 = Hà Nội)
  name: string; // Tên tỉnh/thành phố (VD: "Hà Nội")
  districts: District[]; // Danh sách quận/huyện thuộc tỉnh này
}
```

**Mục đích**: Định nghĩa cấu trúc dữ liệu cho Tỉnh/Thành phố

### 2. Interface District (Dòng 17-21)

```typescript
export interface District {
  code: number; // Mã quận/huyện
  name: string; // Tên quận/huyện (VD: "Hoàng Mai")
  wards: Ward[]; // Danh sách phường/xã
}
```

### 3. Interface Ward (Dòng 23-26)

```typescript
export interface Ward {
  code: number; // Mã phường/xã
  name: string; // Tên phường/xã (VD: "Phường Minh Khai")
}
```

### 4. Interface AddressState (Dòng 28-38)

```typescript
export interface AddressState {
  addressData: City[]; // 📊 Toàn bộ dữ liệu địa chỉ VN (từ API)
  status: "idle" | "pending" | "succeeded" | "failed"; // 🔄 Trạng thái fetch API
  error: string | null; // ❌ Lỗi nếu có
  selectedAddress: string; // ✅ Địa chỉ hiển thị (VD: "P. Minh Khai, Q. Hoàng Mai, Hà Nội")
  selectedCity: string; // Mã tỉnh đã chọn
  selectedDistrict: string; // Mã quận đã chọn
  selectedWard: string; // Mã phường đã chọn
  locationType: "default" | "custom"; // Loại địa chỉ: mặc định hay tùy chỉnh
  showLocationModal: boolean; // Hiển thị modal chọn địa chỉ hay không
}
```

---

## 🔧 INITIAL STATE (Dòng 40-50)

```typescript
const initialState: AddressState = {
  addressData: [], // Chưa có dữ liệu, sẽ fetch từ API
  status: "idle", // Chưa bắt đầu fetch
  error: null, // Chưa có lỗi
  showLocationModal: false, // Modal đóng

  selectedAddress: "P. Minh Khai, Q. Hoàng Mai, Hà Nội", // Địa chỉ mặc định
  selectedCity: "", // Chưa chọn tỉnh
  selectedDistrict: "", // Chưa chọn quận
  selectedWard: "", // Chưa chọn phường
  locationType: "default", // Dùng địa chỉ mặc định
};
```

**Lưu ý**: Thứ tự các field được sắp xếp lại để nhóm các field liên quan:

- Nhóm 1: Dữ liệu API (addressData, status, error, showLocationModal)
- Nhóm 2: User selection (selectedAddress, selectedCity, selectedDistrict, selectedWard, locationType)

---

## 🌐 ASYNC THUNK - FETCH ADDRESS DATA (Dòng 52-65)

```typescript
export const fetchAddressData = createAsyncThunk<
  City[],
  void,
  { rejectValue: string }
>(
  "address/fetchAddressData", // Action type name
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get<City[]>(
        "https://provinces.open-api.vn/api/?depth=3"
      );
      return response.data; // Trả về danh sách City[]
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Đã xảy ra lỗi";
      return rejectWithValue(errorMessage); // Trả về error message
    }
  }
);
```

### Giải thích chi tiết:

**1. Generic Types:**

```typescript
createAsyncThunk<City[], void, { rejectValue: string }>;
```

- `City[]`: Kiểu dữ liệu trả về khi thành công
- `void`: Không cần tham số đầu vào
- `{ rejectValue: string }`: Kiểu dữ liệu lỗi

**2. API Call:**

```typescript
axios.get<City[]>("https://provinces.open-api.vn/api/?depth=3");
```

- `?depth=3`: Lấy đầy đủ 3 cấp (Tỉnh → Quận → Phường)

**3. Error Handling:**

```typescript
error instanceof Error ? error.message : "Đã xảy ra lỗi";
```

- Kiểm tra xem error có phải Error object không
- Nếu có → lấy message
- Nếu không → dùng message mặc định

---

## 🔨 REDUX SLICE (Dòng 67-122)

```typescript
const addressSlice = createSlice({
  name: "address", // Tên slice (dùng trong action types)
  initialState, // State ban đầu
  reducers: {
    // Synchronous actions
    // ... (xem bên dưới)
  },
  extraReducers: (builder) => {
    // Async actions (từ createAsyncThunk)
    // ... (xem bên dưới)
  },
});
```

---

## 📝 REDUCERS - SYNCHRONOUS ACTIONS (Dòng 70-104)

### 1. setLocationType (Dòng 71-73)

```typescript
setLocationType: (state, action: PayloadAction<"default" | "custom">) => {
  state.locationType = action.payload;
};
```

**Mục đích**: Chuyển đổi giữa địa chỉ mặc định và tùy chỉnh

**Cách dùng**:

```typescript
dispatch(setLocationType("custom")); // Chọn địa chỉ tùy chỉnh
```

---

### 2. setSelectedCity (Dòng 74-78)

```typescript
setSelectedCity: (state, action: PayloadAction<string>) => {
  state.selectedCity = action.payload;
  state.selectedDistrict = ""; // ⚠️ Reset quận
  state.selectedWard = ""; // ⚠️ Reset phường
};
```

**Mục đích**: Chọn tỉnh/thành phố

**Tại sao reset District và Ward?**

- Khi đổi tỉnh → danh sách quận/phường cũ không còn hợp lệ
- Phải chọn lại từ đầu

---

### 3. setSelectedDistrict (Dòng 79-82)

```typescript
setSelectedDistrict: (state, action: PayloadAction<string>) => {
  state.selectedDistrict = action.payload;
  state.selectedWard = ""; // ⚠️ Reset phường
};
```

**Mục đích**: Chọn quận/huyện

**Tại sao reset Ward?**

- Khi đổi quận → danh sách phường cũ không còn hợp lệ

---

### 4. setSelectedWard (Dòng 83-85)

```typescript
setSelectedWard: (state, action: PayloadAction<string>) => {
  state.selectedWard = action.payload;
};
```

**Mục đích**: Chọn phường/xã (cấp cuối cùng, không cần reset gì)

---

### 5. setSelectedAddress (Dòng 86-89)

```typescript
setSelectedAddress: (state, action: PayloadAction<string>) => {
  console.log(" Setting address:", action.payload);
  state.selectedAddress = action.payload;
};
```

**Mục đích**: Cập nhật địa chỉ hiển thị (chuỗi đầy đủ)

**Ví dụ**:

```typescript
dispatch(setSelectedAddress("P. Minh Khai, Q. Hoàng Mai, Hà Nội"));
```

---

### 6. setShowLocationModal (Dòng 90-92)

```typescript
setShowLocationModal: (state, action: PayloadAction<boolean>) => {
  state.showLocationModal = action.payload;
};
```

**Mục đích**: Mở/đóng modal chọn địa chỉ

---

### 7. resetSelection (Dòng 93-98)

```typescript
resetSelection: (state) => {
  state.locationType = "default";
  state.selectedCity = "";
  state.selectedDistrict = "";
  state.selectedWard = "";
};
```

**Mục đích**: Reset về trạng thái ban đầu (khi mở modal mới)

---

### 8. syncAddress (Dòng 99-103) ⭐ QUAN TRỌNG

```typescript
syncAddress: (state, action: PayloadAction<{ selectedAddress: string }>) => {
  if (action.payload && action.payload.selectedAddress) {
    state.selectedAddress = action.payload.selectedAddress;
  }
};
```

**Mục đích**: Đồng bộ địa chỉ từ tab khác (cross-tab sync)

**Khi nào được gọi?**

- Khi user thay đổi địa chỉ ở tab A
- Tab B nhận được storage event
- `syncTabs.ts` dispatch action này để cập nhật tab B

---

## ⚡ EXTRA REDUCERS - ASYNC ACTIONS (Dòng 105-121)

```typescript
extraReducers: (builder) => {
  builder
    .addCase(fetchAddressData.pending, (state) => {
      state.status = "pending"; // Đang fetch
      state.error = null; // Xóa lỗi cũ
    })
    .addCase(fetchAddressData.fulfilled, (state, action) => {
      state.status = "succeeded"; // Fetch thành công
      state.addressData = action.payload; // Lưu dữ liệu
      state.error = null; // Xóa lỗi
    })
    .addCase(fetchAddressData.rejected, (state, action) => {
      state.status = "failed"; // Fetch thất bại
      state.error = action.payload || "Đã xảy ra lỗi"; // Lưu lỗi
      state.addressData = []; // Xóa dữ liệu cũ
    });
};
```

**3 trạng thái của async thunk:**

1. **pending**: Đang gọi API
2. **fulfilled**: API trả về thành công
3. **rejected**: API bị lỗi

---

## 🎣 SELECTORS - LẤY DỮ LIỆU TỪ STATE (Dòng 125-133)

### Basic Selectors

```typescript
export const selectAddressData = (state: { address: AddressState }) =>
  state.address.addressData;
export const selectAddressStatus = (state: { address: AddressState }) =>
  state.address.status;
export const selectAddressError = (state: { address: AddressState }) =>
  state.address.error;
export const selectSelectedAddress = (state: { address: AddressState }) =>
  state.address.selectedAddress;
export const selectLocationType = (state: { address: AddressState }) =>
  state.address.locationType;
export const selectSelectedCity = (state: { address: AddressState }) =>
  state.address.selectedCity;
export const selectSelectedDistrict = (state: { address: AddressState }) =>
  state.address.selectedDistrict;
export const selectSelectedWard = (state: { address: AddressState }) =>
  state.address.selectedWard;
export const selectShowLocationModal = (state: { address: AddressState }) =>
  state.address.showLocationModal;
```

**Cách dùng trong component**:

```typescript
const selectedAddress = useAppSelector(selectSelectedAddress);
```

---

## 🚀 MEMOIZED SELECTORS (Dòng 136-161) ⭐ QUAN TRỌNG

### 1. EMPTY_ARRAY Constant (Dòng 136)

```typescript
const EMPTY_ARRAY: never[] = [];
```

**Mục đích**: Tránh tạo array mới mỗi lần render

- Nếu dùng `return []` → mỗi lần tạo array mới → component re-render
- Dùng constant → cùng 1 reference → không re-render

---

### 2. selectDistrictsByCity (Dòng 138-146)

```typescript
export const selectDistrictsByCity = createSelector(
  [selectAddressData, selectSelectedCity], // Input selectors
  (addressData, selectedCity) => {
    // Output function
    if (!selectedCity) return EMPTY_ARRAY; // Chưa chọn tỉnh

    const city = addressData.find((c) => c.code === Number(selectedCity));
    return city?.districts || EMPTY_ARRAY; // Trả về danh sách quận
  }
);
```

**Cách hoạt động**:

1. Lấy `addressData` và `selectedCity` từ state
2. Tìm city có code = selectedCity
3. Trả về danh sách districts của city đó

**Lợi ích của createSelector**:

- ✅ **Memoization**: Chỉ tính toán lại khi input thay đổi
- ✅ **Performance**: Tránh re-render không cần thiết
- ✅ **Reusable**: Dùng lại ở nhiều component

---

### 3. selectWardsByDistrict (Dòng 148-161)

```typescript
export const selectWardsByDistrict = createSelector(
  [selectAddressData, selectSelectedCity, selectSelectedDistrict], // 3 inputs
  (addressData, selectedCity, selectedDistrict) => {
    if (!selectedCity || !selectedDistrict) return EMPTY_ARRAY; // Chưa chọn đủ

    const city = addressData.find((c) => c.code === Number(selectedCity));
    if (!city?.districts) return EMPTY_ARRAY;

    const district = city.districts.find(
      (d) => d.code === Number(selectedDistrict)
    );
    return district?.wards || EMPTY_ARRAY; // Trả về danh sách phường
  }
);
```

**Cách hoạt động**:

1. Lấy `addressData`, `selectedCity`, `selectedDistrict`
2. Tìm city → tìm district
3. Trả về danh sách wards

---

## 📤 EXPORT ACTIONS (Dòng 163-172)

```typescript
export const {
  setLocationType,
  setSelectedCity,
  setSelectedDistrict,
  setSelectedWard,
  setSelectedAddress,
  setShowLocationModal,
  resetSelection,
  syncAddress,
} = addressSlice.actions;
```

**Cách dùng**:

```typescript
import { setSelectedCity } from "./addressSlice";
dispatch(setSelectedCity("01"));
```

---

## 📤 EXPORT REDUCER (Dòng 174)

```typescript
export default addressSlice.reducer;
```

**Được dùng trong `store.ts`**:

```typescript
import addressReducer from "./addressSlice";

const rootReducer = combineReducers({
  address: addressReducer,
  // ...
});
```

---

## 🎯 TÓM TẮT FLOW

### 1. Khi component mount:

```
Component → dispatch(fetchAddressData())
         → API call
         → addressData được lưu vào state
```

### 2. Khi user chọn địa chỉ:

```
User chọn tỉnh → dispatch(setSelectedCity("01"))
              → selectedCity = "01"
              → selectedDistrict = "" (reset)
              → selectedWard = "" (reset)

User chọn quận → dispatch(setSelectedDistrict("001"))
              → selectedDistrict = "001"
              → selectedWard = "" (reset)

User chọn phường → dispatch(setSelectedWard("00001"))
                → selectedWard = "00001"

User click "Giao đến địa chỉ này"
  → Tạo chuỗi địa chỉ: "P. Minh Khai, Q. Hoàng Mai, Hà Nội"
  → dispatch(setSelectedAddress(newAddr))
  → Lưu vào localStorage (redux-persist)
```

### 3. Khi đồng bộ giữa các tab:

```
Tab A: User thay đổi địa chỉ
    → Redux-persist lưu vào localStorage
    → localStorage trigger "storage" event

Tab B: Nhận storage event
    → syncTabs.ts dispatch(syncAddress({ selectedAddress: "..." }))
    → Tab B cập nhật địa chỉ mới
```

---

## 💡 LƯU Ý QUAN TRỌNG

1. **addressData rất lớn** (~500KB) → Không lưu vào localStorage (dùng createTransform trong store.ts)
2. **Memoized selectors** → Tối ưu performance
3. **Reset cascade** → Chọn tỉnh mới → reset quận/phường
4. **Cross-tab sync** → Dùng syncAddress action

---

## 🔗 LIÊN KẾT VỚI CÁC FILE KHÁC

- **store.ts**: Cấu hình redux-persist, createTransform
- **AddressSelector.tsx**: Sử dụng selectors và actions
- **syncTabs.ts**: Dispatch syncAddress để đồng bộ
