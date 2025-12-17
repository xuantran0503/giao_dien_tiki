# 📘 GIẢI THÍCH CHI TIẾT: AddressSelector.tsx

## 🎯 Mục đích của file

Component này hiển thị **giao diện chọn địa chỉ giao hàng**, bao gồm:

- Hiển thị địa chỉ hiện tại
- Modal để chọn địa chỉ mới (Tỉnh/Quận/Phường)
- Tích hợp với Redux để quản lý state
- Fetch dữ liệu địa chỉ từ API

---

## 📦 IMPORT DEPENDENCIES (Dòng 1-34)

### 1. React và Redux (Dòng 1-4)

```typescript
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./AddressSelector.css";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
```

**Giải thích**:

- **`React, { useEffect }`**: React core và hook để xử lý side effects
- **`useDispatch, useSelector`**: Redux hooks (không dùng, đã thay bằng typed hooks)
- **`useAppDispatch, useAppSelector`**: Typed hooks (type-safe)

---

### 2. Import từ addressSlice (Dòng 6-34)

```typescript
import {
  // Types
  City,
  District,
  Ward,

  // Async Thunk
  fetchAddressData,

  // Basic Selectors
  selectAddressData,
  selectAddressStatus,
  selectAddressError,
  selectSelectedAddress,
  selectLocationType,
  selectSelectedCity,
  selectSelectedDistrict,
  selectSelectedWard,
  selectShowLocationModal,

  // Memoized Selectors
  selectDistrictsByCity,
  selectWardsByDistrict,

  // Actions
  setLocationType,
  setSelectedCity,
  setSelectedDistrict,
  setSelectedWard,
  setShowLocationModal,
  setSelectedAddress,
  resetSelection,
} from "../../store/addressSlice";
```

**Phân loại imports**:

1. **Types**: Định nghĩa cấu trúc dữ liệu
2. **Async Thunk**: Fetch dữ liệu từ API
3. **Selectors**: Lấy dữ liệu từ Redux store
4. **Actions**: Thay đổi Redux state

---

## 🏗️ COMPONENT PROPS (Dòng 36-40)

```typescript
interface AddressSelectorProps {
  onLoginClick?: () => void; // Callback khi click "Đăng nhập"
  forceOpen?: boolean; // Bắt buộc mở modal
  onClose?: () => void; // Callback khi đóng modal
}
```

**Cách dùng**:

```typescript
<AddressSelector
  onLoginClick={() => console.log("Login")}
  forceOpen={true}
  onClose={() => console.log("Closed")}
/>
```

---

## 🎣 HOOKS - LẤY DỮ LIỆU TỪ REDUX (Dòng 42-75)

### 1. useAppDispatch (Dòng 44)

```typescript
const dispatch = useAppDispatch();
```

**Mục đích**: Dispatch actions (type-safe)

---

### 2. Lấy dữ liệu từ Redux store (Dòng 47-71)

```typescript
const addressData = useAppSelector(selectAddressData);
const status = useAppSelector(selectAddressStatus);
const error = useAppSelector(selectAddressError);
const selectedAddress = useAppSelector(selectSelectedAddress);
const locationType = useAppSelector(selectLocationType);
const selectedCity = useAppSelector(selectSelectedCity);
const selectedDistrict = useAppSelector(selectSelectedDistrict);
const selectedWard = useAppSelector(selectSelectedWard);
const showLocationModal = useAppSelector(selectShowLocationModal);
```

**Giải thích**:

- **`useAppSelector`**: Type-safe version của `useSelector`
- Mỗi selector lấy 1 phần của state

**Ví dụ giá trị**:

```typescript
addressData = [{ code: 1, name: "Hà Nội", districts: [...] }, ...]
status = "succeeded"
error = null
selectedAddress = "P. Minh Khai, Q. Hoàng Mai, Hà Nội"
locationType = "default"
selectedCity = ""
selectedDistrict = ""
selectedWard = ""
showLocationModal = false
```

---

### 3. Lấy danh sách districts và wards (Dòng 73-75)

```typescript
const districts = useAppSelector(selectDistrictsByCity);
const wards = useAppSelector(selectWardsByDistrict);
```

