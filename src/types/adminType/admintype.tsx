// types/adminActivityTypes.ts

// Shared Interfaces
export interface Admin {
  id: number;
  username: string;
  email: string;
  role: string;
}

export interface AdminActivity {
  id: number;
  admin_id: number;
  activity_type: string;
  created_at: string;
  updated_at: string;
  admin?: Admin;
}

export interface AdminActivitiesResponse {
  activities: AdminActivity[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  hasMore: boolean;
}

export interface TrackLogoutResponse {
  message: string;
  activity: AdminActivity;
}

export interface AdminActivityState {
  activities: AdminActivity[];
  loading: boolean;
  error: string | null;
  totalCount: number;
  currentPage: number;
  totalPages: number;
  hasMore: boolean;
  logoutLoading: boolean;
  logoutError: string | null;
}

// Shared Initial State
export const initialAdminActivityState: AdminActivityState = {
  activities: [],
  loading: false,
  error: null,
  totalCount: 0,
  currentPage: 1,
  totalPages: 0,
  hasMore: false,
  logoutLoading: false,
  logoutError: null,
};