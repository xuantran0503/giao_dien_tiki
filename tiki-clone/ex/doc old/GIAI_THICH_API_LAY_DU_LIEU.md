# GIẢI THÍCH CÁCH LẤY DỮ LIỆU TỪ API

## 1. TỔNG QUAN

Trong dự án Tiki Clone, chúng ta sử dụng Redux Toolkit để quản lý việc lấy dữ liệu địa chỉ từ API công khai của Việt Nam.

## 2. CẤU TRÚC DỮ LIỆU API

### API Endpoint
```
https://provinces.open-api.vn/api/?depth=3
```

### Cấu trúc dữ liệu trả về:
```typescript
interface Ward {
  code: number;    // Mã phường/xã (VD: 1, 2, 3...)
  name: string;    // Tên phường/xã (VD: "Phường Phúc Xá")
}

interface District {
  code: number;    // Mã quận/huyện (VD: 1, 2, 3...)
  name: string;    // Tên quận/huyện (VD: "Quận Ba Đình")
  wards: Ward[];   // Danh sách các phường/xã thuộc quận/huyện này
}

interface City {
  code: number;       // Mã tỉnh/thành phố (VD: 1, 2, 3...)
  name: string;       // Tên tỉnh/thành phố (VD: "Thành phố Hà Nội")
  districts: District[]; // Danh sách các quận/huyện thuộc tỉnh/thành phố này
}
```

### Ví dụ dữ liệu thực tế:
```json
[
  {
    "code": 1,
    "name": "Thành phố Hà Nội",
    "districts": [
      {
        "code": 1,
        "name": "Quận Ba Đình",
        "wards": [
          {
            "code": 1,
            "name": "Phường Phúc Xá"
          },
          {
            "code": 4,
            "name": "Phường Trúc Bạch"
          }
        ]
      },
      {
        "code": 5,
        "name": "Quận Hoàn Kiếm",
        "wards": [
          {
            "code": 19,
            "name": "Phường Chương Dương Độ"
          }
        ]
      }
    ]
  },
  {
    "code": 2,
    "name": "Tỉnh Hà Giang",
    "districts": [...]
  }
]
```

## 3. REDUX TOOLKIT - CREATEASYNCTHUNK

### Tạo Async Action để gọi API:
```typescript
export const fetchAddressData = createAsyncThunk<City[], void, { rejectValue: string }>(
  "address/fetchAddressData",  // Tên action type
  async (_, { rejectWithValue }) => {
    try {
      // Gọi API bằng axios
      const response = await axios.get<City[]>(
        "https://provinces.open-api.vn/api/?depth=3"
      );
      return response.data;  // Trả về dữ liệu khi thành công
    } catch (error: any) {
      // Trả về lỗi khi thất bại
      return rejectWithValue(error.response?.data || "Lỗi kết nối API");
    }
  }
);
```

### Giải thích Generic Types:
- `City[]`: Kiểu dữ liệu trả về khi API call thành công
- `void`: Không cần tham số đầu vào (không truyền gì vào function)
- `{ rejectValue: string }`: Kiểu dữ liệu lỗi khi API call thất bại

## 4. XỬ LÝ CÁC TRẠNG THÁI API

### State Management:
```typescript
interface AddressState {
  addressData: City[];  // Dữ liệu địa chỉ từ API
  status: "idle" | "pending" | "succeeded" | "failed";  // Trạng thái API call
  error: string | null;  // Thông báo lỗi (nếu có)
  // ... các state khác
}
```

### ExtraReducers - Xử lý các trạng thái:
```typescript
extraReducers: (builder) => {
  builder
    // Khi bắt đầu gọi API
    .addCase(fetchAddressData.pending, (state) => {
      state.status = "pending";  // Đang loading
      state.error = null;        // Xóa lỗi cũ
    })
    
    // Khi API trả về thành công
    .addCase(fetchAddressData.fulfilled, (state, action) => {
      state.status = "succeeded";           // Đánh dấu thành công
      state.addressData = action.payload;   // Lưu dữ liệu vào state
      state.error = null;                   // Xóa lỗi
    })
    
    // Khi API trả về lỗi
    .addCase(fetchAddressData.rejected, (state, action) => {
      state.status = "failed";                           // Đánh dấu thất bại
      state.error = action.payload || "Đã xảy ra lỗi";   // Lưu thông báo lỗi
      state.addressData = [];                            // Xóa dữ liệu cũ
    });
}
```

## 5. SELECTORS - LỌC DỮ LIỆU

### Selector cơ bản:
```typescript
export const selectAddressData = (state: RootState) => state.address.addressData;
export const selectAddressStatus = (state: RootState) => state.address.status;
export const selectAddressError = (state: RootState) => state.address.error;
```

