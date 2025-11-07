import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { reduxApiClient } from '@/lib/redux-api';

// Types
interface CourseStats {
  id: number;
  title: string;
  subtitle: string;
  category: string;
  price: number;
  image: string;
  ratings: number;
  status: string;
  is_active: boolean;
  enrollment_count: number;
  completion_count: number;
}

interface AdminCourseStats {
  total_courses: number;
  total_active_courses: number;
  total_enrollments: number;
  total_users_completed: number;
  top_3_courses: CourseStats[];
}

interface AdminStatsState {
  data: AdminCourseStats | null;
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: AdminStatsState = {
  data: null,
  loading: false,
  error: null,
};

// Async thunk for fetching admin course stats
export const fetchAdminCourseStats = createAsyncThunk(
  'adminDashboard/fetchAdminCourseStats',
  async (adminId: string, { rejectWithValue }) => {
    try {
      const response = await reduxApiClient.get(`user/admin/${adminId}`);
      
      if (!response.success) {
        return rejectWithValue(response.error?.message || 'Failed to fetch admin course stats');
      }

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch admin course stats');
    }
  }
);

// Slice
const adminDashboardSlice = createSlice({
  name: 'adminDashboard',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearAdminStats: (state) => {
      state.data = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminCourseStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminCourseStats.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.error = null;
      })
      .addCase(fetchAdminCourseStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.data = null;
      });
  },
});

// Export actions
export const { clearError, clearAdminStats } = adminDashboardSlice.actions;

// Selectors
export const selectAdminCourseStats = (state: { adminDashboard: AdminStatsState }) => 
  // state?.instructorDashboard?.data;
{console.log("welcome to state ",state?.instructorDashboard?.data?.data)}

export const selectAdminCourseStatsLoading = (state: { adminDashboard: AdminStatsState }) => 
  state?.instructorDashboard?.data?.loading;

export const selectAdminCourseStatsError = (state: { adminDashboard: AdminStatsState }) => 
  state?.instructorDashboard?.data?.data.error;

// Derived selectors for specific data
export const selectTotalAdminCourses = (state: { adminDashboard: AdminStatsState }) => 
  state?.instructorDashboard?.data?.datatotal_courses || 0;

export const selectTotalAdminCoursesactive = (state: { adminDashboard: AdminStatsState }) => 
  state?.instructorDashboard?.data?.datatotal_active_courses || 0;

export const selecttotalenrollments = (state: { adminDashboard: AdminStatsState }) => 
  state?.instructorDashboard?.data?.datatotal_enrollments || 0;

export const selectTotalUsersCompleted = (state: { adminDashboard: AdminStatsState }) => 
  state?.instructorDashboard?.data?.datatotal_users_completed || 0;

export const selectTop3Courses = (state: { adminDashboard: AdminStatsState }) => 
  state?.instructorDashboard?.data?.datatop_3_courses || [];

export const selectAverageEnrollmentPerCourse = (state: { adminDashboard: AdminStatsState }) => {
  const data = state?.instructorDashboard?.data;
  if (!data || data.total_courses === 0) return 0;
  return Math.round(data.total_enrollments / data.total_courses);
};

export const selectAverageCompletionRate = (state: { adminDashboard: AdminStatsState }) => {
  const data = state?.instructorDashboard?.data;
  if (!data || data.total_enrollments === 0) return 0;
  return Math.round((data.total_users_completed / data.total_enrollments) * 100);
};







//my data 

export const selectedtotalcourses = (state: { adminDashboard: AdminStatsState }) => 
  state?.instructorDashboard?.data?.data?.total_courses;

export const selectedtotalcoursesactivate = (state: { adminDashboard: AdminStatsState }) => 
  state?.instructorDashboard?.data?.data?.total_active_courses;


export const selectedtotalcoursesEnrolled = (state: { adminDashboard: AdminStatsState }) => 
  state?.instructorDashboard?.data?.data?.total_enrollments;

export const selectedtotaluserscompleted = (state: { adminDashboard: AdminStatsState }) => 
  state?.instructorDashboard?.data?.data?.total_users_completed;


export const selectTop3Coursess = (state: { adminDashboard: AdminStatsState }) => 
  state?.instructorDashboard?.data?.data?.top_3_courses || [];

// Export reducer
export default adminDashboardSlice.reducer;