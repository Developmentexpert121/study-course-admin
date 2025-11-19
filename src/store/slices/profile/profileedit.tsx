// slices/userSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { reduxApiClient } from '@/lib/redux-api';



// User interface
interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  verified: boolean;
  profileImage: string | null;
  bio: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}

// Update profile payload
interface UpdateProfilePayload {
  username?: string;
  bio?: string;
  profileImage?: File | null;
}

// User state interface
interface UserState {
  currentUser: User | null;
  loading: boolean;
  error: string | null;
  updateLoading: boolean;
  updateError: string | null;
}

// Initial state
const initialState: UserState = {
  currentUser: null,
  loading: false,
  error: null,
  updateLoading: false,
  updateError: null,
};

// Async thunk for updating user profile
export const updateUserProfile = createAsyncThunk(
  'user/updateProfile',
  async (
    { userId, updateData }: { userId: number; updateData: UpdateProfilePayload },
    { rejectWithValue }
  ) => {
    try {
      let response;

      if (updateData.profileImage) {
        // If there's a file, use FormData
        const formData = new FormData();
        
        if (updateData.username) {
          formData.append('username', updateData.username);
        }
        if (updateData.bio !== undefined) {
          formData.append('bio', updateData.bio);
        }
        if (updateData.profileImage) {
          formData.append('profileImage', updateData.profileImage);
        }

        response = await reduxApiClient.put(`user/${userId}/profile`, formData);
      } else {
        // If no file, use regular JSON
        response = await reduxApiClient.put(`user/${userId}/profile`, updateData);
      }

      if (!response.success) {
        return rejectWithValue(response.error?.message || 'Failed to update profile');
      }

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update profile');
    }
  }
);


// In your profileedit slice file

// Async thunk for fetching user by ID
export const fetchUserById = createAsyncThunk(
  'user/fetchById',
  async (userId: number, { rejectWithValue }) => {
    try {
      const response = await reduxApiClient.get(`user/${userId}/getinfo`);

      if (!response.success) {
        return rejectWithValue(response.error?.message || 'Failed to fetch user');
      }

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch user');
    }
  }
);

// Create user slice
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUser: (state) => {
      state.currentUser = null;
      state.error = null;
    },
    clearUpdateError: (state) => {
      state.updateError = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    // Optional: Update user locally without API call
    updateUserLocal: (state, action: PayloadAction<Partial<User>>) => {
      if (state.currentUser) {
        state.currentUser = { ...state.currentUser, ...action.payload };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Update Profile cases
      .addCase(updateUserProfile.pending, (state) => {
        state.updateLoading = true;
        state.updateError = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.updateLoading = false;
        state.currentUser = action.payload;
        state.updateError = null;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.updateLoading = false;
        state.updateError = action.payload as string;
      })
      // Fetch User by ID cases
      .addCase(fetchUserById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;
        state.error = null;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Export actions
export const { clearUser, clearUpdateError, clearError, updateUserLocal } = userSlice.actions;



export const selectCurrentUser = (state: any) => state.user.currentUser;
export const selectUserLoading = (state:any) => state.user.loading;
export const selectUserError = (state:any) => state.user.error;
export const selectUpdateLoading = (state:any) => state.user.updateLoading;
export const selectUpdateError = (state:any) => state.user.updateError;



// Export reducer
export default userSlice.reducer;