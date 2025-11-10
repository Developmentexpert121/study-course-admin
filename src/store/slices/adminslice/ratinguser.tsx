import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { reduxApiClient } from "@/lib/redux-api";

// Types
export interface User {
  id: number;
  username: string;
  email: string;
  profileImage?: string;
  bio?: string;
}

export interface Rating {
  id: number;
  user_id: number;
  course_id: number;
  score: number;
  status: "hidebysuperadmin" | "hidebyadmin" | "showtoeveryone";
  review?: string;
  createdAt: string;
  updatedAt: string;
  user?: User | null;
}

interface RatingState {
  ratings: Rating[];
  loading: boolean;
  error: string | null;
  currentRating: Rating | null;
  lastFetched: string | null;
}

const initialState: RatingState = {
  ratings: [],
  loading: false,
  error: null,
  currentRating: null,
  lastFetched: null,
};

// Async Thunks
export const getAllRatings = createAsyncThunk(
  "ratings/getAllRatings",
  async (_, { rejectWithValue }) => {
    try {
      const response = await reduxApiClient.get("rating/public/home-ratings");

      if (!response.success) {
        return rejectWithValue(
          response.error?.message || "Failed to fetch ratings",
        );
      }

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch ratings");
    }
  },
);

export const getRatingById = createAsyncThunk(
  "ratings/getRatingById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await reduxApiClient.get(`ratings/${id}`);

      if (!response.success) {
        return rejectWithValue(
          response.error?.message || "Failed to fetch rating",
        );
      }

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch rating");
    }
  },
);

export const getRatingsByCourseId = createAsyncThunk(
  "ratings/getRatingsByCourseId",
  async (courseId: string, { rejectWithValue }) => {
    try {
      const response = await reduxApiClient.get(`ratings/course/${courseId}`);

      if (!response.success) {
        return rejectWithValue(
          response.error?.message || "Failed to fetch course ratings",
        );
      }

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch course ratings");
    }
  },
);

export const getRatingsByUserId = createAsyncThunk(
  "ratings/getRatingsByUserId",
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await reduxApiClient.get(`ratings/user/${userId}`);

      if (!response.success) {
        return rejectWithValue(
          response.error?.message || "Failed to fetch user ratings",
        );
      }

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch user ratings");
    }
  },
);

// Create Rating Slice
const ratingSlice = createSlice({
  name: "ratings",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentRating: (state) => {
      state.currentRating = null;
    },
    clearRatings: (state) => {
      state.ratings = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // getAllRatings
      .addCase(getAllRatings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllRatings.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.ratings = action.payload.data || action.payload;
        state.error = null;
        state.lastFetched = new Date().toISOString();
      })
      .addCase(getAllRatings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.ratings = [];
      })
      // getRatingById
      .addCase(getRatingById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getRatingById.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.currentRating = action.payload.data || action.payload;
        state.error = null;
      })
      .addCase(getRatingById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.currentRating = null;
      })
      // getRatingsByCourseId
      .addCase(getRatingsByCourseId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getRatingsByCourseId.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.ratings = action.payload.data || action.payload;
          state.error = null;
          state.lastFetched = new Date().toISOString();
        },
      )
      .addCase(getRatingsByCourseId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.ratings = [];
      })
      // getRatingsByUserId
      .addCase(getRatingsByUserId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getRatingsByUserId.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.ratings = action.payload.data || action.payload;
          state.error = null;
          state.lastFetched = new Date().toISOString();
        },
      )
      .addCase(getRatingsByUserId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.ratings = [];
      });
  },
});

// Additional useful selectors
export const selectVisibleRatings = (state: any) =>
  state.ratings.ratings.filter(
    (rating: Rating) => rating.status === "showtoeveryone",
  );

export const selectHiddenRatings = (state: any) =>
  state.ratings.ratings.filter(
    (rating: Rating) =>
      rating.status === "hidebyadmin" || rating.status === "hidebysuperadmin",
  );

export const selectRatingsByCourse = (courseId: number) => (state: any) =>
  state.ratings.ratings.filter(
    (rating: Rating) => rating.course_id === courseId,
  );

export const selectRatingsByUser = (userId: number) => (state: any) =>
  state.ratings.ratings.filter((rating: Rating) => rating.user_id === userId);

export const selectAverageRating = (state: any) => {
  const ratings = state.ratings.ratings;
  if (ratings.length === 0) return 0;
  return (
    ratings.reduce((sum: number, rating: Rating) => sum + rating.score, 0) /
    ratings.length
  );
};

export const { clearError, clearCurrentRating, clearRatings } =
  ratingSlice.actions;

// Selectors
export const selectRatings = (state: any) => state.ratings.ratings;
export const selectRatingLoading = (state: any) => state.ratings.loading;
export const selectRatingError = (state: any) => state.ratings.error;
export const selectCurrentRating = (state: any) => state.ratings.currentRating;
export const selectLastFetched = (state: any) => state.ratings.lastFetched;
export default ratingSlice.reducer;
