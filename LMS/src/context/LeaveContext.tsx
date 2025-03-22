import React, { createContext, useContext, useState } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";

interface LeaveType {
  id: number;
  name: string;
  description: string;
  max_days: number;
}

interface LeaveRequest {
  id?: number;
  user_id: number;
  leave_type_id: number;
  leave_type?: string;
  full_name?: string;
  start_date: string;
  end_date: string;
  reason: string;
  status: "pending" | "approved" | "rejected";
  created_at?: string;
  updated_at?: string;
}

interface LeaveBalance {
  id: number;
  user_id: number;
  leave_type_id: number;
  leave_type?: string;
  days_remaining: number;
  default_days: number;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

interface LeaveContextType {
  leaveRequests: LeaveRequest[];
  leaveBalances: LeaveBalance[];
  leaveTypes: LeaveType[];
  isLoading: boolean;
  error: string | null;
  fetchLeaveRequests: () => Promise<void>;
  fetchLeaveBalances: () => Promise<void>;
  fetchLeaveTypes: () => Promise<void>;
  submitRequest: (data: {
    startDate: string;
    endDate: string;
    typeId: number;
    reason: string;
  }) => Promise<void>;
  updateRequest: (id: number, status: string) => Promise<void>;
  deleteRequest: (id: number) => Promise<void>;
}

const LeaveContext = createContext<LeaveContextType | null>(null);

export function LeaveProvider({ children }: { children: React.ReactNode }) {
  const { state } = useAuth();
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [leaveBalances, setLeaveBalances] = useState<LeaveBalance[]>([]);
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const baseUrl = "http://localhost:5000/api/leave";

  const api = axios.create({
    baseURL: baseUrl,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  const fetchLeaveTypes = async () => {
    try {
      setIsLoading(true);
      const response = await api.get<ApiResponse<LeaveType[]>>("/types");
      setLeaveTypes(response.data.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch leave types");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchLeaveRequests = async () => {
    try {
      setIsLoading(true);
      const response = await api.get<ApiResponse<LeaveRequest[]>>("/requests");
      setLeaveRequests(response.data.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch leave requests");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchLeaveBalances = async () => {
    try {
      setIsLoading(true);
      const response = await api.get<ApiResponse<LeaveBalance[]>>("/balance");
      setLeaveBalances(response.data.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch leave balances");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const submitRequest = async (data: {
    startDate: string;
    endDate: string;
    typeId: number;
    reason: string;
  }): Promise<void> => {
    try {
      setIsLoading(true);
      await api.post("/request", {
        leave_type_id: data.typeId,
        start_date: data.startDate,
        end_date: data.endDate,
        reason: data.reason,
      });
      await fetchLeaveRequests();
      setError(null);
    } catch (err) {
      setError("Failed to submit leave request");
      console.error(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateRequest = async (id: number, status: string): Promise<void> => {
    try {
      setIsLoading(true);
      await api.put(`/requests/${id}`, { status });
      await fetchLeaveRequests();
      setError(null);
    } catch (err) {
      setError("Failed to update leave request");
      console.error(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteRequest = async (id: number): Promise<void> => {
    try {
      setIsLoading(true);
      await api.delete(`/requests/${id}`);
      await fetchLeaveRequests();
      setError(null);
    } catch (err) {
      setError("Failed to delete leave request");
      console.error(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LeaveContext.Provider
      value={{
        leaveRequests,
        leaveBalances,
        leaveTypes,
        isLoading,
        error,
        fetchLeaveRequests,
        fetchLeaveBalances,
        fetchLeaveTypes,
        submitRequest,
        updateRequest,
        deleteRequest,
      }}
    >
      {children}
    </LeaveContext.Provider>
  );
}

export function useLeave() {
  const context = useContext(LeaveContext);
  if (!context) {
    throw new Error("useLeave must be used within a LeaveProvider");
  }
  return context;
}
