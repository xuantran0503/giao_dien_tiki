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

const rootReducer = combineReducers({
  cart: cartReducer,
  checkout: checkoutReducer,
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
      // Use the correct option names for RTK's default middleware
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
      immutableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

setupCrossTabSync(store);

export const persistor = persistStore(store);
export default store;
