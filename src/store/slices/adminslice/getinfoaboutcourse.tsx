import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { reduxApiClient } from "@/lib/redux-api";

// Initial State
const initialState = {
  course: null,
  loading: false,
  error: null,
  lastFetched: null,
};

// Async Thunks

// Fetch course by ID
export const fetchCourseById = createAsyncThunk(
  "courseDetail/fetchCourseById",
  async (courseId: string | number, { rejectWithValue }) => {
    try {
      const result = await reduxApiClient.get(`user/courses/${courseId}`);

      if (result.success && result.data) {
        return result.data;
      } else {
        return rejectWithValue(
          result.error?.message || "Failed to fetch course",
        );
      }
    } catch (error: any) {
      return rejectWithValue(
        error.message || "An error occurred while fetching the course",
      );
    }
  },
);

// Update course
export const updateCourse = createAsyncThunk(
  "courseDetail/updateCourse",
  async (
    { courseId, data }: { courseId: string | number; data: any },
    { rejectWithValue },
  ) => {
    try {
      const result = await reduxApiClient.put(`user/courses/${courseId}`, data);

      if (result.success && result.data) {
        return result.data;
      } else {
        return rejectWithValue(
          result.error?.message || "Failed to update course",
        );
      }
    } catch (error: any) {
      return rejectWithValue(
        error.message || "An error occurred while updating the course",
      );
    }
  },
);

// Delete course
export const deleteCourse = createAsyncThunk(
  "courseDetail/deleteCourse",
  async (courseId: string | number, { rejectWithValue }) => {
    try {
      const result = await reduxApiClient.delete(`user/courses/${courseId}`);

      if (result.success) {
        return courseId;
      } else {
        return rejectWithValue(
          result.error?.message || "Failed to delete course",
        );
      }
    } catch (error: any) {
      return rejectWithValue(
        error.message || "An error occurred while deleting the course",
      );
    }
  },
);

// Slice
const courseDetailSlice = createSlice({
  name: "courseDetail",
  initialState,
  reducers: {
    // Clear course data
    clearCourse: (state) => {
      state.course = null;
      state.error = null;
      state.lastFetched = null;
    },

    // Clear error
    clearError: (state) => {
      state.error = null;
    },

    // Update local course data (for optimistic updates)
    updateLocalCourse: (state: any, action) => {
      if (state.course) {
        state.course = {
          ...state.course,
          ...action.payload,
        };
      }
    },
  },
  extraReducers: (builder) => {
    // Fetch Course by ID
    builder
      .addCase(fetchCourseById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCourseById.fulfilled, (state: any, action) => {
        state.loading = false;
        state.course = action.payload;
        state.error = null;
        state.lastFetched = new Date().toISOString();
      })
      .addCase(fetchCourseById.rejected, (state: any, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update Course
    builder
      .addCase(updateCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCourse.fulfilled, (state, action) => {
        state.loading = false;
        state.course = action.payload;
        state.error = null;
      })
      .addCase(updateCourse.rejected, (state: any, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Delete Course
    builder
      .addCase(deleteCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCourse.fulfilled, (state) => {
        state.loading = false;
        state.course = null;
        state.error = null;
      })
      .addCase(deleteCourse.rejected, (state: any, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Actions
export const { clearCourse, clearError, updateLocalCourse } =
  courseDetailSlice.actions;

// Selectors
export const selectCourse = (state: any) => state.courseDetail.course;
export const selectCourseLoading = (state: any) => state.courseDetail.loading;
export const selectCourseError = (state: any) => state.courseDetail.error;
export const selectLastFetched = (state: any) => state.courseDetail.lastFetched;

// Export reducer
export default courseDetailSlice.reducer;
