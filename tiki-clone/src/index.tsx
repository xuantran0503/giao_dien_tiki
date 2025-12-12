import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import App from "./App";
import "./index.css";

// Import store with proper TypeScript types
import store, { persistor } from "./store/store";
import { setupCrossTabSync } from "./utils/syncTabs";

// Setup cross-tab synchronization
// setupCrossTabSync(store);

// Get root element with proper typing
const rootElement = document.getElementById("root");
if (!rootElement) {
    throw new Error("Root element not found");
}

const root = ReactDOM.createRoot(rootElement);

root.render(
    <React.StrictMode>
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <App />
            </PersistGate>
        </Provider>
    </React.StrictMode>
);