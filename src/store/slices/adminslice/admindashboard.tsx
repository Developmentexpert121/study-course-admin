// slices/instructorDashboardSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { reduxApiClient } from '@/lib/redux-api';

// Types
interface CourseStats {
  total: number;
  active: number;
  inactive: number;
  draft: number;
}

interface ChapterStats {
  total: number;
  averagePerCourse: number;
}

interface EnrollmentStats {
  total: number;
  active: number;
  completed: number;
  completionRate: string;
}

interface StudentStats {
  total: number;
  averagePerCourse: number;
}

interface PerformanceStats {
  averageRating: number;
  totalRevenue: string;
}

interface SummaryStats {
  totalCourses: number;
  activeCourses: number;
  totalChapters: number;
  totalEnrollments: number;
  totalStudents: number;
  totalCertificatesIssued: number;
  averageRating: number;
  totalRevenue: string;
}

interface DashboardStats {
  courses: CourseStats;
  chapters: ChapterStats;
  enrollments: EnrollmentStats;
  students: StudentStats;
  certificates: {
    total: number;
  };
  performance: PerformanceStats;
  summary: SummaryStats;
}

interface DashboardState {
  stats: DashboardStats | null;
  loading: boolean;
  error: string | null;
  lastUpdated: string | null;
}

// Initial state
const initialState: DashboardState = {
  stats: null,
  loading: false,
  error: null,
  lastUpdated: null,
};

// Async thunk for fetching dashboard stats
export const fetchInstructorDashboardStats = createAsyncThunk(
  'instructorDashboard/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await reduxApiClient.get('user/dashboard-stats/admin');
      
      if (!response.success) {
        return rejectWithValue(response.error?.message || 'Failed to fetch dashboard statistics');
      }

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'An error occurred while fetching dashboard statistics');
    }
  }
);

// Slice
const instructorDashboardSlice = createSlice({
  name: 'instructorDashboard',
  initialState,
  reducers: {
    clearStats: (state) => {
      state.stats = null;
      state.error = null;
      state.lastUpdated = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    updateStats: (state, action: PayloadAction<Partial<DashboardStats>>) => {
      if (state.stats) {
        state.stats = {
          ...state.stats,
          ...action.payload,
        };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch stats
      .addCase(fetchInstructorDashboardStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInstructorDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
        state.lastUpdated = new Date().toISOString();
        state.error = null;
      })
      .addCase(fetchInstructorDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.stats = null;
      });
  },
});

// Export actions and reducer
export const { clearStats, clearError, updateStats } = instructorDashboardSlice.actions;
export default instructorDashboardSlice.reducer;

// Selectors
export const selectDashboardStats = (state: { instructorDashboard: DashboardState }) => 
  state.instructorDashboard.stats;

export const selectDashboardLoading = (state: { instructorDashboard: DashboardState }) => 
  state.instructorDashboard.loading;

export const selectDashboardError = (state: { instructorDashboard: DashboardState }) => 
  state.instructorDashboard.error;

export const selectDashboardLastUpdated = (state: { instructorDashboard: DashboardState }) => 
  state.instructorDashboard.lastUpdated;

// Derived selectors
export const selectCourseStats = (state: { instructorDashboard: DashboardState }) => 
  state.instructorDashboard.stats?.courses;

export const selectEnrollmentStats = (state: { instructorDashboard: DashboardState }) => 
  state.instructorDashboard.stats?.enrollments;

export const selectPerformanceStats = (state: { instructorDashboard: DashboardState }) => 
  state.instructorDashboard.stats?.performance;

export const selectSummaryStats = (state: { instructorDashboard: DashboardState }) => 
  state.instructorDashboard.stats?.summary;