**Memoized selectors**:

- **`selectDistrictsByCity`**: Lọc districts dựa trên `selectedCity`
- **`selectWardsByDistrict`**: Lọc wards dựa trên `selectedDistrict`

**Lợi ích**:

- ✅ Tự động cập nhật khi `selectedCity` hoặc `selectedDistrict` thay đổi
- ✅ Không re-render nếu input không đổi (memoization)

---

## ⚡ USEEFFECT - SIDE EFFECTS (Dòng 77-89)

### 1. Fetch Address Data khi component mount (Dòng 78-83)

```typescript
useEffect(() => {
  if (status === "idle") {
    dispatch(fetchAddressData());
  }
}, [dispatch, status]);
```

**Giải thích từng dòng**:

**Dòng 79**: Kiểm tra status

```typescript
if (status === "idle") {
```

- **"idle"**: Chưa fetch dữ liệu
- **"pending"**: Đang fetch
- **"succeeded"**: Đã fetch thành công
- **"failed"**: Fetch thất bại

**Dòng 80**: Dispatch async thunk

```typescript
dispatch(fetchAddressData());
```

- Gọi API: `https://provinces.open-api.vn/api/?depth=3`
- Lấy toàn bộ dữ liệu tỉnh/thành phố VN

**Dòng 83**: Dependencies

```typescript
}, [dispatch, status]);
```

- Chạy lại khi `dispatch` hoặc `status` thay đổi
- Thực tế: `dispatch` không đổi, chỉ `status` thay đổi

**Flow**:

```
1. Component mount → status = "idle"
2. useEffect chạy → dispatch(fetchAddressData())
3. status → "pending"
4. API call thành công → status → "succeeded"
5. addressData được lưu vào Redux store
6. Component re-render với dữ liệu mới
```

---

### 2. Force Open Modal (Dòng 85-89)

```typescript
useEffect(() => {
  if (forceOpen) {
    dispatch(setShowLocationModal(true));
  }
}, [forceOpen, dispatch]);
```

**Mục đích**: Mở modal khi `forceOpen` prop = true

**Cách dùng**:

```typescript
// Parent component
const [forceOpen, setForceOpen] = useState(false);

<AddressSelector forceOpen={forceOpen} />;

// Khi cần mở modal:
setForceOpen(true);
```

---

## 🎬 EVENT HANDLERS (Dòng 91-141)

### 1. handleLocationClick (Dòng 91-94)

```typescript
const handleLocationClick = () => {
  dispatch(resetSelection());
  dispatch(setShowLocationModal(true));
};
```

**Khi nào được gọi**: User click vào nút "Giao đến: [địa chỉ]"

**Hành động**:

1. **Reset selection**: Xóa tỉnh/quận/phường đã chọn
2. **Mở modal**: Hiển thị modal chọn địa chỉ

**Tại sao reset?**

- Mỗi lần mở modal → bắt đầu chọn từ đầu
- Tránh giữ lại selection cũ

---

### 2. handleSaveLocation (Dòng 96-129) ⭐ QUAN TRỌNG

```typescript
const handleSaveLocation = () => {
  if (locationType === "default") {
    dispatch(setShowLocationModal(false));
    if (onClose) onClose();
  } else if (
    locationType === "custom" &&
    selectedCity &&
    selectedDistrict &&
    selectedWard
  ) {
    // Validate addressData is loaded
    if (!addressData || addressData.length === 0) {
      alert("Dữ liệu địa chỉ đang được tải, vui lòng đợi một chút...");
      return;
    }

    const cityObj = addressData.find(
      (c: City) => c.code === Number(selectedCity)
    );

    const districtObj = cityObj?.districts?.find(
      (d: District) => d.code === Number(selectedDistrict)
    );
    const wardObj = districtObj?.wards?.find(
      (w: Ward) => w.code === Number(selectedWard)
    );

    const newAddr = `${wardObj?.name || ""}, ${districtObj?.name || ""}, ${
      cityObj?.name || ""
    }`;

    dispatch(setSelectedAddress(newAddr));

    dispatch(setShowLocationModal(false));
    if (onClose) onClose();
  }
};
```

