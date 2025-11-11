import { createSlice } from "@reduxjs/toolkit";

// Initial state - Redux Persist sẽ tự động load và save
const initialState = {
  items: [],
  totalQuantity: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // Thêm sản phẩm vào giỏ hàng
    addToCart: (state, action) => {
      const newItem = action.payload;
      const existingItem = state.items.find((item) => item.id === newItem.id);

      if (existingItem) {
        // Nếu sản phẩm đã có, cộng thêm số lượng
        existingItem.quantity += newItem.quantity;
        state.totalQuantity += newItem.quantity;
      } else {
        // Nếu chưa có, thêm mới vào giỏ hàng
        state.items.push({
          id: newItem.id,
          name: newItem.name,
          image: newItem.image,
          price: newItem.price,
          originalPrice: newItem.originalPrice,
          discount: newItem.discount,
          quantity: newItem.quantity,
        });
        state.totalQuantity += newItem.quantity;
      }
      // Redux Persist tự động save vào localStorage
    },

    // Xóa sản phẩm khỏi giỏ hàng
    removeFromCart: (state, action) => {
      const id = action.payload;
      const existingItem = state.items.find((item) => item.id === id);

      if (existingItem) {
        state.totalQuantity -= existingItem.quantity;
        state.items = state.items.filter((item) => item.id !== id);
      }
      // Redux Persist tự động save
    },

    // Cập nhật số lượng sản phẩm
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const existingItem = state.items.find((item) => item.id === id);

      if (existingItem && quantity > 0) {
        const diff = quantity - existingItem.quantity;
        existingItem.quantity = quantity;
        state.totalQuantity += diff;
      }
      // Redux Persist tự động save
    },

    // Xóa toàn bộ giỏ hàng
    clearCart: (state) => {
      state.items = [];
      state.totalQuantity = 0;
      // Redux Persist tự động save
    },

    // Action để đồng bộ state từ tab khác (qua storage event)
    syncCart: (state, action) => {
      return action.payload;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  syncCart,
} = cartSlice.actions;
export default cartSlice.reducer;
