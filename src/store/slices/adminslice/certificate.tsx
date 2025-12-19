// features/certificate/certificateSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { reduxApiClient } from "@/lib/redux-api";

// Types
export interface User {
  id: number;
  name: string;
  email: string;
  profileImage: string | null;
}

export interface Course {
  id: number;
  name: string;
  category: string;
  description: string;
}

export interface Certificate {
  id: number;
  certificate_code: string;
  certificate_url: string;
  issued_date: string;
  status: 'pending' | 'teacher_approved' | 'teacher_rejected' | 'admin_approved' | 'admin_rejected' | 'issued' | 'revoked';
  download_count: number;
  user: User;
  course: Course;
  createdAt: string;
  updatedAt: string;
}

export interface CertificateState {
  certificates: Certificate[];
  loading: boolean;
  error: string | null;
  count: number;
  selectedCertificate: Certificate | null;
}

const initialState: CertificateState = {
  certificates: [],
  loading: false,
  error: null,
  count: 0,
  selectedCertificate: null,
};

// Async Thunks
export const fetchAllCertificates = createAsyncThunk(
  'certificate/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await reduxApiClient.get(`certificate/getallcertificate`);
      
      if (!response.success) {
        return rejectWithValue(response.error?.message || 'Failed to fetch certificates');
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error occurred');
    }
  }
);


// Slice
const certificateSlice = createSlice({
  name: 'certificate',
  initialState,
  reducers: {
    setSelectedCertificate: (state, action: PayloadAction<Certificate | null>) => {
      state.selectedCertificate = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    resetCertificates: (state) => {
      state.certificates = [];
      state.count = 0;
      state.selectedCertificate = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch All Certificates
    builder
      .addCase(fetchAllCertificates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllCertificates.fulfilled, (state, action) => {
        state.loading = false;
        state.certificates = action.payload.data;
        state.count = action.payload.count;
      })
      .addCase(fetchAllCertificates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });


  },
});

export const { setSelectedCertificate, clearError, resetCertificates } = certificateSlice.actions;

// Selectors
export const selectCertificates = (state: any) => state.certificate.certificates;
export const selectLoading = (state: any) => state.certificate.loading;
export const selectError = (state: any) => state.certificate.error;
export const selectCount = (state: any) => state.certificate.count;
export const selectSelectedCertificate = (state: any) => state.certificate.selectedCertificate;

export default certificateSlice.reducer;