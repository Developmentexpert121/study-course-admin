// slices/
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { reduxApiClient } from "@/lib/redux-api";

// Types
export interface Email {
  id: number;
  email: string;
  EmailId: number;
  createdAt: string;
}

export interface EmailState {
  emails: Email[];
  loading: boolean;
  error: string | null;
  success: boolean;
}

export interface StoreEmailPayload {
  email: string;
}

export interface EmailResponse {
  success: boolean;
  message: string;
  data: Email;
}

// Initial state
const initialState: EmailState = {
  emails: [],
  loading: false,
  error: null,
  success: false,
};

// Async thunks
export const storeEmail = createAsyncThunk(
  "email/storeEmail",
  async (payload: StoreEmailPayload, { rejectWithValue }) => {
    try {
      const response = await reduxApiClient.post("email/emails", payload);

      if (!response.success) {
        return rejectWithValue(
          response.error?.message || "Failed to store email",
        );
      }

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to store email");
    }
  },
);

export const fetchAllEmails = createAsyncThunk(
  "email/fetchAllEmails",
  async (_, { rejectWithValue }) => {
    try {
      const response = await reduxApiClient.get("email/emails");

      if (!response.success) {
        return rejectWithValue(
          response.error?.message || "Failed to fetch emails",
        );
      }

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch emails");
    }
  },
);

// Slice
const emailSlice = createSlice({
  name: "email",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
    },
    resetEmailState: (state) => {
      state.emails = [];
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Store Email
      .addCase(storeEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(storeEmail.fulfilled, (state, action: PayloadAction<Email>) => {
        state.loading = false;
        state.success = true;
        state.emails.unshift(action.payload);
      })
      .addCase(storeEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      })
      // Fetch All Emails
      .addCase(fetchAllEmails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchAllEmails.fulfilled,
        (state, action: PayloadAction<Email[]>) => {
          state.loading = false;
          state.emails = action.payload;
        },
      )
      .addCase(fetchAllEmails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Export actions and reducer
export const { clearError, clearSuccess, resetEmailState } = emailSlice.actions;

export const selectEmails = (state: any) => state.email.emails;
export const selectEmailLoading = (state: any) => state.email.loading;
export const selectEmailError = (state: any) => state.email.error;
export const selectEmailSuccess = (state: any) => state.email.success;

export default emailSlice.reducer;
