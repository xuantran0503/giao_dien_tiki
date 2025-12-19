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
    pageIndex: 1, // Thử đổi lại thành 1 để xem Backend có dữ liệu không
    pageSize: 20,
};

export const fetchProductsByPage = createAsyncThunk(
    "listing/fetchProductsByPage",
    async (
        params: { pageIndex: number; pageSize: number; keyword?: string },
        { rejectWithValue }
    ) => {
        if (USE_MOCK_DATA) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            return topDealsData;
        }

        try {
            // Sử dụng địa chỉ IP trực tiếp của Server Backend 
            // const FULL_URL = "http://192.168.2.112:9092/api-end-user/listing/get-by-page-promotion"; 
            const FULL_URL = "http://192.168.2.112:9092/api-end-user/listing/get-by-page";
            
            // REQUEST BODY CHUẨN 
            const payload = {
                "PageIndex": params.pageIndex,
                "PageSize": params.pageSize,
                "Orderby": "CreatedDate desc",
                "AId": "da1e0cd8-f73b-4da2-acf2-8ddc621bcf75",
                "LanguageCode": "vi",
                "CurrencyCode": "VND"
            };

            // Gửi request POST với đầy đủ Body và Headers theo chuẩn
            const response = await axios.post(FULL_URL, payload, {
                headers: {
                    "Content-Type": "application/json"
                }
            });
            
            // LOG để kiểm tra cấu trúc của Endpoint Promotion mới
            // console.log(" DỮ LIỆU TỪ PROMOTION API:", response.data);

            //  Lấy block Data (viết hoa)
            const dataBlock = response.data.Data || response.data.data || response.data;
            
            //  Lấy mảng sản phẩm từ trường 'Result'
            const rawData = dataBlock.Result || dataBlock.result || dataBlock.Items || dataBlock.items || (Array.isArray(dataBlock) ? dataBlock : []);
            
            if (!Array.isArray(rawData) || rawData.length === 0) {
                console.warn("Mảng sản phẩm trống hoặc không tìm thấy trường Result. Hãy kiểm tra Console để xem cấu trúc Data!");
                return topDealsData;
            }

            // //  CÁCH 1: GHÉP DOMAIN BACKEND
            // const BACKEND_BASE_URL = "http://192.168.2.112:9092";

            // const findImageUrl = (item: any) => {
            //     let imgPath = "";
            //     // Ưu tiên lấy từ mảng Images
            //     if (item.Images && Array.isArray(item.Images) && item.Images.length > 0) {
            //         imgPath = item.Images[0].Url || item.Images[0].url || "";
            //     }

            //     if (!imgPath) return null;

            //     // Nếu đã là link đầy đủ thì giữ nguyên
            //     if (imgPath.startsWith("http")) return imgPath;

            //     // Ghép domain và xóa dấu / ở đầu nếu có
            //     return `${BACKEND_BASE_URL}/${imgPath.replace(/^\/+/, "")}`;
            // };

            // const BLANK_IMAGE = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

            // // 3. Mapping field để giao diện hiểu được
            // return rawData.map((item: any) => {
            //     const foundImage = findImageUrl(item);
                
            //     return {
            //         id: item.Id || item.id,
            //         title: item.Name || item.name || "Sản phẩm",
            //         image: foundImage || BLANK_IMAGE,
            //         originalPrice: item.Price || item.OriginalPrice || 0,
            //         discount: item.DiscountPercentage || item.Discount || 0,
            //         rating: 5,
            //         shippingBadge: "Giao nhanh 2h",
            //         date: "Hot",
            //     };
            // });

            //  CÁCH 2: DÙNG THẺ ẢNH TỪ TRƯỜNG IMAGE THẺ IMAGE
            const BLANK_IMAGE = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

            return rawData.map((item: any) => {
                let imgUrl = BLANK_IMAGE;       
                if (item.Image && typeof item.Image === "string" && item.Image.trim() !== "") {
                    imgUrl = item.Image;
                } else if (item.Images && Array.isArray(item.Images) && item.Images.length > 0) {
                    imgUrl = item.Images[0].Url || item.Images[0].url || BLANK_IMAGE;
                }   
                return {
                    id: item.Id || item.id,
                    title: item.Name || item.name || "Sản phẩm",
                    image: imgUrl,
                    originalPrice: item.Price || item.OriginalPrice || 0,
                    discount: item.DiscountPercentage || item.Discount || 0,
                    rating: 5,
                    shippingBadge: "Giao nhanh 2h",
                    date: "Hot",
                };
            });
            
        } catch (error: any) {
            console.warn("Lỗi xử lý dữ liệu, hiển thị tạm Mock Data:", error.message);
            return topDealsData;
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
