import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CartItem {
  id: number;
  name: string;
  image: string;
  price: number;
  originalPrice: number;
  discount: number;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  totalQuantity: number;
}

const initialState: CartState = {
  items: [],
  totalQuantity: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
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

    removeFromCart: (state, action: PayloadAction<number>) => {
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

    removeSelectBuysFromCart: (state, action: PayloadAction<number[]>) => {
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

    updateQuantity: (state, action: PayloadAction<{ id: number; quantity: number }>) => {
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

    syncCart: (state, action: PayloadAction<CartState>) => {
      state.items = action.payload.items;
      state.totalQuantity = action.payload.totalQuantity;
    },
  },
});


export const selectCartItems = (state: { cart: CartState }) => state.cart.items;
export const selectTotalQuantity = (state: { cart: CartState }) => state.cart.totalQuantity;
export const selectCartTotal = (state: { cart: CartState }) =>
  state.cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
export const selectCartItemById = (state: { cart: CartState }, id: number) =>
  state.cart.items.find(item => item.id === id);

export const {
  addToCart,
  removeFromCart,
  removeSelectBuysFromCart,
  updateQuantity,
  clearCart,
  syncCart,
} = cartSlice.actions;
export default cartSlice.reducer;
