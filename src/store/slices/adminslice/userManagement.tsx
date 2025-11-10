// slices/userStatusSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { reduxApiClient } from '@/lib/redux-api';

interface UserStatusState {
  loading: boolean;
  error: string | null;
  success: boolean;
  lastAction: 'activate' | 'deactivate' | null;
  lastActionUserId: string | null;
}

interface UserStatusPayload {
  userId: string;
}

interface StatusResponse {
  message: string;
  user: {
    id: string;
    username: string;
    email: string;
    status: string;
  };
}

const initialState: UserStatusState = {
  loading: false,
  error: null,
  success: false,
  lastAction: null,
  lastActionUserId: null,
};

// Async thunks
export const activateUser = createAsyncThunk(
  'userStatus/activateUser',
  async (payload: UserStatusPayload, { rejectWithValue }) => {
    try {
      const response = await reduxApiClient.post('user/activateUser', payload);
      
      if (!response.success) {
        return rejectWithValue(response.error?.message || 'Failed to activate user');
      }
      
      return {
        ...response.data as StatusResponse,
        userId: payload.userId
      };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to activate user');
    }
  }
);

export const deactivateUser = createAsyncThunk(
  'userStatus/deactivateUser',
  async (payload: UserStatusPayload, { rejectWithValue }) => {
    try {
      const response = await reduxApiClient.post('user/deactivate', payload);
      
      if (!response.success) {
        return rejectWithValue(response.error?.message || 'Failed to deactivate user');
      }
      
      return {
        ...response.data as StatusResponse,
        userId: payload.userId
      };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to deactivate user');
    }
  }
);

const userStatusSlice = createSlice({
  name: 'userStatus',
  initialState,
  reducers: {
    // Clear entire state
    clearStatusState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.lastAction = null;
      state.lastActionUserId = null;
    },
    
    // Clear only error
    clearStatusError: (state) => {
      state.error = null;
    },
    
    // Clear only success state
    clearStatusSuccess: (state) => {
      state.success = false;
      state.lastAction = null;
      state.lastActionUserId = null;
    },
    
    // Reset loading state (useful for cancelling operations)
    resetStatusLoading: (state) => {
      state.loading = false;
    },
    
    // Reset specific user's state
    resetUserStatus: (state, action: PayloadAction<string>) => {
      if (state.lastActionUserId === action.payload) {
        state.success = false;
        state.lastAction = null;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Activate user cases
      .addCase(activateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.lastAction = 'activate';
      })
      .addCase(activateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.lastActionUserId = action.payload.userId;
      })
      .addCase(activateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
        state.lastAction = 'activate';
      })
      
      // Deactivate user cases
      .addCase(deactivateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.lastAction = 'deactivate';
      })
      .addCase(deactivateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.lastActionUserId = action.payload.userId;
      })
      .addCase(deactivateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
        state.lastAction = 'deactivate';
      });
  },
});

export const { 
  clearStatusState, 
  clearStatusError, 
  clearStatusSuccess, 
  resetStatusLoading,
  resetUserStatus 
} = userStatusSlice.actions;





// slices/userStatusSlice.ts - Add these to the same file or create separate selectors file

// Selector functions for easier state access
export const selectUserStatus = (state: { userStatus: UserStatusState }) => state.userStatus;
export const selectUserStatusLoading = (state: { userStatus: UserStatusState }) => state.userStatus.loading;
export const selectUserStatusError = (state: { userStatus: UserStatusState }) => state.userStatus.error;
export const selectUserStatusSuccess = (state: { userStatus: UserStatusState }) => state.userStatus.success;
export const selectLastAction = (state: { userStatus: UserStatusState }) => state.userStatus.lastAction;
export const selectLastActionUserId = (state: { userStatus: UserStatusState }) => state.userStatus.lastActionUserId;

// Combined selectors for specific scenarios
export const selectIsActivating = (state: { userStatus: UserStatusState }) => 
  state.userStatus.loading && state.userStatus.lastAction === 'activate';

export const selectIsDeactivating = (state: { userStatus: UserStatusState }) => 
  state.userStatus.loading && state.userStatus.lastAction === 'deactivate';

export const selectIsActivatingUser = (userId: string) => (state: { userStatus: UserStatusState }) => 
  state.userStatus.loading && 
  state.userStatus.lastAction === 'activate' && 
  state.userStatus.lastActionUserId === userId;

export const selectIsDeactivatingUser = (userId: string) => (state: { userStatus: UserStatusState }) => 
  state.userStatus.loading && 
  state.userStatus.lastAction === 'deactivate' && 
  state.userStatus.lastActionUserId === userId;




  export default userStatusSlice.reducer;