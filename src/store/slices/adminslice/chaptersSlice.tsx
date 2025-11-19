import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { reduxApiClient } from '@/lib/redux-api';


interface Lesson {
  id: number;
  title: string;
  content: string;
  chapter_id: number;
  order: number;
  lesson_type: 'video' | 'text' | 'quiz' | 'assignment';
  duration?: number;
  video_url?: string;
  resources?: any;
  is_free: boolean;
  created_at: string;
  updated_at: string;
}


interface Chapter {
  id: number;
  course_id: number;
  title: string;
  description?: string;
  order: number;
  duration?: string;
  is_free?: boolean;
  video_url?: string;
  created_at: string;
  updated_at: string;
  lessons?: Lesson[];
}

interface ChaptersApiResponse {
  success: boolean;
  count: number;
  data: Chapter[];
}

interface ChaptersState {
  chapters: Chapter[];
  loading: boolean;
  error: string | null;
  count: number;
}

// Initial state
const initialState: ChaptersState = {
  chapters: [],
  loading: false,
  error: null,
  count: 0,
};

// Async thunk to fetch chapters by course ID (now includes lessons)
export const fetchChaptersByCourseId = createAsyncThunk<
  ChaptersApiResponse,
  string,
  { rejectValue: string }
>(
  'chapters/fetchByCourseId',
  async (courseId, { rejectWithValue }) => {
    try {
      const response = await reduxApiClient.get(`user/chapters/course/${courseId}`);
      
      if (!response.success || !response.data) {
        return rejectWithValue(
          response.error?.message || 'Failed to fetch chapters'
        );
      }
      
      return response.data as ChaptersApiResponse;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'An unexpected error occurred'
      );
    }
  }
);

// Create slice
const chaptersSlice = createSlice({
  name: 'chapters',
  initialState,
  reducers: {
    clearChapters: (state) => {
      state.chapters = [];
      state.count = 0;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    // New reducer to update a specific lesson
    updateLesson: (state, action: PayloadAction<{ chapterId: number; lessonId: number; updates: Partial<Lesson> }>) => {
      const { chapterId, lessonId, updates } = action.payload;
      const chapter = state.chapters.find(ch => ch.id === chapterId);
      if (chapter && chapter.lessons) {
        const lessonIndex = chapter.lessons.findIndex(lesson => lesson.id === lessonId);
        if (lessonIndex !== -1) {
          chapter.lessons[lessonIndex] = { ...chapter.lessons[lessonIndex], ...updates };
        }
      }
    },
    // New reducer to mark a lesson as completed
    markLessonCompleted: (state, action: PayloadAction<{ chapterId: number; lessonId: number }>) => {
      const { chapterId, lessonId } = action.payload;
      const chapter = state.chapters.find(ch => ch.id === chapterId);
      if (chapter && chapter.lessons) {
        const lesson = chapter.lessons.find(les => les.id === lessonId);
        if (lesson) {
          // You might want to add a 'completed' field to your Lesson interface
          // For now, we'll add it dynamically
          (lesson as any).completed = true;
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChaptersByCourseId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchChaptersByCourseId.fulfilled,
        (state, action: PayloadAction<ChaptersApiResponse>) => {
          state.loading = false;
          state.chapters = action.payload.data;
          state.count = action.payload.count;
          state.error = null;
        }
      )
      .addCase(fetchChaptersByCourseId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch chapters';
        state.chapters = [];
        state.count = 0;
      });
  },
});

export const { 
  clearChapters, 
  clearError, 
  updateLesson, 
  markLessonCompleted 
} = chaptersSlice.actions;

export default chaptersSlice.reducer;