**Khi nào được gọi**: User click "GIAO ĐẾN ĐỊA CHỈ NÀY"

---

#### Case 1: Địa chỉ mặc định (Dòng 97-100)

```typescript
if (locationType === "default") {
  dispatch(setShowLocationModal(false));
  if (onClose) onClose();
}
```

**Hành động**:

1. Đóng modal
2. Gọi callback `onClose` (nếu có)
3. Giữ nguyên `selectedAddress` (không thay đổi)

---

#### Case 2: Địa chỉ tùy chỉnh (Dòng 100-128)

**Bước 1: Validate inputs (Dòng 100-105)**

```typescript
else if (
  locationType === "custom" &&
  selectedCity &&
  selectedDistrict &&
  selectedWard
) {
```

- Kiểm tra user đã chọn đủ 3 cấp (Tỉnh/Quận/Phường)

---

**Bước 2: Validate addressData (Dòng 106-110)**

```typescript
if (!addressData || addressData.length === 0) {
  alert("Dữ liệu địa chỉ đang được tải, vui lòng đợi một chút...");
  return;
}
```

- Đảm bảo dữ liệu đã được fetch
- Tránh lỗi khi addressData chưa sẵn sàng

---

**Bước 3: Tìm City object (Dòng 112)**

```typescript
const cityObj = addressData.find((c: City) => c.code === Number(selectedCity));
```

**Ví dụ**:

```typescript
selectedCity = "01"  // Mã Hà Nội
cityObj = { code: 1, name: "Hà Nội", districts: [...] }
```

---

**Bước 4: Tìm District object (Dòng 114-116)**

```typescript
const districtObj = cityObj?.districts?.find(
  (d: District) => d.code === Number(selectedDistrict)
);
```

**Optional chaining (`?.`)**:

- Nếu `cityObj` null → `districtObj` = undefined
- Tránh lỗi "Cannot read property 'districts' of undefined"

---

**Bước 5: Tìm Ward object (Dòng 117-119)**

```typescript
const wardObj = districtObj?.wards?.find(
  (w: Ward) => w.code === Number(selectedWard)
);
```

---

**Bước 6: Tạo chuỗi địa chỉ (Dòng 121-122)**

```typescript
const newAddr = `${wardObj?.name || ""}, ${districtObj?.name || ""}, ${
  cityObj?.name || ""
}`;
```

**Ví dụ**:

```typescript
wardObj.name = "Phường Minh Khai";
districtObj.name = "Quận Hoàng Mai";
cityObj.name = "Hà Nội";

newAddr = "Phường Minh Khai, Quận Hoàng Mai, Hà Nội";
```

**Fallback (`|| ""`)**:

- Nếu object không tồn tại → dùng chuỗi rỗng
- Tránh "undefined" trong chuỗi

---

**Bước 7: Cập nhật Redux state (Dòng 124)**

```typescript
dispatch(setSelectedAddress(newAddr));
```

- Lưu địa chỉ mới vào Redux store
- Redux-persist tự động lưu vào localStorage

---

**Bước 8: Đóng modal (Dòng 126-127)**

```typescript
dispatch(setShowLocationModal(false));
if (onClose) onClose();
```

---

### 3. handleLoginClick (Dòng 131-136)

```typescript
const handleLoginClick = () => {
  dispatch(setShowLocationModal(false));
  if (onLoginClick) {
    onLoginClick();
  }
};
```

**Khi nào được gọi**: User click "Đăng nhập để chọn địa chỉ giao hàng"

**Hành động**:

1. Đóng modal
2. Gọi callback `onLoginClick` (do parent component cung cấp)

---

### 4. handleCloseModal (Dòng 138-141)

```typescript
const handleCloseModal = () => {
  dispatch(setShowLocationModal(false));
  if (onClose) onClose();
};
```

**Khi nào được gọi**:

- User click nút "×" (close button)
- User click overlay (ngoài modal)

---

## 🎨 RENDER HELPERS (Dòng 143-152)

### renderLoadingState (Dòng 144-152)

