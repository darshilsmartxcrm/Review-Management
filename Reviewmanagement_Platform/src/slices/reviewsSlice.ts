import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { reviewsApi } from '../api/reviewsApi';
import { getUsedReviewsLocal, markReviewUsed } from '../lib/storage';

interface ReviewsState {
  usedReviewsByClient: Record<string, string[]>;
  loading: boolean;
}

const initialState: ReviewsState = {
  usedReviewsByClient: {},
  loading: false,
};

export const fetchLockedReviews = createAsyncThunk(
  'reviews/fetchLockedReviews',
  async (clientId: string) => {
    try {
      const remote = await reviewsApi.fetchUsedReviews(clientId);
      return { clientId, usedReviews: remote || [] };
    } catch {
      return { clientId, usedReviews: [] };
    }
  }
);

export const lockReview = createAsyncThunk(
  'reviews/lockReview',
  async ({ clientId, reviewText }: { clientId: string; reviewText: string }) => {
    try {
      await reviewsApi.lockReview(clientId, reviewText);
    } catch {}
    return { clientId, reviewText };
  }
);

const reviewsSlice = createSlice({
  name: 'reviews',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchLockedReviews.fulfilled, (state, action) => {
      state.usedReviewsByClient[action.payload.clientId] = action.payload.usedReviews;
    });

    builder.addCase(lockReview.fulfilled, (state, action) => {
      const existing = state.usedReviewsByClient[action.payload.clientId] || [];
      if (!existing.includes(action.payload.reviewText)) {
        state.usedReviewsByClient[action.payload.clientId] = [action.payload.reviewText, ...existing];
      }
    });
  },
});

export default reviewsSlice.reducer;
