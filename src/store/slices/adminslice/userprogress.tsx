// store/slices/coursesSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { reduxApiClient } from '@/lib/redux-api';

// Types
export interface Chapter {
  id: number;
  title: string;
  content: string;
  order: number;
  locked: boolean;
}

export interface Course {
  id: number;
  title: string;
  description: string;
  category: string;
  image: string;
  chapters: Chapter[];
}

interface CoursesState {
  courses: Course[];
  loading: boolean;
  error: string | null;
  lastFetched: number | null;
}

const initialState: CoursesState = {
  courses: [],
  loading: false,
  error: null,
  lastFetched: null,
};

// Async thunk to fetch courses with chapters and progress
export const fetchCoursesWithProgress = createAsyncThunk(
  'courses/fetchCoursesWithProgress',
  async (userId: number, { rejectWithValue }) => {
    try {
      const response = await reduxApiClient.get(`course/with-progress/${userId}`);
      
      if (response.success && response.data) {
        // Extract the data array from the response
        return Array.isArray(response.data) ? response.data : response.data.data || [];
      } else {
        return rejectWithValue(response.error?.message || 'Failed to fetch courses');
      }
    } catch (error: any) {
      return rejectWithValue(error.message || 'An error occurred while fetching courses');
    }
  }
);

// Create the slice
const coursesSlice = createSlice({
  name: 'courses',
  initialState,
  reducers: {
    // Clear courses data
    clearCourses: (state) => {
      state.courses = [];
      state.error = null;
      state.lastFetched = null;
    },
    
    // Update chapter lock status
    updateChapterLockStatus: (state, action: PayloadAction<{ courseId: number; chapterId: number; locked: boolean }>) => {
      const { courseId, chapterId, locked } = action.payload;
      const course = state.courses.find(c => c.id === courseId);
      
      if (course) {
        const chapter = course.chapters.find(ch => ch.id === chapterId);
        if (chapter) {
          chapter.locked = locked;
        }
      }
    },
    
    // Reset error
    resetError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch courses with progress
      .addCase(fetchCoursesWithProgress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCoursesWithProgress.fulfilled, (state, action: PayloadAction<Course[]>) => {
        state.loading = false;
        state.courses = action.payload;
        state.lastFetched = Date.now();
        state.error = null;
      })
      .addCase(fetchCoursesWithProgress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Export actions
export const { 
  clearCourses, 
  updateChapterLockStatus, 
  resetError 
} = coursesSlice.actions;

// Selectors
export const selectAllCourses = (state: { courses: CoursesState }) => state.courses.courses;
export const selectCoursesLoading = (state: { courses: CoursesState }) => state.courses.loading;
export const selectCoursesError = (state: { courses: CoursesState }) => state.courses.error;
export const selectCourseById = (courseId: number) => (state: { courses: CoursesState }) => 
  state.courses.courses.find(course => course.id === courseId);
export const selectEnrolledCourses = (state: { courses: CoursesState }) => 
  state.courses.courses.filter(course => course.chapters.some(ch => !ch.locked));
export const selectLastFetched = (state: { courses: CoursesState }) => state.courses.lastFetched;

// Export reducer
export default coursesSlice.reducer;