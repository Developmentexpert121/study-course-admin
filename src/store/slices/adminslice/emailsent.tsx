import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { reduxApiClient } from '@/lib/redux-api';

// Types
export interface BulkEmailPayload {
  subject: string;
  message: string;
  htmlContent?: string;
  batchSize?: number;
}

export interface BulkEmailResult {
  total: number;
  successful: number;
  failed: number;
  failedEmails: string[];
}

export interface BulkEmailResponse {
  success: boolean;
  message: string;
  data: BulkEmailResult;
}

export interface BulkEmailState {
  loading: boolean;
  error: string | null;
  success: boolean;
  result: BulkEmailResult | null;
  progress: number;
}

// Initial state
const initialState: BulkEmailState = {
  loading: false,
  error: null,
  success: false,
  result: null,
  progress: 0,
};

// Async thunk for sending bulk emails
export const sendBulkEmailBatch = createAsyncThunk(
  'bulkEmail/sendBulkEmailBatch',
  async (payload: BulkEmailPayload, { rejectWithValue }) => {
    try {
      const response = await reduxApiClient.post('email/emails/bulk-send-batch', payload);
      
      if (!response.success) {
        return rejectWithValue(response.error?.message || 'Failed to send bulk emails');
      }
      
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to send bulk emails');
    }
  }
);

// Slice
const bulkEmailSlice = createSlice({
  name: 'bulkEmail',
  initialState,
  reducers: {
    clearBulkEmailState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.result = null;
      state.progress = 0;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
      state.result = null;
    },
    updateProgress: (state, action: PayloadAction<number>) => {
      state.progress = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Send Bulk Email
      .addCase(sendBulkEmailBatch.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.progress = 0;
        state.result = null;
      })
      .addCase(sendBulkEmailBatch.fulfilled, (state, action: PayloadAction<BulkEmailResponse>) => {
        state.loading = false;
        state.success = true;
        state.result = action.payload.data;
        state.progress = 100;
      })
      .addCase(sendBulkEmailBatch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
        state.progress = 0;
      });
  },
});

// Export actions and reducer
export const { 
  clearBulkEmailState, 
  clearError, 
  clearSuccess, 
  updateProgress 
} = bulkEmailSlice.actions;
export default bulkEmailSlice.reducer;