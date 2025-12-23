import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { topDealsData } from "../data/topDealsData";

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
  Keyword?: string;
}

const initialState: ListingState = {
  products: [],
  status: "idle",
  error: null,
  pageIndex: 1,
  pageSize: 20,
};

// const BLANK_IMAGE =
//   "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

// const BACKEND_BASE_URL = "http://192.168.2.112:9092";

// function buildImageUrl(url?: string): string {
//   if (!url) return BLANK_IMAGE;

//   if (url.startsWith("http")) return url;

//   return `${BACKEND_BASE_URL}/${url.replace(/^\/+/, "").replace(/\/+/g, "/")}`;
// }

function transformProductData(item: any): Product {
  // let imageUrl = BLANK_IMAGE;

  // if (item.Image) {
  //   imageUrl = buildImageUrl(item.Image);
  // } else if (
  //   item.Images &&
  //   Array.isArray(item.Images) &&
  //   item.Images.length > 0
  // ) {
  //   imageUrl = buildImageUrl(item.Images[0].Url || item.Images[0].url);
  // }

  return {
    id: item.Id || item.id,
    title: item.Name || item.name || "Sản phẩm",
    // image: imageUrl,
    image: item.Image,
    originalPrice: item.Price || item.OriginalPrice || 0,
    discount: item.DiscountPercentage || item.Discount || 0,
    rating: 5,
    shippingBadge: "Giao nhanh 2h",
    date: "Hot",
  };
}

const USE_MOCK_DATA = false;

export const fetchProductsByPage = createAsyncThunk<
  Product[],
  { pageIndex: number; pageSize: number },
  { rejectValue: string }
>("listing/fetchProductsByPage", async (params, { rejectWithValue }) => {
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

    const rawProducts = response.data?.Data?.Result;

    if (!Array.isArray(rawProducts) || rawProducts.length === 0) {
      console.warn(" API không trả sản phẩm, fallback mock data");
      return topDealsData;
    }

    return rawProducts.map(transformProductData);
  } catch (error: any) {
    return rejectWithValue(error.message || "Không thể tải danh sách sản phẩm");
  }
});

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
