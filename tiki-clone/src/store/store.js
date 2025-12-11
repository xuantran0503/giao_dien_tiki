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
} from "redux-persist";

import storage from "redux-persist/lib/storage";

import { setupCrossTabSync } from "../utils/syncTabs";

import cartReducer from "./cartSlice";
import checkoutReducer from "./checkoutSlice";
import addressReducer from "./addressSlice";

const rootReducer = combineReducers({
  cart: cartReducer,
  checkout: checkoutReducer,
  address: addressReducer,
});

const persistConfig = {
  key: "root",
  storage,
};

// Wrap root reducer với persistReducer
const pReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: pReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // Tăng threshold để tránh warning với state lớn
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

export const persistor = persistStore(store);
export default store;
