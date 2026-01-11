# 📘 GIẢI THÍCH CHI TIẾT: store.ts

## 🎯 Mục đích của file

File này là **trung tâm cấu hình Redux store**, bao gồm:

- Kết hợp các reducers (cart, checkout, address)
- Cấu hình **redux-persist** để lưu state vào localStorage
- Tối ưu hóa localStorage với **createTransform**
- Thiết lập **cross-tab synchronization**

---

## 📦 IMPORT DEPENDENCIES (Dòng 1-19)

### 1. Redux Toolkit (Dòng 1)

```typescript
import { configureStore, combineReducers } from "@reduxjs/toolkit";
```

- **`configureStore`**: Tạo Redux store với cấu hình tốt nhất (DevTools, middleware, etc.)
- **`combineReducers`**: Kết hợp nhiều reducers thành 1 root reducer

---

### 2. Redux Persist (Dòng 2-13)

```typescript
import {
  persistStore, // Tạo persistor để quản lý persistence
  persistReducer, // Wrap reducer để tự động lưu/load state
  createTransform, // Tùy chỉnh cách lưu/load state
  FLUSH, // Action types của redux-persist
  REHYDRATE, // (dùng để ignore trong middleware)
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  PersistConfig, // Type cho persist config
} from "redux-persist";
```

**Các action types của redux-persist**:

- **REHYDRATE**: Khi state được load từ localStorage
- **PERSIST**: Khi state được lưu vào localStorage
- **FLUSH**: Xóa tất cả pending persist operations
- **PAUSE**: Tạm dừng persistence
- **PURGE**: Xóa toàn bộ persisted state
- **REGISTER**: Đăng ký reducer với persistor

---

### 3. Storage Engine (Dòng 14)

```typescript
import storage from "redux-persist/lib/storage";
```

- **`storage`**: localStorage engine (mặc định)
- Có thể thay bằng `sessionStorage` hoặc custom storage

---

### 4. Cross-Tab Sync (Dòng 15)

```typescript
import { setupCrossTabSync } from "../utils/syncTabs";
```

- Function để đồng bộ state giữa các browser tabs

---

### 5. Reducers và Types (Dòng 17-19)

```typescript
import cartReducer, { CartState } from "./cartSlice";
import checkoutReducer, { CheckoutState } from "./checkoutSlice";
import addressReducer, { AddressState } from "./addressSlice";
```

- Import các reducers và state types từ các slice

---

## 🏗️ ROOT STATE TYPE (Dòng 21-25)

```typescript
export interface RootState {
  cart: CartState;
  checkout: CheckoutState;
  address: AddressState;
}
```

**Mục đích**: Định nghĩa type cho toàn bộ Redux state

**Cách dùng**:

```typescript
const selectedAddress = useAppSelector(
  (state: RootState) => state.address.selectedAddress
);
```

---

## 🔧 CREATE TRANSFORM - TỐI ƯU LOCALSTORAGE (Dòng 27-53) ⭐ QUAN TRỌNG

### Tại sao cần createTransform?

**Vấn đề**: `addressData` chứa toàn bộ dữ liệu tỉnh/thành phố VN (~500KB)

- Lưu vào localStorage → lãng phí dung lượng
- Load chậm khi khởi động app
- Dữ liệu có thể cũ (nên fetch mới từ API)

**Giải pháp**: Chỉ lưu những gì cần thiết, loại bỏ dữ liệu lớn

---

### Cấu trúc createTransform

```typescript
const addressTransform = createTransform(
  // Hàm 1: SAVE (inbound) - Chạy khi LƯU vào localStorage
  (inboundState: AddressState) => { ... },

  // Hàm 2: LOAD (outbound) - Chạy khi TẢI từ localStorage
  (outboundState: Partial<AddressState>): AddressState => { ... },

  // Config: Chỉ áp dụng cho slice "address"
  { whitelist: ["address"] }
);
```

---

