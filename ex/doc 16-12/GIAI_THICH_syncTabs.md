# 📘 GIẢI THÍCH CHI TIẾT: syncTabs.ts

## 🎯 Mục đích của file

File này xử lý **đồng bộ Redux state giữa các browser tabs** (cross-tab synchronization).

**Tình huống**:

- User mở 2 tabs: Tab A và Tab B
- Tab A: User thay đổi địa chỉ giao hàng
- Tab B: Tự động cập nhật địa chỉ mới **mà không cần reload**

---

## 📦 IMPORT TYPES (Dòng 1-4)

```typescript
import type { AppStore } from "../store/store";
import type { CartState } from "../store/cartSlice";
import type { CheckoutState } from "../store/checkoutSlice";
import type { AddressState } from "../store/addressSlice";
```

**Giải thích**:

- `import type`: Chỉ import types (không import runtime code)
- **AppStore**: Type của Redux store
- **CartState, CheckoutState, AddressState**: Types của các slices

---

## 🏗️ INTERFACE DEFINITIONS (Dòng 6-20)

### 1. PersistedState Interface (Dòng 6-14)

```typescript
interface PersistedState {
  cart?: string; // JSON string của CartState
  checkout?: string; // JSON string của CheckoutState
  address?: string; // JSON string của AddressState
  // _persist?: {
  //     version: number;
  //     rehydrated: boolean;
  // };
}
```

**Mục đích**: Định nghĩa cấu trúc dữ liệu trong localStorage

**Tại sao là string?**

- localStorage chỉ lưu được string
- Redux-persist tự động JSON.stringify khi lưu
- Chúng ta phải JSON.parse khi đọc

**Ví dụ dữ liệu thực tế trong localStorage**:

```json
{
  "cart": "{\"items\":[],\"totalQuantity\":0}",
  "checkout": "{\"history\":[]}",
  "address": "{\"selectedAddress\":\"P. Minh Khai, Q. Hoàng Mai, Hà Nội\",\"selectedCity\":\"01\",...}"
}
```

**`_persist` (commented out)**:

- Metadata của redux-persist
- Không cần thiết cho cross-tab sync
- Đã comment để đơn giản hóa

---

### 2. StorageEventData Interface (Dòng 16-20)

```typescript
interface StorageEventData {
  key: string | null; // Key của localStorage item bị thay đổi
  newValue: string | null; // Giá trị mới
  // oldValue: string | null; // Giá trị cũ (không dùng)
}
```

**Mục đích**: Type cho storage event

**Storage Event là gì?**

- Browser tự động trigger event khi localStorage thay đổi
- **Chỉ trigger ở các tabs KHÁC**, không trigger ở tab hiện tại
- Event chứa: key, newValue, oldValue, url

**Tại sao comment oldValue?**

- Không cần so sánh giá trị cũ
- Chỉ cần giá trị mới để đồng bộ

---

## 🔧 MAIN FUNCTION: setupCrossTabSync (Dòng 22-83)

### Function Signature (Dòng 22)

```typescript
export const setupCrossTabSync = (store: AppStore): (() => void) => {
```

**Giải thích**:

- **Input**: `store: AppStore` - Redux store instance
- **Output**: `() => void` - Cleanup function (để remove event listener)

**Cách dùng**:

```typescript
// store.ts
const cleanup = setupCrossTabSync(store);

// Khi unmount (nếu cần):
cleanup();
```

---

### handleStorageChange Function (Dòng 24-76)

Đây là **trái tim** của cross-tab sync!

---

#### Bước 1: Lấy dữ liệu từ event (Dòng 24-29)

```typescript
const handleStorageChange = (event: StorageEvent): void => {
    const { key, newValue } = event as StorageEventData;

    if (key !== "persist:root" || !newValue) {
        return;
    }
```

**Giải thích từng dòng**:

**Dòng 25**: Destructure event

```typescript
const { key, newValue } = event as StorageEventData;
```

- `key`: Key của localStorage item (VD: "persist:root")
- `newValue`: Giá trị mới (JSON string)

**Dòng 27-29**: Early return nếu không phải persist:root

```typescript
if (key !== "persist:root" || !newValue) {
  return;
}
```

- **Chỉ quan tâm đến "persist:root"** (key của redux-persist)
- Nếu `newValue` null → item bị xóa → không cần sync

---

#### Bước 2: Parse persisted state (Dòng 31-32)

```typescript
try {
    const persistedState: PersistedState = JSON.parse(newValue);
```

**Giải thích**:

- `newValue` là JSON string
- Parse thành object với cấu trúc `PersistedState`

**Ví dụ**:

```typescript
// newValue (string):
'{"cart":"{\\"items\\":[],\\"totalQuantity\\":0}","address":"{\\"selectedAddress\\":\\"...\\"}"}'

// persistedState (object):
{
  cart: '{"items":[],"totalQuantity":0}',
  address: '{"selectedAddress":"..."}'
}
```

---

