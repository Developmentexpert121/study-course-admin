import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { reduxApiClient } from "@/lib/redux-api";

interface Rating {
  id: number;
  user_id: number;
  course_id: number;
  score: number;
  status: string;
  review: string | null;
  isactive: boolean;
  review_visibility: string;
}

interface UpdateVisibilityPayload {
  ratingId: string | number;
  role: string;
}

interface RatingState {
  rating: Rating | null;
  loading: boolean;
  error: string | null;
  success: boolean;
  message: string | null;
}

const initialState: RatingState = {
  rating: null,
  loading: false,
  error: null,
  success: false,
  message: null,
};

// Async thunk for updating review visibility
export const updateReviewVisibility = createAsyncThunk(
  "rating/updateReviewVisibility",
  async (payload: UpdateVisibilityPayload, { rejectWithValue }) => {
    try {
      const response = await reduxApiClient.put(
        `ratings/${payload.ratingId}/visibility`,
        { role: payload.role }
      );

      if (!response.success) {
        return rejectWithValue(response.error?.message || "Failed to update visibility");
      }

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || "An error occurred");
    }
  }
);

// Async thunk for getting rating by ID
export const getRatingById = createAsyncThunk(
  "rating/getRatingById",
  async (ratingId: string | number, { rejectWithValue }) => {
    try {
      const response = await reduxApiClient.get(`ratings/${ratingId}`);

      if (!response.success) {
        return rejectWithValue(response.error?.message || "Failed to fetch rating");
      }

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || "An error occurred");
    }
  }
);

// Async thunk for batch update visibility
export const batchUpdateReviewVisibility = createAsyncThunk(
  "rating/batchUpdateReviewVisibility",
  async (
    payload: { ratingIds: (string | number)[]; role: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await reduxApiClient.put(
        "ratings/batch/visibility",
        payload
      );

      if (!response.success) {
        return rejectWithValue(response.error?.message || "Failed to update visibility");
      }

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || "An error occurred");
    }
  }
);

// Async thunk for deleting rating
export const deleteUserRating = createAsyncThunk(
  "rating/deleteUserRating",
  async (ratingId: string | number, { rejectWithValue }) => {
    try {
      const response = await reduxApiClient.delete(`ratings/${ratingId}`);

      if (!response.success) {
        return rejectWithValue(response.error?.message || "Failed to delete rating");
      }

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || "An error occurred");
    }
  }
);

const ratingSlice = createSlice({
  name: "rating",
  initialState,
  reducers: {
    resetRatingState: (state) => {
      state.rating = null;
      state.loading = false;
      state.error = null;
      state.success = false;
      state.message = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Update Review Visibility
    builder
      .addCase(updateReviewVisibility.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateReviewVisibility.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message || "Review visibility updated successfully";
        state.rating = action.payload.data;
      })
      .addCase(updateReviewVisibility.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload as string;
      });

    // Get Rating By ID
    builder
      .addCase(getRatingById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getRatingById.fulfilled, (state, action) => {
        state.loading = false;
        state.rating = action.payload.data;
      })
      .addCase(getRatingById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Batch Update Review Visibility
    builder
      .addCase(batchUpdateReviewVisibility.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(batchUpdateReviewVisibility.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message || "Ratings updated successfully";
      })
      .addCase(batchUpdateReviewVisibility.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload as string;
      });

    // Delete User Rating
    builder
      .addCase(deleteUserRating.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deleteUserRating.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message || "Rating deleted successfully";
        state.rating = null;
      })
      .addCase(deleteUserRating.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetRatingState, clearError } = ratingSlice.actions;
export default ratingSlice.reducer;