# 🔧 Sửa lỗi Cross-Tab Sync và Performance Warning

## ✅ Vấn đề đã sửa

### 1. 🔄 Đồng bộ hiển thị dữ liệu giữa các tab

**Vấn đề**: Khi thay đổi địa chỉ ở tab này, tab khác không tự động cập nhật, phải F5 mới thấy thay đổi.

**Nguyên nhân**:

- Custom event `addressChange` chỉ hoạt động trong cùng 1 tab
- Không có mechanism để sync state giữa các browser tabs

**Giải pháp**:

1. ✅ Sử dụng `storage` event của localStorage (tự động trigger khi localStorage thay đổi từ tab khác)
2. ✅ Thêm `syncAddress` reducer vào `addressSlice.js`
3. ✅ Cập nhật `syncTabs.js` để listen và dispatch `syncAddress` action
4. ✅ Redux-persist tự động lưu state vào localStorage
5. ✅ Khi localStorage thay đổi → `storage` event → dispatch `syncAddress` → UI update

**Code changes**:

```javascript
// addressSlice.js - Thêm reducer
syncAddress: (state, action) => {
  if (action.payload && action.payload.selectedAddress) {
    state.selectedAddress = action.payload.selectedAddress;
  }
},

// syncTabs.js - Thêm xử lý sync
if (newState.address) {
  const addressState = JSON.parse(newState.address);
  store.dispatch({
    type: "address/syncAddress",
    payload: addressState,
  });
}
```

### 2. ⚡ Sửa warning ImmutableStateInvariantMiddleware

**Warning**:

```
ImmutableStateInvariantMiddleware took 49ms, which is more than
the warning threshold of 32ms.
```

**Nguyên nhân**:

- `addressData` từ API rất lớn (63 tỉnh/thành, mỗi tỉnh có nhiều quận/huyện, mỗi quận có nhiều phường/xã)
- Middleware check immutability mất nhiều thời gian với state lớn
- Default threshold là 32ms, quá nhỏ cho data lớn

**Giải pháp**:

1. ✅ Tăng `warnAfter` threshold từ 32ms lên 128ms
2. ✅ Thêm `ignoredPaths` để bỏ qua check cho `address.addressData`
3. ✅ Middleware vẫn hoạt động nhưng không warning với state lớn

**Code changes**:

```javascript
// store.js
middleware: (getDefaultMiddleware) =>
  getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      warnAfter: 128, // Tăng từ 32ms
    },
    immutableCheck: {
      ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      warnAfter: 128, // Tăng từ 32ms
      ignoredPaths: ['address.addressData'], // Bỏ qua addressData
    },
  }),
```

## 🔄 Luồng đồng bộ giữa các tab

```
Tab 1: User chọn địa chỉ mới
    ↓
dispatch(setSelectedAddress(newAddr))
    ↓
Redux state update
    ↓
Redux-persist lưu vào localStorage
    ↓
localStorage.setItem("persist:root", {...})
    ↓
[Browser triggers "storage" event cho các tab khác]
    ↓
Tab 2: storage event listener (syncTabs.js)
    ↓
Parse newState.address
    ↓
dispatch({ type: "address/syncAddress", payload: addressState })
    ↓
Redux state update ở Tab 2
    ↓
UI tự động re-render với địa chỉ mới ✨
```

## 📊 So sánh trước và sau

### Trước khi sửa:

- ❌ Tab 2 không tự động cập nhật khi Tab 1 thay đổi địa chỉ
- ❌ Phải F5 để thấy thay đổi
- ❌ Warning về performance trong console
- ❌ UX không tốt

### Sau khi sửa:

- ✅ Tab 2 tự động cập nhật ngay lập tức
- ✅ Không cần F5
- ✅ Không còn warning
- ✅ UX mượt mà, professional

## 🎯 Files đã sửa

1. **`src/store/addressSlice.js`**

   - Thêm `syncAddress` reducer
   - Export `syncAddress` action

2. **`src/utils/syncTabs.js`**

   - Thêm xử lý sync cho address state
   - Listen storage event và dispatch syncAddress

3. **`src/store/store.js`**
   - Tăng `warnAfter` threshold
   - Thêm `ignoredPaths` cho addressData

## 🧪 Cách test

### Test Cross-Tab Sync:

1. Mở 2 tabs cùng truy cập ứng dụng
2. Ở Tab 1: Click chọn địa chỉ mới
3. Quan sát Tab 2: Địa chỉ tự động cập nhật ngay lập tức ✅

### Test Performance:

1. Mở DevTools Console
2. Navigate đến trang có AddressSelector
3. Kiểm tra: Không còn warning về ImmutableStateInvariantMiddleware ✅

## 💡 Lưu ý quan trọng

### 1. Storage Event chỉ trigger cho tabs khác

- Storage event **KHÔNG** trigger cho tab hiện tại
- Chỉ trigger cho các tabs khác đang mở cùng origin
- Đây là behavior mặc định của browser

### 2. Redux-persist tự động sync

- Không cần manually save vào localStorage
- Redux-persist tự động persist state khi có thay đổi
- `syncTabs.js` chỉ cần listen và dispatch action

### 3. Performance với state lớn

- `addressData` có thể lên đến hàng trăm KB
- Tăng threshold để tránh warning không cần thiết
- Middleware vẫn hoạt động, chỉ không warning
- Production build tự động disable middleware này

## 📚 Tài liệu tham khảo

- [Redux Toolkit - Middleware](https://redux-toolkit.js.org/api/getDefaultMiddleware)
- [Storage Event - MDN](https://developer.mozilla.org/en-US/docs/Web/API/Window/storage_event)
- [Redux Persist](https://github.com/rt2zz/redux-persist)

## 🎉 Kết quả

- ✅ Cross-tab sync hoạt động hoàn hảo
- ✅ Không còn warning về performance
- ✅ UX tốt hơn, professional hơn
- ✅ Code clean, maintainable
