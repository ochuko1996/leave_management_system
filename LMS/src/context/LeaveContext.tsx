import { createContext, useContext, useReducer, ReactNode } from "react";
import { LeaveState, LeaveRequest, LeaveBalance } from "@/types";
import { leaveAPI } from "@/services/api";

// Define action types
type LeaveAction =
  | { type: "FETCH_START" }
  | { type: "FETCH_ERROR"; payload: string }
  | { type: "SET_REQUESTS"; payload: LeaveRequest[] }
  | { type: "SET_HISTORY"; payload: LeaveRequest[] }
  | { type: "SET_BALANCES"; payload: LeaveBalance[] }
  | { type: "ADD_REQUEST"; payload: LeaveRequest }
  | { type: "UPDATE_REQUEST"; payload: LeaveRequest }
  | { type: "CANCEL_REQUEST"; payload: number };

// Initial state
const initialState: LeaveState = {
  requests: [],
  history: [],
  balances: [],
  isLoading: false,
  error: null,
};

// Create context
const LeaveContext = createContext<{
  state: LeaveState;
  fetchRequests: () => Promise<void>;
  fetchHistory: () => Promise<void>;
  fetchBalances: () => Promise<void>;
  submitRequest: (leaveData: any) => Promise<void>;
  updateRequest: (id: number, data: any) => Promise<void>;
  cancelRequest: (id: number) => Promise<void>;
} | null>(null);

// Reducer function
function leaveReducer(state: LeaveState, action: LeaveAction): LeaveState {
  switch (action.type) {
    case "FETCH_START":
      return { ...state, isLoading: true, error: null };
    case "FETCH_ERROR":
      return { ...state, isLoading: false, error: action.payload };
    case "SET_REQUESTS":
      return { ...state, requests: action.payload, isLoading: false };
    case "SET_HISTORY":
      return { ...state, history: action.payload, isLoading: false };
    case "SET_BALANCES":
      return { ...state, balances: action.payload, isLoading: false };
    case "ADD_REQUEST":
      return {
        ...state,
        requests: [...state.requests, action.payload],
      };
    case "UPDATE_REQUEST":
      return {
        ...state,
        requests: state.requests.map((req) =>
          req.id === action.payload.id ? action.payload : req
        ),
      };
    case "CANCEL_REQUEST":
      return {
        ...state,
        requests: state.requests.filter((req) => req.id !== action.payload),
      };
    default:
      return state;
  }
}

// Provider component
export function LeaveProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(leaveReducer, initialState);

  const fetchRequests = async () => {
    try {
      dispatch({ type: "FETCH_START" });
      const requests = await leaveAPI.getRequests();
      dispatch({ type: "SET_REQUESTS", payload: requests });
    } catch (error: any) {
      dispatch({
        type: "FETCH_ERROR",
        payload: error.response?.data?.message || "Failed to fetch requests",
      });
    }
  };

  const fetchHistory = async () => {
    try {
      dispatch({ type: "FETCH_START" });
      const history = await leaveAPI.getHistory();
      dispatch({ type: "SET_HISTORY", payload: history });
    } catch (error: any) {
      dispatch({
        type: "FETCH_ERROR",
        payload: error.response?.data?.message || "Failed to fetch history",
      });
    }
  };

  const fetchBalances = async () => {
    try {
      dispatch({ type: "FETCH_START" });
      const balances = await leaveAPI.getLeaveBalance();
      dispatch({ type: "SET_BALANCES", payload: balances });
    } catch (error: any) {
      dispatch({
        type: "FETCH_ERROR",
        payload: error.response?.data?.message || "Failed to fetch balances",
      });
    }
  };

  const submitRequest = async (leaveData: any) => {
    try {
      const request = await leaveAPI.submitRequest(leaveData);
      dispatch({ type: "ADD_REQUEST", payload: request });
    } catch (error: any) {
      dispatch({
        type: "FETCH_ERROR",
        payload: error.response?.data?.message || "Failed to submit request",
      });
    }
  };

  const updateRequest = async (id: number, data: any) => {
    try {
      const updated = await leaveAPI.updateRequest(id, data);
      dispatch({ type: "UPDATE_REQUEST", payload: updated });
    } catch (error: any) {
      dispatch({
        type: "FETCH_ERROR",
        payload: error.response?.data?.message || "Failed to update request",
      });
    }
  };

  const cancelRequest = async (id: number) => {
    try {
      await leaveAPI.cancelRequest(id);
      dispatch({ type: "CANCEL_REQUEST", payload: id });
    } catch (error: any) {
      dispatch({
        type: "FETCH_ERROR",
        payload: error.response?.data?.message || "Failed to cancel request",
      });
    }
  };

  return (
    <LeaveContext.Provider
      value={{
        state,
        fetchRequests,
        fetchHistory,
        fetchBalances,
        submitRequest,
        updateRequest,
        cancelRequest,
      }}
    >
      {children}
    </LeaveContext.Provider>
  );
}

// Custom hook for using leave context
export function useLeave() {
  const context = useContext(LeaveContext);
  if (!context) {
    throw new Error("useLeave must be used within a LeaveProvider");
  }
  return context;
}
