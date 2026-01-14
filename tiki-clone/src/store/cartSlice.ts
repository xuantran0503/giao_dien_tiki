import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from './store';

const API_BASE = 'http://192.168.2.112:9092';
const A_ID = 'da1e0cd8-f73b-4da2-acf2-8ddc621bcf75';

export interface CartItem {
  id: string;
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
  status: 'idle' | 'pending' | 'succeeded' | 'failed';
  error: string | null;
  cartId: string | null;
}
const getCartId = () => localStorage.getItem('cartId');

const initialState: CartState = {
  items: [],
  status: 'idle',
  error: null,
  cartId: getCartId(),
};

// API: Thêm sản phẩm vào giỏ hàng
// POST /api-end-user/cart/cart-public/item (Thêm mới)
// PUT /api-end-user/cart/cart-public/update-item (Cập nhật nếu đã tồn tại)
export const addItemToCart = createAsyncThunk(
  'cart/addItemToCart',
  async (
    params: {
      productId: string;
      quantity: number;
      price: number;
      originalPrice: number;
      discount: number;
      name: string;
      image: string;
      description: string;
    },
    { dispatch, getState, rejectWithValue }
  ) => {
    let cartId = getCartId();
    const state = getState() as RootState;

    // Kiểm tra sản phẩm đã có trong giỏ hàng chưa
    const existingItem = state.cart.items.find((item) => item.productId === params.productId);

    try {
      // TRƯỜNG HỢP 1: Nếu sản phẩm ĐÃ TỒN TẠI -> Cập nhật số lượng (PUT)
      if (existingItem && cartId) {
        const newQuantity = existingItem.quantity + params.quantity;

        await axios.put(`${API_BASE}/api-end-user/cart/cart-public/update-item`, {
          CartId: cartId,
          ItemId: params.productId,
          CartItemId: existingItem.cartItemId,
          Count: newQuantity,
          AId: A_ID,
        });

        dispatch(fetchCartDetail(cartId));
        return params;
      }

      // TRƯỜNG HỢP 2: Nếu chưa có -> Thêm mới (POST)
      const payload: any = {
        ItemId: params.productId,
        Count: params.quantity,
        UsingDate: [new Date().toISOString()],
        AId: A_ID,
      };

      if (cartId) {
        payload.CartId = cartId;
      }

      const response = await axios({
        method: 'POST',
        url: `${API_BASE}/api-end-user/cart/cart-public/item`,
        data: payload,
        headers: { 'Content-Type': 'application/json' },
        params: { aid: A_ID },
      });

      const returnedCartId = response.data?.Data?.CartId || response.data?.CartId;

      if (returnedCartId) {
        localStorage.setItem('cartId', returnedCartId);
        dispatch(setCartId(returnedCartId));
        cartId = returnedCartId;
      }

      if (cartId) {
        dispatch(fetchCartDetail(cartId));
      }

      return params;
    } catch (error: any) {
      console.log('Cart Action Error:', error.response?.data);
      const errorMessage =
        error.response?.data?.Message || error.response?.data?.title || error.message;
      return rejectWithValue(errorMessage);
    }
  }
);

