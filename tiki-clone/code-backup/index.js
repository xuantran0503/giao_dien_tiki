import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import App from "../src/App";
import "./index.css";

import { syncCart } from "../src/store/cartSlice";
import store, { persistor } from "../src/store/store";
import { PersistGate } from "redux-persist/integration/react";
import { setupCrossTabSync } from "../src/utils/syncTabs";

// setupCrossTabSync(store, syncCart);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>
);
