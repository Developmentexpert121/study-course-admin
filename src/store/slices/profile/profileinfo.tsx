import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { reduxApiClient } from "@/lib/redux-api";

// User interface matching your backend model
interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  verified: boolean;
  profileImage: string | null;
  bio: string;
  status: "pending" | "approved" | "rejected" | "active" | "inactive";
  createdAt: string;
  updatedAt: string;
}

interface UserState {
  currentUser: User | null;
  loading: boolean;
  error: string | null;
  lastFetched: number | null;
}

const initialState: UserState = {
  currentUser: null,
  loading: false,
  error: null,
  lastFetched: null,
};

// Enhanced async thunk with better error handling
export const getUserById = createAsyncThunk(
  "user/getUserById",
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await reduxApiClient.get(`user/${userId}/getinfo`);
      if (!response.success) {
        return rejectWithValue(
          response.error?.message || "Failed to fetch user",
        );
      }

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch user");
    }
  },
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearUser: (state) => {
      state.currentUser = null;
      state.loading = false;
      state.error = null;
      state.lastFetched = null;
    },

    clearError: (state) => {
      state.error = null;
    },

    resetLoading: (state) => {
      state.loading = false;
    },

    // Update user profile (for local state updates)
    updateUserProfile: (state, action: PayloadAction<Partial<User>>) => {
      if (state.currentUser) {
        state.currentUser = { ...state.currentUser, ...action.payload };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserById.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.currentUser = action.payload;
        state.error = null;
        state.lastFetched = Date.now();
      })
      .addCase(getUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.currentUser = null;
      });
  },
});

export const { clearUser, clearError, resetLoading, updateUserProfile } =
  userSlice.actions;

// Selectors
export const selectCurrentUser = (state: { user: UserState }) =>
  state.user.currentUser;
export const selectUserLoading = (state: { user: UserState }) =>
  state.user.loading;
export const selectUserError = (state: { user: UserState }) => state.user.error;
export const selectUserLastFetched = (state: { user: UserState }) =>
  state.user.lastFetched;

export default userSlice.reducer;
