import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { createSelector } from "reselect";
import axios from "axios";
import { RootState } from "./store";

export interface Ward {
  code: number;
  name: string;
}

export interface District {
  code: number;
  name: string;
  wards: Ward[];
}

export interface City {
  code: number;
  name: string;
  districts: District[];
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
  showLocationModal: false,

  selectedAddress: "P. Minh Khai, Q. Hoàng Mai, Hà Nội",
  selectedCity: "",
  selectedDistrict: "",
  selectedWard: "",
  locationType: "default",
};

export const fetchAddressData = createAsyncThunk<City[], void, { rejectValue: string }>(
  "address/fetchAddressData",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get<City[]>(
        "https://provinces.open-api.vn/api/?depth=3"
      );
      return response.data;
    } catch (error) 
    {
      return rejectWithValue( error instanceof Error ? error.message : "Failed to fetch address data" );
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
      console.log("Change address new:", action.payload);
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
export const selectAddressData = (state: RootState  ) => state.address.addressData;
export const selectAddressStatus = (state: RootState) => state.address.status;
export const selectAddressError = (state: RootState) => state.address.error;
export const selectSelectedAddress = (state: RootState) => state.address.selectedAddress;
export const selectLocationType = (state: RootState) => state.address.locationType;
export const selectSelectedCity = (state: RootState) => state.address.selectedCity;
export const selectSelectedDistrict = (state: RootState) => state.address.selectedDistrict;
export const selectSelectedWard = (state: RootState) => state.address.selectedWard;
export const selectShowLocationModal = (state: RootState) => state.address.showLocationModal;

// Memoized selectors using "reselect" to prevent unnecessary re-renders
const EMPTY_ARRAY: never[] = [];

export const selectDistrictsByCity = createSelector(
  [selectAddressData, selectSelectedCity],
  (addressData, selectedCity) => {
    if (!selectedCity) return EMPTY_ARRAY;

    const city = addressData.find((c) => c.code === Number(selectedCity));
    return city?.districts || EMPTY_ARRAY;
  }
);

export const selectWardsByDistrict = createSelector(
  [selectAddressData, selectSelectedCity, selectSelectedDistrict],
  (addressData, selectedCity, selectedDistrict) => {
    if (!selectedCity || !selectedDistrict) return EMPTY_ARRAY;

    const city = addressData.find((c) => c.code === Number(selectedCity));
    if (!city?.districts) return EMPTY_ARRAY;

    const district = city.districts.find(
      (d) => d.code === Number(selectedDistrict)
    );
    return district?.wards || EMPTY_ARRAY;
  }
);

export const {
  setLocationType,
  setSelectedCity,
  setSelectedDistrict,
  setSelectedWard,
  setSelectedAddress,
  setShowLocationModal,
  resetSelection,
  syncAddress,
} = addressSlice.actions;

export default addressSlice.reducer;
