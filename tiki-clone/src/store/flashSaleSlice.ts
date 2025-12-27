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
  totalCount: number;
  currentProduct: FlashSaleProduct | null;
  productDetailStatus: "idle" | "pending" | "succeeded" | "failed";
}

const initialState: FlashSaleState = {
  products: [],
  status: "idle",
  error: null,
  pageIndex: 1,
  pageSize: 18,
  totalCount: 0,
  currentProduct: null,
  productDetailStatus: "idle",
};

// API: Danh sách sản phẩm Flash Sale
// POST /api-end-user/listing/get-by-page
export const fetchFlashSaleProducts = createAsyncThunk(
  "flashSale/fetchFlashSaleProducts",
  async (
    params: {
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
          PageIndex: params.pageIndex,
          PageSize: params.pageSize,
          Orderby: "CreatedDate desc",
          AId: "da1e0cd8-f73b-4da2-acf2-8ddc621bcf75",
          CurrencyCode: "VND",
          Keyword: params.keyword || "",
        }
      );

      const list = data.Data.Result || [];
      // const totalCount = data.Data.TotalCount || 0;

      // const products = list.map((item: any) => {
      return list.map((item: any) => {
        const hasPromotion = item.MinHasPromotion || item.MaxHasPromotion;

        const currentPrice = hasPromotion
          ? item.MinPromotionPrice ??
            item.MaxPromotionPrice ??
            item.Price ??
            item.MinPrice ??
            item.MaxPrice ??
            0
          : item.Price ?? item.MinPrice ?? item.MaxPrice ?? 0;

        let originalPrice = item.MaxPrice ?? item.MinPrice ?? currentPrice;

        if (originalPrice < currentPrice) {
          originalPrice = currentPrice;
        }

        let discount = 0;

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
          id: item.Id,
          title: item.Name,
          name: item.Name,
          originalPrice,
          currentPrice,
          discount,
          image: item.Image || "",
          // rating: item.Rating || 0,
          // soldPercent: item.SoldPercent || 0,
          // stock: item.Stock || 0,
          // sold: item.Sold || 0,
          // startTime: item.FlashSaleStartTime,
          // endTime: item.FlashSaleEndTime,
        };
      });

      // return {
      //   products,
      //   totalCount,
      // };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.Message ||
          error.message ||
          "Failed to fetch flash sale products"
      );
    }
  }
);

// API: Chi tiết sản phẩm Flash Sale
// GET /api-end-user/listing/{id}
export const fetchFlashSaleProductById = createAsyncThunk(
  "flashSale/fetchFlashSaleProductById",
  async (id: string | number, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(
        `${API_BASE}/api-end-user/listing/${id}`,
        {
          params: {
            aid: "da1e0cd8-f73b-4da2-acf2-8ddc621bcf75",
          },
        }
      );

      const item = data.Data;

      const hasPromotion = item.MinHasPromotion || item.MaxHasPromotion;

      const currentPrice = hasPromotion
        ? item.MinPromotionPrice ??
          item.MaxPromotionPrice ??
          item.Price ??
          item.MinPrice ??
          item.MaxPrice ??
          0
        : item.Price ?? item.MinPrice ?? item.MaxPrice ?? 0;

      let originalPrice = item.MaxPrice ?? item.MinPrice ?? currentPrice;

      if (originalPrice < currentPrice) {
        originalPrice = currentPrice;
      }

      let discount = 0;

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
        id: item.Id,
        title: item.Name,
        name: item.Name,
        originalPrice,
        currentPrice,
        discount,
        image: item.Image || "",
        // rating: item.Rating || 0,
        // soldPercent: item.SoldPercent || 0,
        // stock: item.Stock || 0,
        // sold: item.Sold || 0,
        // startTime: item.FlashSaleStartTime,
        // endTime: item.FlashSaleEndTime,
      };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.Message ||
          error.message ||
          "Failed to fetch product detail"
      );
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
      state.products = [];
      state.totalCount = 0;
      state.status = "idle";
      state.error = null;
    },
    clearFlashSaleCurrentProduct: (state) => {
      state.currentProduct = null;
      state.productDetailStatus = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch flash sale products
      .addCase(fetchFlashSaleProducts.pending, (state) => {
        state.status = "pending";
        state.error = null;
      })
      .addCase(fetchFlashSaleProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.products = action.payload;
        // state.products = action.payload.products;
        // state.totalCount = action.payload.totalCount;
      })
      .addCase(fetchFlashSaleProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          (action.payload as string) || "Failed to fetch flash sale products";
      })

      // Fetch flash sale product detail
      .addCase(fetchFlashSaleProductById.pending, (state) => {
        state.productDetailStatus = "pending";
        state.error = null;
      })
      .addCase(fetchFlashSaleProductById.fulfilled, (state, action) => {
        state.productDetailStatus = "succeeded";
        state.currentProduct = action.payload;
      })
      .addCase(fetchFlashSaleProductById.rejected, (state, action) => {
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
export const selectFlashSaleError = (state: RootState) => state.flashSale.error;
export const selectFlashSaleTotalCount = (state: RootState) =>
  state.flashSale.totalCount;
export const selectFlashSalePageIndex = (state: RootState) =>
  state.flashSale.pageIndex;
export const selectFlashSaleCurrentProduct = (state: RootState) =>
  state.flashSale.currentProduct;
export const selectFlashSaleProductDetailStatus = (state: RootState) =>
  state.flashSale.productDetailStatus;

export const { setFlashSalePageIndex, clearFlashSaleProducts, clearFlashSaleCurrentProduct } =
  flashSaleSlice.actions;
export default flashSaleSlice.reducer;
