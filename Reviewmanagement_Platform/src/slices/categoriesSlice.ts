import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { IndustryCategory } from '../lib/types';
import { categoriesApi } from '../api/categoriesApi';
import { INDUSTRY_CATALOG } from '../lib/data';

interface CategoriesState {
  items: IndustryCategory[];
  loading: boolean;
  error: string | null;
}

const defaultList: IndustryCategory[] = Object.values(INDUSTRY_CATALOG).map((cat) => ({
  ...cat,
  isSystem: true,
}));

const initialState: CategoriesState = {
  items: defaultList,
  loading: false,
  error: null,
};

export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const data = await categoriesApi.fetchCategories();
      if (Array.isArray(data) && data.length > 0) {
        return data;
      }
      return defaultList;
    } catch (err: any) {
      return defaultList;
    }
  }
);

export const addCategory = createAsyncThunk(
  'categories/addCategory',
  async (categoryData: Partial<IndustryCategory>, { rejectWithValue }) => {
    try {
      const saved = await categoriesApi.createCategory(categoryData);
      return saved;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to create category');
    }
  }
);

export const updateCategory = createAsyncThunk(
  'categories/updateCategory',
  async ({ id, updates }: { id: string; updates: Partial<IndustryCategory> }, { rejectWithValue }) => {
    try {
      const updated = await categoriesApi.updateCategory(id, updates);
      return updated;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to update category');
    }
  }
);

export const deleteCategory = createAsyncThunk(
  'categories/deleteCategory',
  async (id: string, { rejectWithValue }) => {
    try {
      await categoriesApi.deleteCategory(id);
      return id;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to delete category');
    }
  }
);

export const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    setCategoriesDirect: (state, action: PayloadAction<IndustryCategory[]>) => {
      state.items = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchCategories
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch categories';
      })
      // addCategory
      .addCase(addCategory.fulfilled, (state, action) => {
        const idx = state.items.findIndex((c) => c.id === action.payload.id);
        if (idx >= 0) {
          state.items[idx] = action.payload;
        } else {
          state.items.push(action.payload);
        }
      })
      // updateCategory
      .addCase(updateCategory.fulfilled, (state, action) => {
        const idx = state.items.findIndex((c) => c.id === action.payload.id);
        if (idx >= 0) {
          state.items[idx] = action.payload;
        }
      })
      // deleteCategory
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.items = state.items.filter((c) => c.id !== action.payload);
      });
  },
});

export const { setCategoriesDirect } = categoriesSlice.actions;
export default categoriesSlice.reducer;