```typescript
const renderLoadingState = () => {
  if (status === "pending") {
    return <div className="loading-message">Đang tải dữ liệu địa chỉ...</div>;
  }
  if (status === "failed") {
    return <div className="error-message">Lỗi: {error}</div>;
  }
  return null;
};
```

**Mục đích**: Hiển thị trạng thái loading/error

**3 trạng thái**:

1. **pending**: Đang fetch API → Hiển thị "Đang tải..."
2. **failed**: Fetch lỗi → Hiển thị lỗi
3. **succeeded/idle**: Không hiển thị gì

---

## 🖼️ JSX RENDER (Dòng 154-355)

### Cấu trúc tổng thể

```typescript
return (
  <>
    {/* 1. Hiển thị địa chỉ hiện tại */}
    <div className="location">...</div>

    {/* 2. Modal chọn địa chỉ */}
    {showLocationModal && <div className="location-modal-overlay">...</div>}
  </>
);
```

---

### 1. Hiển thị địa chỉ hiện tại (Dòng 156-164)

```typescript
<div className="location">
  <div className="img-location">
    <img src="/location.png" alt="location" />
  </div>
  <h4 className="text-location1">Giao đến: </h4>
  <button onClick={handleLocationClick} className="location-link">
    {selectedAddress}
  </button>
</div>
```

**Giải thích**:

- **Icon**: Hình location
- **Label**: "Giao đến:"
- **Button**: Hiển thị địa chỉ hiện tại, click để mở modal

**Ví dụ hiển thị**:

```
📍 Giao đến: P. Minh Khai, Q. Hoàng Mai, Hà Nội
```

---

### 2. Modal Overlay (Dòng 167-168)

```typescript
{showLocationModal && (
  <div className="location-modal-overlay" onClick={handleCloseModal}>
```

**Conditional rendering**:

- Chỉ hiển thị khi `showLocationModal = true`

**onClick={handleCloseModal}**:

- Click vào overlay (nền tối) → đóng modal

---

### 3. Modal Content (Dòng 169)

```typescript
<div className="location-modal" onClick={(e) => e.stopPropagation()}>
```

**`onClick={(e) => e.stopPropagation()}`**:

- Ngăn event bubble lên overlay
- Click vào modal content → KHÔNG đóng modal
- Chỉ click vào overlay mới đóng

---

### 4. Modal Header (Dòng 171-176)

```typescript
<div className="location-modal-header">
  <h2>Địa chỉ giao hàng</h2>
  <button className="close-btn" onClick={handleCloseModal}>
    ×
  </button>
</div>
```

**Nút close (×)**:

- Click → đóng modal

---

### 5. Modal Body - Description (Dòng 178-182)

```typescript
<p className="location-description">
  Hãy chọn địa chỉ nhận hàng để được dự báo thời gian giao hàng cùng phí đóng
  gói, vận chuyển một cách chính xác nhất.
</p>
```

---

### 6. Login Button (Dòng 184-189)

```typescript
<button className="btn-login-location" onClick={handleLoginClick}>
  Đăng nhập để chọn địa chỉ giao hàng
</button>
```

---

### 7. Divider (Dòng 191)

```typescript
<div className="or-divider">hoặc</div>
```

---

### 8. Loading/Error State (Dòng 193-194)

```typescript
{
  renderLoadingState();
}
```

---

### 9. Location Options (Dòng 196-336)

#### Option 1: Địa chỉ mặc định (Dòng 197-206)

```typescript
<label className="location-option">
  <input
    type="radio"
    name="location-type"
    value="default"
    checked={locationType === "default"}
    onChange={(e) =>
      dispatch(setLocationType(e.target.value as "default" | "custom"))
    }
  />
  <span>{selectedAddress}</span>
</label>
```

**Radio button**:

- `checked={locationType === "default"}`: Checked nếu đang chọn default
- `onChange`: Dispatch action để thay đổi `locationType`

---

#### Option 2: Địa chỉ tùy chỉnh (Dòng 208-217)

