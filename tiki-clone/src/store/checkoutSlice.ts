import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartItem } from "./cartSlice";


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
      // console.log("Processing new order:", {
      //   id: newOrder.id,
      //   itemCount: newOrder.items.length,
      //   totalAmount: newOrder.totalAmount,
      //   items: newOrder.items.map(item => ({ id: item.id, name: item.name, quantity: item.quantity }))
      // });

      // Simple duplicate check based on ID only
      const isDuplicate = state.history.some(existingOrder => existingOrder.id === newOrder.id);

      if (!isDuplicate) {
        // console.log("Adding new order to history:", newOrder.id);
        // console.log("Current history length:", state.history.length);
        state.history.push(newOrder);
        state.data = newOrder;
        // console.log("New history length:", state.history.length);
      } else {
        console.log("Duplicate order detected, skipping:", newOrder.id);
      }
    },

    syncCheckout: (state, action: PayloadAction<{ history: CheckoutData[]; data: CheckoutData | null }>) => {
      state.history = action.payload.history;
      state.data = action.payload.data;
    },

    updateCheckoutStatus: (state, action: PayloadAction<{ id: string; status: CheckoutData["status"] }>) => {
      const { id, status } = action.payload;

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
      console.log("Clearing checkout history...");
      console.log("History length before clear:", state.history.length);

      state.history = [];
      state.data = null;

      console.log("History length after clear:", state.history.length);
      console.log("Checkout history cleared successfully");

      // Force clear from localStorage to prevent redux-persist from restoring
      try {
        const persistKey = "persist:root";
        const persistedData = localStorage.getItem(persistKey);
        if (persistedData) {
          const parsed = JSON.parse(persistedData);
          if (parsed.checkout) {
            parsed.checkout = JSON.stringify({ history: [], data: null });
            localStorage.setItem(persistKey, JSON.stringify(parsed));
            console.log("Cleared checkout from localStorage");
          }
        }
      } catch (error) {
        console.error("Error clearing checkout from localStorage:", error);
      }
    },
  },
});


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
