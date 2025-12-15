import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// createAsyncThunk nhận 2 tham số:
// 1. type string: 'address/fetchAddressData' - tên action
// 2. payloadCreator: async function trả về data

export const fetchAddressData = createAsyncThunk(
  "address/fetchAddressData",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        "https://provinces.open-api.vn/api/?depth=3"
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const addressSlice = createSlice({
  name: "address",
  initialState: {
    addressData: [],
    status: "idle",
    error: null,

    selectedAddress: "P. Minh Khai, Q. Hoàng Mai, Hà Nội",
    selectedCity: "",
    selectedDistrict: "",
    selectedWard: "",
    locationType: "default",
    showLocationModal: false,
  },

  reducers: {
    setLocationType: (state, action) => {
      state.locationType = action.payload;
    },

    setSelectedCity: (state, action) => {
      state.selectedCity = action.payload;
      // Reset district và ward khi đổi city
      state.selectedDistrict = "";
      state.selectedWard = "";
    },

    setSelectedDistrict: (state, action) => {
      state.selectedDistrict = action.payload;
      // Reset ward khi đổi district
      state.selectedWard = "";
    },

    setSelectedWard: (state, action) => {
      state.selectedWard = action.payload;
    },

    setSelectedAddress: (state, action) => {
      state.selectedAddress = action.payload;
    },

    setShowLocationModal: (state, action) => {
      state.showLocationModal = action.payload;
    },

    resetSelection: (state) => {
      state.locationType = "default";
      state.selectedCity = "";
      state.selectedDistrict = "";
      state.selectedWard = "";
    },

    loadAddressFromStorage: (state) => {
      const saved = window.localStorage.getItem("selectedAddress");
      if (saved && typeof saved === "string") {
        state.selectedAddress = saved;
      }
    },

    syncAddress: (state, action) => {
      // Chỉ sync selectedAddress để tránh conflict
      if (action.payload && action.payload.selectedAddress) {
        state.selectedAddress = action.payload.selectedAddress;
      }
    },
  },

  //=====  extraReducers - Async Actions Handler ======
  extraReducers: (builder) => {
    builder
      // Khi bắt đầu fetch (pending)
      .addCase(fetchAddressData.pending, (state) => {
        state.status = "pending";
        state.error = null;
      })

      // Khi fetch thành công (fulfilled)
      .addCase(fetchAddressData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.addressData = action.payload || [];
        state.error = null;
      })

      // Khi fetch thất bại (rejected)
      .addCase(fetchAddressData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Đã xảy ra lỗi";
        state.addressData = [];
      });
  },
});

//  Selectors - Lấy dữ liệu từ state
export const selectAddressData = (state) => state.address.addressData;
export const selectAddressStatus = (state) => state.address.status;
export const selectAddressError = (state) => state.address.error;
export const selectSelectedAddress = (state) => state.address.selectedAddress;
export const selectLocationType = (state) => state.address.locationType;
export const selectSelectedCity = (state) => state.address.selectedCity;
export const selectSelectedDistrict = (state) => state.address.selectedDistrict;
export const selectSelectedWard = (state) => state.address.selectedWard;
export const selectShowLocationModal = (state) =>
  state.address.showLocationModal;

// lấy danh sách quận/huyện theo thành phố
export const selectDistrictsByCity = (state) => {
  const { addressData, selectedCity } = state.address;
  if (!selectedCity) return [];

  const city = addressData.find((c) => c.code === Number(selectedCity));
  return city && city.districts ? city.districts : [];
};

//lấy danh sách phường/xã theo quận/huyện
export const selectWardsByDistrict = (state) => {
  const { addressData, selectedCity, selectedDistrict } = state.address;
  if (!selectedCity || !selectedDistrict) return [];

  const city = addressData.find((c) => c.code === Number(selectedCity));
  if (!city || !city.districts) return [];

  const district = city.districts.find(
    (d) => d.code === Number(selectedDistrict)
  );
  return district && district.wards ? district.wards : [];
};

export const {
  setLocationType,
  setSelectedCity,
  setSelectedDistrict,
  setSelectedWard,
  setSelectedAddress,
  setShowLocationModal,
  resetSelection,
  loadAddressFromStorage,
  syncAddress,
} = addressSlice.actions;

export default addressSlice.reducer;
