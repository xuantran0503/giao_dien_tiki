import cartReducer from "./cartSlice";

import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web

// Combine tất cả reducers
const rootReducer = combineReducers({
  cart: cartReducer,
});

// Cấu hình persist
const persistConfig = {
  key: "root", // key cho storage
  storage, // sử dụng localStorage
  whitelist: ["cart"], // chỉ persist cart state
};

// Wrap root reducer với persistReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Bỏ qua các action của redux-persist
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

// Tạo persistor
export const persistor = persistStore(store);
export default store;
