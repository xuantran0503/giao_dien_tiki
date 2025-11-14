export const setupCrossTabSync = (store, syncAction) => {
  const handleStorageChange = (event) => {
    if (event.key === "persist:root" && event.newValue) {
      try {
        const newState = JSON.parse(event.newValue);

        if (newState.cart) {
          const cartState = JSON.parse(newState.cart);
          // Dispatch action để sync state
          store.dispatch(syncAction(cartState));
          // console.log("Cart synced from another tab:", cartState);
        }
      } catch (error) {
        // console.error("Error syncing cart from storage event:", error);
      }
    }
  };

  window.addEventListener("storage", handleStorageChange);

  return () => {
    window.removeEventListener("storage", handleStorageChange);
  };
};
