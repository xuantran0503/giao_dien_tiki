import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

export interface Product {
  id: string | number;
  productId?: string;
  title: string;
  originalPrice: number;
  discount: number;
  rating?: number;
  image: string;
  name?: string;
  price?: number;
  imageBadges?: string;
  shippingBadge?: string;
  date?: string;
  madeIn?: string | null;
  description?: string;
  shortDescription?: string;
}

export interface ListingState {
  products: Product[];
  status: "idle" | "pending" | "succeeded" | "failed";
  error: string | null;
  pageIndex: number;
  pageSize: number;
  Keyword?: string;
  currentProduct: Product | null;
  productDetailStatus: "idle" | "pending" | "succeeded" | "failed";
}

const initialState: ListingState = {
  products: [],
  status: "idle",
  error: null,
  pageIndex: 1,
  pageSize: 18,
  currentProduct: null,
  productDetailStatus: "idle",
};

const API_BASE = "http://192.168.2.112:9092";

// POST products by page
export const fetchProductsByPage = createAsyncThunk(
  "listing/fetchProductsByPage",
  async (
    params: { pageIndex: number; pageSize: number },
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
          // LanguageCode: "vi",
          CurrencyCode: "VND",
          // Keyword: params.Keyword || "",
        }
      );

      const list = data.Data.Result || [];

      return list.map((item: any) => {
        return {
          id: item.Id,
          productId: item.ExData?.GroupServiceId || item.ProductsId || item.Id,
          // productId: item.Id,
          title: item.Name,
          name: item.Name,
          originalPrice: item.Price || 0,
          currentPrice: item.PromotionPrice || item.Price || 0,
          discount: item.DiscountPercentage || 0,
          image: item.Image
            ? item.Image.startsWith("http")
              ? item.Image
              : `${API_BASE}${item.Image}`
            : "",
        };
      });
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// GET product detail by id
export const fetchProductById = createAsyncThunk(
  "listing/fetchProductById",
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
      // console.log("Raw Product Detail:", item);
      const { originalPrice, discount, currentPrice } = ProductPrices(item);

      return {
        id: item.Id,
        productId: item.ExData?.GroupServiceId || item.ProductsId || item.Id,
        title: item.Name,
        name: item.Name,
        image: item.Image
          ? item.Image.startsWith("http")
            ? item.Image
            : `${API_BASE}${item.Image}`
          : "",
        originalPrice,
        currentPrice,
        discount,
        description: item.Description,
        shortDescription: item.ShortDescription,
      };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const listingSlice = createSlice({
  name: "listing",
  initialState,
  reducers: {
    setListingPageIndex: (state, action: PayloadAction<number>) => {
      state.pageIndex = action.payload;
    },
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
      state.productDetailStatus = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      // Product in list cases
      .addCase(fetchProductsByPage.pending, (state) => {
        state.status = "pending";
        state.error = null;
      })
      .addCase(fetchProductsByPage.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.products = action.payload;
      })
      .addCase(fetchProductsByPage.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) || "Failed to fetch products";
      })

      // Product detail cases
      .addCase(fetchProductById.pending, (state) => {
        state.productDetailStatus = "pending";
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.productDetailStatus = "succeeded";
        state.currentProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.productDetailStatus = "failed";
        state.error = (action.payload as string) || "Failed to fetch product detail";
      });
  },
});

export const { setListingPageIndex, clearCurrentProduct } =
  listingSlice.actions;
export default listingSlice.reducer;
