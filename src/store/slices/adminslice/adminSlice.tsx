import { useApiClient } from "@/lib/api";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { reduxApiClient } from "@/lib/redux-api";

// Types
interface Admin {
  id: string;
  username: string;
  email: string;
  role: string;
  verified: boolean;
  status: "pending" | "approved" | "rejected";
  profileImage?: string;
  createdAt: string;
}

interface AdminState {
  admins: Admin[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  loading: boolean;
  error: string | null;
  actionLoading: { [key: string]: boolean };
  stats: {
    totalAdmins: number;
    verifiedAdmins: number;
    unverifiedAdmins: number;
  };
  // Search state
  searchQuery: string;
  filters: {
    status: string;
    email: string;
    name: string;
  };
}

const initialState: AdminState = {
  admins: [],
  totalCount: 0,
  currentPage: 1,
  totalPages: 1,
  itemsPerPage: 10,
  loading: false,
  error: null,
  actionLoading: {},
  stats: {
    totalAdmins: 0,
    verifiedAdmins: 0,
    unverifiedAdmins: 0,
  },
  // Search initial state
  searchQuery: "",
  filters: {
    status: "",
    email: "",
    name: "",
  },
};

// Async Thunks

// Fetch all admins with pagination and search/filters
export const fetchAdmins = createAsyncThunk(
  "admin/fetchAdmins",
  async (
    {
      page = 1,
      search = "",
      status = "",
      email = "",
      name = ""
    }: {
      page?: number;
      search?: string;
      status?: string;
      email?: string;
      name?: string;
    } = {},
    { rejectWithValue }
  ) => {
    try {
      // Build query parameters
      const params = new URLSearchParams();
      params.append('page', page.toString());

      if (search) params.append('search', search);
      if (status && status !== 'all') params.append('status', status);
      if (email) params.append('email', email);
      if (name) params.append('name', name);

      const response = await reduxApiClient.get(`user/admins?${params.toString()}`);

      if (response.data.success && response.data.data) {
        console.log("response", response.data.data);
        return {
          admins: response.data.data.admins || [],
          currentPage: response.data.data.pagination?.currentPage || 1,
          totalPages: response.data.data.pagination?.totalPages || 1,
          totalCount: response.data.data.pagination?.totalItems || 0,
          itemsPerPage: response.data.data.pagination?.itemsPerPage || 10,
          stats: response.data.data.stats || {
            totalAdmins: 0,
            verifiedAdmins: 0,
            unverifiedAdmins: 0,
          },
        };
      } else {
        return rejectWithValue(
          response.data.message || "Failed to fetch admins",
        );
      }
    } catch (err: any) {
      if (err.response?.status === 401) {
        return rejectWithValue("Session expired. Please login again.");
      } else if (err.response?.status === 403) {
        return rejectWithValue(
          "Access denied. Super Admin privileges required.",
        );
      } else {
        return rejectWithValue("An error occurred while fetching admins");
      }
    }
  },
);

// Approve admin
export const approveAdmin = createAsyncThunk(
  "admin/approveAdmin",
  async (adminId: string, { rejectWithValue }) => {
    try {
      const response = await reduxApiClient.put(
        `user/admins/${adminId}/approve`,
        {},
      );

      if (response.success) {
        return {
          adminId,
          message:
            "Admin approved successfully! An approval email has been sent.",
        };
      } else {
        return rejectWithValue(
          response.error?.message || "Failed to approve admin",
        );
      }
    } catch (err: any) {
      console.error("Approve error:", err);
      return rejectWithValue("An error occurred while approving admin");
    }
  },
);

// Reject admin
export const rejectAdmin = createAsyncThunk(
  "admin/rejectAdmin",
  async (adminId: string, { rejectWithValue }) => {
    try {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");

      const response: any = await reduxApiClient.patch(
        `user/admins/${adminId}/reject`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (response.success) {
        return {
          adminId,
          message: response.message || "Admin rejected successfully!",
        };
      } else {
        return rejectWithValue(response.message || "Failed to reject admin");
      }
    } catch (err: any) {
      const status = err.response?.status;
      const errorMessage = err.response?.data?.message;

      switch (status) {
        case 400:
          return rejectWithValue(
            errorMessage || "Invalid request. Admin ID is required.",
          );
        case 401:
          return rejectWithValue("Session expired. Please login again.");
        case 403:
          return rejectWithValue(
            "Access denied. Super Admin privileges required.",
          );
        case 404:
          return rejectWithValue("Admin user not found.");
        case 500:
          return rejectWithValue(
            `Server error: ${errorMessage || "Internal server error"}`,
          );
        default:
          return rejectWithValue(
            errorMessage || "An error occurred while rejecting admin",
          );
      }
    }
  },
);

// Slice
const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setActionLoading: (
      state,
      action: PayloadAction<{ adminId: string; loading: boolean }>,
    ) => {
      state.actionLoading[action.payload.adminId] = action.payload.loading;
    },
    // Search and filter reducers
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setStatusFilter: (state, action: PayloadAction<string>) => {
      state.filters.status = action.payload;
    },
    setEmailFilter: (state, action: PayloadAction<string>) => {
      state.filters.email = action.payload;
    },
    setNameFilter: (state, action: PayloadAction<string>) => {
      state.filters.name = action.payload;
    },
    clearFilters: (state) => {
      state.searchQuery = "";
      state.filters.status = "";
      state.filters.email = "";
      state.filters.name = "";
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch Admins
    builder
      .addCase(fetchAdmins.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdmins.fulfilled, (state, action) => {
        state.loading = false;
        state.admins = action.payload.admins;
        state.totalCount = action.payload.totalCount;
        state.currentPage = action.payload.currentPage;
        state.totalPages = action.payload.totalPages;
        state.itemsPerPage = action.payload.itemsPerPage;
        state.stats = action.payload.stats;
        state.error = null;
      })
      .addCase(fetchAdmins.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Approve Admin
    builder
      .addCase(approveAdmin.pending, (state, action) => {
        state.actionLoading[action.meta.arg] = true;
      })
      .addCase(approveAdmin.fulfilled, (state, action) => {
        state.actionLoading[action.payload.adminId] = false;
        // Update admin status in the list
        const admin = state.admins.find((a) => a.id === action.payload.adminId);
        if (admin) {
          admin.status = "approved";
        }
      })
      .addCase(approveAdmin.rejected, (state, action) => {
        state.actionLoading[action.meta.arg] = false;
        state.error = action.payload as string;
      });

    // Reject Admin
    builder
      .addCase(rejectAdmin.pending, (state, action) => {
        state.actionLoading[action.meta.arg] = true;
      })
      .addCase(rejectAdmin.fulfilled, (state, action) => {
        state.actionLoading[action.payload.adminId] = false;
        // Update admin status in the list
        const admin = state.admins.find((a) => a.id === action.payload.adminId);
        if (admin) {
          admin.status = "rejected";
        }
      })
      .addCase(rejectAdmin.rejected, (state, action) => {
        state.actionLoading[action.meta.arg] = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  clearError,
  setActionLoading,
  setSearchQuery,
  setStatusFilter,
  setEmailFilter,
  setNameFilter,
  clearFilters,
  setPage
} = adminSlice.actions;
export default adminSlice.reducer;

// Selectors
export const selectAdmins = (state: any) => state.admin.admins;
export const selectTotalCount = (state: any) => state.admin.totalCount;
export const selectCurrentPage = (state: any) => state.admin.currentPage;
export const selectTotalPages = (state: any) => state.admin.totalPages;
export const selectItemsPerPage = (state: any) => state.admin.itemsPerPage;
export const selectLoading = (state: any) => state.admin.loading;
export const selectError = (state: any) => state.admin.error;
export const selectActionLoading = (state: any) => state.admin.actionLoading;
export const selectVerifiedCount = (state: any) =>
  state.admin.admins.filter((a: Admin) => a.verified).length;
export const selectRejectedCount = (state: any) =>
  state.admin.admins.filter((a: Admin) => a.status === "rejected").length;

export const selectAdminStats = (state: any) => state.admin.stats;
export const selectTotalAdmins = (state: any) => state.admin.stats.totalAdmins;
export const selectVerifiedAdmins = (state: any) => state.admin.stats.verifiedAdmins;
export const selectUnverifiedAdmins = (state: any) => state.admin.stats.unverifiedAdmins;

// Search and filter selectors
export const selectSearchQuery = (state: any) => state.admin.searchQuery;
export const selectFilters = (state: any) => state.admin.filters;