```typescript
<label className="location-option">
  <input
    type="radio"
    name="location-type"
    value="custom"
    checked={locationType === "custom"}
    onChange={(e) =>
      dispatch(setLocationType(e.target.value as "default" | "custom"))
    }
  />
  <span>Chọn khu vực giao hàng khác</span>
</label>
```

---

#### Conditional Selects (Dòng 219-335)

```typescript
{
  locationType === "custom" && (
    <div className="location-selects">
      {/* Tỉnh/Thành phố */}
      {/* Quận/Huyện */}
      {/* Phường/Xã */}
    </div>
  );
}
```

**Chỉ hiển thị khi `locationType === "custom"`**

---

### 10. Select Tỉnh/Thành phố (Dòng 222-257)

```typescript
<div className="select-group">
  <label>Tỉnh/Thành phố</label>
  <div className="select-wrapper">
    <select
      value={selectedCity}
      onChange={(e) => dispatch(setSelectedCity(e.target.value))}
      className={selectedCity ? "selected" : ""}
      disabled={status === "pending"}
    >
      <option value="" disabled hidden>
        Vui lòng chọn tỉnh/thành phố
      </option>
      {addressData.map((city: City) => (
        <option key={city.code} value={city.code}>
          {city.name}
        </option>
      ))}
    </select>
    {/* Custom arrow icon */}
  </div>
</div>
```

**Giải thích**:

**`value={selectedCity}`**: Controlled component

- Giá trị từ Redux store

**`onChange`**: Dispatch action

```typescript
onChange={(e) => dispatch(setSelectedCity(e.target.value))}
```

- Cập nhật Redux state
- Tự động reset `selectedDistrict` và `selectedWard`

**`disabled={status === "pending"}`**:

- Disable khi đang fetch dữ liệu

**`addressData.map(...)`**:

- Render tất cả tỉnh/thành phố

---

### 11. Select Quận/Huyện (Dòng 260-295)

```typescript
<select
  value={selectedDistrict}
  onChange={(e) => dispatch(setSelectedDistrict(e.target.value))}
  className={selectedDistrict ? "selected" : ""}
  disabled={!selectedCity || status === "pending"}
>
  <option value="" disabled hidden>
    Vui lòng chọn quận/huyện
  </option>
  {districts.map((district: District) => (
    <option key={district.code} value={district.code}>
      {district.name}
    </option>
  ))}
</select>
```

**Điểm khác biệt**:

**`disabled={!selectedCity || status === "pending"}`**:

- Disable nếu chưa chọn tỉnh
- Disable nếu đang fetch

**`districts.map(...)`**:

- Dùng memoized selector `selectDistrictsByCity`
- Tự động lọc districts theo `selectedCity`

---

### 12. Select Phường/Xã (Dòng 298-333)

```typescript
<select
  value={selectedWard}
  onChange={(e) => dispatch(setSelectedWard(e.target.value))}
  className={selectedWard ? "selected" : ""}
  disabled={!selectedDistrict || status === "pending"}
>
  <option value="" disabled hidden>
    Vui lòng chọn phường/xã
  </option>
  {wards.map((ward: Ward) => (
    <option key={ward.code} value={ward.code}>
      {ward.name}
    </option>
  ))}
</select>
```

**`disabled={!selectedDistrict || status === "pending"}`**:

- Disable nếu chưa chọn quận

**`wards.map(...)`**:

- Dùng memoized selector `selectWardsByDistrict`

---

### 13. Save Button (Dòng 338-348)

```typescript
<button
  className="btn-save-location"
  onClick={handleSaveLocation}
  disabled={
    status === "pending" ||
    (locationType === "custom" &&
      (!selectedCity ||
        !selectedDistrict ||
        !selectedWard ||
        !addressData.length))
  }
>
  GIAO ĐẾN ĐỊA CHỈ NÀY
</button>
```

**Disable conditions**:

1. `status === "pending"`: Đang fetch dữ liệu
2. `locationType === "custom"` và chưa chọn đủ 3 cấp
3. `!addressData.length`: Dữ liệu chưa sẵn sàng

---

## 🎯 FLOW HOÀN CHỈNH

### Scenario 1: User chọn địa chỉ mặc định

