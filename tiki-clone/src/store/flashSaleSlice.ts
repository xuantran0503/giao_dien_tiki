import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "./store";

const API_BASE = "http://192.168.2.112:9092";

export interface FlashSaleProduct {
  id: string | number;
  title: string;
  name?: string;
  originalPrice: number;
  currentPrice: number;
  discount: number;
  rating?: number;
  image: string;
  soldPercent?: number;
  stock?: number;
  sold?: number;
  startTime?: string;
  endTime?: string;
}

export interface FlashSaleState {
  products: FlashSaleProduct[];
  status: "idle" | "pending" | "succeeded" | "failed";
  error: string | null;
  pageIndex: number;
  pageSize: number;
  currentProduct: FlashSaleProduct | null;
  productDetailStatus: "idle" | "pending" | "succeeded" | "failed";
}

const initialState: FlashSaleState = {
  products: [],
  status: "idle",
  error: null,
  pageIndex: 1,
  pageSize: 18,
  currentProduct: null,
  productDetailStatus: "idle",
};

// API: Danh sách sản phẩm Flash Sale
export const fetchFlashSaleProducts = createAsyncThunk(
  "flashSale/fetchFlashSaleProducts",
  async (
    payload: {
      pageIndex: number;
      pageSize: number;
      keyword?: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await axios.post(
        `${API_BASE}/api-end-user/listing/get-by-page`,
        {
          PageIndex: payload.pageIndex,
          PageSize: payload.pageSize,
          Orderby: "CreatedDate desc",
          AId: "da1e0cd8-f73b-4da2-acf2-8ddc621bcf75",
          CurrencyCode: "VND",
          Keyword: payload.keyword || "",
        }
      );

      const list = data.Data.Result || [];

      return list.map((item: any) => {
        return {
          id: item.Id,
          title: item.Name,
          name: item.Name,
          originalPrice: item.Price || 0,
          currentPrice: item.PromotionPrice || item.Price,
          discount: item.DiscountPercentage || 0,
          image: item.Image || "",
        };
      });
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.Message ||
          error.message ||
          "Failed to fetch flash sale products"
      );
    }
  }
);

// GET product detail by id for Flash Sale
export const fetchProductByIdFashSale = createAsyncThunk(
  "flashSale/fetchProductByIdFashSale",
  async (id: string | number, { rejectWithValue }) => {
    // console.log(`[API Request] Fetching product with ID: ${id}`);
    try {
      const { data } = await axios.get(
        `${API_BASE}/api-end-user/listing/${id}`,
        {
          params: {
            aid: "da1e0cd8-f73b-4da2-acf2-8ddc621bcf75",
          },
        }
      );
      console.log(`[API Response] Data received for ID: ${id}`, data.Data);

      const ProductPrices = (item: any) => {
        const hasPromotion = item.MinHasPromotion || item.MaxHasPromotion;

        const currentPrice = hasPromotion
          ? item.MinPromotionPrice ??
            item.MaxPromotionPrice ??
            item.MinPrice ??
            item.MaxPrice ??
            0
          : item.Price ?? item.MinPrice ?? item.MaxPrice ?? 0;

        let originalPrice = item.MaxPrice ?? item.MinPrice ?? currentPrice;

        if (originalPrice < currentPrice) {
          originalPrice = currentPrice;
        }

        let discount = 0;

        //  Tính % giảm giá CHỈ khi có khuyến mãi hợp lệ
        if (
          (item.MaxHasPromotion === true || item.MinHasPromotion === true) &&
          originalPrice > currentPrice &&
          originalPrice > 0
        ) {
          discount = Math.round(
            ((originalPrice - currentPrice) / originalPrice) * 100
          );
        }

        return {
          originalPrice,
          currentPrice,
          discount,
        };
      };

      const item = data.Data;
      // if (!item) return null;

      const { originalPrice, discount, currentPrice } = ProductPrices(item);

      return {
        id: item.Id,
        title: item.Name,
        name: item.Name,
        image: item.Image,
        originalPrice,
        currentPrice,
        discount,
        description: item.Description,
        shortDescription: item.ShortDescription,
        // madeIn: item.ExData?.Origin || item.madeIn,
      };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const flashSaleSlice = createSlice({
  name: "flashSale",
  initialState,
  reducers: {
    setFlashSalePageIndex: (state, action: PayloadAction<number>) => {
      state.pageIndex = action.payload;
    },
    clearFlashSaleProducts: (state) => {
      // state.products = [];
      // state.status = "idle";
      // state.error = null;
      state.currentProduct = null;
      state.productDetailStatus = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFlashSaleProducts.pending, (state) => {
        state.status = "pending";
        state.error = null;
      })
      .addCase(fetchFlashSaleProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.products = action.payload;
      })
      .addCase(fetchFlashSaleProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          (action.payload as string) || "Failed to fetch flash sale products";
      })

      // Product detail cases
      .addCase(fetchProductByIdFashSale.pending, (state) => {
        state.productDetailStatus = "pending";
        state.error = null;
      })
      .addCase(fetchProductByIdFashSale.fulfilled, (state, action) => {
        state.productDetailStatus = "succeeded";
        state.currentProduct = action.payload;
      })
      .addCase(fetchProductByIdFashSale.rejected, (state, action) => {
        state.productDetailStatus = "failed";
        state.error =
          (action.payload as string) || "Failed to fetch product detail";
      });
  },
});

// Selectors
export const selectFlashSaleProducts = (state: RootState) =>
  state.flashSale.products;
export const selectFlashSaleStatus = (state: RootState) =>
  state.flashSale.status;
export const selectFlashSalePageIndex = (state: RootState) =>
  state.flashSale.pageIndex;

export const { setFlashSalePageIndex, clearFlashSaleProducts } =
  flashSaleSlice.actions;
export default flashSaleSlice.reducer;
