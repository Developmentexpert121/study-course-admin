import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { reduxApiClient } from "@/lib/redux-api";

// Types
interface AdminActivity {
  id: string;
  admin_id: string;
  activity_type: string;
  created_at: string;
  updated_at: string;
  username: string;
  email: string;
  role: string;
}

interface AdminActivityState {
  activities: AdminActivity[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  hasMore: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AdminActivityState = {
  activities: [],
  totalCount: 0,
  currentPage: 1,
  totalPages: 1,
  hasMore: false,
  loading: false,
  error: null,
};

// Async Thunks

// Fetch all admin activities
export const fetchAdminActivities = createAsyncThunk(
  "adminActivity/fetchActivities",
  async (_, { rejectWithValue }) => {
    try {
      const response = await reduxApiClient.get("user/getlogs");

      if (response.data.success && response.data.data) {
        return {
          activities: response.data.data.activities || [],
          totalCount: response.data.data.totalCount || 0,
          currentPage: response.data.data.currentPage || 1,
          totalPages: response.data.data.totalPages || 1,
          hasMore: response.data.data.hasMore || false,
        };
      } else {
        return rejectWithValue(
          response.data.message || "Failed to fetch admin activities",
        );
      }
    } catch (err: any) {
      if (err.response?.status === 403 || err.response?.status === 401) {
        return rejectWithValue("Session expired. Please login again.");
      } else if (err.response?.status === 403 || err.response?.status === 401) {
        return rejectWithValue(
          "Access denied. Super Admin privileges required.",
        );
      } else {
        return rejectWithValue(
          "An error occurred while fetching admin activities",
        );
      }
    }
  },
);

// Slice
const adminActivitySlice = createSlice({
  name: "adminActivity",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearActivities: (state) => {
      state.activities = [];
      state.totalCount = 0;
      state.currentPage = 1;
      state.totalPages = 1;
      state.hasMore = false;
    },
  },
  extraReducers: (builder) => {
    // Fetch Admin Activities
    builder
      .addCase(fetchAdminActivities.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminActivities.fulfilled, (state, action) => {
        state.loading = false;
        state.activities = action.payload.activities;
        state.totalCount = action.payload.totalCount;
        state.currentPage = action.payload.currentPage;
        state.totalPages = action.payload.totalPages;
        state.hasMore = action.payload.hasMore;
        state.error = null;
      })
      .addCase(fetchAdminActivities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearActivities } = adminActivitySlice.actions;
export default adminActivitySlice.reducer;

// Selectors
export const selectActivities = (state: any) => state.adminActivity.activities;
export const selectTotalCount = (state: any) => state.adminActivity.totalCount;
export const selectCurrentPage = (state: any) =>
  state.adminActivity.currentPage;
export const selectTotalPages = (state: any) => state.adminActivity.totalPages;
export const selectHasMore = (state: any) => state.adminActivity.hasMore;
export const selectLoading = (state: any) => state.adminActivity.loading;
export const selectError = (state: any) => state.adminActivity.error;

// Additional selectors for filtering
export const selectActivitiesByType = (state: any, activityType: string) =>
  state.adminActivity.activities.filter(
    (activity: AdminActivity) => activity.activity_type === activityType,
  );

export const selectActivitiesByAdmin = (state: any, adminId: string) =>
  state.adminActivity.activities.filter(
    (activity: AdminActivity) => activity.admin_id === adminId,
  );

export const selectRecentActivities = (state: any, limit: number = 10) =>
  state.adminActivity.activities.slice(0, limit);
