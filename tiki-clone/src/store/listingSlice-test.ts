import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { topDealsData } from "../data/topDealsData";

const USE_MOCK_DATA = false; // Tắt Mock để gọi API thật theo hướng dẫn mới

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

const BACKEND_BASE_URL = "http://192.168.2.112:9092";
const BLANK_IMAGE =
  "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

/**
 * Lấy mảng sản phẩm từ API response
 * API có thể trả về nhiều cấu trúc khác nhau, function này xử lý tất cả
 */
// function extractProductsFromResponse(responseData: any): any[] {
//     // Bước 1: Lấy data block (có thể là Data, data, hoặc chính responseData)
//     const dataBlock = responseData?.Data || responseData?.data || responseData;

//     // Bước 2: Lấy mảng sản phẩm (có thể là Result, result, Items, items, hoặc chính dataBlock)
//     const products =
//         dataBlock?.Result ||
//         dataBlock?.result ||
//         dataBlock?.Items ||
//         dataBlock?.items ||
//         (Array.isArray(dataBlock) ? dataBlock : []);

//     return products;
// }

/**
 * Xây dựng URL ảnh từ path
 * - Nếu không có URL → trả về ảnh trắng
 * - Nếu đã là URL đầy đủ → giữ nguyên
 * - Nếu là relative path → ghép với backend URL
 */
// function buildImageUrl(url?: string): string {
//     if (!url) return BLANK_IMAGE;
//     if (url.startsWith("http")) return url;

//     // Xóa các dấu / thừa ở đầu và ghép với backend URL
//     const cleanPath = url.replace(/^\/+/, "");
//     return `${BACKEND_BASE_URL}/${cleanPath}`;
// }

/**
 * Chuyển đổi dữ liệu từ API sang Product interface
 */
function transformProductData(item: any): Product {
  // Xử lý image URL trực tiếp (thay vì dùng getImageUrl)
  let imageUrl = BLANK_IMAGE;
  if (item.Image) {
    // imageUrl = buildImageUrl(item.Image);
    imageUrl = item.Image;
  } else if (item.Images?.length > 0) {
    const firstImage = item.Images[0];
    const imgPath = firstImage.Url || firstImage.url;
    // imageUrl = buildImageUrl(imgPath);
    imageUrl = imgPath;
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
      // await new Promise(resolve => setTimeout(resolve, 1000));
      return topDealsData;
    }

    try {
      const FULL_URL =
        "http://192.168.2.112:9092/api-end-user/listing/get-by-page";
      // REQUEST BODY CHUẨN
      const payload = {
        PageIndex: params.pageIndex,
        PageSize: params.pageSize,
        Orderby: "CreatedDate desc",
        AId: "da1e0cd8-f73b-4da2-acf2-8ddc621bcf75",
        LanguageCode: "vi",
        CurrencyCode: "VND",
      };
      // Gửi request POST với đầy đủ Body và Headers theo chuẩn
      const response = await axios.post(FULL_URL, payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Lấy mảng sản phẩm từ API response
      // const products = extractProductsFromResponse(response.data);
      // const products = response.data;
      const products = response.data?.Data?.Result;

      if (!products || products.length === 0) {
        console.warn("Không tìm thấy sản phẩm từ API, sử dụng mock data");
        return topDealsData;
      }

      // Chuyển đổi dữ liệu API sang format của app
      return products.map(transformProductData);
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
