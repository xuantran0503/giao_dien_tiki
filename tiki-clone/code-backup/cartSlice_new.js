import { createSlice } from "@reduxjs/toolkit";

const INITIAL_CART_STATE = {
  items: [],
  totalQuantity: 0,
};

const findItemById = (items, id) => {
  return items.find((item) => item.id === id);
};

const createCartItem = (product) => ({
  id: product.id,
  name: product.name,
  image: product.image,
  price: product.price,
  originalPrice: product.originalPrice,
  discount: product.discount,
  quantity: product.quantity,
});

// const calculateTotalQuantity = (items) => {
//   return items.reduce((total, item) => total + item.quantity, 0);
// };

const handleAddToCart = (state, action) => {
  const newProduct = action.payload;
  const existingItem = findItemById(state.items, newProduct.id);

  if (existingItem) {
    // Sản phẩm đã tồn tại thì Tăng số lượng
    existingItem.quantity += newProduct.quantity;
    state.totalQuantity += newProduct.quantity;
  } else {
    // Sản phẩm mới thì Thêm vào giỏ
    const cartItem = createCartItem(newProduct);
    state.items.push(cartItem);
    state.totalQuantity += newProduct.quantity;
  }
};

const handleRemoveFromCart = (state, action) => {
  const productId = action.payload;
  const existingItem = findItemById(state.items, productId);

  if (existingItem) {
    // Trừ số lượng và xóa sản phẩm
    state.totalQuantity -= existingItem.quantity;
    state.items = state.items.filter((item) => item.id !== productId);
  }
};

const handleUpdateQuantity = (state, action) => {
  const { id, quantity } = action.payload;
  const existingItem = findItemById(state.items, id);

  if (existingItem && quantity > 0) {
    // Tính chênh lệch số lượng
    const quantityDifference = quantity - existingItem.quantity;

    // Cập nhật
    existingItem.quantity = quantity;
    state.totalQuantity += quantityDifference;
  } else if (existingItem && quantity <= 0) {
    handleRemoveFromCart(state, { payload: id });
  }
};

const handleClearCart = (state) => {
  state.items = [];
  state.totalQuantity = 0;
};

const handleSyncCart = (state, action) => {
  // Replace toàn bộ state với state mới
  return action.payload;
};

const cartSlice = createSlice({
  name: "cart",
  initialState: INITIAL_CART_STATE,
  reducers: {
    addToCart: handleAddToCart,
    removeFromCart: handleRemoveFromCart,
    updateQuantity: handleUpdateQuantity,
    clearCart: handleClearCart,
    syncCart: handleSyncCart,
  },
});

export default cartSlice.reducer;
