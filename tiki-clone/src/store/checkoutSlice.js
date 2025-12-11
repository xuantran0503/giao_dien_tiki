import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  history: [],
  data: null,
};

const checkoutSlice = createSlice({
  name: "checkout",
  initialState,
  reducers: {
    addCheckout: (state, action) => {
      state.history.push(action.payload);
      state.data = action.payload;
    },

    syncCheckout: (state, action) => {
      state.history = action.payload.history;
      state.data = action.payload.data;
    },

    clearCheckoutHistory: (state) => {
      state.history = [];
      state.data = null;
    },
  },
});

export const { addCheckout, clearCheckoutHistory } = checkoutSlice.actions;
export default checkoutSlice.reducer;
