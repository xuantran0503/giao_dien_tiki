// import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
// import axios from "axios";
// import { RootState } from "./store";

// const API_BASE = "http://192.168.2.112:9092";
// const A_ID = "da1e0cd8-f73b-4da2-acf2-8ddc621bcf75";

// const getCartId = () => localStorage.getItem("cartId");

// export interface CartItem {
//   id: string; // ID gốc từ Server
//   listingId: string; // Listing ID bóc tách để điều hướng
//   cartItemId: string;
//   productId: string;
//   name: string;
//   image: string;
//   price: number;
//   originalPrice: number;
//   discount: number;
//   quantity: number;
// }

// export interface CartState {
//   items: CartItem[];
//   status: "idle" | "pending" | "succeeded" | "failed";
//   error: string | null;
//   cartId: string | null;
// }

// const initialState: CartState = {
//   items: [],
//   status: "idle",
//   error: null,
//   cartId: getCartId(),
// };

// // API: Thêm sản phẩm vào giỏ hàng
// // POST /api-end-user/cart/cart-public/item (Thêm mới)
// // PUT /api-end-user/cart/cart-public/update-item (Cập nhật nếu đã tồn tại)
// export const addItemToCart = createAsyncThunk(
//   "cart/addItemToCart",
//   async (
//     params: {
//       productId: string;
//       quantity: number;
//       price: number;
//       originalPrice: number;
//       discount: number;
//       name: string;
//     },
//     { dispatch, getState, rejectWithValue }
//   ) => {
//     let cartId = getCartId();
//     const state = getState() as RootState;

//     // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
//     const existingItem = state.cart.items.find(
//       (item) => item.productId === params.productId
//     );

//     try {
//       // TRƯỜNG HỢP 1: Nếu sản phẩm ĐÃ TỒN TẠI -> Cập nhật số lượng (PUT)
//       if (existingItem && cartId) {
//         const newQuantity = existingItem.quantity + params.quantity;

//         await axios.put(
//           `${API_BASE}/api-end-user/cart/cart-public/update-item`,
//           {
//             CartId: cartId,
//             ProductId: params.productId,
//             CartItemId: existingItem.cartItemId,
//             Count: newQuantity,
//             AId: A_ID,
//           }
//         );

//         // Load lại giỏ hàng để đồng bộ UI
//         dispatch(fetchCartDetail(cartId));
//         return params;
//       }

//       // TRƯỜNG HỢP 2: Nếu chưa có -> Thêm mới (POST)
//       const payload: any = {
//         ItemId: params.productId,
//         Count: params.quantity,
//         UsingDate: [new Date().toISOString()],
//         AId: A_ID,
//       };

//       if (cartId) {
//         payload.CartId = cartId;
//       }

//       const response = await axios({
//         method: "POST",
//         url: `${API_BASE}/api-end-user/cart/cart-public/item`,
//         data: payload,
//         headers: { "Content-Type": "application/json" },
//         params: { aid: A_ID },
//       });

//       const returnedCartId =
//         response.data?.Data?.CartId || response.data?.CartId;

//       if (returnedCartId) {
//         localStorage.setItem("cartId", returnedCartId);
//         dispatch(setCartId(returnedCartId));
//         cartId = returnedCartId;
//       }

//       if (cartId) {
//         dispatch(fetchCartDetail(cartId));
//       }

//       return params;
//     } catch (error: any) {
//       console.log("Cart Action Error:", error.response?.data);
//       const errorMessage =
//         error.response?.data?.Message ||
//         error.response?.data?.title ||
//         error.message;
//       return rejectWithValue(errorMessage);
//     }
//   }
// );

// // API: Lấy chi tiết giỏ hàng
// // get /api-end-user/cart/cart-public/{id}
// export const fetchCartDetail = createAsyncThunk(
//   "cart/fetchCartDetail",
//   async (argCartId: string | undefined, { rejectWithValue }) => {
//     const cartId = argCartId || getCartId();
//     if (!cartId) return rejectWithValue("No CartId found");

//     try {
//       const { data } = await axios.get(
//         `${API_BASE}/api-end-user/cart/cart-public/${cartId}`,
//         { params: { aid: A_ID } }
//       );

