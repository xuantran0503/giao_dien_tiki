import type { AppStore } from "../store/store";
import type { CartState } from "../store/cartSlice";
import type { CheckoutState } from "../store/checkoutSlice";
import type { AddressState } from "../store/addressSlice";

/**
 * Interface for persisted state structure
 */
interface PersistedState {
    cart?: string;
    checkout?: string;
    address?: string;
    // _persist?: {
    //     version: number;
    //     rehydrated: boolean;
    // };
}

/**
 * Interface for storage event data
 */
interface StorageEventData {
    key: string | null;
    newValue: string | null;
    // oldValue: string | null;
}

/**
 * Setup cross-tab synchronization for Redux store
 * This function listens to localStorage changes and syncs state across browser tabs
 * 
 * @param store - The Redux store instance
 * @returns Cleanup function to remove event listeners
 */
export const setupCrossTabSync = (store: AppStore): (() => void) => {
    /**
     * Handle localStorage change events
     * @param event - Storage event from localStorage
     */
    const handleStorageChange = (event: StorageEvent): void => {
        const { key, newValue } = event as StorageEventData;

        // Only handle redux-persist root key changes
        if (key !== "persist:root" || !newValue) {
            return;
        }

        try {
            const persistedState: PersistedState = JSON.parse(newValue);

            // Sync cart state across tabs
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

            // Sync checkout state across tabs
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

            // Sync address state across tabs
            if (persistedState.address) {
                try {
                    const addressState: AddressState = JSON.parse(persistedState.address);
                    store.dispatch({
                        type: "address/syncAddress",
                        payload: { selectedAddress: addressState.selectedAddress },
                    });
                } catch (addressError) {
                    console.error("Error syncing address state:", addressError);
                }
            }

        } catch (parseError) {
            console.error("Error parsing persisted state:", parseError);
        }
    };

    // Add event listener for storage changes
    window.addEventListener("storage", handleStorageChange);

    // Return cleanup function
    return (): void => {
        window.removeEventListener("storage", handleStorageChange);
    };
};

/**
 * Manually trigger cross-tab sync for specific state slice
 * @param store - The Redux store instance
 * @param sliceName - Name of the slice to sync
 */
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

/**
 * Check if cross-tab sync is supported
 * @returns True if localStorage and storage events are supported
 */
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

/**
 * Get current persisted state from localStorage
 * @returns Parsed persisted state or null if not available
 */
// export const getCurrentPersistedState = (): PersistedState | null => {
//     try {
//         const persistedData = localStorage.getItem("persist:root");
//         return persistedData ? JSON.parse(persistedData) : null;
//     } catch (error) {
//         console.error("Error getting persisted state:", error);
//         return null;
//     }
// };