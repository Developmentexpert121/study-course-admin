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
  isactive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RatingResponse {
  success: boolean;
  message: string;
  data: {
    id: number;
    isactive: boolean;
    updatedAt: string;
  };
}

export interface RatingState {
  softDeleteLoading: boolean;
  softDeleteError: string | null;
  softDeleteSuccess: boolean;
  
  addRatingLoading: boolean;
  addRatingError: string | null;
  addRatingSuccess: boolean;
  
  updatedRatingId: number | null;
  actionType: 'softDelete' | 'addRating' | null;
}

// Initial state
const initialState: RatingState = {
  softDeleteLoading: false,
  softDeleteError: null,
  softDeleteSuccess: false,
  
  addRatingLoading: false,
  addRatingError: null,
  addRatingSuccess: false,
  
  updatedRatingId: null,
  actionType: null,
};

// Async thunks
export const softDeleteRating = createAsyncThunk(
  'ratings/softDeleteRating',
  async (ratingId: number, { rejectWithValue }) => {
    try {
      const response = await reduxApiClient.patch(`rating/ratings/${ratingId}/soft-delete`);
      
      if (!response.success) {
        return rejectWithValue(response.error?.message || 'Failed to delete rating');
      }
      
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to delete rating');
    }
  }
);

export const addRating = createAsyncThunk(
  'ratings/addRating',
  async (ratingId: number, { rejectWithValue }) => {
    try {
      const response = await reduxApiClient.patch(`rating/ratings/${ratingId}/soft-add`);
      
      if (!response.success) {
        return rejectWithValue(response.error?.message || 'Failed to activate rating');
      }
      
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to activate rating');
    }
  }
);

// Slice
const ratingSlice = createSlice({
  name: 'ratings',
  initialState,
  reducers: {
    clearRatingState: (state) => {
      state.softDeleteLoading = false;
      state.softDeleteError = null;
      state.softDeleteSuccess = false;
      state.addRatingLoading = false;
      state.addRatingError = null;
      state.addRatingSuccess = false;
      state.updatedRatingId = null;
      state.actionType = null;
    },
    clearSoftDeleteState: (state) => {
      state.softDeleteLoading = false;
      state.softDeleteError = null;
      state.softDeleteSuccess = false;
    },
    clearAddRatingState: (state) => {
      state.addRatingLoading = false;
      state.addRatingError = null;
      state.addRatingSuccess = false;
    },
    clearErrors: (state) => {
      state.softDeleteError = null;
      state.addRatingError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Soft Delete Rating
      .addCase(softDeleteRating.pending, (state) => {
        state.softDeleteLoading = true;
        state.softDeleteError = null;
        state.softDeleteSuccess = false;
        state.actionType = 'softDelete';
      })
      .addCase(softDeleteRating.fulfilled, (state, action: PayloadAction<RatingResponse>) => {
        state.softDeleteLoading = false;
        state.softDeleteSuccess = true;
        state.updatedRatingId = action.payload.data.id;
        state.actionType = 'softDelete';
      })
      .addCase(softDeleteRating.rejected, (state, action) => {
        state.softDeleteLoading = false;
        state.softDeleteError = action.payload as string;
        state.softDeleteSuccess = false;
        state.actionType = 'softDelete';
      })
      // Add/Activate Rating
      .addCase(addRating.pending, (state) => {
        state.addRatingLoading = true;
        state.addRatingError = null;
        state.addRatingSuccess = false;
        state.actionType = 'addRating';
      })
      .addCase(addRating.fulfilled, (state, action: PayloadAction<RatingResponse>) => {
        state.addRatingLoading = false;
        state.addRatingSuccess = true;
        state.updatedRatingId = action.payload.data.id;
        state.actionType = 'addRating';
      })
      .addCase(addRating.rejected, (state, action) => {
        state.addRatingLoading = false;
        state.addRatingError = action.payload as string;
        state.addRatingSuccess = false;
        state.actionType = 'addRating';
      });
  },
});

// Export actions and reducer
export const { 
  clearRatingState, 
  clearSoftDeleteState, 
  clearAddRatingState,
  clearErrors 
} = ratingSlice.actions;
export default ratingSlice.reducer;

export const selectSoftDeleteLoading = (state: any) => state.ratings.softDeleteLoading;
export const selectSoftDeleteError = (state: any) => state.ratings.softDeleteError;
export const selectSoftDeleteSuccess = (state: any) => state.ratings.softDeleteSuccess;

export const selectAddRatingLoading = (state: any) => state.ratings.addRatingLoading;
export const selectAddRatingError = (state: any) => state.ratings.addRatingError;
export const selectAddRatingSuccess = (state: any) => state.ratings.addRatingSuccess;

export const selectUpdatedRatingId = (state: any) => state.ratings.updatedRatingId;
export const selectActionType = (state: any) => state.ratings.actionType;
