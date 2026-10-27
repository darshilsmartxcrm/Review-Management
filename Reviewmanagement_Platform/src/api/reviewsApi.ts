import { apiClient } from './client';

export interface ReviewsResponse {
  success: boolean;
  clientId?: string;
  usedReviews?: string[];
  count?: number;
  message?: string;
  error?: string;
}

export const reviewsApi = {
  fetchUsedReviews: async (clientId: string): Promise<string[]> => {
    try {
      const res = await apiClient<ReviewsResponse>('/api/reviews', {
        method: 'GET',
        params: { clientId },
      });
      return res.usedReviews || [];
    } catch {
      return [];
    }
  },

  lockReview: async (clientId: string, reviewText: string): Promise<boolean> => {
    try {
      const res = await apiClient<ReviewsResponse>('/api/reviews', {
        method: 'POST',
        body: JSON.stringify({ clientId, reviewText }),
      });
      return res.success;
    } catch {
      return false;
    }
  },
};
