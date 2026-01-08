import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "./store";

const API_BASE = "http://192.168.2.112:9092";
const A_ID = "da1e0cd8-f73b-4da2-acf2-8ddc621bcf75";

const getOrCreateCartId = () => {
  let cartId = localStorage.getItem("cartId");
  if (!cartId) {
    cartId = crypto.randomUUID();
    localStorage.setItem("cartId", cartId);
  }
  return cartId;
};

export interface CartItem {
  cartItemId: string;
  productId: string;
  name: string;
  image: string;
  price: number;
  originalPrice: number;
  discount: number;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  status: "idle" | "pending" | "succeeded" | "failed";
  error: string | null;
  cartId: string | null;
}

const initialState: CartState = {
  items: [],
  status: "idle",
  error: null,
  cartId: getOrCreateCartId(),
};

// API: Thêm sản phẩm vào giỏ hàng
//post /api-end-user/acrt / cart - public / item;
export const addItemToCart = createAsyncThunk(
  "cart/addItemToCart",
  async (
    params: {
      productId: string;
      quantity: number;
      price: number;
      originalPrice: number;
      discount: number;
      name: string;
      image: string;
    },
    { dispatch, getState, rejectWithValue }
  ) => {
    const cartId = getOrCreateCartId();
    try {
      const now = new Date();

      const payload = {
        CartId: cartId,
        ItemId: params.productId,
        Count: params.quantity,
        // Price: params.price,
        UsingDate: [now.toISOString()],
        AId: A_ID,
      };

      console.log(JSON.stringify(payload, null, 2));

      const response = await axios({
        method: "POST",
        url: `${API_BASE}/api-end-user/cart/cart-public/item`,
        data: payload,
        headers: {
          "Content-Type": "application/json",
        },
        params: {
          aid: A_ID,
        },
      });

      dispatch(fetchCartDetail(cartId));
      return params;
    } catch (error: any) {
      console.log("Add to cart response error:", error.response?.data);
      const errorMessage =
        error.response?.data?.Message ||
        error.response?.data?.title ||
        error.message;
      return rejectWithValue(errorMessage);
    }
  }
);

// API: Lấy chi tiết giỏ hàng
// get /api-end-user/cart/cart-public/{id}
export const fetchCartDetail = createAsyncThunk(
  "cart/fetchCartDetail",
  async (cartId: string, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(
        `${API_BASE}/api-end-user/cart/cart-public/${cartId}`,
        { params: { aid: A_ID } }
      );

      const items = data.Data?.Items || [];

      return items.map((item: any) => ({
        cartItemId: item.CartItemId,
        productId: item.ItemId,
        name: item.ProductName,
        image: item.ProductImage,
        price: item.Price,
        originalPrice: item.OriginalPrice || item.Price,
        discount: item.DiscountPercentage || 0,
        quantity: item.Count,
      }));
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

// API: Xóa từng sản phẩm trong giỏ hàng
// put  /api-end-user/cart/cart-public/remove-item

export const removeItemFromCart = createAsyncThunk(
  "cart/removeItemFromCart",
  async (
    params: { cartItemId: string; productId: string },
    { dispatch, rejectWithValue }
  ) => {
    try {
      const cartId = getOrCreateCartId();

      await axios.put(`${API_BASE}/api-end-user/cart/cart-public/remove-item`, {
        CartId: cartId,
        // ProductId: productId,
        CartItemId: params.cartItemId,

        AId: A_ID,
      });

      dispatch(fetchCartDetail(cartId));

      return { productId: params.productId };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.Message || error.message);
    }
  }
);

// API: Xóa tất cả sản phẩm trong giỏ hàng
// put   /api-end-user/cart/cart-public/clear-item
export const clearAllCartItems = createAsyncThunk(
  "cart/clearAllCartItems",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const cartId = getOrCreateCartId();

      await axios({
        method: "PUT",
        url: `${API_BASE}/api-end-user/cart/cart-public/clear-item`,
        data: {
          CartId: cartId,
          AId: A_ID,
        },
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (cartId) {
        dispatch(fetchCartDetail(cartId));
      }

      return null;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.Message || error.message);
    }
  }
);

// API: Cập nhật số lượng sản phẩm trong giỏ hàng
//put /api-end-user/cart/cart-public/clear-item

export const updateCartItemQuantity = createAsyncThunk(
  "cart/updateCartItemQuantity",
  async (
    params: {
      cartItemId: string;
      productId: string;
      quantity: number;
    },
    { dispatch }
  ) => {
    const cartId = getOrCreateCartId();

    await axios.put(`${API_BASE}/api-end-user/cart/cart-public/update-item`, {
      CartId: cartId,
      ProductId: params.productId,
      CartItemId: params.cartItemId,
      Quantity: params.quantity,
      AId: A_ID,
    });

    dispatch(fetchCartDetail(cartId));
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    syncCart: (state, action: PayloadAction<CartState>) => {
      state.items = action.payload.items;
    },
    setCartId: (state, action: PayloadAction<string>) => {
      state.cartId = action.payload;
    },
    clearCart: (state) => {
      state.items = [];
      state.status = "idle";
      state.error = null;
      state.cartId = null;
    },
  },

  extraReducers: (builder) => {
    builder
      // Add item to cart
      .addCase(addItemToCart.pending, (state) => {
        state.status = "pending";
        state.error = null;
      })
      .addCase(addItemToCart.fulfilled, (state) => {
        state.status = "succeeded";
        // Items will be updated by fetchCartDetail
      })
      .addCase(addItemToCart.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          (action.payload as string) || "Failed to add item to cart";
      })

      // Fetch cart detail
      .addCase(fetchCartDetail.pending, (state) => {
        state.status = "pending";
        state.error = null;
      })
      .addCase(fetchCartDetail.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
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
        state.items = state.items.filter(
          (item) => item.productId !== productId
        );
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
      })
      .addCase(clearAllCartItems.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) || "Failed to clear cart";
      })

      // Update cart item quantity
      .addCase(updateCartItemQuantity.pending, (state) => {
        state.status = "pending";
        state.error = null;
      })
      .addCase(updateCartItemQuantity.fulfilled, (state) => {
        state.status = "succeeded";
        // Items will be updated by fetchCartDetail
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
export const selectCartTotal = (state: RootState) =>
  state.cart.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
export const selectCartItemById = (state: RootState, productId: string) =>
  state.cart.items.find((item) => item.productId === productId);
export const selectCartStatus = (state: RootState) => state.cart.status;
export const selectCartError = (state: RootState) => state.cart.error;

export const { syncCart, setCartId, clearCart } = cartSlice.actions;

export default cartSlice.reducer;
