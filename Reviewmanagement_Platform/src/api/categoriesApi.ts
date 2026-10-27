import { apiClient } from './client';
import { IndustryCategory } from '../lib/types';

export interface CategoriesResponse {
  success: boolean;
  count?: number;
  data?: IndustryCategory[] | IndustryCategory;
  message?: string;
  error?: string;
}

export const categoriesApi = {
  fetchCategories: async (): Promise<IndustryCategory[]> => {
    try {
      const res = await apiClient<CategoriesResponse>('/api/categories', {
        method: 'GET',
      });
      if (Array.isArray(res.data)) {
        return res.data;
      }
      return [];
    } catch (e) {
      console.error('Failed to fetch categories from backend:', e);
      return [];
    }
  },

  fetchCategoryById: async (id: string): Promise<IndustryCategory | null> => {
    try {
      const res = await apiClient<CategoriesResponse>(`/api/categories/${encodeURIComponent(id)}`, {
        method: 'GET',
      });
      if (res.data && !Array.isArray(res.data)) {
        return res.data;
      }
      return null;
    } catch {
      return null;
    }
  },

  createCategory: async (category: Partial<IndustryCategory>): Promise<IndustryCategory> => {
    const res = await apiClient<CategoriesResponse>('/api/categories', {
      method: 'POST',
      body: JSON.stringify(category),
    });
    if (!res.data || Array.isArray(res.data)) {
      throw new Error(res.error || 'Failed to create category');
    }
    return res.data;
  },

  updateCategory: async (id: string, updates: Partial<IndustryCategory>): Promise<IndustryCategory> => {
    const res = await apiClient<CategoriesResponse>(`/api/categories/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    if (!res.data || Array.isArray(res.data)) {
      throw new Error(res.error || 'Failed to update category');
    }
    return res.data;
  },

  deleteCategory: async (id: string): Promise<boolean> => {
    const res = await apiClient<CategoriesResponse>(`/api/categories/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
    return res.success;
  },
};
