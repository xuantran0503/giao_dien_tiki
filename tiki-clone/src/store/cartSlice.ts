import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "./store";

const API_BASE = "http://192.168.2.112:9092";

const A_ID = "da1e0cd8-f73b-4da2-acf2-8ddc621bcf75";

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
  cartId: A_ID,
};

// API: Thêm sản phẩm vào giỏ hàng
//post /api-end-user/acrt / cart - public / item;
export const addItemToCart = createAsyncThunk(
  "cart/addItemToCart",
  async (
    params: {
      productId: string | number;
      quantity: number;
      price: number;
      originalPrice: number;
      discount: number;
      name: string;
      image: string;
    },
    { dispatch, getState, rejectWithValue }
  ) => {
    const state = getState() as RootState;
    const cartId = state.cart.cartId || A_ID;
    try {
      // Format UsingDate as "yyyy-MM-dd HH:mm:ss"
      const now = new Date();
      const usingDate = now.toISOString().replace("T", " ").substring(0, 19);

      const payload = {
        CartId: cartId,
        ItemId: String(params.productId),
        ProductName: params.name, // Add product name
        Price: params.price, // Add price
        Count: params.quantity,
        UsingDate: [usingDate], // Array of date strings in format "yyyy-MM-dd HH:mm:ss"
        AId: A_ID,
      };

      console.log("=== ADD TO CART REQUEST ===");
      console.log("Payload:", JSON.stringify(payload, null, 2));

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

      console.log("=== ADD TO CART SUCCESS ===");
      console.log("Response:", response.data);

      if (response.data?.Code === 200 || response.data?.Code === 0) {
        dispatch(fetchCartDetail(cartId));
        return params;
      } else {
        console.warn("API returned non-success code:", response.data);
        return rejectWithValue(response.data?.Message || "Failed to add item");
      }
    } catch (error: any) {
      console.error("=== ADD TO CART ERROR ===");
      console.error("Status:", error.response?.status);
      console.error("Response:", error.response?.data);
      return rejectWithValue(error.response?.data?.Message || error.message);
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

// export const fetchCartDetail = createAsyncThunk(
//   "cart/fetchCartDetail",
//   async (cartId: string, { rejectWithValue }) => {
//     try {
//       const { data } = await axios.get(
//         `${API_BASE}/api-end-user/cart/cart-public/${cartId}`,
//         {
//           params: {
//             aid: A_ID,
//           },
//         }
//       );

//       const cartItems = data.Data?.Items || data.Data || [];

//       return cartItems.map((item: any) => ({
//         id: item.ProductId || item.ItemId || item.Id,
//         name: item.ProductName || item.Name || "Sản phẩm",
//         image: item.ProductImage || item.Image || "",
//         price: item.Price || 0,
//         originalPrice: item.OriginalPrice || item.Price || 0,
//         discount: item.DiscountPercentage || item.Discount || 0,
//         quantity: item.Quantity || item.Count || 0,
//       }));
//     } catch (error: any) {
//       return rejectWithValue(error.response?.data?.Message || error.message);
//     }
//   }
// );

// API: Xóa từng sản phẩm trong giỏ hàng
// put  /api-end-user/cart/cart-public/remove-item

export const removeItemFromCart = createAsyncThunk(
  "cart/removeItemFromCart",
  async (cartItemId: string, { getState, dispatch, rejectWithValue }) => {
    try {
      const state = getState() as RootState;

      await axios.put(
        `${API_BASE}/api-end-user/cart/cart-public/remove-item`,
        {
          CartId: state.cart.cartId,
          ItemId: [cartItemId],
          AId: A_ID,
        },
        { params: { aid: A_ID } }
      );

      dispatch(fetchCartDetail(state.cart.cartId!));

      return { cartItemId };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.Message || error.message);
    }
  }
);

// export const removeItemFromCart = createAsyncThunk(
//   "cart/removeItemFromCart",
//   async (
//     productId: string | number,
//     { dispatch, getState, rejectWithValue }
//   ) => {
//     try {
//       const state = getState() as RootState;
//       const cartId = state.cart.cartId;

//       // According to Swagger, ItemId should be an array for remove-item
//       const payload = {
//         CartId: cartId,
//         ItemId: [String(productId)], // Array of ItemIds
//         AId: A_ID,
//       };

//       console.log("Remove Item Payload:", payload);

//       await axios({
//         method: "PUT",
//         url: `${API_BASE}/api-end-user/cart/cart-public/remove-item`,
//         data: payload,
//         headers: {
//           "Content-Type": "application/json",
//         },
//         params: {
//           aid: A_ID,
//         },
//       });
//       console.log("Item removed from cart successfully.");

//       if (cartId) {
//         dispatch(fetchCartDetail(cartId));
//       }

//       return { productId };
//     } catch (error: any) {
//       console.error("Remove Item Error Details:", {
//         message: error.message,
//         response: error.response?.data,
//       });
//       return rejectWithValue(error.response?.data?.Message || error.message);
//     }
//   }
// );

// API: Xóa tất cả sản phẩm trong giỏ hàng
// put   /api-end-user/cart/cart-public/clear-item
export const clearAllCartItems = createAsyncThunk(
  "cart/clearAllCartItems",
  async (_, { dispatch, getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const cartId = state.cart.cartId;

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
        params: {
          aid: A_ID,
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
    { getState, dispatch }
  ) => {
    const state = getState() as RootState;

    await axios.put(
      `${API_BASE}/api-end-user/cart/cart-public/update-item`,
      {
        CartId: state.cart.cartId,
        ItemId: params.productId,
        CartItemId: params.cartItemId,
        Count: params.quantity,
        AId: A_ID,
      },
      { params: { aid: A_ID } }
    );

    dispatch(fetchCartDetail(state.cart.cartId!));
  }
);

// export const updateCartItemQuantity = createAsyncThunk(
//   "cart/updateCartItemQuantity",
//   async (
//     params: { productId: string | number; quantity: number; price: number },
//     { dispatch, getState, rejectWithValue }
//   ) => {
//     try {
//       const state = getState() as RootState;
//       const cartId = state.cart.cartId || A_ID;

//       await axios({
//         method: "PUT",
//         url: `${API_BASE}/api-end-user/cart/cart-public/update-item`,
//         data: {
//           CartId: cartId,
//           ItemId: String(params.productId),
//           Count: params.quantity,
//           UsingDate: [new Date().toISOString()],
//           AId: A_ID,
//         },
//         headers: {
//           "Content-Type": "application/json",
//         },
//         params: {
//           aid: A_ID,
//         },
//       });

//       if (cartId) {
//         dispatch(fetchCartDetail(cartId));
//       }

//       return {
//         productId: params.productId,
//         quantity: params.quantity,
//       };
//     } catch (error: any) {
//       console.error("Update Quantity Error Details:", {
//         message: error.message,
//         response: error.response?.data,
//       });
//       return rejectWithValue(error.response?.data?.Message || error.message);
//     }
//   }
// );

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
        const { cartItemId } = action.payload;
        state.items = state.items.filter(
          (item) => item.cartItemId !== cartItemId
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
