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
export const hideRatingBySuperAdmin = createAsyncThunk(
  'rating/hideRatingBySuperAdmin',
  async (ratingId: number, { rejectWithValue }) => {
    try {
      const response = await reduxApiClient.patch(`rating/ratings/${ratingId}/hide-by-superadmin`);
      
      if (!response.success) {
        return rejectWithValue(response.error?.message || 'Failed to hide rating');
      }
      
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to hide rating');
    }
  }
);

export const unhideRatingBySuperAdmin = createAsyncThunk(
  'rating/unhideRatingBySuperAdmin',
  async (ratingId: number, { rejectWithValue }) => {
    try {
      const response = await reduxApiClient.patch(`rating/ratings/${ratingId}/unhide-by-superadmin`);
      
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
      .addCase(hideRatingBySuperAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.actionType = 'hide';
      })
      .addCase(hideRatingBySuperAdmin.fulfilled, (state, action: PayloadAction<RatingResponse>) => {
        state.loading = false;
        state.success = true;
        state.updatedRating = action.payload.data;
        state.actionType = 'hide';
      })
      .addCase(hideRatingBySuperAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
        state.actionType = 'hide';
      })
      // Unhide Rating By Super Admin
      .addCase(unhideRatingBySuperAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.actionType = 'unhide';
      })
      .addCase(unhideRatingBySuperAdmin.fulfilled, (state, action: PayloadAction<RatingResponse>) => {
        state.loading = false;
        state.success = true;
        state.updatedRating = action.payload.data;
        state.actionType = 'unhide';
      })
      .addCase(unhideRatingBySuperAdmin.rejected, (state, action) => {
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