# 📚 Hướng dẫn createAsyncThunk và Axios

## 🎯 Tổng quan

`createAsyncThunk` là một utility từ Redux Toolkit giúp xử lý các async operations (như API calls) một cách dễ dàng và có cấu trúc.

## 🔑 Khái niệm cơ bản

### 1. createAsyncThunk là gì?

`createAsyncThunk` tự động tạo ra 3 action types cho mỗi async operation:

- **pending**: Khi bắt đầu gọi API (đang loading)
- **fulfilled**: Khi API trả về thành công
- **rejected**: Khi API bị lỗi

### 2. Cú pháp cơ bản

```javascript
export const fetchAddressData = createAsyncThunk(
  "address/fetchAddressData", // Action type prefix
  async (arg, thunkAPI) => {
    // Payload creator function
    // Logic xử lý async
  }
);
```

## 📖 Giải thích chi tiết

### Tham số của createAsyncThunk

1. **Type String** (`'address/fetchAddressData'`):

   - Tên của action
   - Redux Toolkit sẽ tự động tạo 3 actions:
     - `address/fetchAddressData/pending`
     - `address/fetchAddressData/fulfilled`
     - `address/fetchAddressData/rejected`

2. **Payload Creator Function**:
   ```javascript
   async (arg, thunkAPI) => {
     // arg: tham số truyền vào khi dispatch
     // thunkAPI: object chứa các utilities
   };
   ```

### thunkAPI Object

`thunkAPI` cung cấp nhiều utilities hữu ích:

```javascript
{
  dispatch, // Dispatch actions khác
    getState, // Lấy state hiện tại
    extra, // Extra argument
    requestId, // Unique ID cho request
    signal, // AbortController.signal
    rejectWithValue, // Trả về custom error
    fulfillWithValue; // Trả về custom success value
}
```

## 🔄 So sánh Fetch vs Axios

### Fetch API (Cũ)

```javascript
useEffect(() => {
  fetch("https://provinces.open-api.vn/api/?depth=3")
    .then((res) => res.json()) // Phải parse JSON thủ công
    .then((data) => setAddressData(data || []))
    .catch((err) => console.log("Lỗi:", err));
}, []);
```

**Nhược điểm:**

- Phải parse JSON thủ công với `.json()`
- Không tự động throw error cho HTTP errors (404, 500...)
- Khó xử lý timeout
- Không có interceptors
- Không hỗ trợ progress tracking

### Axios (Mới)

```javascript
export const fetchAddressData = createAsyncThunk(
  "address/fetchAddressData",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        "https://provinces.open-api.vn/api/?depth=3"
      );
      return response.data; // Tự động parse JSON
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);
```

**Ưu điểm:**

- ✅ Tự động parse JSON (`response.data`)
- ✅ Tự động throw error cho HTTP errors
- ✅ Hỗ trợ timeout dễ dàng
- ✅ Có interceptors để xử lý request/response
- ✅ Hỗ trợ progress tracking
- ✅ Hỗ trợ cancel requests
- ✅ Tương thích tốt với cả browser và Node.js

## 🏗️ Cấu trúc Redux Slice với createAsyncThunk

### 1. Tạo Async Thunk

```javascript
export const fetchAddressData = createAsyncThunk(
  "address/fetchAddressData",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("API_URL");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
```

### 2. Tạo Slice với extraReducers

```javascript
const addressSlice = createSlice({
  name: "address",
  initialState: {
    addressData: [],
    status: "idle", // 'idle' | 'pending' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {
    // Synchronous actions
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAddressData.pending, (state) => {
        state.status = "pending";
        state.error = null;
      })
      .addCase(fetchAddressData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.addressData = action.payload;
      })
      .addCase(fetchAddressData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});
```

### 3. Sử dụng trong Component

```javascript
import { useDispatch, useSelector } from "react-redux";
import { fetchAddressData } from "./addressSlice";

function MyComponent() {
  const dispatch = useDispatch();
  const { addressData, status, error } = useSelector((state) => state.address);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchAddressData());
    }
  }, [dispatch, status]);

  if (status === "pending") return <div>Loading...</div>;
  if (status === "failed") return <div>Error: {error}</div>;

  return <div>{/* Render data */}</div>;
}
```

