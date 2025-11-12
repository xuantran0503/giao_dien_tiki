import { createSlice } from "@reduxjs/toolkit";

/**
 * ============================================
 * CART SLICE - ALTERNATIVE IMPLEMENTATION
 * ============================================
 * Cách trình bày khác nhưng giữ nguyên chức năng
 * So với file gốc, file này có:
 * - Tách logic thành helper functions
 * - Thêm JSDoc comments
 * - Cấu trúc rõ ràng hơn
 * - Dễ maintain và test hơn
 * ============================================
 */

// ============================================
// 1. CONSTANTS & INITIAL STATE
// ============================================

/**
 * Initial state cho cart
 * @typedef {Object} CartState
 * @property {Array} items - Danh sách sản phẩm trong giỏ
 * @property {number} totalQuantity - Tổng số lượng sản phẩm
 */
const INITIAL_CART_STATE = {
  items: [],
  totalQuantity: 0,
};

// ============================================
// 2. HELPER FUNCTIONS (Pure Functions)
// ============================================

/**
 * Tìm sản phẩm trong giỏ hàng theo ID
 * @param {Array} items - Danh sách sản phẩm
 * @param {string|number} id - ID sản phẩm cần tìm
 * @returns {Object|undefined} Sản phẩm tìm được hoặc undefined
 */
const findItemById = (items, id) => {
  return items.find((item) => item.id === id);
};

/**
 * Tạo object sản phẩm mới cho giỏ hàng
 * @param {Object} product - Thông tin sản phẩm
 * @returns {Object} Sản phẩm đã format
 */
const createCartItem = (product) => ({
  id: product.id,
  name: product.name,
  image: product.image,
  price: product.price,
  originalPrice: product.originalPrice,
  discount: product.discount,
  quantity: product.quantity,
});

/**
 * Tính toán lại tổng số lượng sản phẩm
 * @param {Array} items - Danh sách sản phẩm
 * @returns {number} Tổng số lượng
 */
const calculateTotalQuantity = (items) => {
  return items.reduce((total, item) => total + item.quantity, 0);
};

// ============================================
// 3. REDUCER HANDLERS
// ============================================

/**
 * Handler cho action addToCart
 * Thêm sản phẩm vào giỏ hoặc tăng số lượng nếu đã có
 */
const handleAddToCart = (state, action) => {
  const newProduct = action.payload;
  const existingItem = findItemById(state.items, newProduct.id);

  if (existingItem) {
    // Sản phẩm đã tồn tại → Tăng số lượng
    existingItem.quantity += newProduct.quantity;
    state.totalQuantity += newProduct.quantity;
  } else {
    // Sản phẩm mới → Thêm vào giỏ
    const cartItem = createCartItem(newProduct);
    state.items.push(cartItem);
    state.totalQuantity += newProduct.quantity;
  }
};

/**
 * Handler cho action removeFromCart
 * Xóa sản phẩm khỏi giỏ hàng
 */
const handleRemoveFromCart = (state, action) => {
  const productId = action.payload;
  const existingItem = findItemById(state.items, productId);

  if (existingItem) {
    // Trừ số lượng và xóa sản phẩm
    state.totalQuantity -= existingItem.quantity;
    state.items = state.items.filter((item) => item.id !== productId);
  }
};

/**
 * Handler cho action updateQuantity
 * Cập nhật số lượng sản phẩm trong giỏ
 */
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
    // Nếu quantity <= 0, xóa sản phẩm
    handleRemoveFromCart(state, { payload: id });
  }
};

/**
 * Handler cho action clearCart
 * Xóa toàn bộ giỏ hàng
 */
const handleClearCart = (state) => {
  state.items = [];
  state.totalQuantity = 0;
};

/**
 * Handler cho action syncCart
 * Đồng bộ state từ tab khác (qua storage event)
 */
const handleSyncCart = (state, action) => {
  // Replace toàn bộ state với state mới
  return action.payload;
};

// ============================================
// 4. SLICE DEFINITION
// ============================================

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

// ============================================
// 5. EXPORTS
// ============================================

// Export actions
export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  syncCart,
} = cartSlice.actions;

// Export reducer
export default cartSlice.reducer;

// // Export selectors (bonus - để dễ dàng lấy data từ store)
// export const selectCartItems = (state) => state.cart.items;
// export const selectTotalQuantity = (state) => state.cart.totalQuantity;
// export const selectCartItemById = (state, id) =>
//   findItemById(state.cart.items, id);
// export const selectCartTotal = (state) =>
//   state.cart.items.reduce(
//     (total, item) => total + item.price * item.quantity,
//     0
//   );

// // Export helper functions (để có thể test riêng)
// export const helpers = {
//   findItemById,
//   createCartItem,
//   calculateTotalQuantity,
// };
