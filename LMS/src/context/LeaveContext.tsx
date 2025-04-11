import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
} from "react";
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
  const retryCount = useRef(0);
  const maxRetries = 3;
  const retryTimeout = useRef<NodeJS.Timeout>();
  const isInitialMount = useRef(true);
  const [initialDataLoaded, setInitialDataLoaded] = useState(false);

  const baseUrl = "http://localhost:5000/api/leave";

  const api = axios.create({
    baseURL: baseUrl,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    timeout: 10000, // 10 second timeout
  });

  // Add request interceptor with proper type annotation
  api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("token");
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Add response interceptor
  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response?.status === 401) {
        // Handle unauthorized error
        localStorage.removeItem("token");
        window.location.href = "/login";
        return Promise.reject(error);
      }
      return Promise.reject(error);
    }
  );

  // Fix generic type declaration
  const fetchWithRetry = async <T,>(
    fetchFn: () => Promise<T>,
    setData: (data: T) => void,
    errorMessage: string
  ): Promise<void> => {
    try {
      setIsLoading(true);
      const data = await fetchFn();
      setData(data);
      setError(null);
      retryCount.current = 0; // Reset retry count on success
    } catch (err) {
      if (retryCount.current < maxRetries) {
        retryCount.current += 1;
        const delay = Math.min(1000 * Math.pow(2, retryCount.current), 10000);

        if (retryTimeout.current) {
          clearTimeout(retryTimeout.current);
        }

        console.log(
          `Retrying in ${delay / 1000} seconds (attempt ${retryCount.current})`
        );
        retryTimeout.current = setTimeout(() => {
          fetchWithRetry(fetchFn, setData, errorMessage);
        }, delay);
      } else {
        setError(errorMessage);
        console.error(err);
        retryCount.current = 0;
      }
    } finally {
      setIsLoading(false);
    }
  };

  const fetchLeaveTypes = useCallback(async () => {
    await fetchWithRetry(
      async () => {
        const response = await api.get<ApiResponse<LeaveType[]>>("/types");
        return response.data.data;
      },
      setLeaveTypes,
      "Failed to fetch leave types"
    );
  }, []);

  const fetchLeaveRequests = useCallback(async () => {
    await fetchWithRetry(
      async () => {
        const response = await api.get<ApiResponse<LeaveRequest[]>>(
          "/requests"
        );
        return response.data.data;
      },
      setLeaveRequests,
      "Failed to fetch leave requests"
    );
  }, []);

  const fetchLeaveBalances = useCallback(async () => {
    await fetchWithRetry(
      async () => {
        const response = await api.get<ApiResponse<LeaveBalance[]>>("/balance");
        return response.data.data;
      },
      setLeaveBalances,
      "Failed to fetch leave balances"
    );
  }, []);

  // Cleanup function
  useEffect(() => {
    return () => {
      if (retryTimeout.current) {
        clearTimeout(retryTimeout.current);
      }
    };
  }, []);

  // Initial data fetch - only on first mount to prevent infinite loops
  useEffect(() => {
    // Only fetch data once when authenticated
    if (state.isAuthenticated && !initialDataLoaded) {
      console.log("Initial data fetch - this should only happen once");

      // Set flag to prevent repeated data fetching
      setInitialDataLoaded(true);

      // Stagger the API calls to prevent overwhelming the server
      fetchLeaveTypes();

      setTimeout(() => {
        fetchLeaveRequests();
      }, 1500);

      setTimeout(() => {
        fetchLeaveBalances();
      }, 3000);
    }
  }, [
    state.isAuthenticated,
    initialDataLoaded,
    fetchLeaveTypes,
    fetchLeaveRequests,
    fetchLeaveBalances,
  ]);

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
      // Fetch leave requests only after successful submission
      await fetchLeaveRequests();
      setError(null);
    } catch (err: any) {
      // Handle specific error for department conflicts
      if (err.response?.status === 409) {
        const errorMessage =
          err.response.data.message ||
          "Department conflict: Another person from your department already has approved leave for this period.";
        setError(errorMessage);
        throw new Error(errorMessage);
      } else {
        setError("Failed to submit leave request");
        console.error(err);
        throw err;
      }
    } finally {
      setIsLoading(false);
    }
  };

  const updateRequest = async (id: number, status: string): Promise<void> => {
    try {
      setIsLoading(true);
      await api.put(`/requests/${id}`, { status });
      // Fetch leave requests only after successful update
      await fetchLeaveRequests();
      setError(null);
    } catch (err: any) {
      // Handle specific error for department conflicts
      if (err.response?.status === 409) {
        const errorMessage =
          err.response.data.message ||
          "Department conflict: Another person from this department already has approved leave for this period.";
        setError(errorMessage);
        throw new Error(errorMessage);
      } else {
        setError("Failed to update leave request");
        console.error(err);
        throw err;
      }
    } finally {
      setIsLoading(false);
    }
  };

  const deleteRequest = async (id: number): Promise<void> => {
    try {
      setIsLoading(true);
      await api.delete(`/requests/${id}`);
      // Fetch leave requests only after successful deletion
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