```
1. User click "Giao đến: [địa chỉ]"
   → handleLocationClick()
   → dispatch(resetSelection())
   → dispatch(setShowLocationModal(true))

2. Modal mở
   → locationType = "default" (mặc định)

3. User click "GIAO ĐẾN ĐỊA CHỈ NÀY"
   → handleSaveLocation()
   → dispatch(setShowLocationModal(false))
   → Modal đóng
   → Giữ nguyên selectedAddress
```

---

### Scenario 2: User chọn địa chỉ tùy chỉnh

```
1. User click "Giao đến: [địa chỉ]"
   → Modal mở

2. User chọn radio "Chọn khu vực giao hàng khác"
   → dispatch(setLocationType("custom"))
   → Hiển thị 3 dropdowns

3. User chọn Tỉnh
   → dispatch(setSelectedCity("01"))
   → selectedDistrict = "" (reset)
   → selectedWard = "" (reset)
   → districts được cập nhật (memoized selector)

4. User chọn Quận
   → dispatch(setSelectedDistrict("001"))
   → selectedWard = "" (reset)
   → wards được cập nhật (memoized selector)

5. User chọn Phường
   → dispatch(setSelectedWard("00001"))

6. User click "GIAO ĐẾN ĐỊA CHỈ NÀY"
   → handleSaveLocation()
   → Tìm cityObj, districtObj, wardObj
   → Tạo chuỗi: "P. Minh Khai, Q. Hoàng Mai, Hà Nội"
   → dispatch(setSelectedAddress(newAddr))
   → Redux-persist lưu vào localStorage
   → Storage event trigger → Tab khác đồng bộ
   → Modal đóng
```

---

## 💡 LƯU Ý QUAN TRỌNG

### 1. Controlled Components

```typescript
<select value={selectedCity} onChange={(e) => dispatch(setSelectedCity(e.target.value))}>
```

- Giá trị từ Redux store (single source of truth)
- Không dùng local state

### 2. Memoized Selectors

```typescript
const districts = useAppSelector(selectDistrictsByCity);
const wards = useAppSelector(selectWardsByDistrict);
```

- Tự động lọc dữ liệu
- Tránh re-render không cần thiết

### 3. Cascade Reset

```typescript
// setSelectedCity
state.selectedDistrict = "";
state.selectedWard = "";

// setSelectedDistrict
state.selectedWard = "";
```

- Chọn tỉnh mới → reset quận/phường
- Đảm bảo dữ liệu nhất quán

### 4. Error Handling

```typescript
if (!addressData || addressData.length === 0) {
  alert("Dữ liệu địa chỉ đang được tải, vui lòng đợi một chút...");
  return;
}
```

- Validate trước khi xử lý
- Tránh crash app

### 5. Optional Chaining

```typescript
const cityObj = addressData.find((c: City) => c.code === Number(selectedCity));
const districtObj = cityObj?.districts?.find(...);
```

- Tránh lỗi "Cannot read property of undefined"

---

## 🔗 LIÊN KẾT VỚI CÁC FILE KHÁC

### 1. addressSlice.ts

- Cung cấp selectors, actions, types
- Quản lý Redux state

### 2. store.ts

- Cấu hình redux-persist
- createTransform để tối ưu localStorage

### 3. syncTabs.ts

- Đồng bộ selectedAddress giữa các tabs

### 4. AddressSelector.css

- Styling cho component

---

## 🎓 KẾT LUẬN

**AddressSelector.tsx** là một component phức tạp nhưng được tổ chức tốt:

- ✅ Tích hợp Redux hoàn chỉnh
- ✅ Fetch dữ liệu từ API
- ✅ Memoized selectors để tối ưu performance
- ✅ Controlled components
- ✅ Error handling tốt
- ✅ Cross-tab sync
- ✅ UX tốt (disable states, loading states)

**Key takeaways**:

1. Dùng typed hooks (useAppDispatch, useAppSelector)
2. Memoized selectors cho derived data
3. Cascade reset để đảm bảo data consistency
4. Validate trước khi xử lý
5. Optional chaining để tránh lỗi
