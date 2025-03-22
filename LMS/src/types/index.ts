export interface User {
  id: number;
  staff_id: string;
  full_name: string;
  email: string;
  department: string;
  role: "staff" | "hod" | "dean" | "admin";
}

export interface LeaveRequest {
  id: number;
  type: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: "pending" | "approved" | "rejected" | "cancelled";
  duration: string;
}

export interface LeaveBalance {
  type: string;
  total: number;
  used: number;
  remaining: number;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  token: string | null;
}

export interface LeaveState {
  requests: LeaveRequest[];
  history: LeaveRequest[];
  balances: LeaveBalance[];
  isLoading: boolean;
  error: string | null;
}