#### Bước 3: Sync Cart State (Dòng 34-45)

```typescript
// Sync cart state
if (persistedState.cart) {
  try {
    const cartState: CartState = JSON.parse(persistedState.cart);
    store.dispatch({
      type: "cart/syncCart",
      payload: cartState,
    });
  } catch (cartError) {
    console.error("Error syncing cart state:", cartError);
  }
}
```

**Giải thích từng bước**:

**1. Kiểm tra cart có tồn tại không** (Dòng 35)

```typescript
if (persistedState.cart) {
```

**2. Parse cart state** (Dòng 37)

```typescript
const cartState: CartState = JSON.parse(persistedState.cart);
```

- `persistedState.cart` là string
- Parse thành `CartState` object

**3. Dispatch action để cập nhật Redux store** (Dòng 38-41)

```typescript
store.dispatch({
  type: "cart/syncCart",
  payload: cartState,
});
```

- **type**: `"cart/syncCart"` - Action type (phải match với reducer)
- **payload**: Toàn bộ cart state mới

**4. Error handling** (Dòng 42-44)

```typescript
catch (cartError) {
    console.error("Error syncing cart state:", cartError);
}
```

- Nếu parse lỗi → log error
- Không crash app

---

#### Bước 4: Sync Checkout State (Dòng 47-58)

```typescript
// Sync checkout state
if (persistedState.checkout) {
  try {
    const checkoutState: CheckoutState = JSON.parse(persistedState.checkout);
    store.dispatch({
      type: "checkout/syncCheckout",
      payload: checkoutState,
    });
  } catch (checkoutError) {
    console.error("Error syncing checkout state:", checkoutError);
  }
}
```

**Tương tự cart**, nhưng:

- Action type: `"checkout/syncCheckout"`
- Payload: `CheckoutState`

---

#### Bước 5: Sync Address State (Dòng 60-71) ⭐ QUAN TRỌNG

```typescript
// Sync address state
if (persistedState.address) {
  try {
    const addressState: AddressState = JSON.parse(persistedState.address);
    store.dispatch({
      type: "address/syncAddress",
      payload: { selectedAddress: addressState.selectedAddress },
    });
  } catch (addressError) {
    console.error("Error syncing address state:", addressError);
  }
}
```

**Điểm khác biệt**:

**Payload chỉ chứa `selectedAddress`**:

```typescript
payload: {
  selectedAddress: addressState.selectedAddress;
}
```

**Tại sao không sync toàn bộ addressState?**

- `addressData` rất lớn (~500KB)
- Mỗi tab tự fetch `addressData` từ API
- **Chỉ cần sync user selection** (selectedAddress)

**Reducer trong addressSlice.ts**:

```typescript
syncAddress: (state, action: PayloadAction<{ selectedAddress: string }>) => {
  if (action.payload && action.payload.selectedAddress) {
    state.selectedAddress = action.payload.selectedAddress;
  }
};
```

---

#### Bước 6: Error Handling (Dòng 73-75)

```typescript
} catch (parseError) {
    console.error("Error parsing persisted state:", parseError);
}
```

**Mục đích**: Catch lỗi khi parse `newValue`

- Nếu localStorage bị corrupt
- Nếu format không đúng

---

### Register Event Listener (Dòng 78)

```typescript
window.addEventListener("storage", handleStorageChange);
```

**Giải thích**:

- Đăng ký listener cho "storage" event
- Mỗi khi localStorage thay đổi → `handleStorageChange` được gọi

**Lưu ý**: Event chỉ trigger ở **tabs khác**, không trigger ở tab hiện tại

---

### Return Cleanup Function (Dòng 80-82)

```typescript
return (): void => {
  window.removeEventListener("storage", handleStorageChange);
};
```

**Mục đích**: Remove event listener khi không cần nữa

**Cách dùng**:

```typescript
const cleanup = setupCrossTabSync(store);

// Khi app unmount (hiếm khi cần):
cleanup();
```

---

## 🗑️ COMMENTED CODE (Dòng 86-152)

Các functions đã comment:

1. **triggerCrossTabSync** (Dòng 86-127): Manually trigger sync
2. **isCrossTabSyncSupported** (Dòng 130-141): Check browser support
3. **getCurrentPersistedState** (Dòng 144-152): Get current localStorage state

**Tại sao comment?**

- Không cần thiết cho flow hiện tại
- Có thể uncomment nếu cần trong tương lai
- Giữ lại để tham khảo

---

## 🎯 FLOW HOÀN CHỈNH

### Scenario: User mở 2 tabs

| **Tab A (Active)**                                              | **Tab B (Inactive)** |
| --------------------------------------------------------------- | -------------------- |
| 1. User chọn địa chỉ mới                                        |
| 2. `dispatch(setSelectedAddress("..."))`                        |
| 3. Reducer cập nhật Redux state                                 |
| 4. Redux-persist lưu vào localStorage                           |
| 5. localStorage["persist:root"] thay đổi                        |
| 6. Browser trigger "storage" event                              |
| 7. `handleStorageChange` được gọi                               |
| 8. Parse `newValue` → `persistedState`                          |
| 9. Parse `persistedState.address` → `addressState`              |
| 10. `dispatch({ type: "address/syncAddress", payload: {...} })` |
| 11. Reducer cập nhật Redux state                                |
| 12. Component re-render với địa chỉ mới ✅                      |

