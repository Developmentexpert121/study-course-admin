import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { reduxApiClient } from "@/lib/redux-api";

// Types
interface PasswordResetPayload {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
  userId: string;
}

interface PasswordResetResponse {
  success: boolean;
  message: string;
}

interface PasswordResetState {
  isResetting: boolean;
  success: boolean;
  error: string | null;
  message: string | null;
}

const initialState: PasswordResetState = {
  isResetting: false,
  success: false,
  error: null,
  message: null,
};

// Async Thunks

// Reset password
export const resetPassword = createAsyncThunk(
  "passwordReset/resetPassword",
  async (payload: PasswordResetPayload, { rejectWithValue }) => {
    try {
      const { oldPassword, newPassword, confirmPassword, userId } = payload;

      // Client-side validation
      if (!oldPassword || !newPassword || !confirmPassword) {
        return rejectWithValue(
          "Old password, new password, and confirm password are required"
        );
      }

      if (newPassword !== confirmPassword) {
        return rejectWithValue(
          "New password and confirm password do not match"
        );
      }

      if (newPassword.length < 6) {
        return rejectWithValue(
          "New password must be at least 6 characters long"
        );
      }

      if (oldPassword === newPassword) {
        return rejectWithValue(
          "New password cannot be the same as old password"
        );
      }

      const response = await reduxApiClient.post("user/reset-passwords", {
        userId,
        oldPassword,
        newPassword,
        confirmPassword,
      });

      if (response.success && response.data) {
        return {
          success: true,
          message: response.data.message || "Password reset successfully",
        };
      } else {
        return rejectWithValue(
          response.error?.message || "Failed to reset password"
        );
      }
    } catch (err: any) {
      if (err.response?.status === 401) {
        return rejectWithValue("Session expired. Please login again.");
      } else if (err.response?.status === 400) {
        return rejectWithValue(err.response.data?.message || "Invalid request");
      } else {
        return rejectWithValue(
          "An error occurred while resetting password"
        );
      }
    }
  }
);

// Slice
const passwordResetSlice = createSlice({
  name: "passwordReset",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearMessage: (state) => {
      state.message = null;
    },
    clearSuccess: (state) => {
      state.success = false;
    },
    resetPasswordResetState: (state) => {
      state.isResetting = false;
      state.success = false;
      state.error = null;
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    // Reset Password
    builder
      .addCase(resetPassword.pending, (state) => {
        state.isResetting = true;
        state.error = null;
        state.success = false;
        state.message = null;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.isResetting = false;
        state.success = true;
        state.message = action.payload.message;
        state.error = null;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isResetting = false;
        state.success = false;
        state.error = action.payload as string;
        state.message = null;
      });
  },
});

export const {
  clearError,
  clearMessage,
  clearSuccess,
  resetPasswordResetState,
} = passwordResetSlice.actions;
export default passwordResetSlice.reducer;

// Selectors
export const selectIsResetting = (state: any) =>
  state.passwordReset.isResetting;
export const selectResetSuccess = (state: any) =>
  state.passwordReset.success;
export const selectResetError = (state: any) =>
  state.passwordReset.error;
export const selectResetMessage = (state: any) =>
  state.passwordReset.message;