### Hàm 1: SAVE - Loại bỏ dữ liệu không cần thiết (Dòng 28-34)

```typescript
// SAVE: Loại bỏ các field không cần thiết
(inboundState: AddressState) => {
  const { addressData, status, error, showLocationModal, ...rest } =
    inboundState;

  // console.log("Saving address to localStorage:", rest);
  return rest;
};
```

**Giải thích từng bước**:

1. **Destructuring để loại bỏ fields**:

```typescript
const { addressData, status, error, showLocationModal, ...rest } = inboundState;
```

- `addressData` ❌ Loại bỏ (dữ liệu lớn, sẽ fetch lại)
- `status` ❌ Loại bỏ (UI state, không cần lưu)
- `error` ❌ Loại bỏ (lỗi cũ, không cần lưu)
- `showLocationModal` ❌ Loại bỏ (UI state, modal luôn đóng khi reload)
- `...rest` ✅ Giữ lại (selectedAddress, selectedCity, selectedDistrict, selectedWard, locationType)

2. **Kết quả lưu vào localStorage**:

```json
{
  "selectedAddress": "P. Minh Khai, Q. Hoàng Mai, Hà Nội",
  "selectedCity": "01",
  "selectedDistrict": "001",
  "selectedWard": "00001",
  "locationType": "custom"
}
```

✅ **Chỉ ~200 bytes thay vì ~500KB!**

---

### Hàm 2: LOAD - Khôi phục giá trị mặc định (Dòng 36-50)

```typescript
//LOAD: Khôi phục giá trị mặc định cho các field đã loại bỏ
(outboundState: Partial<AddressState>): AddressState => {
  const result = {
    ...outboundState, // Spread các field đã lưu (selectedAddress, selectedCity, etc.)

    // Khôi phục giá trị mặc định
    addressData: [], // Sẽ fetch lại từ API
    status: "idle" as const, // Reset về trạng thái ban đầu
    error: null, // Không có lỗi
    showLocationModal: false, // Modal đóng
  } as AddressState;

  // console.log("Loading address from localStorage:", result);
  return result;
};
```

**Giải thích từng bước**:

1. **`...outboundState`**: Lấy dữ liệu từ localStorage

```typescript
{
  selectedAddress: "P. Minh Khai, Q. Hoàng Mai, Hà Nội",
  selectedCity: "01",
  selectedDistrict: "001",
  selectedWard: "00001",
  locationType: "custom"
}
```

2. **Thêm các field bị loại bỏ với giá trị mặc định**:

```typescript
addressData: [],           // Sẽ fetch lại khi component mount
status: "idle" as const,   // Trigger fetchAddressData
error: null,
showLocationModal: false,
```

3. **Kết quả cuối cùng**:

```typescript
{
  // Từ localStorage:
  selectedAddress: "P. Minh Khai, Q. Hoàng Mai, Hà Nội",
  selectedCity: "01",
  selectedDistrict: "001",
  selectedWard: "00001",
  locationType: "custom",

  // Giá trị mặc định:
  addressData: [],
  status: "idle",
  error: null,
  showLocationModal: false
}
```

---

### Config: Whitelist (Dòng 52)

```typescript
{
  whitelist: ["address"];
}
```

- **Chỉ áp dụng transform này cho slice "address"**
- Không ảnh hưởng đến `cart` và `checkout` slices

---

## 🔗 COMBINE REDUCERS (Dòng 55-60)

```typescript
const rootReducer = combineReducers({
  cart: cartReducer,
  checkout: checkoutReducer,
  address: addressReducer,
});
```

**Kết quả**: Root state có cấu trúc:

```typescript
{
  cart: { items: [...], totalQuantity: 0 },
  checkout: { history: [...] },
  address: { selectedAddress: "...", ... }
}
```

---

## ⚙️ PERSIST CONFIG (Dòng 62-69)

