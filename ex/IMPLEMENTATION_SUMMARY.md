# 🎯 Tóm tắt: Áp dụng createAsyncThunk và Axios vào AddressSelector

## ✅ Những gì đã hoàn thành

### 1. Tạo Redux Slice với createAsyncThunk

**File**: `src/store/addressSlice.js`

- ✅ Tạo `fetchAddressData` async thunk sử dụng **axios** thay vì fetch
- ✅ Quản lý state với `status`, `error`, và `addressData`
- ✅ Xử lý 3 trạng thái: `pending`, `fulfilled`, `rejected`
- ✅ Tạo reducers cho các actions đồng bộ
- ✅ Tạo selectors để lấy dữ liệu từ state
- ✅ **FIX**: Loại bỏ side effects khỏi reducers (localStorage, dispatchEvent)

### 2. Cập nhật Store

**File**: `src/store/store.js`

- ✅ Import và thêm `addressReducer` vào `rootReducer`
- ✅ State address giờ được quản lý bởi Redux và persist với redux-persist

### 3. Refactor AddressSelector Component

**File**: `src/components/AddressSelector/AddressSelector.jsx`

- ✅ Sử dụng `useSelector` để lấy state từ Redux
- ✅ Sử dụng `useDispatch` để dispatch actions
- ✅ Fetch dữ liệu địa chỉ khi component mount
- ✅ Hiển thị loading và error states
- ✅ **FIX**: Xử lý side effects trong component (useEffect) thay vì trong reducer
- ✅ Sync với localStorage khi selectedAddress thay đổi
- ✅ Dispatch custom event khi lưu địa chỉ mới

### 4. Thêm CSS cho Loading/Error

**File**: `src/components/AddressSelector/AddressSelector.css`

- ✅ Thêm styles cho `.loading-message`
- ✅ Thêm styles cho `.error-message`

### 5. Tài liệu

**File**: `CREATEASYNCTHUNK_GUIDE.md`

- ✅ Hướng dẫn chi tiết về createAsyncThunk
- ✅ So sánh Fetch vs Axios
- ✅ Patterns và best practices
- ✅ Ví dụ thực tế

## 🐛 Lỗi đã sửa

### Lỗi: "You may not call store.getState() while the reducer is executing"

**Nguyên nhân**:

- Reducer `setSelectedAddress` đang gọi `window.localStorage.setItem()` và `window.dispatchEvent()`
- Đây là **side effects** - vi phạm quy tắc Redux: reducers phải là **pure functions**

**Giải pháp**:

1. ✅ Loại bỏ side effects khỏi reducer
2. ✅ Xử lý side effects trong component với `useEffect`
3. ✅ Dispatch custom event chỉ khi cần thiết (trong handleSaveLocation)

## 📊 Luồng dữ liệu mới

```
Component Mount
    ↓
dispatch(fetchAddressData())  ← createAsyncThunk với axios
    ↓
[pending] → status = "pending" → Hiển thị loading
    ↓
[fulfilled] → status = "succeeded" → Hiển thị dữ liệu
    ↓
User chọn địa chỉ
    ↓
dispatch(setSelectedAddress(newAddr))  ← Pure reducer
    ↓
useEffect theo dõi selectedAddress
    ↓
localStorage.setItem()  ← Side effect trong component
    ↓
dispatchEvent("addressChange")  ← Sync với tabs khác
```

## 🔑 Điểm quan trọng

### 1. Reducers phải là Pure Functions

```javascript
// ❌ SAI - Có side effects
setSelectedAddress: (state, action) => {
  state.selectedAddress = action.payload;
  window.localStorage.setItem("selectedAddress", action.payload); // Side effect!
};

// ✅ ĐÚNG - Pure function
setSelectedAddress: (state, action) => {
  state.selectedAddress = action.payload;
  // Side effects được xử lý trong component
};
```

### 2. Side Effects trong Component

```javascript
// ✅ ĐÚNG - Side effects trong useEffect
useEffect(() => {
  window.localStorage.setItem("selectedAddress", selectedAddress);
}, [selectedAddress]);
```

### 3. Axios vs Fetch

```javascript
// Fetch - Phải parse JSON thủ công
fetch(url)
  .then(res => res.json())
  .then(data => ...)

// Axios - Tự động parse JSON
axios.get(url)
  .then(res => res.data)  // Đã là object rồi!
```

## 🎨 Cải tiến UX

1. **Loading State**: Hiển thị "Đang tải dữ liệu địa chỉ..." khi fetch
2. **Error State**: Hiển thị lỗi nếu API fail
3. **Disable Selects**: Disable dropdowns khi đang loading
4. **Auto-save**: Tự động lưu vào localStorage khi địa chỉ thay đổi

## 📚 Files đã tạo/sửa

1. ✅ `src/store/addressSlice.js` - **MỚI**
2. ✅ `src/store/store.js` - Cập nhật
3. ✅ `src/components/AddressSelector/AddressSelector.jsx` - Refactor hoàn toàn
4. ✅ `src/components/AddressSelector/AddressSelector.css` - Thêm styles
5. ✅ `CREATEASYNCTHUNK_GUIDE.md` - **MỚI** - Tài liệu hướng dẫn

## 🚀 Cách sử dụng

```javascript
// Trong component khác
import { useSelector, useDispatch } from "react-redux";
import {
  selectSelectedAddress,
  setSelectedAddress,
} from "./store/addressSlice";

function MyComponent() {
  const dispatch = useDispatch();
  const address = useSelector(selectSelectedAddress);

  const handleChange = (newAddress) => {
    dispatch(setSelectedAddress(newAddress));
  };

  return <div>{address}</div>;
}
```

## 🎓 Bài học

1. **Luôn giữ reducers pure** - Không side effects!
2. **Sử dụng createAsyncThunk** cho async operations
3. **Axios tốt hơn fetch** - Tự động parse JSON, xử lý errors tốt hơn
4. **Side effects trong useEffect** - Không trong reducers
5. **Selectors giúp code sạch hơn** - Tái sử dụng logic lấy dữ liệu

## ✨ Kết quả

- ✅ Code sạch hơn, dễ maintain
- ✅ State management tập trung với Redux
- ✅ Xử lý async operations đúng cách
- ✅ Không còn lỗi "store.getState() while reducer is executing"
- ✅ UX tốt hơn với loading/error states
- ✅ Sử dụng axios thay vì fetch
