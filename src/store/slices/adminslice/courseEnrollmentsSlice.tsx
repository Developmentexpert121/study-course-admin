import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { reduxApiClient } from '@/lib/redux-api';

interface User {
  id: string;
  username: string;
  email: string;
  profileImage: string;
}

interface EnrolledUser {
  enrollment_id: string;
  enrolled_at: string;
  user: User;
}

interface CourseEnrollmentsState {
  enrolledUsers: EnrolledUser[];
  loading: boolean;
  error: string | null;
  courseId: string | null;
  enrollmentCount: number;
}

const initialState: CourseEnrollmentsState = {
  enrolledUsers: [],
  loading: false,
  error: null,
  courseId: null,
  enrollmentCount: 0,
};

// Async thunk to fetch course enrolled users
export const fetchCourseEnrolledUsers = createAsyncThunk(
  'courseEnrollments/fetchCourseEnrolledUsers',
  async (courseId: string, { rejectWithValue }) => {
    try {
      const response = await reduxApiClient.get(`enrollment/course/${courseId}/users`);
      
      if (!response.success) {
        return rejectWithValue(response.error?.message || 'Failed to fetch enrolled users');
      }
      
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'An error occurred');
    }
  }
);

const courseEnrollmentsSlice = createSlice({
  name: 'courseEnrollments',
  initialState,
  reducers: {
    clearCourseEnrollmentsError: (state) => {
      state.error = null;
    },
    clearEnrolledUsers: (state) => {
      state.enrolledUsers = [];
      state.enrollmentCount = 0;
      state.courseId = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch course enrolled users
      .addCase(fetchCourseEnrolledUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCourseEnrolledUsers.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.enrolledUsers = action.payload.data || [];
        state.enrollmentCount = action.payload.enrollment_count || 0;
        state.courseId = action.payload.course_id || null;
        state.error = null;
      })
      .addCase(fetchCourseEnrolledUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearCourseEnrollmentsError, clearEnrolledUsers } = courseEnrollmentsSlice.actions;
export default courseEnrollmentsSlice.reducer;