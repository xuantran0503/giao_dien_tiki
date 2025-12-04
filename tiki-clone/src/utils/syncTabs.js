export const setupCrossTabSync = (store) => {
  const handleStorageChange = (event) => {
    if (event.key === "persist:root" && event.newValue) {
      try {
        const newState = JSON.parse(event.newValue);

        if (newState.cart) {
          const cartState = JSON.parse(newState.cart);
          store.dispatch({ type: "cart/syncCart", payload: cartState });

          // store.dispatch({ type: "cart/syncCart", payload: newState.cart });
        }

        if (newState.checkout) {
          const checkoutState = JSON.parse(newState.checkout);
          store.dispatch({
            type: "checkout/syncCheckout",
            payload: checkoutState,
          });
        }
      } catch (error) {
        console.error("Error syncing state:", error);
      }
    }
  };

  window.addEventListener("storage", handleStorageChange);

  return () => {
    window.removeEventListener("storage", handleStorageChange);
  };
};
