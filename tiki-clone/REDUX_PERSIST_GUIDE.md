# 🛒 Hướng dẫn Redux Persist & Cross-Tab Sync

## 📋 Tổng quan

Dự án đã được tích hợp **Redux Persist** để lưu trữ giỏ hàng vào localStorage và đồng bộ dữ liệu giữa các tab/cửa sổ trình duyệt.

## ✨ Tính năng

### 1. **Lưu trữ tự động (Auto Persistence)**
- ✅ Tất cả thay đổi trong giỏ hàng tự động được lưu vào localStorage
- ✅ Dữ liệu được giữ nguyên khi reload trang
- ✅ Không cần viết code localStorage thủ công

### 2. **Đồng bộ giữa các Tab (Cross-Tab Sync)**
- ✅ Mở nhiều tab cùng lúc → thay đổi ở tab này sẽ tự động cập nhật tab kia
- ✅ Sử dụng Storage Event API để lắng nghe thay đổi
- ✅ Đồng bộ real-time khi thêm/xóa/cập nhật sản phẩm

### 3. **Cộng dồn số lượng thông minh**
- ✅ Thêm sản phẩm trùng → tự động cộng thêm số lượng
- ✅ Cập nhật từ trang chi tiết sản phẩm → cộng vào giỏ hàng
- ✅ Tăng/giảm số lượng trong giỏ hàng → cập nhật tổng số lượng

## 🏗️ Cấu trúc Code

### 1. **Store Configuration** (`src/store/store.js`)

```javascript
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["cart"], // Chỉ persist cart state
};

const persistedReducer = persistReducer(persistConfig, cartReducer);
export const persistor = persistStore(store);
```

**Giải thích:**
- `key: "root"` → localStorage key là `persist:root`
- `storage` → sử dụng localStorage (web)
- `whitelist: ["cart"]` → chỉ lưu cart, bỏ qua các state khác

### 2. **Cart Slice** (`src/store/cartSlice.js`)

```javascript
const cartSlice = createSlice({
  name: "cart",
  initialState: { items: [], totalQuantity: 0 },
  reducers: {
    addToCart: (state, action) => {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (existingItem) {
        // Cộng thêm số lượng nếu sản phẩm đã có
        existingItem.quantity += action.payload.quantity;
        state.totalQuantity += action.payload.quantity;
      } else {
        // Thêm mới nếu chưa có
        state.items.push(action.payload);
        state.totalQuantity += action.payload.quantity;
      }
      // Redux Persist tự động save
    },
    syncCart: (state, action) => {
      // Đồng bộ từ tab khác
      return action.payload;
    },
  },
});
```

### 3. **Cross-Tab Sync** (`src/utils/syncTabs.js`)

```javascript
export const setupCrossTabSync = (store, syncAction) => {
  const handleStorageChange = (event) => {
    if (event.key === "persist:root" && event.newValue) {
      const newState = JSON.parse(event.newValue);
      const cartState = JSON.parse(newState.cart);
      store.dispatch(syncAction(cartState));
    }
  };
  
  window.addEventListener("storage", handleStorageChange);
  return () => window.removeEventListener("storage", handleStorageChange);
};
```

**Cách hoạt động:**
1. Tab A thay đổi giỏ hàng → Redux Persist lưu vào localStorage
2. localStorage thay đổi → trigger `storage` event
3. Tab B nhận event → dispatch `syncCart` action → cập nhật UI

### 4. **App Entry** (`src/index.js`)

```javascript
import { PersistGate } from "redux-persist/integration/react";
import { setupCrossTabSync } from "./utils/syncTabs";

// Setup sync giữa các tab
setupCrossTabSync(store, syncCart);

<Provider store={store}>
  <PersistGate loading={null} persistor={persistor}>
    <App />
  </PersistGate>
</Provider>
```

## 🎯 Cách sử dụng

### Thêm sản phẩm vào giỏ hàng

```javascript
import { useDispatch } from "react-redux";
import { addToCart } from "../store/cartSlice";

const ProductDetail = () => {
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);
  
  const handleAddToCart = () => {
    dispatch(addToCart({
      id: product.id,
      name: product.name,
      image: product.image,
      price: finalPrice,
      originalPrice: product.originalPrice,
      discount: product.discount,
      quantity: quantity, // Số lượng từ input
    }));
  };
  
  return (
    <button onClick={handleAddToCart}>Thêm vào giỏ hàng</button>
  );
};
```

