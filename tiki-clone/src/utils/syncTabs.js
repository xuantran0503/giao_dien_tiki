// Utility để đồng bộ Redux state giữa các tab/window

/**
 * Thiết lập listener để đồng bộ state giữa các tab
 * Sử dụng storage event để lắng nghe thay đổi từ localStorage
 * 
 * @param {Object} store - Redux store instance
 * @param {Function} syncAction - Action creator để sync state
 */
export const setupCrossTabSync = (store, syncAction) => {
  // Lắng nghe storage event (chỉ trigger khi localStorage thay đổi từ tab khác)
  const handleStorageChange = (event) => {
    // Kiểm tra xem có phải là persist:root key không
    if (event.key === "persist:root" && event.newValue) {
      try {
        // Parse dữ liệu mới từ localStorage
        const newState = JSON.parse(event.newValue);
        
        // Parse cart state (redux-persist lưu dưới dạng string)
        if (newState.cart) {
          const cartState = JSON.parse(newState.cart);
          
          // Dispatch action để sync state
          store.dispatch(syncAction(cartState));
          
          console.log("🔄 Cart synced from another tab:", cartState);
        }
      } catch (error) {
        console.error("Error syncing cart from storage event:", error);
      }
    }
  };

  // Đăng ký event listener
  window.addEventListener("storage", handleStorageChange);

  // Trả về function để cleanup (gỡ bỏ listener)
  return () => {
    window.removeEventListener("storage", handleStorageChange);
  };
};

/**
 * Broadcast thay đổi đến các tab khác
 * Có thể sử dụng BroadcastChannel API cho real-time sync tốt hơn
 */
export const createBroadcastChannel = (channelName = "tiki-cart-sync") => {
  // Kiểm tra browser có support BroadcastChannel không
  if (typeof BroadcastChannel !== "undefined") {
    return new BroadcastChannel(channelName);
  }
  return null;
};

/**
 * Setup BroadcastChannel để sync real-time giữa các tab
 * Nhanh hơn storage event và work với cả private/incognito mode
 */
export const setupBroadcastSync = (store, syncAction, channelName = "tiki-cart-sync") => {
  const channel = createBroadcastChannel(channelName);
  
  if (!channel) {
    console.warn("BroadcastChannel not supported, falling back to storage events");
    return null;
  }

  // Lắng nghe message từ các tab khác
  channel.onmessage = (event) => {
    if (event.data && event.data.type === "CART_UPDATE") {
      console.log("📡 Received cart update via BroadcastChannel:", event.data.payload);
      store.dispatch(syncAction(event.data.payload));
    }
  };

  // Function để broadcast thay đổi
  const broadcast = (cartState) => {
    channel.postMessage({
      type: "CART_UPDATE",
      payload: cartState,
      timestamp: Date.now(),
    });
  };

  // Cleanup function
  const cleanup = () => {
    channel.close();
  };

  return { broadcast, cleanup };
};