```typescript
const persistConfig: any = {
  key: "root", // Key trong localStorage
  storage, // localStorage engine
  whitelist: ["cart", "address", "checkout"], // Các slices cần persist
  transforms: [addressTransform], // Áp dụng transform
  throttle: 100, // Chờ 100ms trước khi lưu (debounce)
  // debug: true,                           // Bật debug logging
};
```

### Giải thích từng option:

**1. `key: "root"`**

- Tạo key `persist:root` trong localStorage
- Tất cả state được lưu dưới key này

**2. `storage`**

- Sử dụng localStorage (browser storage)
- Dữ liệu tồn tại vĩnh viễn (không mất khi đóng tab)

**3. `whitelist: ["cart", "address", "checkout"]`**

- **Chỉ lưu 3 slices này**
- Nếu có slice khác (VD: `user`), sẽ không được lưu

**4. `transforms: [addressTransform]`**

- Áp dụng transform để tối ưu `address` slice
- `cart` và `checkout` không bị ảnh hưởng

**5. `throttle: 100`**

- **Debounce**: Chờ 100ms sau action cuối cùng mới lưu
- Tránh lưu quá nhiều lần khi user thao tác nhanh
- VD: User chọn tỉnh → chọn quận → chọn phường (3 actions)
  - Không lưu: Chọn tỉnh → Lưu → Chọn quận → Lưu → Chọn phường → Lưu
  - Có throttle: Chờ 100ms → Lưu 1 lần duy nhất

---

## 🔄 PERSIST REDUCER (Dòng 71)

```typescript
const persistedReducer = persistReducer(persistConfig, rootReducer);
```

**Wrap rootReducer với persistReducer**:

- Tự động lưu state vào localStorage sau mỗi action
- Tự động load state từ localStorage khi app khởi động

---

## 🏪 CONFIGURE STORE (Dòng 73-91)

```typescript
const store = configureStore({
  reducer: persistedReducer, // Sử dụng persisted reducer
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // Redux-persist middleware configuration
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        warnAfter: 128,
      },
      immutableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        warnAfter: 128,
        ignoredPaths: ["address.addressData"],
      },
    }),
});
```

### Middleware Configuration

**1. serializableCheck (Dòng 78-82)**

```typescript
serializableCheck: {
  ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
  warnAfter: 128,
}
```

**Mục đích**: Kiểm tra xem action có chứa dữ liệu non-serializable không

- **Non-serializable**: Function, Promise, Date, etc.
- **Redux yêu cầu**: Tất cả action phải serializable (JSON.stringify được)

**Tại sao ignore redux-persist actions?**

- Redux-persist actions có thể chứa non-serializable data
- Đây là hành vi bình thường, không phải lỗi

**`warnAfter: 128`**:

- Nếu check mất > 128ms → warning
- Mặc định là 32ms (quá nhỏ, gây nhiều warning)

---

**2. immutableCheck (Dòng 83-89)**

```typescript
immutableCheck: {
  ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
  warnAfter: 128,
  ignoredPaths: ["address.addressData"],
}
```

**Mục đích**: Kiểm tra xem state có bị mutate trực tiếp không

- **Redux yêu cầu**: State phải immutable (không được sửa trực tiếp)
- **Redux Toolkit**: Dùng Immer để tự động tạo immutable updates

**`ignoredPaths: ["address.addressData"]`**:

- `addressData` rất lớn (~500KB)
- Check immutability mất nhiều thời gian
- Bỏ qua để tránh warning

---

## 🔄 SETUP CROSS-TAB SYNC (Dòng 93)

```typescript
setupCrossTabSync(store);
```

**Mục đích**: Đồng bộ state giữa các browser tabs

**Cách hoạt động**:

1. Tab A: User thay đổi state
2. Redux-persist lưu vào localStorage
3. localStorage trigger "storage" event
4. Tab B: Nhận event → dispatch action → cập nhật state

**Chi tiết**: Xem file `GIAI_THICH_syncTabs.md`

---

## 📤 EXPORT TYPES (Dòng 95-96)