## 🎨 Patterns thường dùng

### 1. Truyền tham số vào thunk

```javascript
export const fetchCityData = createAsyncThunk(
  "address/fetchCityData",
  async (cityId) => {
    // Nhận tham số
    const response = await axios.get(`/api/cities/${cityId}`);
    return response.data;
  }
);

// Sử dụng
dispatch(fetchCityData(123));
```

### 2. Sử dụng getState để lấy state hiện tại

```javascript
export const updateAddress = createAsyncThunk(
  "address/updateAddress",
  async (newAddress, { getState }) => {
    const state = getState();
    const userId = state.user.id;

    const response = await axios.put(`/api/users/${userId}/address`, {
      address: newAddress,
    });
    return response.data;
  }
);
```

### 3. Dispatch actions khác từ thunk

```javascript
export const fetchAndProcessData = createAsyncThunk(
  "data/fetchAndProcess",
  async (_, { dispatch }) => {
    const response = await axios.get("/api/data");

    // Dispatch action khác
    dispatch(setProcessing(true));

    return response.data;
  }
);
```

### 4. Xử lý error chi tiết

```javascript
export const fetchData = createAsyncThunk(
  "data/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/data");
      return response.data;
    } catch (error) {
      // Xử lý error chi tiết
      if (error.response) {
        // Server trả về error response
        return rejectWithValue({
          message: error.response.data.message,
          status: error.response.status,
        });
      } else if (error.request) {
        // Request được gửi nhưng không nhận được response
        return rejectWithValue({
          message: "Không thể kết nối đến server",
        });
      } else {
        // Lỗi khác
        return rejectWithValue({
          message: error.message,
        });
      }
    }
  }
);
```

## 🔍 Selectors

Selectors giúp lấy dữ liệu từ state một cách có tổ chức:

```javascript
// Simple selectors
export const selectAddressData = (state) => state.address.addressData;
export const selectAddressStatus = (state) => state.address.status;

// Computed selectors
export const selectDistrictsByCity = (state) => {
  const { addressData, selectedCity } = state.address;
  if (!selectedCity) return [];

  const city = addressData.find((c) => c.code === Number(selectedCity));
  return city?.districts || [];
};

// Sử dụng
const districts = useSelector(selectDistrictsByCity);
```

## 📊 Loading States Pattern

```javascript
const initialState = {
  data: null,
  status: "idle", // 'idle' | 'pending' | 'succeeded' | 'failed'
  error: null,
};

// Trong component
if (status === "pending") return <LoadingSpinner />;
if (status === "failed") return <ErrorMessage error={error} />;
if (status === "succeeded") return <DataDisplay data={data} />;
```

## 🎯 Best Practices

1. **Luôn xử lý cả 3 trạng thái**: pending, fulfilled, rejected
2. **Sử dụng rejectWithValue** để trả về error message có ý nghĩa
3. **Kiểm tra status trước khi fetch** để tránh fetch nhiều lần
4. **Sử dụng selectors** thay vì truy cập state trực tiếp
5. **Tách logic phức tạp** ra khỏi component
6. **Xử lý cleanup** khi component unmount (nếu cần)

## 🚀 Ví dụ thực tế: AddressSelector

Xem file `addressSlice.js` và `AddressSelector.jsx` để thấy ví dụ hoàn chỉnh về cách:

- Tạo async thunk với axios
- Xử lý loading và error states
- Sử dụng selectors
- Kết hợp với localStorage
- Sync data giữa các components

## 📚 Tài liệu tham khảo

- [Redux Toolkit - createAsyncThunk](https://redux-toolkit.js.org/api/createAsyncThunk)
- [Axios Documentation](https://axios-http.com/docs/intro)
- [Redux Toolkit Tutorial](https://redux-toolkit.js.org/tutorials/overview)