### Cập nhật số lượng trong giỏ hàng

```javascript
import { updateQuantity } from "../store/cartSlice";

const CartPage = () => {
  const dispatch = useDispatch();
  
  const handleIncrease = (id, currentQuantity) => {
    dispatch(updateQuantity({ id, quantity: currentQuantity + 1 }));
  };
  
  const handleDecrease = (id, currentQuantity) => {
    if (currentQuantity > 1) {
      dispatch(updateQuantity({ id, quantity: currentQuantity - 1 }));
    }
  };
};
```

### Xóa sản phẩm

```javascript
import { removeFromCart } from "../store/cartSlice";

const handleRemove = (id) => {
  dispatch(removeFromCart(id));
};
```

## 🧪 Test Cross-Tab Sync

### Bước 1: Mở 2 tab
1. Tab A: `http://localhost:3000`
2. Tab B: `http://localhost:3000`

### Bước 2: Thêm sản phẩm ở Tab A
- Click "Thêm vào giỏ hàng" ở Tab A
- ➡️ Tab B tự động cập nhật số lượng giỏ hàng

### Bước 3: Tăng số lượng ở Tab B
- Click nút "+" trong giỏ hàng ở Tab B
- ➡️ Tab A tự động cập nhật

### Bước 4: Reload cả 2 tab
- F5 reload
- ➡️ Dữ liệu vẫn được giữ nguyên

## 📊 Kiểm tra localStorage

Mở DevTools → Application → Local Storage → `http://localhost:3000`

Sẽ thấy key `persist:root` với dữ liệu:
```json
{
  "cart": "{\"items\":[...],\"totalQuantity\":5}",
  "_persist": "{\"version\":-1,\"rehydrated\":true}"
}
```

## 🔧 Cấu hình nâng cao

### Persist nhiều reducer

```javascript
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["cart", "user", "settings"], // Persist nhiều state
};
```

### Blacklist (loại trừ)

```javascript
const persistConfig = {
  key: "root",
  storage,
  blacklist: ["ui", "temp"], // Không persist những state này
};
```

### State Reconciler

```javascript
import autoMergeLevel2 from "redux-persist/lib/stateReconciler/autoMergeLevel2";

const persistConfig = {
  key: "root",
  storage,
  stateReconciler: autoMergeLevel2, // Merge 2 levels deep
};
```

## 🚀 Performance Tips

1. **Throttle updates**: Redux Persist tự động throttle việc lưu
2. **Selective persistence**: Chỉ persist state cần thiết (whitelist)
3. **Transforms**: Có thể transform data trước khi lưu (compress, encrypt)

## 🐛 Troubleshooting

### Lỗi: "A non-serializable value was detected"

**Giải pháp:** Đã thêm middleware config:
```javascript
middleware: (getDefaultMiddleware) =>
  getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
    },
  }),
```

### Cross-tab không sync

**Kiểm tra:**
1. Có đang mở cùng domain không? (storage event chỉ work cùng origin)
2. Có đang dùng incognito/private mode không? (localStorage isolated)
3. Check console log: `🔄 Cart synced from another tab`

### Data bị mất sau reload

**Kiểm tra:**
1. `PersistGate` đã được wrap đúng chưa?
2. localStorage có bị disable không?
3. Check DevTools → Application → Local Storage

## 📚 Tài liệu tham khảo

- [Redux Persist GitHub](https://github.com/rt2zz/redux-persist)
- [Storage Event API](https://developer.mozilla.org/en-US/docs/Web/API/Window/storage_event)
- [BroadcastChannel API](https://developer.mozilla.org/en-US/docs/Web/API/BroadcastChannel)

## ✅ Checklist triển khai

- [x] Cài đặt redux-persist
- [x] Cấu hình persistConfig và persistor
- [x] Wrap app với PersistGate
- [x] Loại bỏ localStorage thủ công
- [x] Thêm cross-tab sync với storage event
- [x] Test thêm/xóa/cập nhật sản phẩm
- [x] Test đồng bộ giữa các tab
- [x] Test reload trang

## 🎊 Kết quả

✨ **Giỏ hàng hoạt động hoàn hảo với:**
- Lưu trữ tự động
- Đồng bộ real-time giữa các tab
- Cộng dồn số lượng thông minh
- Không mất dữ liệu khi reload

---

**Tác giả:** AI Assistant  
**Ngày:** 2025-11-11  
**Version:** 1.0.0