//       // console.log("Full Cart Details API Response:", data);

//       const items = data.Data?.ListItem || data.Data?.Items || [];
//       // LOG ĐỂ KIỂM TRA DỮ LIỆU THỰC TẾ
//       // if (items.length > 0) {
//       //   console.log("DỮ LIỆU GIỎ HÀNG TỪ SERVER:", items[0]);
//       // }
//       // Reverse to show newest items first
//       items.reverse();

//       return items.map((item: any) => {
//         // const firstImgObj =
//         //   item.ImageUrl && item.ImageUrl.length > 0 ? item.ImageUrl[0] : null;
//         // let imageUrl = "";
//         // if (firstImgObj) {
//         //   if (typeof firstImgObj === "string") {
//         //     imageUrl = firstImgObj;
//         //   } else if (firstImgObj.Url) {
//         //     imageUrl = firstImgObj.Url;
//         //   }
//         // }

//         // if (imageUrl && !imageUrl.startsWith("http")) {
//         //   imageUrl = `${API_BASE}${imageUrl}`;
//         // }

//         // Dùng Regex để tìm mã UUID (Listing ID) trong Uri - Đây là nguồn tin cậy nhất
//         let listingId = item.Id; // Mặc định dùng Id của chính nó nếu không tìm thấy ID khác
//         if (item.Uri) {
//           const match = item.Uri.match(
//             /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i
//           );
//           if (match) {
//             listingId = match[0];
//           }
//         }

//         return {
//           id: item.Id,
//           listingId: listingId,
//           cartItemId: item.CartItemId,
//           productId: item.GroupServiceId || item.Id, // ID dùng để thao tác giỏ hàng
//           name: item.Name,
//           // image: imageUrl,
//           price: item.SalePrice,
//           originalPrice: item.SalePrice,
//           discount: 0,
//           quantity: item.Count,
//           uri: item.Uri,
//         };
//       });
//     } catch (err: any) {
//       return rejectWithValue(err.message);
//     }
//   }
// );

// // API: Xóa từng sản phẩm trong giỏ hàng
// // put  /api-end-user/cart/cart-public/remove-item
// export const removeItemFromCart = createAsyncThunk(
//   "cart/removeItemFromCart",
//   async (
//     params: { cartItemId: string; productId: string },
//     { dispatch, rejectWithValue }
//   ) => {
//     const cartId = getCartId();
//     if (!cartId) return rejectWithValue("No CartId found");

//     try {
//       await axios.put(`${API_BASE}/api-end-user/cart/cart-public/remove-item`, {
//         CartId: cartId,
//         ProductId: params.productId, // Trả lại ProductId cho API xóa
//         CartItemId: params.cartItemId,
//         AId: A_ID,
//       });

//       dispatch(fetchCartDetail(cartId));

//       return { cartItemId: params.cartItemId };
//     } catch (error: any) {
//       return rejectWithValue(error.response?.data?.Message || error.message);
//     }
//   }
// );

// // API: Xóa tất cả sản phẩm trong giỏ hàng
// // put   /api-end-user/cart/cart-public/clear-item
// export const clearAllCartItems = createAsyncThunk(
//   "cart/clearAllCartItems",
//   async (_, { dispatch, rejectWithValue }) => {
//     const cartId = getCartId();
//     if (!cartId) return rejectWithValue("No CartId found");

//     try {
//       await axios({
//         method: "PUT",
//         url: `${API_BASE}/api-end-user/cart/cart-public/clear-item`,
//         data: {
//           CartId: cartId,
//           AId: A_ID,
//         },
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });

//       dispatch(fetchCartDetail(cartId));

//       return null;
//     } catch (error: any) {
//       return rejectWithValue(error.response?.data?.Message || error.message);
//     }
//   }
// );

// // API: Cập nhật số lượng sản phẩm trong giỏ hàng
// //put /api-end-user/cart/cart-public/clear-item

// export const updateCartItemQuantity = createAsyncThunk(
//   "cart/updateCartItemQuantity",
//   async (
//     params: {
//       cartItemId: string;
//       productId: string;
//       quantity: number;
//     },
//     { dispatch, rejectWithValue }
//   ) => {
//     const cartId = getCartId();
//     if (!cartId) return rejectWithValue("No CartId found");

