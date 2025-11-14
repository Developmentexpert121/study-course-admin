import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { reduxApiClient } from "@/lib/redux-api";

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
  role_id?: string;
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
  roleId: string | null;
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
  roleId: null,
};

export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async (
    {
      page,
      limit,
      search = "",
      verificationStatus = "all",
      role_id = null,
    }: {
      page: number;
      limit: number;
      search?: string;
      verificationStatus?: string;
      role_id?: string | null;
    },
    { rejectWithValue },
  ) => {
    try {
      // Build query parameters
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      // Add search parameters if they exist
      if (search) {
        params.append("search", search);
      }

      // Add verification status filter if not 'all'
      if (verificationStatus && verificationStatus !== "all") {
        const isVerified = verificationStatus === "verified";
        params.append("verifyUser", isVerified.toString());
      }

      // Add role_id filter if provided
      if (role_id) {
        params.append("role_id", role_id);
      }

      const res = await reduxApiClient.get(
        `user/get-all-details-admin?${params.toString()}`,
      );

      // Match the actual API response structure
      const responseData = res.data.data;

      return {
        users: responseData.users || [],
        totalPages: responseData.totalPages || 0,
        currentPage: page,
        totalUsers: responseData.totalUsers || 0,
        activeUsers: responseData.activeUsers || 0,
        inactiveUsers: responseData.inactiveUsers || 0,
        filteredUsersCount: responseData.filteredUsersCount || 0,
        searchTerm: search,
        verificationStatus: verificationStatus,
        roleId: role_id,
      };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch users",
      );
    }
  },
);

const usersSlice = createSlice({
  name: "users",
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
    setRoleId: (state, action: PayloadAction<string | null>) => {
      state.roleId = action.payload;
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
    clearSearch: (state) => {
      state.searchTerm = "";
      state.verificationStatus = "all";
      state.roleId = null;
    },
    clearRoleFilter: (state) => {
      state.roleId = null;
    },
    resetUserCounts: (state) => {
      state.totalUsers = 0;
      state.activeUsers = 0;
      state.inactiveUsers = 0;
      state.filteredUsersCount = 0;
    },
    resetFilters: (state) => {
      state.searchTerm = "";
      state.verificationStatus = "all";
      state.roleId = null;
      state.currentPage = 1;
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
        state.roleId = action.payload.roleId;
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
  setRoleId,
  setTotalUsers,
  setActiveUsers,
  setInactiveUsers,
  clearError,
  clearSearch,
  clearRoleFilter,
  resetUserCounts,
  resetFilters,
} = usersSlice.actions;

export default usersSlice.reducer;