```typescript
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
```

**Mục đích**: Type-safe dispatch và store

**Cách dùng**:

```typescript
// hooks.ts
export const useAppDispatch = () => useDispatch<AppDispatch>();

// Component
const dispatch = useAppDispatch();
dispatch(fetchAddressData()); // ✅ Type-safe
```

---

## 💾 CREATE PERSISTOR (Dòng 98)

```typescript
export const persistor = persistStore(store);
```

**Mục đích**: Tạo persistor để quản lý persistence

**Cách dùng trong App**:

```typescript
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import store, { persistor } from "./store/store";

<Provider store={store}>
  <PersistGate loading={null} persistor={persistor}>
    <App />
  </PersistGate>
</Provider>;
```

**`PersistGate`**:

- Chờ state được load từ localStorage
- Hiển thị `loading` component trong lúc chờ
- Chỉ render app khi state đã sẵn sàng

---

## 📤 EXPORT STORE (Dòng 100)

```typescript
export default store;
```

---

## 🎯 FLOW HOÀN CHỈNH

### 1. Khi App khởi động:

```
1. Store được tạo với persistedReducer
2. PersistGate chờ state load từ localStorage
3. Redux-persist đọc "persist:root" từ localStorage
4. addressTransform.outbound chạy:
   - Lấy selectedAddress, selectedCity, etc.
   - Thêm addressData: [], status: "idle", etc.
5. State được khôi phục vào Redux store
6. App render với state đã load
7. Component dispatch(fetchAddressData()) vì status = "idle"
8. API call → addressData được cập nhật
```

---

### 2. Khi User thay đổi địa chỉ:

```
1. User chọn địa chỉ mới
2. dispatch(setSelectedAddress("..."))
3. Reducer cập nhật state
4. Redux-persist phát hiện state thay đổi
5. Chờ 100ms (throttle)
6. addressTransform.inbound chạy:
   - Loại bỏ addressData, status, error, showLocationModal
   - Chỉ giữ selectedAddress, selectedCity, etc.
7. Lưu vào localStorage["persist:root"]
8. localStorage trigger "storage" event
9. Các tab khác nhận event → đồng bộ state
```

---

### 3. Khi Reload trang:

```
1. Store được tạo lại
2. Redux-persist load state từ localStorage
3. addressTransform.outbound khôi phục state
4. Component nhận state với:
   - selectedAddress: "..." (từ localStorage)
   - addressData: [] (mặc định)
   - status: "idle" (mặc định)
5. useEffect trigger fetchAddressData()
6. addressData được fetch lại từ API
```

---

## 💡 LƯU Ý QUAN TRỌNG

### 1. Tại sao cần createTransform?

- ✅ Tiết kiệm dung lượng localStorage (200 bytes vs 500KB)
- ✅ Load nhanh hơn khi khởi động
- ✅ Luôn có dữ liệu mới từ API
- ✅ Tránh lưu UI state không cần thiết

### 2. Tại sao cần throttle?

- ✅ Tránh lưu quá nhiều lần
- ✅ Tối ưu performance
- ✅ Giảm write operations vào localStorage

### 3. Tại sao ignore immutableCheck cho addressData?

- ✅ addressData rất lớn
- ✅ Check immutability mất nhiều thời gian
- ✅ Immer đã đảm bảo immutability

### 4. Tại sao cần cross-tab sync?

- ✅ User mở nhiều tab cùng lúc
- ✅ Thay đổi ở tab A → tab B cũng cập nhật
- ✅ Trải nghiệm người dùng tốt hơn

---

## 🔗 LIÊN KẾT VỚI CÁC FILE KHÁC

- **addressSlice.ts**: Định nghĩa AddressState và reducers
- **syncTabs.ts**: Xử lý cross-tab synchronization
- **App.tsx**: Wrap với Provider và PersistGate
- **hooks.ts**: useAppDispatch, useAppSelector với types
