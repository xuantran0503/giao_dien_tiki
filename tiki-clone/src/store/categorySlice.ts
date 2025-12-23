import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

export interface Category {
  id: string;
  name: string;
  image?: string;
}

export interface CategoryState {
  categories: Category[];
  status: "idle" | "pending" | "succeeded" | "failed";
  childCategories: Category[];
  chilldCategoryStatus?: "idle" | "pending" | "succeeded" | "failed";
  error?: string | null;
  currentCategory?: Category | null;
}

const initialState: CategoryState = {
  categories: [],
  status: "idle",
  childCategories: [],
  chilldCategoryStatus: "idle",
  error: null,
  currentCategory: null,
};

const API_BASE = "http://192.168.2.112:9092";
const AID = "da1e0cd8-f73b-4da2-acf2-8ddc621bcf75";

// GET all categories
export const fetchAllCategories = createAsyncThunk(
  "category/fetchAllCategories",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(
        `${API_BASE}/api-end-user/classification/get-all`,
        {
          params: { aid: AID },
        }
      );

      const list = data.Data;

      return list.map((item: any) => ({
        id: item.Id,
        name: item.DisplayName,
        // code: item.Code || item.code,
        image: item.Image || item.image,
      }));
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// GET child categories by parent id
export const fetchChildCategories = createAsyncThunk(
  "category/fetchChildCategories",
  async (id: string, { rejectWithValue, getState }) => {
    try {
      const { data } = await axios.get(
        `${API_BASE}/api-end-user/classification/${id}/get-children`,
        {
          params: { aid: AID },
        }
      );
      const list = data.Data || [];

      // const id = ParentId;
      const children = list.map((item: any) => ({
        id: item.Id,
        name: item.DisplayName,
        image: item.Image || item.image || "",
      }));

      // Tìm thông tin danh mục hiện tại từ categories đã có trong state
      const state = getState() as any;
      const current = state.category.categories.find(
        (c: any) => String(c.id) === String(id)
      );

      return {
        id,
        children,
        current: current || { id, name: "Danh mục" },
      };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    setCurrentCategory: (state, action: PayloadAction<Category | null>) => {
      state.currentCategory = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // All categories cases
      .addCase(fetchAllCategories.pending, (state) => {
        state.status = "pending";
        state.error = null;
      })
      .addCase(
        fetchAllCategories.fulfilled,
        (state, action: PayloadAction<Category[]>) => {
          state.status = "succeeded";
          state.categories = action.payload;
        }
      )
      .addCase(fetchAllCategories.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          (action.payload as string) || "Failed to fetch categories";
      })

      // Child categories cases
      .addCase(fetchChildCategories.pending, (state) => {
        state.chilldCategoryStatus = "pending";
        state.error = null;
      })

      .addCase(fetchChildCategories.fulfilled, (state, action: any) => {
        state.chilldCategoryStatus = "succeeded";
        state.childCategories = action.payload.children;
        state.currentCategory = action.payload.current;
      })

      .addCase(fetchChildCategories.rejected, (state, action) => {
        state.chilldCategoryStatus = "failed";
        state.error =
          (action.payload as string) || "Failed to fetch child categories";
      });
  },
});

export const { setCurrentCategory } = categorySlice.actions;
export default categorySlice.reducer;
