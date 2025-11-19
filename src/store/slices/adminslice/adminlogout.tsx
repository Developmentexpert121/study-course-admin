import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  AdminActivityState,
  initialAdminActivityState,
  AdminActivitiesResponse,
  TrackLogoutResponse,
} from "@/types/adminType/admintype";
import { reduxApiClient } from "@/lib/redux-api";

// Use shared initial state
const initialState: AdminActivityState = initialAdminActivityState;
// Async thunk for getting all admin activities
export const getAllAdminActivities = createAsyncThunk(
  "adminActivity/getAllAdminActivities",
  async (
    params: {
      page?: number;
      limit?: number;
      activity_type?: string;
      admin_id?: number;
    } = {},
    { rejectWithValue },
  ) => {
    try {
      const { page = 1, limit = 50, activity_type, admin_id } = params;

      const response = await reduxApiClient.get("user/getlogs", {
        params: {
          page,
          limit,
          activity_type,
          admin_id,
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch admin activities",
      );
    }
  },
);

// Async thunk for tracking logout activity
export const trackLogoutActivity = createAsyncThunk(
  "adminActivity/trackLogout",
  async (admin_id: number, { rejectWithValue }) => {
    try {
      const response = await reduxApiClient.post("user/logout", {
        admin_id,
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to track logout activity",
      );
    }
  },
);

// Slice
const adminActivitySlice = createSlice({
  name: "adminActivity",
  initialState,
  reducers: {
    clearActivities: (state) => {
      state.activities = [];
      state.totalCount = 0;
      state.currentPage = 1;
      state.totalPages = 0;
      state.hasMore = false;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
      state.logoutError = null;
    },
    clearLogoutState: (state) => {
      state.logoutLoading = false;
      state.logoutError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get All Admin Activities
      .addCase(getAllAdminActivities.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getAllAdminActivities.fulfilled,
        (state, action: PayloadAction<AdminActivitiesResponse>) => {
          state.loading = false;
          state.activities = action.payload.activities;
          state.totalCount = action.payload.totalCount;
          state.currentPage = action.payload.currentPage;
          state.totalPages = action.payload.totalPages;
          state.hasMore = action.payload.hasMore;
        },
      )
      .addCase(getAllAdminActivities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.activities = [];
        state.totalCount = 0;
        state.currentPage = 1;
        state.totalPages = 0;
        state.hasMore = false;
      })
      // Track Logout Activity
      .addCase(trackLogoutActivity.pending, (state) => {
        state.logoutLoading = true;
        state.logoutError = null;
      })
      .addCase(trackLogoutActivity.fulfilled, (state) => {
        state.logoutLoading = false;
        state.logoutError = null;
      })
      .addCase(trackLogoutActivity.rejected, (state, action) => {
        state.logoutLoading = false;
        state.logoutError = action.payload as string;
      });
  },
});

export const { clearActivities, clearError, clearLogoutState } =
  adminActivitySlice.actions;
export default adminActivitySlice.reducer;
