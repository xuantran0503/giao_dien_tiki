import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { topDealsData } from "../data/topDealsData";

const API_BASE = "http://192.168.2.112:9092";

export interface Product {
  id: string | number;
  title: string;
  originalPrice: number;
  discount: number;
  rating: number;
  image: string;
  shippingBadge?: string;
  date?: string;
}

const initialState = {
  products: [] as Product[],
  status: "idle" as "idle" | "pending" | "succeeded" | "failed",
  error: null as string | null,
  pageIndex: 1,
};

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
          LanguageCode: "vi",
          CurrencyCode: "VND",
        }
      );

      const list = data?.Data?.Result;
      if (!Array.isArray(list) || list.length === 0) return topDealsData;

      return list.map((item: any) => {
        // Lấy URL ảnh và chuẩn hóa (fix lỗi // và đường dẫn tương đối)
        let img = item.Image || item.Images?.[0]?.Url || "";
        if (img && !img.startsWith("http")) {
          img = `${API_BASE}/${img.replace(/\/+/g, "/").replace(/^\//, "")}`;
        }

        return {
          id: item.Id || item.id,
          title: item.Name || item.name || "Sản phẩm",
          image: img,
          originalPrice: item.Price || 0,
          discount: item.DiscountPercentage || 0,
          rating: 5,
          shippingBadge: "Giao nhanh 2h",
          date: "Hot",
        };
      });
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const listingSlice = createSlice({
  name: "listing",
  initialState,
  reducers: {
    setPageIndex: (state, action: PayloadAction<number>) => {
      state.pageIndex = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductsByPage.pending, (state) => {
        state.status = "pending";
        state.error = null;
      })
      .addCase(fetchProductsByPage.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.products = action.payload as Product[];
      })
      .addCase(fetchProductsByPage.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export const { setPageIndex } = listingSlice.actions;
export default listingSlice.reducer;
