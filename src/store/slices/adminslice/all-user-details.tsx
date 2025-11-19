// store/slices/adminslice/all-user-details.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { reduxApiClient } from "@/lib/redux-api";

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  status: string;
  verifyUser: boolean;
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
  accountStatus: string; // CHANGED: from verificationStatus to accountStatus
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
  accountStatus: "all", // CHANGED
  roleId: null,
};

export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async (
    {
      page,
      limit,
      search = "",
      accountStatus = "all",
      role_id = null,
    }: {
      page: number;
      limit: number;
      search?: string;
      accountStatus?: string;
      role_id?: string | null;
    },
    { rejectWithValue },
  ) => {
    try {
      console.log("🔍 DEBUG - fetchUsers called with:", {
        page,
        limit,
        search,
        accountStatus,
        role_id,
      });

      // FIXED: Use URLSearchParams to properly serialize parameters
      const params = new URLSearchParams();
      params.append("page", page.toString());
      params.append("limit", limit.toString());

      if (search) {
        params.append("search", search);
        console.log("✅ ADDING search param:", search);
      }

      if (accountStatus && accountStatus !== "all") {
        params.append("accountStatus", accountStatus);
        console.log("✅ ADDING accountStatus param:", accountStatus);
      } else {
        console.log("ℹ️ No accountStatus filter (showing all)");
      }

      if (role_id) {
        params.append("role_id", role_id);
        console.log("✅ ADDING role_id param:", role_id);
      }

      const queryString = params.toString();
      console.log("🔗 FINAL QUERY STRING:", queryString);
      console.log("🌐 FULL URL: user/get-all-details-admin?" + queryString);

      // FIXED: Manually construct the URL with query string
      const res = await reduxApiClient.get(
        `user/get-all-details-admin?${queryString}`,
      );

      console.log("📡 API RESPONSE received:", {
        success: res.data.success,
        userCount: res.data.data?.users?.length || 0,
      });

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
        accountStatus: accountStatus,
        roleId: role_id,
      };
    } catch (error: any) {
      console.error("❌ API Error:", error);
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
    setAccountStatus: (state, action: PayloadAction<string>) => {
      // CHANGED
      state.accountStatus = action.payload;
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
      state.accountStatus = "all"; // CHANGED
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
      state.accountStatus = "all"; // CHANGED
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
        state.accountStatus = action.payload.accountStatus; // CHANGED
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
  setAccountStatus, // CHANGED
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
