import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
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

// Import reducers with their state types
import cartReducer, { CartState } from "./cartSlice";
import checkoutReducer, { CheckoutState } from "./checkoutSlice";
import addressReducer, { AddressState } from "./addressSlice";

// Define RootState interface
export interface RootState {
  cart: CartState;
  checkout: CheckoutState;
  address: AddressState;
}

// Root reducer with proper typing
const rootReducer = combineReducers({
  cart: cartReducer,
  checkout: checkoutReducer,
  address: addressReducer,
});

// Persist config with proper typing
const persistConfig: PersistConfig<RootState> = {
  key: "root",
  storage,
  // Optional: specify which slices to persist
  whitelist: ["cart", "address", "checkout"],
};

// Persisted reducer with proper typing
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store with proper typing
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

// Setup cross-tab synchronization
setupCrossTabSync(store);

// Export types for use in components
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;

// Create persistor
export const persistor = persistStore(store);

// Export store as default
export default store;