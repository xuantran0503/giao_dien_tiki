import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartItem } from "./cartSlice";

// Interface for Checkout Data
export interface CheckoutData {
  id: string;
  items: CartItem[];
  totalAmount: number;
  deliveryAddress: string;
  paymentMethod: string;
  orderDate: string;
  status: "pending" | "confirmed" | "shipping" | "delivered" | "cancelled";
}

// Interface for Checkout State
export interface CheckoutState {
  history: CheckoutData[];
  data: CheckoutData | null;
}

const initialState: CheckoutState = {
  history: [],
  data: null,
};

const checkoutSlice = createSlice({
  name: "checkout",
  initialState,
  reducers: {
    addCheckout: (state, action: PayloadAction<CheckoutData>) => {
      state.history.push(action.payload);
      state.data = action.payload;
    },

    syncCheckout: (state, action: PayloadAction<{ history: CheckoutData[]; data: CheckoutData | null }>) => {
      state.history = action.payload.history;
      state.data = action.payload.data;
    },

    updateCheckoutStatus: (state, action: PayloadAction<{ id: string; status: CheckoutData["status"] }>) => {
      const { id, status } = action.payload;

      // Update in history
      const historyItem = state.history.find(item => item.id === id);
      if (historyItem) {
        historyItem.status = status;
      }

      // Update current data if it matches
      if (state.data && state.data.id === id) {
        state.data.status = status;
      }
    },

    clearCheckoutHistory: (state) => {
      state.history = [];
      state.data = null;
    },
  },
});

// Selectors
// Note: RootState will be imported from store.ts in components
export const selectCheckoutHistory = (state: { checkout: CheckoutState }) => state.checkout.history;
export const selectCurrentCheckout = (state: { checkout: CheckoutState }) => state.checkout.data;
export const selectCheckoutById = (state: { checkout: CheckoutState }, id: string) =>
  state.checkout.history.find(item => item.id === id);
export const selectCheckoutsByStatus = (state: { checkout: CheckoutState }, status: CheckoutData["status"]) =>
  state.checkout.history.filter(item => item.status === status);

export const {
  addCheckout,
  syncCheckout,
  updateCheckoutStatus,
  clearCheckoutHistory
} = checkoutSlice.actions;
export default checkoutSlice.reducer;
