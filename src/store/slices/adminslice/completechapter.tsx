import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { reduxApiClient } from "@/lib/redux-api";

interface Progress {
  id: number;
  userId: number;
  courseId: number;
  chapterId: number;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ProgressState {
  progress: Progress | null;
  allProgress: Progress[];
  currentPage: number;
  totalPages: number;
  totalProgress: number;
  loading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: ProgressState = {
  progress: null,
  allProgress: [],
  currentPage: 1,
  totalPages: 0,
  totalProgress: 0,
  loading: false,
  error: null,
  success: false,
};

// Async thunk for marking chapter complete
export const markChapterComplete = createAsyncThunk(
  "progress/markChapterComplete",
  async (
    {
      userId,
      courseId,
      chapterId,
    }: {
      userId: number;
      courseId: number;
      chapterId: number;
    },
    { rejectWithValue }
  ) => {
    try {
      const res = await reduxApiClient.post("progress/complete", {
        userId,
        courseId,
        chapterId,
      });

      if (res.success) {
        return res.data?.data;
      }

      return rejectWithValue(res.error?.message || "Failed to mark chapter complete");
    } catch (error: any) {
      return rejectWithValue(
        error.message || "Failed to mark chapter complete"
      );
    }
  }
);

// Async thunk for fetching progress by userId, courseId, and chapterId
export const fetchProgress = createAsyncThunk(
  "progress/fetchProgress",
  async (
    {
      userId,
      courseId,
      chapterId,
    }: {
      userId: number;
      courseId: number;
      chapterId: number;
    },
    { rejectWithValue }
  ) => {
    try {
      const res = await reduxApiClient.get("progress", {
        userId,
        courseId,
        chapterId,
      });

      if (res.success) {
        return res.data?.data;
      }

      return rejectWithValue(res.error?.message || "Failed to fetch progress");
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch progress");
    }
  }
);

// Async thunk for fetching all progress for a user in a course
export const fetchCourseProgress = createAsyncThunk(
  "progress/fetchCourseProgress",
  async (
    {
      userId,
      courseId,
      page = 1,
      limit = 10,
    }: {
      userId: number;
      courseId: number;
      page?: number;
      limit?: number;
    },
    { rejectWithValue }
  ) => {
    try {
      const params = new URLSearchParams({
        userId: userId.toString(),
        courseId: courseId.toString(),
        page: page.toString(),
        limit: limit.toString(),
      });

      const res = await reduxApiClient.get(`progress/course?${params.toString()}`);

      if (res.success) {
        return {
          progress: res.data?.data?.progress || [],
          totalPages: res.data?.data?.totalPages || 0,
          currentPage: page,
          totalProgress: res.data?.data?.totalProgress || 0,
        };
      }

      return rejectWithValue(res.error?.message || "Failed to fetch course progress");
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch course progress");
    }
  }
);

const progressSlice = createSlice({
  name: "progress",
  initialState,
  reducers: {
    resetProgress: (state) => {
      state.progress = null;
      state.loading = false;
      state.error = null;
      state.success = false;
    },
    clearError: (state) => {
      state.error = null;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Mark chapter complete
      .addCase(markChapterComplete.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(markChapterComplete.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.progress = action.payload;
        state.error = null;
      })
      .addCase(markChapterComplete.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload as string;
      })
      // Fetch progress
      .addCase(fetchProgress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProgress.fulfilled, (state, action) => {
        state.loading = false;
        state.progress = action.payload;
        state.error = null;
      })
      .addCase(fetchProgress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch course progress
      .addCase(fetchCourseProgress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCourseProgress.fulfilled, (state, action) => {
        state.loading = false;
        state.allProgress = action.payload.progress;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
        state.totalProgress = action.payload.totalProgress;
        state.error = null;
      })
      .addCase(fetchCourseProgress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetProgress, clearError, setCurrentPage } = progressSlice.actions;
export default progressSlice.reducer;