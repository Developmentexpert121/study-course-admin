// slices/ratingSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { reduxApiClient } from '@/lib/redux-api';

// Types
export interface Rating {
  id: number;
  user_id: number;
  course_id: number;
  score: number;
  status: 'hidebysuperadmin' | 'hidebyadmin' | 'showtoeveryone';
  review: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface RatingResponse {
  success: boolean;
  message: string;
  data: Rating;
}

export interface RatingState {
  loading: boolean;
  error: string | null;
  success: boolean;
  actionType: string | null; // To track which action was performed
  updatedRating: Rating | null;
}

// Initial state
const initialState: RatingState = {
  loading: false,
  error: null,
  success: false,
  actionType: null,
  updatedRating: null,
};

// Async thunks
export const hideRatingByAdmin = createAsyncThunk(
  'rating/hideRatingByAdmin',
  async (ratingId: number, { rejectWithValue }) => {
    try {
      const response = await reduxApiClient.patch(`rating/ratings/${ratingId}/hide-by-admin`);
      
      if (!response.success) {
        return rejectWithValue(response.error?.message || 'Failed to hide rating');
      }
      
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to hide rating');
    }
  }
);

export const unhideRatingByAdmin = createAsyncThunk(
  'rating/unhideRatingByAdmin',
  async (ratingId: number, { rejectWithValue }) => {
    try {
      const response = await reduxApiClient.patch(`rating/ratings/${ratingId}/unhide-by-admin`);
      // /ratings/:ratingId/unhide-by-admin
      
      if (!response.success) {
        return rejectWithValue(response.error?.message || 'Failed to unhide rating');
      }
      
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to unhide rating');
    }
  }
);

// Slice
const ratingSlice = createSlice({
  name: 'rating',
  initialState,
  reducers: {
    clearRatingState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.actionType = null;
      state.updatedRating = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
      state.actionType = null;
      state.updatedRating = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Hide Rating By Super Admin
      .addCase(hideRatingByAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.actionType = 'hide';
      })
      .addCase(hideRatingByAdmin.fulfilled, (state, action: PayloadAction<RatingResponse>) => {
        state.loading = false;
        state.success = true;
        state.updatedRating = action.payload.data;
        state.actionType = 'hide';
      })
      .addCase(hideRatingByAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
        state.actionType = 'hide';
      })
      // Unhide Rating By Super Admin
      .addCase(unhideRatingByAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.actionType = 'unhide';
      })
      .addCase(unhideRatingByAdmin.fulfilled, (state, action: PayloadAction<RatingResponse>) => {
        state.loading = false;
        state.success = true;
        state.updatedRating = action.payload.data;
        state.actionType = 'unhide';
      })
      .addCase(unhideRatingByAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
        state.actionType = 'unhide';
      });
  },
});

// Export actions and reducer
export const { clearRatingState, clearError, clearSuccess } = ratingSlice.actions;
export default ratingSlice.reducer;