import { createSlice } from "@reduxjs/toolkit";

const getStoredState = () => {
  try {
    return (
      JSON.parse(localStorage.getItem("checkout_history")) || {
        history: [],
        data: null,
      }
    );
  } catch {
    return { history: [], data: null };
  }
};

const checkoutSlice = createSlice({
  name: "checkout",
  initialState: getStoredState(),
  reducers: {
    saveCheckout: (state, action) => {
      const newOrder = action.payload;

      const latestHistory = getStoredState().history;

      state.history = [...latestHistory, newOrder];
      state.data = newOrder;

      localStorage.setItem("checkout_history", JSON.stringify(state));
    },

    clearCheckoutHistory: (state) => {
      state.history = [];
      state.data = null;
      localStorage.setItem("checkout_history", JSON.stringify(state));
    },

    syncFromStorage: (state, action) => {
      // const { history = [], data = null } = action.payload || {};
      // const { history, data } = action.payload;
      const history = action.payload.history;
      const data = action.payload.data;

      state.history = history;
      state.data = data;
    },
  },
});

export const { saveCheckout, clearCheckoutHistory, syncFromStorage } =
  checkoutSlice.actions;
export default checkoutSlice.reducer;