---

## 📊 DIAGRAM

```
┌─────────────────────────────────────────────────────────────┐
│                         TAB A                               │
├─────────────────────────────────────────────────────────────┤
│  User Action                                                │
│      ↓                                                       │
│  dispatch(setSelectedAddress("..."))                        │
│      ↓                                                       │
│  Redux Store Updated                                        │
│      ↓                                                       │
│  Redux-Persist saves to localStorage                        │
│      ↓                                                       │
│  localStorage["persist:root"] = "..."                       │
└─────────────────────────────────────────────────────────────┘
                           ↓
                    Storage Event
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                         TAB B                               │
├─────────────────────────────────────────────────────────────┤
│  window.addEventListener("storage", handleStorageChange)    │
│      ↓                                                       │
│  handleStorageChange(event)                                 │
│      ↓                                                       │
│  Parse event.newValue → persistedState                      │
│      ↓                                                       │
│  Parse persistedState.address → addressState                │
│      ↓                                                       │
│  dispatch({ type: "address/syncAddress", payload: {...} })  │
│      ↓                                                       │
│  Redux Store Updated                                        │
│      ↓                                                       │
│  Component Re-renders ✅                                     │
└─────────────────────────────────────────────────────────────┘
```

---

## 💡 LƯU Ý QUAN TRỌNG

### 1. Storage Event chỉ trigger ở tabs khác

```typescript
// Tab A: Thay đổi localStorage
localStorage.setItem("key", "value");
// → Storage event KHÔNG trigger ở Tab A
// → Storage event CHỈ trigger ở Tab B, Tab C, etc.
```

### 2. Tại sao cần try-catch cho từng slice?

```typescript
// Sync cart state
if (persistedState.cart) {
  try {
    // ...
  } catch (cartError) {
    console.error("Error syncing cart state:", cartError);
  }
}
```

- Nếu cart parse lỗi → không ảnh hưởng đến checkout và address
- Mỗi slice độc lập

### 3. Tại sao address chỉ sync selectedAddress?

```typescript
payload: {
  selectedAddress: addressState.selectedAddress;
}
```

- `addressData` quá lớn (~500KB)
- Mỗi tab tự fetch từ API
- Chỉ sync user selection

### 4. Performance considerations

- **Throttle trong store.ts**: Tránh lưu quá nhiều lần
- **Selective sync**: Chỉ sync những gì cần thiết
- **Error isolation**: Lỗi ở 1 slice không ảnh hưởng slice khác

---

## 🔗 LIÊN KẾT VỚI CÁC FILE KHÁC

### 1. store.ts

```typescript
import { setupCrossTabSync } from "../utils/syncTabs";

const store = configureStore({ ... });
setupCrossTabSync(store);  // ← Gọi ở đây
```

### 2. addressSlice.ts

```typescript
reducers: {
  syncAddress: (state, action: PayloadAction<{ selectedAddress: string }>) => {
    if (action.payload && action.payload.selectedAddress) {
      state.selectedAddress = action.payload.selectedAddress;
    }
  };
}
```

### 3. cartSlice.ts (tương tự)

```typescript
reducers: {
  syncCart: (state, action: PayloadAction<CartState>) => {
    return action.payload; // Replace toàn bộ cart state
  };
}
```

### 4. checkoutSlice.ts (tương tự)

```typescript
reducers: {
  syncCheckout: (state, action: PayloadAction<CheckoutState>) => {
    return action.payload; // Replace toàn bộ checkout state
  };
}
```

---

## 🧪 TESTING

### Cách test cross-tab sync:

1. **Mở 2 tabs**: `http://localhost:3000`
2. **Tab A**: Thay đổi địa chỉ giao hàng
3. **Tab B**: Kiểm tra địa chỉ có tự động cập nhật không
4. **Console**: Kiểm tra không có error

### Expected behavior:

- ✅ Tab B cập nhật ngay lập tức
- ✅ Không cần reload trang
- ✅ Không có error trong console

---

## 🎓 KẾT LUẬN

**syncTabs.ts** là một utility nhỏ nhưng rất quan trọng:

- ✅ Đồng bộ state giữa các tabs
- ✅ Trải nghiệm người dùng tốt hơn
- ✅ Code đơn giản, dễ maintain
- ✅ Error handling tốt
- ✅ Performance tối ưu

**Key takeaways**:

1. Storage event chỉ trigger ở tabs khác
2. Mỗi slice có error handling riêng
3. Chỉ sync những gì cần thiết (selectedAddress, không sync addressData)
4. Cleanup function để remove event listener
