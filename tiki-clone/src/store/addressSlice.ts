import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

export interface City {
  code: number;
  name: string;
  districts: District[];
}
// Type tương đương
// export type City = {
//   code: number;
//   name: string;
//   districts: District[];
// };

export interface District {
  code: number;
  name: string;
  wards: Ward[];
}

export interface Ward {
  code: number;
  name: string;
}

export interface AddressState {
  addressData: City[];
  status: "idle" | "pending" | "succeeded" | "failed";
  error: string | null;
  selectedAddress: string;
  selectedCity: string;
  selectedDistrict: string;
  selectedWard: string;
  locationType: "default" | "custom";
  showLocationModal: boolean;
}

const initialState: AddressState = {
  addressData: [],
  status: "idle",
  error: null,
  selectedAddress: "P. Minh Khai, Q. Hoàng Mai, Hà Nội",
  selectedCity: "",
  selectedDistrict: "",
  selectedWard: "",
  locationType: "default",
  showLocationModal: false,
};

export const fetchAddressData = createAsyncThunk<City[], void, { rejectValue: string }>(
  "address/fetchAddressData",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get<City[]>(
        "https://provinces.open-api.vn/api/?depth=3"
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

const addressSlice = createSlice({
  name: "address",
  initialState,
  reducers: {
    setLocationType: (state, action: PayloadAction<"default" | "custom">) => {
      state.locationType = action.payload;
    },
    setSelectedCity: (state, action: PayloadAction<string>) => {
      state.selectedCity = action.payload;
      state.selectedDistrict = "";
      state.selectedWard = "";
    },
    setSelectedDistrict: (state, action: PayloadAction<string>) => {
      state.selectedDistrict = action.payload;
      state.selectedWard = "";
    },
    setSelectedWard: (state, action: PayloadAction<string>) => {
      state.selectedWard = action.payload;
    },
    setSelectedAddress: (state, action: PayloadAction<string>) => {
      state.selectedAddress = action.payload;
    },
    setShowLocationModal: (state, action: PayloadAction<boolean>) => {
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
    syncAddress: (state, action: PayloadAction<{ selectedAddress: string }>) => {
      if (action.payload && action.payload.selectedAddress) {
        state.selectedAddress = action.payload.selectedAddress;
      }
    },
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
        state.error = null;
      })
      .addCase(fetchAddressData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Đã xảy ra lỗi";
        state.addressData = [];
      });
  },
});

// RootState will be imported from store.ts in components
export const selectAddressData = (state: { address: AddressState }) => state.address.addressData;
export const selectAddressStatus = (state: { address: AddressState }) => state.address.status;
export const selectAddressError = (state: { address: AddressState }) => state.address.error;
export const selectSelectedAddress = (state: { address: AddressState }) => state.address.selectedAddress;
export const selectLocationType = (state: { address: AddressState }) => state.address.locationType;
export const selectSelectedCity = (state: { address: AddressState }) => state.address.selectedCity;
export const selectSelectedDistrict = (state: { address: AddressState }) => state.address.selectedDistrict;
export const selectSelectedWard = (state: { address: AddressState }) => state.address.selectedWard;
export const selectShowLocationModal = (state: { address: AddressState }) => state.address.showLocationModal;

export const selectDistrictsByCity = (state: { address: AddressState }) => {
  const { addressData, selectedCity } = state.address;
  if (!selectedCity) return [];

  const city = addressData.find((c) => c.code === Number(selectedCity));
  return city && city.districts ? city.districts : [];
};

export const selectWardsByDistrict = (state: { address: AddressState }) => {
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
