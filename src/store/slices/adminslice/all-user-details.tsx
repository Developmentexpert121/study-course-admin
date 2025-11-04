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
  filterType: string;
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
  filterType: "all",
};

// Async thunk for fetching users - UPDATED to include search parameters
export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async ({ 
    page, 
    limit, 
    search = "", 
    filterType = "all" 
  }: { 
    page: number; 
    limit: number;
    search?: string;
    filterType?: string;
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
        params.append('filterType', filterType);
      }

      const res = await reduxApiClient.get(`user/get-all-details-admin?${params.toString()}`);
      return {
        users: res.data.data.users || [],
        totalPages: res.data?.data?.totalPages || 0,
        currentPage: page,
        totalUsers: res.data?.data?.totalUsers || 0,
        activeUsers: res.data?.data?.activeUsers || 0,
        inactiveUsers: res.data?.data?.inactiveUsers || 0,
        filteredUsersCount: res.data?.data?.filteredUsersCount || 0,
        searchTerm: search,
        filterType: filterType,
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
    setFilterType: (state, action: PayloadAction<string>) => {
      state.filterType = action.payload;
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
      state.filterType = "all";
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
        state.filterType = action.payload.filterType;
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
  setFilterType, 
  setTotalUsers,
  setActiveUsers,
  setInactiveUsers,
  clearError, 
  clearSearch,
  resetUserCounts
} = usersSlice.actions;

export default usersSlice.reducer;