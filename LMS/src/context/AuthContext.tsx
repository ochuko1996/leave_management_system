import { createContext, useContext, useReducer, ReactNode } from "react";
import { AuthState, User } from "@/types";
import { authAPI } from "@/services/api";

// Define action types
type AuthAction =
  | { type: "LOGIN_START" | "LOGOUT" | "REGISTER_START" }
  | { type: "LOGIN_SUCCESS" | "REGISTER_SUCCESS"; payload: User }
  | { type: "LOGIN_ERROR" | "REGISTER_ERROR"; payload: string }
  | { type: "UPDATE_PROFILE"; payload: User };

// Initial state
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// Create context
const AuthContext = createContext<{
  state: AuthState;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
  updateProfile: (data: any) => Promise<void>;
} | null>(null);

// Reducer function
function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "LOGIN_START":
    case "REGISTER_START":
      return { ...state, isLoading: true, error: null };
    case "LOGIN_SUCCESS":
    case "REGISTER_SUCCESS":
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        user: action.payload,
        error: null,
      };
    case "LOGIN_ERROR":
    case "REGISTER_ERROR":
      return {
        ...state,
        isLoading: false,
        isAuthenticated: false,
        user: null,
        error: action.payload,
      };
    case "LOGOUT":
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        error: null,
      };
    case "UPDATE_PROFILE":
      return {
        ...state,
        user: action.payload,
      };
    default:
      return state;
  }
}

// Provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const login = async (email: string, password: string) => {
    try {
      dispatch({ type: "LOGIN_START" });
      const { user, token } = await authAPI.login(email, password);
      localStorage.setItem("token", token);
      dispatch({ type: "LOGIN_SUCCESS", payload: user });
    } catch (error: any) {
      dispatch({
        type: "LOGIN_ERROR",
        payload: error.response?.data?.message || "Login failed",
      });
    }
  };

  const register = async (userData: any) => {
    try {
      dispatch({ type: "REGISTER_START" });
      const { user } = await authAPI.register(userData);
      dispatch({ type: "REGISTER_SUCCESS", payload: user });
    } catch (error: any) {
      dispatch({
        type: "REGISTER_ERROR",
        payload: error.response?.data?.message || "Registration failed",
      });
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    dispatch({ type: "LOGOUT" });
  };

  const updateProfile = async (data: any) => {
    try {
      const { user } = await authAPI.updateProfile(data);
      dispatch({ type: "UPDATE_PROFILE", payload: user });
    } catch (error: any) {
      // Handle error but don't change state
      console.error("Profile update failed:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{ state, login, register, logout, updateProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook for using auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
