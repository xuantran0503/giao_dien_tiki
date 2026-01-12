import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  totalQuantity: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
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
    },

    removeFromCart: (state, action) => {
      const id = action.payload;

      const existingItem = state.items.find(
        (item) => String(item.id) === String(id)
      );

      if (existingItem) {
        state.totalQuantity -= existingItem.quantity;
        state.items = state.items.filter(
          (item) => String(item.id) !== String(id)
        );
      } else {
        console.log("KHÔNG TÌM THẤY sản phẩm để xóa!");
      }
    },

    removeManyFromCart: (state, action) => {
      const idsToRemove = action.payload;
      // Chuyển đổi tất cả ID sang string để so sánh chính xác
      const stringIdsToRemove = idsToRemove.map(String);

      state.items = state.items.filter(
        (item) => !stringIdsToRemove.includes(String(item.id))
      );

      state.totalQuantity = state.items.reduce(
        (total, item) => total + item.quantity,
        0
      );
    },

    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const existingItem = state.items.find((item) => item.id === id);

      if (existingItem && quantity > 0) {
        const diff = quantity - existingItem.quantity;
        existingItem.quantity = quantity;
        state.totalQuantity += diff;
      }
    },

    clearCart: (state) => {
      state.items = [];
      state.totalQuantity = 0;
    },

    syncCart: (state, action) => {
      return action.payload;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  removeManyFromCart,
  updateQuantity,
  clearCart,
  syncCart,
} = cartSlice.actions;
export default cartSlice.reducer;
