import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartItem } from "./cartSlice";
import { RootState } from "./store";

export interface AddressSnapshot {
  detailedAddress: string;
  generalAddress: string;
  timestamp: string;
}

export interface CheckoutData {
  id: string;
  items: CartItem[];
  totalAmount: number;
  deliveryAddress: string;
  paymentMethod: string;
  orderDate: string;
  status: "pending" | "confirmed" | "shipping" | "delivered" | "cancelled";
  customerInfo?: {
    fullName: string;
    phone: string;
    email: string;
    note?: string;
  };
  addressSnapshot?: AddressSnapshot; // Địa chỉ tại thời điểm mua hàng
}

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
      const newOrder = action.payload;
      state.history.push(newOrder);
      state.data = newOrder;
    },

    syncCheckout: (
      state,
      action: PayloadAction<{
        history: CheckoutData[];
        data: CheckoutData | null;
      }>
    ) => {
      // console.log(
      //   "Syncing checkout history from other tab:",
      //   action.payload.history.length,
      //   "items"
      // );
      state.history = action.payload.history;
      state.data = action.payload.data;
    },

    updateCheckoutStatus: (
      state,
      action: PayloadAction<{ id: string; status: CheckoutData["status"] }>
    ) => {
      const { id, status } = action.payload;

      const historyItem = state.history.find((item) => item.id === id);
      if (historyItem) {
        historyItem.status = status;
      }

      // Update current data if it matches
      if (state.data && state.data.id === id) {
        state.data.status = status;
      }
    },

    clearCheckoutHistory: (state) => {
      console.log("Action: clearCheckoutHistory triggered");
      state.history = [];
      state.data = null;
      console.log("Checkout history cleared in state");
    },
  },
});

export const selectCheckoutHistory = (state: RootState) =>
  state.checkout.history;
export const selectCurrentCheckout = (state: RootState) => state.checkout.data;
export const selectCheckoutById = (state: RootState, id: string) =>
  state.checkout.history.find((item) => item.id === id);
export const selectCheckoutsByStatus = (
  state: RootState,
  status: CheckoutData["status"]
) => state.checkout.history.filter((item) => item.status === status);

export const {
  addCheckout,
  syncCheckout,
  updateCheckoutStatus,
  clearCheckoutHistory,
} = checkoutSlice.actions;
export default checkoutSlice.reducer;
