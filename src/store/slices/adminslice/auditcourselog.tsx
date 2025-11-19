// store/slices/courseAuditLogSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { reduxApiClient } from '@/lib/redux-api';

export interface AuditLog {
  id: number;
  course_id: number;
  course_title: string;
  action: 'created' | 'updated' | 'activated' | 'deactivated' | 'deleted';
  user_id: number | null;
  user_name: string | null;
  changed_fields: any | null;
  is_active_status: boolean | null;
  action_timestamp: string;
}

export interface AuditLogFilters {
  page?: number;
  limit?: number;
  search?: string;
  action?: string;
  course_id?: number;
  user_id?: number;
  from_date?: string;
  to_date?: string;
  is_active_status?: boolean;
  sort?: string;
}

interface PaginationInfo {
  current_page: number;
  total_pages: number;
  total_records: number;
  has_next: boolean;
  has_prev: boolean;
}

interface Stats {
  total_logs: number;
  recent_activity_24h: number;
  actions_breakdown: Array<{ action: string; count: number }>;
  top_users: Array<{ user_name: string; action_count: number }>;
}

interface CourseAuditLogState {
  auditLogs: AuditLog[];
  pagination: PaginationInfo | null;
  filters: AuditLogFilters;
  loading: boolean;
  stats: Stats | null;
  statsLoading: boolean;
  error: { code?: string; message: string } | null;
}

const initialState: CourseAuditLogState = {
  auditLogs: [],
  pagination: null,
  filters: {
    page: 1,
    limit: 20,
    sort: '-action_timestamp',
  },
  loading: false,
  stats: null,
  statsLoading: false,
  error: null,
};

// Async thunks
export const fetchCourseAuditLogs = createAsyncThunk(
  'courseAuditLog/fetchCourseAuditLogs',
  async (filters: AuditLogFilters, { rejectWithValue }) => {
    try {
      const response = await reduxApiClient.get('user/getCourseAuditLogs', filters);
      
      if (!response.success) {
        return rejectWithValue({ 
          code: 'FETCH_ERROR', 
          message: response.error?.message || 'Failed to fetch audit logs' 
        });
      }
      
      return response.data;
    } catch (error: any) {
      return rejectWithValue({ 
        code: 'NETWORK_ERROR', 
        message: error.message || 'Failed to fetch audit logs' 
      });
    }
  }
);

export const fetchAuditLogStats = createAsyncThunk(
  'courseAuditLog/fetchAuditLogStats',
  async (_, { rejectWithValue }) => {
    try {
      // This would call your stats endpoint - adjust URL as needed
      const response = await reduxApiClient.get('audit-logs/stats');
      
      if (!response.success) {
        return rejectWithValue({ 
          code: 'STATS_ERROR', 
          message: response.error?.message || 'Failed to fetch stats' 
        });
      }
      
      return response.data;
    } catch (error: any) {
      return rejectWithValue({ 
        code: 'NETWORK_ERROR', 
        message: error.message || 'Failed to fetch stats' 
      });
    }
  }
);

const courseAuditLogSlice = createSlice({
  name: 'courseAuditLog',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<AuditLogFilters>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        page: 1,
        limit: 20,
        sort: '-action_timestamp',
      };
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.filters.page = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchCourseAuditLogs
      .addCase(fetchCourseAuditLogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCourseAuditLogs.fulfilled, (state, action) => {
        state.loading = false;
        state.auditLogs = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchCourseAuditLogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as { code?: string; message: string };
        state.auditLogs = [];
        state.pagination = null;
      })
      // fetchAuditLogStats
      .addCase(fetchAuditLogStats.pending, (state) => {
        state.statsLoading = true;
      })
      .addCase(fetchAuditLogStats.fulfilled, (state, action) => {
        state.statsLoading = false;
        state.stats = action.payload.data;
      })
      .addCase(fetchAuditLogStats.rejected, (state) => {
        state.statsLoading = false;
        // Don't set error for stats failure as it's secondary data
      });
  },
});

export const { setFilters, clearFilters, setPage, clearError } = courseAuditLogSlice.actions;
export default courseAuditLogSlice.reducer;