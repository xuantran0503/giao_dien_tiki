import type { AppStore } from "../store/store";
import type { CartState } from "../store/cartSlice";
import type { CheckoutState } from "../store/checkoutSlice";
import type { AddressState } from "../store/addressSlice";

interface PersistedState {
  cart?: string;
  checkout?: string;
  address?: string;
}

interface StorageEventData {
  key: string | null;
  newValue: string | null;
}

export const setupCrossTabSync = (store: AppStore): (() => void) => {
  const handleStorageChange = (event: StorageEvent): void => {
    const { key, newValue } = event as StorageEventData;

    // Nếu Cần local store mới đổi thành persist:root_v2 cho khớp với cấu hình trong store.ts cũng cần phải đổi ở đó

    if (key !== "persist:root" || !newValue) {
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
            payload: cartState,
          });
        } catch (cartError) {
          console.error("Error syncing cart state:", cartError);
        }
      }

      // Sync checkout state
      if (persistedState.checkout) {
        try {
          const checkoutState: CheckoutState = JSON.parse(
            persistedState.checkout
          );
          // console.log(
          //   "Storage event: Syncing checkout state, items:",
          //   checkoutState.history?.length
          // );
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
            payload: addressState,
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
