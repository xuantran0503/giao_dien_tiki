import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { topDealsData } from "../data/topDealsData";

const USE_MOCK_DATA = false;

export interface Product {
  id: string | number;
  title: string;
  originalPrice: number;
  discount: number;
  rating: number;
  image: string;
  imageBadges?: string;
  shippingBadge?: string;
  date?: string;
  madeIn?: string | null;
}

export interface ListingState {
  products: Product[];
  status: "idle" | "pending" | "succeeded" | "failed";
  error: string | null;
  pageIndex: number;
  pageSize: number;
}

const initialState: ListingState = {
  products: [],
  status: "idle",
  error: null,
  pageIndex: 1,
  pageSize: 20,
};

const BLANK_IMAGE =
  "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

const BACKEND_BASE_URL = "http://192.168.2.112:9092";

/**
 * Ghép backend URL với image path
 */
function buildImageUrl(url?: string): string {
  if (!url) return BLANK_IMAGE;
  if (url.startsWith("http")) return url; // Đã là full URL

  // Xóa dấu / ở đầu và ghép với backend URL
  const cleanPath = url.replace(/^\/+/, "");
  return `${BACKEND_BASE_URL}/${cleanPath}`;
}

function transformProductData(item: any): Product {
  let imageUrl = BLANK_IMAGE;

  if (item.Image) {
    imageUrl = buildImageUrl(item.Image);
  } else if (item.Images?.length > 0) {
    const firstImage = item.Images[0];
    const imgPath = firstImage.Url || firstImage.url;
    imageUrl = buildImageUrl(imgPath);
  }

  return {
    id: item.Id || item.id,
    title: item.Name || item.name || "Sản phẩm",
    image: imageUrl,
    originalPrice: item.Price || item.OriginalPrice || 0,
    discount: item.DiscountPercentage || item.Discount || 0,
    rating: 5,
    shippingBadge: "Giao nhanh 2h",
    date: "Hot",
  };
}

export const fetchProductsByPage = createAsyncThunk(
  "listing/fetchProductsByPage",
  async (
    params: { pageIndex: number; pageSize: number },
    { rejectWithValue }
  ) => {
    if (USE_MOCK_DATA) {
      return topDealsData;
    }

    try {
      const FULL_URL =
        "http://192.168.2.112:9092/api-end-user/listing/get-by-page";

      const payload = {
        PageIndex: params.pageIndex,
        PageSize: params.pageSize,
        Orderby: "CreatedDate desc",
        AId: "da1e0cd8-f73b-4da2-acf2-8ddc621bcf75",
        LanguageCode: "vi",
        CurrencyCode: "VND",
      };

      const response = await axios.post(FULL_URL, payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      //  DEBUG: Kiểm tra API response
      console.log(" Full API Response:", response.data);
      console.log(" Data.Result:", response.data?.Data?.Result);

      const products = response.data?.Data?.Result;

      if (!products || products.length === 0) {
        console.warn("Không tìm thấy sản phẩm từ API, sử dụng mock data");
        return topDealsData;
      }

      //  DEBUG: Kiểm tra sản phẩm đầu tiên
      console.log(" First Product:", products[0]);
      console.log(" First Product Image:", products[0]?.Image);
      console.log(" First Product Images:", products[0]?.Images);

      const transformedProducts = products.map(transformProductData);

      //  DEBUG: Kiểm tra sau khi transform
      console.log(" Transformed First Product:", transformedProducts[0]);
      console.log(" Transformed Image URL:", transformedProducts[0]?.image);

      return transformedProducts;
    } catch (error: any) {
      return rejectWithValue(error.message || "API Error");
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
        state.products = action.payload;
      })
      .addCase(fetchProductsByPage.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) || "Failed to fetch products";
      });
  },
});

export const { setPageIndex } = listingSlice.actions;
export default listingSlice.reducer;
