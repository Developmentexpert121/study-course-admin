// features/certificate/certificateApprovalSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { reduxApiClient } from "@/lib/redux-api";

// Types
export interface CertificateApprovalData {
  id: number;
  certificate_code: string;
  certificate_url: string;
  issued_date: string;
  status: string;
  previousStatus: string;
  download_count: number;
  user_id: number;
  course_id: number;
  updatedAt: string;
}

export interface CertificateApprovalState {
  loading: boolean;
  approvalLoading: Record<number, boolean>;
  rejectionLoading: Record<number, boolean>;
  error: string | null;
  successMessage: string | null;
  lastApprovedCertificate: CertificateApprovalData | null;
  lastRejectedCertificate: CertificateApprovalData | null;
}

const initialState: CertificateApprovalState = {
  loading: false,
  approvalLoading: {},
  rejectionLoading: {},
  error: null,
  successMessage: null,
  lastApprovedCertificate: null,
  lastRejectedCertificate: null,
};

export const approveCertificate = createAsyncThunk(
  'certificateApproval/approve',
  async (certificateId: number, { rejectWithValue }) => {
    try {
      console.log("Approving certificate with id:", certificateId);
      const response = await reduxApiClient.put(
        `certificate/approval/of/certificate`,
        { id: certificateId }
      );

      if (!response.success) {
        return rejectWithValue(response.error?.message || 'Failed to approve certificate');
      }

      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Unknown error occurred'
      );
    }
  }
);

// ✅ FIXED: Corrected payload structure and role type
export const rejectCertificate = createAsyncThunk(
  'certificateApproval/reject',
  async ({ userId, role,reason  }: { userId: number; role: 'admin' | 'super-admin' ,reason?: string; }, { rejectWithValue }) => {
    try {
      
      // Try with leading slash if backend route has it
      const response = await reduxApiClient.put(
        `certificate/rejected/of/certificate`,
        { 
          user_id: userId,
          role: role
        }
      );

      if (!response.success) {
        return rejectWithValue(response.error?.message || 'Failed to reject certificate');
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Unknown error occurred'
      );
    }
  }
);

// Slice
const certificateApprovalSlice = createSlice({
  name: 'certificateApproval',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccessMessage: (state) => {
      state.successMessage = null;
    },
    resetApprovalState: (state) => {
      state.loading = false;
      state.approvalLoading = {};
      state.rejectionLoading = {};
      state.error = null;
      state.successMessage = null;
      state.lastApprovedCertificate = null;
      state.lastRejectedCertificate = null;
    },
  },
  extraReducers: (builder) => {
    // Approve Certificate
    builder
      .addCase(approveCertificate.pending, (state, action) => {
        const certificateId = action.meta.arg;
        state.approvalLoading[certificateId] = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(approveCertificate.fulfilled, (state, action) => {
        const certificateId = action.meta.arg;
        state.approvalLoading[certificateId] = false;
        state.lastApprovedCertificate = action.payload;
        state.successMessage = `Certificate approved successfully. Status updated to '${action.payload.status}'`;
        state.error = null;
      })
      .addCase(approveCertificate.rejected, (state, action) => {
        const certificateId = action.meta.arg;
        state.approvalLoading[certificateId] = false;
        state.error = action.payload as string;
        state.successMessage = null;
      });

    // ✅ FIXED: Correctly access userId from the object parameter
    builder
      .addCase(rejectCertificate.pending, (state, action) => {
        const { userId } = action.meta.arg; // Extract userId from object
        state.rejectionLoading[userId] = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(rejectCertificate.fulfilled, (state, action) => {
        const { userId } = action.meta.arg; // Extract userId from object
        state.rejectionLoading[userId] = false;
        state.lastRejectedCertificate = action.payload;
        state.successMessage = 'Certificates rejected successfully';
        state.error = null;
      })
      .addCase(rejectCertificate.rejected, (state, action) => {
        const { userId } = action.meta.arg; // Extract userId from object
        state.rejectionLoading[userId] = false;
        state.error = action.payload as string;
        state.successMessage = null;
      });
  },
});

export const { clearError, clearSuccessMessage, resetApprovalState } =
  certificateApprovalSlice.actions;

// Selectors
export const selectApprovalLoading = (state: any) =>
  state.certificateApproval.approvalLoading;
export const selectRejectionLoading = (state: any) =>
  state.certificateApproval.rejectionLoading;
export const selectApprovalError = (state: any) =>
  state.certificateApproval.error;
export const selectApprovalSuccess = (state: any) =>
  state.certificateApproval.successMessage;
export const selectLastApprovedCertificate = (state: any) =>
  state.certificateApproval.lastApprovedCertificate;
export const selectLastRejectedCertificate = (state: any) =>
  state.certificateApproval.lastRejectedCertificate;

export default certificateApprovalSlice.reducer;