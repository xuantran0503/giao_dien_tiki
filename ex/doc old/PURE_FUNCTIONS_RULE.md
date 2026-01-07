# ⚠️ QUAN TRỌNG: Reducers PHẢI là Pure Functions

## 🚫 Lỗi: "You may not call store.getState() while the reducer is executing"

### Nguyên nhân gốc rễ

Lỗi này xảy ra khi **reducer có side effects** (gọi localStorage, dispatchEvent, API calls, etc.)

### ❌ Code SAI (Gây lỗi)

```javascript
// ❌ SAI - Reducer có side effects
setSelectedAddress: (state, action) => {
  state.selectedAddress = action.payload;

  // ❌ Side effect 1: Gọi localStorage
  window.localStorage.setItem("selectedAddress", action.payload);

  // ❌ Side effect 2: Dispatch event
  window.dispatchEvent(
    new CustomEvent("addressChange", {
      detail: { address: action.payload },
    })
  );
};
```

**Tại sao SAI?**

1. `dispatchEvent` trigger `handleAddressChange` listener
2. `handleAddressChange` gọi `dispatch(setSelectedAddress(addr))`
3. Tạo ra **vòng lặp vô hạn**
4. Vi phạm quy tắc: "Không được gọi store.getState() trong reducer"

### ✅ Code ĐÚNG (Không lỗi)

```javascript
// ✅ ĐÚNG - Reducer là pure function
setSelectedAddress: (state, action) => {
  state.selectedAddress = action.payload;
  // Chỉ cập nhật state, KHÔNG có side effects
};
```

## 🔄 Xử lý Side Effects đúng cách

### Cách 1: Trong Component với useEffect

```javascript
// ✅ ĐÚNG - Side effects trong component
useEffect(() => {
  window.localStorage.setItem("selectedAddress", selectedAddress);
}, [selectedAddress]);
```

### Cách 2: Sử dụng Redux-persist

```javascript
// ✅ ĐÚNG - Redux-persist tự động lưu state
const persistConfig = {
  key: "root",
  storage,
};

const pReducer = persistReducer(persistConfig, rootReducer);
```

## 🎯 Giải pháp cho Cross-Tab Sync

### ❌ Cách CŨ (Sai - Dùng custom event)

```javascript
// Component
useEffect(() => {
  const handleAddressChange = (e) => {
    dispatch(setSelectedAddress(e.detail.address));
  };
  window.addEventListener("addressChange", handleAddressChange);
}, []);

// Reducer
setSelectedAddress: (state, action) => {
  state.selectedAddress = action.payload;
  window.dispatchEvent(new CustomEvent("addressChange", ...)); // ❌ Vòng lặp!
}
```

**Vấn đề**: Tạo ra vòng lặp vô hạn!

### ✅ Cách MỚI (Đúng - Dùng Redux-persist + storage event)

```javascript
// syncTabs.js
const handleStorageChange = (event) => {
  if (event.key === "persist:root" && event.newValue) {
    const newState = JSON.parse(event.newValue);

    if (newState.address) {
      const addressState = JSON.parse(newState.address);
      store.dispatch({
        type: "address/syncAddress",
        payload: addressState,
      });
    }
  }
};

window.addEventListener("storage", handleStorageChange);
```

**Ưu điểm**:

- ✅ Không có vòng lặp
- ✅ Storage event chỉ trigger từ tabs khác
- ✅ Redux-persist tự động lưu state
- ✅ Reducers vẫn là pure functions

## 📊 So sánh

| Aspect          | Custom Event (❌) | Redux-persist + Storage Event (✅) |
| --------------- | ----------------- | ---------------------------------- |
| Reducers        | Có side effects   | Pure functions                     |
| Vòng lặp        | Có thể xảy ra     | Không xảy ra                       |
| Complexity      | Cao               | Thấp                               |
| Maintainability | Khó               | Dễ                                 |
| Best Practice   | Không             | Có                                 |

## 🔑 Quy tắc vàng

### 1. Reducers PHẢI là Pure Functions

```javascript
// ✅ Pure function
const reducer = (state, action) => {
  return { ...state, value: action.payload };
};

// ❌ Impure function (có side effects)
const reducer = (state, action) => {
  localStorage.setItem("key", action.payload); // ❌
  fetch("/api/data"); // ❌
  console.log("something"); // ❌ (OK trong dev, nhưng vẫn là side effect)
  return { ...state, value: action.payload };
};
```

### 2. Side Effects thuộc về:

- ✅ Components (useEffect)
- ✅ Middleware
- ✅ Thunks (createAsyncThunk)
- ❌ KHÔNG thuộc về Reducers

### 3. Cross-tab sync:

- ✅ Dùng redux-persist
- ✅ Listen storage event
- ✅ Dispatch sync actions
- ❌ KHÔNG dùng custom events trong reducers

## 🛠️ Cách fix nếu gặp lỗi này

### Bước 1: Tìm reducer có side effects

```javascript
// Tìm các pattern này trong reducers:
- window.localStorage
- window.dispatchEvent
- fetch()
- axios.get()
- console.log() (không gây lỗi nhưng nên tránh)
- Math.random()
- Date.now()
```

### Bước 2: Di chuyển side effects ra ngoài

```javascript
// ❌ Trước
setData: (state, action) => {
  state.data = action.payload;
  localStorage.setItem("data", action.payload); // ❌
};

// ✅ Sau
// Reducer
setData: (state, action) => {
  state.data = action.payload;
};

// Component
useEffect(() => {
  localStorage.setItem("data", data);
}, [data]);
```

### Bước 3: Test

1. Mở DevTools Console
2. Thực hiện action
3. Kiểm tra không có lỗi "store.getState() while reducer is executing"

## 📚 Tài liệu tham khảo

- [Redux: Reducers must be pure](https://redux.js.org/tutorials/fundamentals/part-3-state-actions-reducers#rules-of-reducers)
- [Redux Toolkit: createSlice](https://redux-toolkit.js.org/api/createSlice)
- [Redux-persist](https://github.com/rt2zz/redux-persist)

## ✅ Checklist

Trước khi commit code, kiểm tra:

- [ ] Reducers không có localStorage calls
- [ ] Reducers không có dispatchEvent calls
- [ ] Reducers không có API calls
- [ ] Reducers không có Math.random() hoặc Date.now()
- [ ] Side effects được xử lý trong useEffect hoặc middleware
- [ ] Cross-tab sync dùng redux-persist + storage event
- [ ] Test với nhiều tabs, không có lỗi console

## 🎉 Kết luận

**LUÔN NHỚ**:

- Reducers = Pure Functions
- Side Effects = useEffect / Middleware / Thunks
- Cross-tab Sync = Redux-persist + Storage Event

Tuân thủ quy tắc này sẽ tránh được 99% lỗi liên quan đến Redux! 🚀