### Selector phức tạp - Lọc theo cấp bậc:
```typescript
// Lấy danh sách quận/huyện theo tỉnh được chọn
export const selectDistrictsByCity = (state: RootState) => {
  const { addressData, selectedCity } = state.address;
  
  // Nếu chưa chọn tỉnh thì trả về mảng rỗng
  if (!selectedCity) return [];

  // Tìm tỉnh theo code được chọn
  const city = addressData.find((c) => c.code === Number(selectedCity));
  
  // Trả về danh sách quận/huyện hoặc mảng rỗng
  return city && city.districts ? city.districts : [];
};

// Lấy danh sách phường/xã theo huyện được chọn
export const selectWardsByDistrict = (state: RootState) => {
  const { addressData, selectedCity, selectedDistrict } = state.address;
  
  // Nếu chưa chọn tỉnh hoặc huyện thì trả về mảng rỗng
  if (!selectedCity || !selectedDistrict) return [];

  // Tìm tỉnh theo code
  const city = addressData.find((c) => c.code === Number(selectedCity));
  if (!city || !city.districts) return [];

  // Tìm huyện theo code
  const district = city.districts.find(
    (d) => d.code === Number(selectedDistrict)
  );
  
  // Trả về danh sách phường/xã hoặc mảng rỗng
  return district && district.wards ? district.wards : [];
};
```

## 6. SỬ DỤNG TRONG COMPONENT

### Gọi API khi component mount:
```typescript
const AddressSelector: React.FC = () => {
  const dispatch = useDispatch();
  
  // Lấy dữ liệu từ Redux store
  const addressData = useSelector(selectAddressData);
  const status = useSelector(selectAddressStatus);
  const error = useSelector(selectAddressError);
  const districts = useSelector(selectDistrictsByCity);
  const wards = useSelector(selectWardsByDistrict);

  // Gọi API khi component mount
  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchAddressData());
    }
  }, [dispatch, status]);

  // Hiển thị loading state
  if (status === "pending") {
    return <div>Đang tải dữ liệu địa chỉ...</div>;
  }

  // Hiển thị error state
  if (status === "failed") {
    return <div>Lỗi: {error}</div>;
  }

  // Render UI với dữ liệu
  return (
    <div>
      {/* Dropdown chọn tỉnh/thành phố */}
      <select onChange={(e) => dispatch(setSelectedCity(e.target.value))}>
        <option value="">Chọn tỉnh/thành phố</option>
        {addressData.map((city) => (
          <option key={city.code} value={city.code}>
            {city.name}
          </option>
        ))}
      </select>

      {/* Dropdown chọn quận/huyện */}
      <select onChange={(e) => dispatch(setSelectedDistrict(e.target.value))}>
        <option value="">Chọn quận/huyện</option>
        {districts.map((district) => (
          <option key={district.code} value={district.code}>
            {district.name}
          </option>
        ))}
      </select>

      {/* Dropdown chọn phường/xã */}
      <select onChange={(e) => dispatch(setSelectedWard(e.target.value))}>
        <option value="">Chọn phường/xã</option>
        {wards.map((ward) => (
          <option key={ward.code} value={ward.code}>
            {ward.name}
          </option>
        ))}
      </select>
    </div>
  );
};
```

## 7. FLOW HOẠT ĐỘNG

```
1. Component Mount
   ↓
2. useEffect trigger
   ↓
3. dispatch(fetchAddressData())
   ↓
4. createAsyncThunk thực thi
   ↓
5. axios.get() gọi API
   ↓
6. API trả về dữ liệu
   ↓
7. extraReducers xử lý response
   ↓
8. State được cập nhật
   ↓
9. Component re-render với dữ liệu mới
   ↓
10. User tương tác với dropdown
    ↓
11. Selectors lọc dữ liệu theo lựa chọn
    ↓
12. UI cập nhật theo dữ liệu đã lọc
```

## 8. TẠI SAO CÓ THỂ LẤY ĐƯỢC DỮ LIỆU?

### Lý do kỹ thuật:
1. **API công khai**: `provinces.open-api.vn` là API miễn phí, không cần authentication
2. **CORS enabled**: API cho phép cross-origin requests từ browser
3. **Structured data**: Dữ liệu có cấu trúc JSON chuẩn, dễ parse
4. **HTTP GET**: Method đơn giản, không cần body hay headers phức tạp

### Lý do về kiến trúc:
1. **Redux Toolkit**: Quản lý state và async operations hiệu quả
2. **TypeScript**: Đảm bảo type safety cho dữ liệu API
3. **Axios**: HTTP client mạnh mẽ, xử lý errors tốt
4. **React Hooks**: useSelector và useEffect quản lý lifecycle

### Lý do về UX:
1. **Caching**: Dữ liệu được lưu trong Redux store, không cần gọi lại API
2. **Loading states**: Hiển thị trạng thái loading/error cho user
3. **Hierarchical selection**: Chọn địa chỉ theo cấp bậc (Tỉnh → Huyện → Xã)
4. **Persistence**: Lưu địa chỉ đã chọn vào localStorage

## 9. LỢI ÍCH CỦA CÁCH TIẾP CẬN NÀY

### Performance:
- Chỉ gọi API 1 lần khi app khởi động
- Dữ liệu được cache trong memory
- Selectors tối ưu hóa việc lọc dữ liệu

### Maintainability:
- Code tách biệt rõ ràng (API logic, state management, UI)
- TypeScript đảm bảo type safety
- Dễ dàng test và debug

### User Experience:
- Loading states rõ ràng
- Error handling tốt
- Responsive UI với dữ liệu real-time

### Scalability:
- Dễ dàng thêm các API khác
- Pattern có thể tái sử dụng
- Tích hợp tốt với Redux ecosystem