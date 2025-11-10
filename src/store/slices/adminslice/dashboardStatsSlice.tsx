import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { reduxApiClient } from '@/lib/redux-api';

// Async thunk for fetching dashboard stats
export const fetchDashboardStats = createAsyncThunk(
  'dashboardStats/fetchDashboardStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await reduxApiClient.get('user/dashboard-stats');
      
      if (!response.success) {
        return rejectWithValue(response.error || 'Failed to fetch dashboard statistics');
      }

      return response.data;
    } catch (error : any) {
      return rejectWithValue(error.message || 'Network error occurred');
    }
  }
);

const dashboardStatsSlice = createSlice({
  name: 'dashboardStats',
  initialState: {
    data: null,
    loading: false,
    error: null,
    lastFetched: null,
  },
  reducers: {
    clearDashboardStats: (state) => {
      state.data = null;
      state.error = null;
      state.lastFetched = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    resetDashboardStats: (state) => {
      state.data = null;
      state.loading = false;
      state.error = null;
      state.lastFetched = null;
    },
    // Optional: Update specific stats without refetching
    updateStatsManually: (state :any , action :any) => {
      if (state.data) {
        state.data = { 
          ...state.data, ...action.payload };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch dashboard stats
      .addCase(fetchDashboardStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state : any, action: any) => {
        state.loading = false;
        state.data = action.payload;
        state.lastFetched = new Date().toISOString();
        state.error = null;
      })
      .addCase(fetchDashboardStats.rejected, (state : any, action: any) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch dashboard statistics';
        state.data = null;
      });
  },
});

// Export actions
export const { 
  clearDashboardStats, 
  clearError, 
  resetDashboardStats,
  updateStatsManually 
} = dashboardStatsSlice.actions;

// Export selectors
export const selectDashboardStats = (state :any) => state.dashboardStats.data;
export const selectDashboardStatsLoading = (state : any) => state.dashboardStats.loading;
export const selectDashboardStatsError = (state : any) => state.dashboardStats.error;
export const selectDashboardStatsLastFetched = (state : any) => state.dashboardStats.lastFetched;

// Export specific data selectors for easier access
export const selectTotalUsers = (state : any) => state.dashboardStats.data?.summary?.totalUsers || 0;
export const selectTotalAdmins = (state : any) => state.dashboardStats.data?.summary?.totalAdmins || 0;
export const selectTotalChapters = (state : any) => state.dashboardStats.data?.summary?.totalChapters || 0;
export const selectTotalCourses = (state : any) => state.dashboardStats.data?.summary?.totalCourses || 0;
export const selectActiveCourses = (state : any) => state.dashboardStats.data?.summary?.activeCourses || 0;
export const selectInactiveCourses = (state : any) => state.dashboardStats.data?.summary?.inactiveCourses || 0;

// Detailed selectors
export const selectUserStats = (state : any) => state.dashboardStats.data?.users || {};
export const selectChapterStats = (state : any) => state.dashboardStats.data?.chapters || {};
export const selectCourseStats = (state : any) => state.dashboardStats.data?.courses || {};

// User role specific selectors
export const selectAdminUsers = (state : any) => state.dashboardStats.data?.users?.byRole?.admin || 0;
export const selectRegularUsers = (state : any) => state.dashboardStats.data?.users?.byRole?.user || 0;
export const selectVerifiedUsers = (state : any) => state.dashboardStats.data?.users?.userVerification?.verified || 0;
export const selectUnverifiedUsers = (state : any) => state.dashboardStats.data?.users?.userVerification?.unverified || 0;
export const selectApprovedAdmins = (state : any) => state.dashboardStats.data?.users?.adminStatus?.approved || 0;
export const selectRejectedAdmins = (state : any) => state.dashboardStats.data?.users?.adminStatus?.rejected || 0;
export const selectPendingAdmins = (state : any) => state.dashboardStats.data?.users?.adminStatus?.pending || 0;

// Course status selectors
export const selectDraftCourses = (state : any) => state.dashboardStats.data?.courses?.draft || 0;

export default dashboardStatsSlice.reducer;