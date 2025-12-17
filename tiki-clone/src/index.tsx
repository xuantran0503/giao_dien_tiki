import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import App from "./App";
import "./index.css";


import store, { persistor } from "./store/store";
import { setupCrossTabSync } from "./utils/syncTabs";



// Get root element with proper typing
const rootElement = document.getElementById("root");
if (!rootElement) {
    throw new Error("Root element not found");
}

const root = ReactDOM.createRoot(rootElement);

// Chỉ sử dụng StrictMode trong production để tránh double rendering trong development
const AppWrapper = process.env.NODE_ENV === 'production' ? React.StrictMode : React.Fragment;

root.render(
    <AppWrapper>
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <App />
            </PersistGate>
        </Provider>
    </AppWrapper>
);