//     try {
//       await axios.put(`${API_BASE}/api-end-user/cart/cart-public/update-item`, {
//         CartId: cartId,
//         ProductId: params.productId,
//         CartItemId: params.cartItemId,
//         Count: params.quantity,
//         AId: A_ID,
//       });

//       dispatch(fetchCartDetail(cartId));
//     } catch (error: any) {
//       return rejectWithValue(error.message);
//     }
//   }
// );

// const cartSlice = createSlice({
//   name: "cart",
//   initialState,
//   reducers: {
//     syncCart: (state, action: PayloadAction<CartState>) => {
//       state.items = action.payload.items;
//     },
//     setCartId: (state, action: PayloadAction<string | null>) => {
//       state.cartId = action.payload;
//     },
//     clearCart: (state) => {
//       state.items = [];
//       state.status = "idle";
//       state.error = null;
//       state.cartId = null;
//     },
//   },

//   extraReducers: (builder) => {
//     builder
//       // Add item to cart
//       .addCase(addItemToCart.pending, (state) => {
//         state.status = "pending";
//         state.error = null;
//       })
//       .addCase(addItemToCart.fulfilled, (state) => {
//         state.status = "succeeded";
//         // Items will be updated by fetchCartDetail
//       })
//       .addCase(addItemToCart.rejected, (state, action) => {
//         state.status = "failed";
//         state.error =
//           (action.payload as string) || "Failed to add item to cart";
//       })

//       // Fetch cart detail
//       .addCase(fetchCartDetail.pending, (state) => {
//         state.status = "pending";
//         state.error = null;
//       })
//       .addCase(fetchCartDetail.fulfilled, (state, action) => {
//         state.status = "succeeded";
//         state.items = action.payload;
//       })
//       .addCase(fetchCartDetail.rejected, (state, action) => {
//         state.status = "failed";
//         state.error = (action.payload as string) || "Failed to fetch cart";
//       })

//       // Remove item from cart
//       .addCase(removeItemFromCart.pending, (state) => {
//         state.status = "pending";
//         state.error = null;
//       })
//       .addCase(removeItemFromCart.fulfilled, (state, action) => {
//         state.status = "succeeded";
//         const { cartItemId } = action.payload;
//         state.items = state.items.filter(
//           (item) => item.cartItemId !== cartItemId
//         );
//       })
//       .addCase(removeItemFromCart.rejected, (state, action) => {
//         state.status = "failed";
//         state.error =
//           (action.payload as string) || "Failed to remove item from cart";
//       })

//       // Clear all cart items
//       .addCase(clearAllCartItems.pending, (state) => {
//         state.status = "pending";
//         state.error = null;
//       })
//       .addCase(clearAllCartItems.fulfilled, (state) => {
//         state.status = "succeeded";
//         state.items = [];
//       })
//       .addCase(clearAllCartItems.rejected, (state, action) => {
//         state.status = "failed";
//         state.error = (action.payload as string) || "Failed to clear cart";
//       })

//       // Update cart item quantity
//       .addCase(updateCartItemQuantity.pending, (state) => {
//         state.status = "pending";
//         state.error = null;
//       })
//       .addCase(updateCartItemQuantity.fulfilled, (state) => {
//         state.status = "succeeded";
//         // Items will be updated by fetchCartDetail
//       })
//       .addCase(updateCartItemQuantity.rejected, (state, action) => {
//         state.status = "failed";
//         state.error =
//           (action.payload as string) || "Failed to update item quantity";
//       });
//   },
// });

// // Selectors
// export const selectCartItems = (state: RootState) => state.cart.items;
// export const selectCartTotal = (state: RootState) =>
//   state.cart.items.reduce(
//     (total, item) => total + item.price * item.quantity,
//     0
//   );
// export const selectCartItemById = (state: RootState, productId: string) =>
//   state.cart.items.find((item) => item.productId === productId);
// export const selectCartStatus = (state: RootState) => state.cart.status;
// export const selectCartError = (state: RootState) => state.cart.error;

// export const { syncCart, setCartId, clearCart } = cartSlice.actions;

// export default cartSlice.reducer;
