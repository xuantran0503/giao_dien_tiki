import type { AppStore } from "../store/store";
import type { CartState } from "../store/cartSlice";
import type { CheckoutState } from "../store/checkoutSlice";
import type { AddressState } from "../store/addressSlice";

interface PersistedState {
    cart?: string;
    checkout?: string;
    address?: string;
    // _persist?: {
    //     version: number;
    //     rehydrated: boolean;
    // };
}

interface StorageEventData {
    key: string | null;
    newValue: string | null;
}

export const setupCrossTabSync = (store: AppStore): (() => void) => {

    const handleStorageChange = (event: StorageEvent): void => {
        const { key, newValue } = event as StorageEventData;
        // only care about changes to the persisted root state
        // Cần đổi thành persist:root_v2 cho khớp với cấu hình trong store.ts
        if (key !== "persist:root_v2" || !newValue) {
            return;
        }

        try {
            const persistedState: PersistedState = JSON.parse(newValue);

            // Sync cart state 
            if (persistedState.cart) {
                try {
                    const cartState: CartState = JSON.parse(persistedState.cart);
                    store.dispatch({
                        type: "cart/syncCart",
                        payload: cartState
                    });
                } catch (cartError) {
                    console.error("Error syncing cart state:", cartError);
                }
            }

            // Sync checkout state
            if (persistedState.checkout) {
                try {
                    const checkoutState: CheckoutState = JSON.parse(persistedState.checkout);
                    store.dispatch({
                        type: "checkout/syncCheckout",
                        payload: checkoutState,
                    });
                } catch (checkoutError) {
                    console.error("Error syncing checkout state:", checkoutError);
                }
            }

            // Sync address state
            if (persistedState.address) {
                try {
                    const addressState: AddressState = JSON.parse(persistedState.address);
                    store.dispatch({
                        type: "address/syncAddress",
                        // payload: { selectedAddress: addressState.selectedAddress },
                        payload: addressState
                    });
                } catch (addressError) {
                    console.error("Error syncing address state:", addressError);
                }
            }

        } catch (parseError) {
            console.error("Error parsing persisted state:", parseError);
        }
    };

    window.addEventListener("storage", handleStorageChange);

    return (): void => {
        window.removeEventListener("storage", handleStorageChange);
    };
};


// export const triggerCrossTabSync = (
//     store: AppStore,
//     sliceName: "cart" | "checkout" | "address"
// ): void => {
//     try {
//         const persistedData = localStorage.getItem("persist:root");
//         if (!persistedData) return;

//         const persistedState: PersistedState = JSON.parse(persistedData);

//         switch (sliceName) {
//             case "cart":
//                 if (persistedState.cart) {
//                     const cartState: CartState = JSON.parse(persistedState.cart);
//                     store.dispatch({ type: "cart/syncCart", payload: cartState });
//                 }
//                 break;

//             case "checkout":
//                 if (persistedState.checkout) {
//                     const checkoutState: CheckoutState = JSON.parse(persistedState.checkout);
//                     store.dispatch({ type: "checkout/syncCheckout", payload: checkoutState });
//                 }
//                 break;

//             case "address":
//                 if (persistedState.address) {
//                     const addressState: AddressState = JSON.parse(persistedState.address);
//                     store.dispatch({
//                         type: "address/syncAddress",
//                         payload: { selectedAddress: addressState.selectedAddress }
//                     });
//                 }
//                 break;

//             default:
//                 console.warn(`Unknown slice name: ${sliceName}`);
//         }
//     } catch (error) {
//         console.error(`Error manually syncing ${sliceName} state:`, error);
//     }
// };


// export const isCrossTabSyncSupported = (): boolean => {
//     try {
//         return (
//             typeof Storage !== "undefined" &&
//             typeof window !== "undefined" &&
//             typeof window.addEventListener === "function" &&
//             typeof localStorage !== "undefined"
//         );
//     } catch {
//         return false;
//     }
// };


// export const getCurrentPersistedState = (): PersistedState | null => {
//     try {
//         const persistedData = localStorage.getItem("persist:root");
//         return persistedData ? JSON.parse(persistedData) : null;
//     } catch (error) {
//         console.error("Error getting persisted state:", error);
//         return null;
//     }
// };