export const setupCrossTabSync = (store, syncAction) => {
  // Lắng nghe storage event (chỉ trigger khi localStorage thay đổi từ tab khác)
  const handleStorageChange = (event) => {
    // Kiểm tra xem có phải là persist:root key không
    if (event.key === "persist:root" && event.newValue) {
      try {
        const newState = JSON.parse(event.newValue);

        if (newState.cart) {
          const cartState = JSON.parse(newState.cart);

          // Dispatch action để sync state
          store.dispatch(syncAction(cartState));

          console.log("Cart synced from another tab:", cartState);
        }
      } catch (error) {
        console.error("Error syncing cart from storage event:", error);
      }
    }
  };

  window.addEventListener("storage", handleStorageChange);

  // Trả về function để cleanup (gỡ bỏ listener)
  return () => {
    window.removeEventListener("storage", handleStorageChange);
  };
};
