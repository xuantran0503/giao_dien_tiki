import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  createTransform,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  PersistConfig,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import { setupCrossTabSync } from "../utils/syncTabs";

import cartReducer, { CartState } from "./cartSlice";
import checkoutReducer, { CheckoutState } from "./checkoutSlice";
import addressReducer, { AddressState } from "./addressSlice";

export interface RootState {
  cart: CartState;
  checkout: CheckoutState;
  address: AddressState;
}

const addressTransform = createTransform(
  // SAVE: Loại bỏ các field không cần thiết
  (inboundState: AddressState) => {
    const { addressData, status, error, showLocationModal, ...rest } = inboundState;

    // console.log("Saving address to localStorage:", rest);
    return rest;
  },

  //LOAD: Khôi phục giá trị mặc định cho các field đã loại bỏ
  (outboundState: Partial<AddressState>): AddressState => {

    const result = {
      ...outboundState,
      
      // Khôi phục giá trị mặc định
      addressData: [],
      status: "idle" as const, // Type assertion để giữ nguyên kiểu
      error: null,
      showLocationModal: false,
    } as AddressState;

    // console.log("Loading address from localStorage:", result);
    return result;
  },

  { whitelist: ["address"] }
);

// Root reducer with proper typing
const rootReducer = combineReducers({
  cart: cartReducer,
  checkout: checkoutReducer,
  address: addressReducer,
});

const persistConfig: any = {
  key: "root",
  storage,
  whitelist: ["cart", "address", "checkout"], 
  transforms: [addressTransform],
  throttle: 100, // Lưu localStorage tối đa 1 lần/100ms
  // debug: true, // Enable debug logging
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // Redux-persist middleware configuration
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        // Tăng warning threshold từ 32ms lên 128ms
        warnAfter: 128,
      },
      immutableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        // Tăng warning threshold từ 32ms lên 128ms
        warnAfter: 128,
        // Bỏ qua check cho addressData vì có thể rất lớn
        ignoredPaths: ["address.addressData"],
      },
    }),
});

setupCrossTabSync(store);

export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;

export const persistor = persistStore(store);

export default store;