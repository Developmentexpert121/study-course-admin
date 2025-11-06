import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { reduxApiClient } from '@/lib/redux-api';

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  verifyUser: boolean;
  status: string;
  createdAt: string;
  profileImage: string | null;
  enrolledCourses: any[];
}

interface UsersState {
  users: User[];
  currentPage: number;
  totalPages: number;
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  filteredUsersCount: number;
  loading: boolean;
  error: string | null;
  searchTerm: string;
  verificationStatus: string;
}

const initialState: UsersState = {
  users: [],
  totalPages: 0,
  currentPage: 1,
  totalUsers: 0,
  activeUsers: 0,
  inactiveUsers: 0,
  filteredUsersCount: 0,
  loading: false,
  error: null,
  searchTerm: "",
  verificationStatus: "all",
};

// Async thunk for fetching users - UPDATED to include search and verification status parameters
export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async ({
    page,
    limit,
    search = "",
    verificationStatus = "all"
  }: {
    page: number;
    limit: number;
    search?: string;
    verificationStatus?: string;
  }, { rejectWithValue }) => {
    try {
      // Build query parameters
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      // Add search parameters if they exist
      if (search) {
        params.append('search', search);
      }

      // Add verification status filter if not 'all'
      if (verificationStatus && verificationStatus !== 'all') {
        // Convert to boolean value for the API
        const isVerified = verificationStatus === 'verified';
        params.append('verifyUser', isVerified.toString());
      }

      console.log('API URL:', `user/get-all-details-admin?${params.toString()}`);
      const res = await reduxApiClient.get(`user/get-all-details-admin?${params.toString()}`);
      console.log('API Response:', res.data);
      return {
        users: res.data.data.users || [],
        totalPages: res.data?.data?.totalPages || 0,
        currentPage: page,
        totalUsers: res.data?.data?.totalUsers || 0,
        activeUsers: res.data?.data?.activeUsers || 0,
        inactiveUsers: res.data?.data?.inactiveUsers || 0,
        filteredUsersCount: res.data?.data?.filteredUsersCount || 0,
        searchTerm: search,
        verificationStatus: verificationStatus,
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch users');
    }
  }
);

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setSearch: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
    setVerificationStatus: (state, action: PayloadAction<string>) => {
      state.verificationStatus = action.payload;
    },
    setTotalUsers: (state, action: PayloadAction<number>) => {
      state.totalUsers = action.payload;
    },
    setActiveUsers: (state, action: PayloadAction<number>) => {
      state.activeUsers = action.payload;
    },
    setInactiveUsers: (state, action: PayloadAction<number>) => {
      state.inactiveUsers = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    // Optional: Add a clearSearch action
    clearSearch: (state) => {
      state.searchTerm = "";
      state.verificationStatus = "all";
    },
    // Reset all user counts
    resetUserCounts: (state) => {
      state.totalUsers = 0;
      state.activeUsers = 0;
      state.inactiveUsers = 0;
      state.filteredUsersCount = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.users;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
        state.totalUsers = action.payload.totalUsers;
        state.activeUsers = action.payload.activeUsers;
        state.inactiveUsers = action.payload.inactiveUsers;
        state.filteredUsersCount = action.payload.filteredUsersCount;
        state.searchTerm = action.payload.searchTerm;
        state.verificationStatus = action.payload.verificationStatus;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setPage,
  setSearch,
  setVerificationStatus,
  setTotalUsers,
  setActiveUsers,
  setInactiveUsers,
  clearError,
  clearSearch,
  resetUserCounts
} = usersSlice.actions;

export default usersSlice.reducer;