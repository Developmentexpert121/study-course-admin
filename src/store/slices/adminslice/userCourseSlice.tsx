import { useApiClient } from '@/lib/api';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { reduxApiClient } from '@/lib/redux-api';


// Define interfaces
export interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  is_active: boolean;
  image: string;
  creator: string;
  ratings: number;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

export interface CourseStats {
  totalCourses: number;
  activeCourses: number;
  inactiveCourses: number;
  averageRating: string;
  categoryDistribution: Record<string, number>;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalCourses: number;
  coursesPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface FiltersInfo {
  availableCategories: string[];
  totalActive: number;
  totalInactive: number;
}

export interface UserCoursesState {
  courses: Course[];
  totalCourses: number;
  currentPage: number;
  totalPages: number;
  loading: boolean;
  error: string | null;
  stats: CourseStats | null;
}

// Initial state
const initialState: UserCoursesState = {
  courses: [],
  totalCourses: 0,
  currentPage: 1,
  totalPages: 1,
  loading: false,
  error: null,
  stats: null,
};

// Define RootState type for selectors
interface RootState {
  userCourses: UserCoursesState;
}

// Async thunk for fetching user courses using your api utility
export const fetchUserCourses = createAsyncThunk(
  'userCourses/fetchUserCourses',
  async ({ userId, page = 1, filters }: { userId: number; page?: number; filters?: any }, { rejectWithValue }) => {
      
    
    try {
      // Build query parameters
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        ...filters,
      }).toString();

      // Use your api utility instead of fetch
      const response = await reduxApiClient.get(`user/${userId}/courses`);
      
      if (!response.success) {
        throw new Error(response.error?.message || 'Failed to fetch courses');
      }

      return response.data;

    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch courses');
    }
  }
);

// Async thunk for fetching user course stats
export const fetchUserCourseStats = createAsyncThunk(
  'userCourses/fetchUserCourseStats',
  async (userId: number, { rejectWithValue }) => {
    try {
      const response = await reduxApiClient.get(`user/${userId}/courses`);
     
      if (!response.success) {
        throw new Error(response.error?.message || 'Failed to fetch course stats');
      }

      return response.data;

    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch course stats');
    }
  }
);

const userCourseSlice = createSlice({
  name: 'userCourses',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    clearCourses: (state) => {
      state.courses = [];
      state.totalCourses = 0;
      state.currentPage = 1;
      state.totalPages = 1;
      state.stats = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch user courses
      .addCase(fetchUserCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.courses = action.payload.courses || [];
        state.totalCourses = action.payload.pagination?.totalCourses || 0;
        state.currentPage = action.payload.pagination?.currentPage || 1;
        state.totalPages = action.payload.pagination?.totalPages || 1;
        
        // Handle stats from filters or create default
        if (action.payload.filters) {
          state.stats = {
            totalCourses: action.payload.filters.totalActive + action.payload.filters.totalInactive,
            activeCourses: action.payload.filters.totalActive,
            inactiveCourses: action.payload.filters.totalInactive,
            averageRating: '0.0',
            categoryDistribution: {}
          };
        } else {
          state.stats = {
            totalCourses: state.totalCourses,
            activeCourses: state.courses.filter(course => course.is_active).length,
            inactiveCourses: state.courses.filter(course => !course.is_active).length,
            averageRating: '0.0',
            categoryDistribution: {}
          };
        }
      })
      .addCase(fetchUserCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to fetch courses';
      })
      // Fetch user course stats
      .addCase(fetchUserCourseStats.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserCourseStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchUserCourseStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to fetch course stats';
      });
  },
});

// Selectors with proper typing
export const selectUserCourses = (state: RootState) => state.userCourses.courses;
export const selectTotalCourses = (state: RootState) => state.userCourses.totalCourses;
export const selectCurrentPage = (state: RootState) => state.userCourses.currentPage;
export const selectTotalPages = (state: RootState) => state.userCourses.totalPages;
export const selectLoading = (state: RootState) => state.userCourses.loading;
export const selectError = (state: RootState) => state.userCourses.error;
export const selectCourseStats = (state: RootState) => state.userCourses.stats;

export const { clearError, setCurrentPage, clearCourses } = userCourseSlice.actions;
export default userCourseSlice.reducer;