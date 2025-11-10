// store/slices/homepage/homepageSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { reduxApiClient } from '@/lib/redux-api';

// Types
export interface Course {
  id: number;
  title: string;
  subtitle?: string;
  description?: string;
  category: string;
  additional_categories: any[];
  image?: string;
  intro_video?: string;
  creator: string;
  price: number;
  price_type: 'free' | 'paid';
  duration?: string;
  features: any[];
  ratings?: number;
  createdAt: string;
  updatedAt: string;
}

interface CoursesResponse {
  success: boolean;
  count: number;
  data: Course[];
}

interface HomepageState {
  courses: Course[];
  loading: boolean;
  error: string | null;
  count: number;
}

const initialState: HomepageState = {
  courses: [],
  loading: false,
  error: null,
  count: 0,
};

// Async thunk for fetching active courses
export const fetchActiveCourses = createAsyncThunk(
  'homepage/fetchActiveCourses',
  async (_, { rejectWithValue }) => {
    try {
      // Adjust the endpoint to match your backend route
      const response = await reduxApiClient.get('course/courses/active');
      
      if (!response.success) {
        return rejectWithValue(response.error?.message || 'Failed to fetch courses');
      }
      
      return response.data as CoursesResponse;
    } catch (error: any) {
      return rejectWithValue(error.message || 'An error occurred while fetching courses');
    }
  }
);

const homepageSlice = createSlice({
  name: 'homepage',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCourses: (state) => {
      state.courses = [];
      state.count = 0;
      state.error = null;
    },
    updateCourseRating: (state, action) => {
      const { courseId, rating } = action.payload;
      const course = state.courses.find(c => c.id === courseId);
      if (course) {
        course.ratings = rating;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchActiveCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActiveCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.courses = action.payload.data || [];
        state.count = action.payload.count || 0;
        state.error = null;
      })
      .addCase(fetchActiveCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.courses = [];
        state.count = 0;
      });
  },
});

// Selectors
export const selectAllCourses = (state: { homepage: HomepageState }) => state.homepage.courses;
export const selectCoursesLoading = (state: { homepage: HomepageState }) => state.homepage.loading;
export const selectCoursesError = (state: { homepage: HomepageState }) => state.homepage.error;
export const selectCoursesCount = (state: { homepage: HomepageState }) => state.homepage.count;

// Export actions and reducer
export const { clearError, clearCourses, updateCourseRating } = homepageSlice.actions;
export default homepageSlice.reducer;