// API: Lấy thông tin chi tiết trong giỏ hàng
// get /api-end-user/cart/cart-public/{id}
export const fetchCartDetail = createAsyncThunk(
  'cart/fetchCartDetail',
  async (argCartId: string | undefined, { rejectWithValue }) => {
    const cartId = argCartId || getCartId();
    if (!cartId) return rejectWithValue('No CartId found');

    try {
      const { data } = await axios.get(`${API_BASE}/api-end-user/cart/cart-public/${cartId}`, {
        params: { aid: A_ID },
      });

      // console.log("Full Cart Details API Response:", data);

      const items = data.Data?.ListItem || data.Data?.Items || [];

      // LOG ĐỂ KIỂM TRA DỮ LIỆU THỰC TẾ
      // if (items.length > 0) {
      //   console.log("DỮ LIỆU GIỎ HÀNG TỪ SERVER:", items[0]);
      // }

      // đảo ngược mảng để hiển thị sản phẩm thêm mới ở trên cùng
      items.reverse();

      return items.map((item: any) => {
        // Cố gắng bóc tách listingId từ Uri nếu có thể
        const uriParts = item.Uri?.split('/') || [];
        const listingIdFromUri = uriParts.length > 0 ? uriParts[uriParts.length - 1] : '';

        return {
          id: item.Id,
          cartItemId: item.CartItemId,
          listingId: listingIdFromUri,
          productId: item.GroupServiceId || item.Id,
          name: item.Name,
          price: item.SalePrice,
          originalPrice: item.SalePrice,
          discount: item.DiscountValue,
          quantity: item.Count,
          // image: item.ImageUrl,
        };
      });
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

// API: Xóa từng sản phẩm trong giỏ hàng
// put  /api-end-user/cart/cart-public/remove-item
export const removeItemFromCart = createAsyncThunk(
  'cart/removeItemFromCart',
  async (params: { cartItemId: string; productId: string }, { dispatch, rejectWithValue }) => {
    const cartId = getCartId();
    if (!cartId) return rejectWithValue('No CartId found');

    try {
      await axios.put(`${API_BASE}/api-end-user/cart/cart-public/remove-item`, {
        CartId: cartId,
        ItemId: params.productId,
        CartItemId: params.cartItemId,
        AId: A_ID,
      });

      dispatch(fetchCartDetail(cartId));

      return { cartItemId: params.cartItemId };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.Message || error.message);
    }
  }
);

// API: Xóa tất cả sản phẩm trong giỏ hàng
// put   /api-end-user/cart/cart-public/clear-item
export const clearAllCartItems = createAsyncThunk(
  'cart/clearAllCartItems',
  async (_, { dispatch, rejectWithValue }) => {
    const cartId = getCartId();
    if (!cartId) return rejectWithValue('No CartId found');

    try {
      await axios({
        method: 'PUT',
        url: `${API_BASE}/api-end-user/cart/cart-public/clear-item`,
        data: {
          CartId: cartId,
          AId: A_ID,
        },
        // headers: {
        //   'Content-Type': 'application/json',
        // },
      });

      dispatch(fetchCartDetail(cartId));

      return null;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.Message || error.message);
    }
  }
);

// API: Cập nhật số lượng sản phẩm trong giỏ hàng
//put /api-end-user/cart/cart-public/update-item

export const updateCartItemQuantity = createAsyncThunk(
  'cart/updateCartItemQuantity',
  async (
    params: {
      cartItemId: string;
      productId: string;
      quantity: number;
    },
    { dispatch, rejectWithValue }
  ) => {
    const cartId = getCartId();
    if (!cartId) return rejectWithValue('No CartId found');

    try {
      await axios.put(`${API_BASE}/api-end-user/cart/cart-public/update-item`, {
        CartId: cartId,
        ItemId: params.productId,
        CartItemId: params.cartItemId,
        Count: params.quantity,
        AId: A_ID,
      });

      dispatch(fetchCartDetail(cartId));
      return params;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    syncCart: (state, action: PayloadAction<CartState>) => {
      state.items = action.payload.items;
      state.cartId = action.payload.cartId;
    },
    setCartId: (state, action: PayloadAction<string | null>) => {
      state.cartId = action.payload;
    },
    clearCart: (state) => {
      state.items = [];
      state.status = 'idle';
      state.error = null;
      state.cartId = null;
    },
  },

  extraReducers: (builder) => {
    builder
      // Add item to cart
      .addCase(addItemToCart.pending, (state) => {
        state.status = 'pending';
        state.error = null;
      })
      .addCase(addItemToCart.fulfilled, (state) => {
        state.status = 'succeeded';
        // Items will be updated by fetchCartDetail
      })
      .addCase(addItemToCart.rejected, (state, action) => {
        state.status = 'failed';
        state.error = (action.payload as string) || 'Failed to add item to cart';
      })

      // Fetch cart detail
      .addCase(fetchCartDetail.pending, (state) => {
        state.status = 'pending';
        state.error = null;
      })
      .addCase(fetchCartDetail.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchCartDetail.rejected, (state, action) => {
        state.status = 'failed';
        state.error = (action.payload as string) || 'Failed to fetch cart';
      })

      // Remove item from cart
      .addCase(removeItemFromCart.pending, (state) => {
        state.status = 'pending';
        state.error = null;
      })
      .addCase(removeItemFromCart.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const { cartItemId } = action.payload;
        state.items = state.items.filter((item) => item.cartItemId !== cartItemId);
      })
      .addCase(removeItemFromCart.rejected, (state, action) => {
        state.status = 'failed';
        state.error = (action.payload as string) || 'Failed to remove item from cart';
      })

      // Clear all cart items
      .addCase(clearAllCartItems.pending, (state) => {
        state.status = 'pending';
        state.error = null;
      })
      .addCase(clearAllCartItems.fulfilled, (state) => {
        state.status = 'succeeded';
        state.items = [];
      })
      .addCase(clearAllCartItems.rejected, (state, action) => {
        state.status = 'failed';
        state.error = (action.payload as string) || 'Failed to clear cart';
      })

      // Update cart item quantity
      .addCase(updateCartItemQuantity.pending, (state) => {
        state.status = 'pending';
        state.error = null;
      })
      .addCase(updateCartItemQuantity.rejected, (state, action) => {
        state.status = 'failed';
        state.error = (action.payload as string) || 'Failed to update item quantity';
      })
      .addCase(updateCartItemQuantity.fulfilled, (state, action: any) => {
        state.status = 'succeeded';
        const { cartItemId, quantity } = action.payload;
        const item = state.items.find((i) => i.cartItemId === cartItemId);
        if (item) {
          item.quantity = quantity;
        }
      });
  },
});

// Selectors
export const selectCartItems = (state: RootState) => state.cart.items;
export const selectCartTotal = (state: RootState) =>
  state.cart.items.reduce((total, item) => total + item.price * item.quantity, 0);
export const selectCartItemById = (state: RootState, productId: string) =>
  state.cart.items.find((item) => item.productId === productId);
export const selectCartStatus = (state: RootState) => state.cart.status;
export const selectCartError = (state: RootState) => state.cart.error;

export const { syncCart, setCartId, clearCart } = cartSlice.actions;

export default cartSlice.reducer;
