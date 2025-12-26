import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "./store";

const API_BASE = "http://192.168.2.112:9092";

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
  status: "idle" | "pending" | "succeeded" | "failed";
  error: string | null;
}

const initialState: CartState = {
  items: [],
  totalQuantity: 0,
  status: "idle",
  error: null,
};

// API: Thêm/cập nhật sản phẩm vào giỏ hàng
// POST /api-end-user/cart/cart-public/update-item
export const addItemToCart = createAsyncThunk(
  "cart/addItemToCart",
  async (
    params: {
      productId: number;
      quantity: number;
      price: number;
      originalPrice: number;
      discount: number;
      name: string;
      image: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await axios.post(
        `${API_BASE}/api-end-user/cart/cart-public/update-item`,
        {
          ProductId: params.productId,
          Quantity: params.quantity,
          Price: params.price,
        }
      );

      // Trả về thông tin sản phẩm đã thêm
      return {
        id: params.productId,
        name: params.name,
        image: params.image,
        price: params.price,
        originalPrice: params.originalPrice,
        discount: params.discount,
        quantity: params.quantity,
        apiResponse: data.Data,
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.Message || error.message);
    }
  }
);

// API: Lấy chi tiết giỏ hàng
// GET /api-end-user/cart/cart-public/{id}
export const fetchCartDetail = createAsyncThunk(
  "cart/fetchCartDetail",
  async (cartId: string, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(
        `${API_BASE}/api-end-user/cart/cart-public/${cartId}`
      );

      const cartItems = data.Data.Items || [];

      // Map dữ liệu từ API về CartItem[]
      return cartItems.map((item: any) => ({
        id: item.ProductId,
        name: item.ProductName,
        image: item.ProductImage,
        price: item.Price,
        originalPrice: item.OriginalPrice || item.Price,
        discount: item.Discount || 0,
        quantity: item.Quantity,
      }));
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.Message || error.message);
    }
  }
);

// API: Xóa từng sản phẩm trong giỏ hàng
// PUT /api-end-user/cart/cart-public/remove-item
export const removeItemFromCart = createAsyncThunk(
  "cart/removeItemFromCart",
  async (productId: number, { rejectWithValue }) => {
    try {
      const { data } = await axios.put(
        `${API_BASE}/api-end-user/cart/cart-public/remove-item`,
        {
          ProductId: productId,
        }
      );

      return {
        productId,
        apiResponse: data.Data,
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.Message || error.message);
    }
  }
);

// API: Xóa tất cả sản phẩm trong giỏ hàng
// PUT /api-end-user/cart/cart-public/clear-item
export const clearAllCartItems = createAsyncThunk(
  "cart/clearAllCartItems",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.put(
        `${API_BASE}/api-end-user/cart/cart-public/clear-item`,
        {}
      );

      return data.Data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.Message || error.message);
    }
  }
);

// API: Cập nhật số lượng sản phẩm trong giỏ hàng
// PUT /api-end-user/cart/cart-public/update-item
export const updateCartItemQuantity = createAsyncThunk(
  "cart/updateCartItemQuantity",
  async (
    params: { productId: number; quantity: number; price: number },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await axios.put(
        `${API_BASE}/api-end-user/cart/cart-public/update-item`,
        {
          ProductId: params.productId,
          Quantity: params.quantity,
          Price: params.price,
        }
      );

      return {
        productId: params.productId,
        quantity: params.quantity,
        apiResponse: data.Data,
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.Message || error.message);
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // Local actions (không gọi API)
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const newItem = action.payload;
      const existingItem = state.items.find((item) => item.id === newItem.id);

      if (existingItem) {
        existingItem.quantity += newItem.quantity;
        state.totalQuantity += newItem.quantity;
      } else {
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
      }
    },

    removeSelectBuysFromCart: (state, action: PayloadAction<number[]>) => {
      const idsToRemove = action.payload;
      const stringIdsToRemove = idsToRemove.map(String);

      state.items = state.items.filter(
        (item) => !stringIdsToRemove.includes(String(item.id))
      );

      state.totalQuantity = state.items.reduce(
        (total, item) => total + item.quantity,
        0
      );
    },

    updateQuantity: (
      state,
      action: PayloadAction<{ id: number; quantity: number }>
    ) => {
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
  extraReducers: (builder) => {
    builder
      // Add item to cart
      .addCase(addItemToCart.pending, (state) => {
        state.status = "pending";
        state.error = null;
      })
      .addCase(addItemToCart.fulfilled, (state, action) => {
        state.status = "succeeded";
        const newItem = action.payload;
        const existingItem = state.items.find(
          (item) => item.id === newItem.id
        );

        if (existingItem) {
          existingItem.quantity += newItem.quantity;
          state.totalQuantity += newItem.quantity;
        } else {
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
      })
      .addCase(addItemToCart.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) || "Failed to add item to cart";
      })

      // Fetch cart detail
      .addCase(fetchCartDetail.pending, (state) => {
        state.status = "pending";
        state.error = null;
      })
      .addCase(fetchCartDetail.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
        state.totalQuantity = action.payload.reduce(
          (total: number, item: CartItem) => total + item.quantity,
          0
        );
      })
      .addCase(fetchCartDetail.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) || "Failed to fetch cart";
      })

      // Remove item from cart
      .addCase(removeItemFromCart.pending, (state) => {
        state.status = "pending";
        state.error = null;
      })
      .addCase(removeItemFromCart.fulfilled, (state, action) => {
        state.status = "succeeded";
        const { productId } = action.payload;
        const existingItem = state.items.find((item) => item.id === productId);

        if (existingItem) {
          state.totalQuantity -= existingItem.quantity;
          state.items = state.items.filter((item) => item.id !== productId);
        }
      })
      .addCase(removeItemFromCart.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          (action.payload as string) || "Failed to remove item from cart";
      })

      // Clear all cart items
      .addCase(clearAllCartItems.pending, (state) => {
        state.status = "pending";
        state.error = null;
      })
      .addCase(clearAllCartItems.fulfilled, (state) => {
        state.status = "succeeded";
        state.items = [];
        state.totalQuantity = 0;
      })
      .addCase(clearAllCartItems.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          (action.payload as string) || "Failed to clear cart";
      })

      // Update cart item quantity
      .addCase(updateCartItemQuantity.pending, (state) => {
        state.status = "pending";
        state.error = null;
      })
      .addCase(updateCartItemQuantity.fulfilled, (state, action) => {
        state.status = "succeeded";
        const { productId, quantity } = action.payload;
        const existingItem = state.items.find((item) => item.id === productId);

        if (existingItem && quantity > 0) {
          const diff = quantity - existingItem.quantity;
          existingItem.quantity = quantity;
          state.totalQuantity += diff;
        }
      })
      .addCase(updateCartItemQuantity.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          (action.payload as string) || "Failed to update item quantity";
      });
  },
});

// Selectors
export const selectCartItems = (state: RootState) => state.cart.items;
export const selectTotalQuantity = (state: RootState) =>
  state.cart.totalQuantity;
export const selectCartTotal = (state: RootState) =>
  state.cart.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
export const selectCartItemById = (state: RootState, id: number) =>
  state.cart.items.find((item) => item.id === id);
export const selectCartStatus = (state: RootState) => state.cart.status;
export const selectCartError = (state: RootState) => state.cart.error;

export const {
  addToCart,
  removeFromCart,
  removeSelectBuysFromCart,
  updateQuantity,
  clearCart,
  syncCart,
} = cartSlice.actions;

export default cartSlice.reducer;
