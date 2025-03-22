import React, { createContext, useContext, useReducer } from "react";
import axios from "axios";
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
  isAuthenticated: Boolean(localStorage.getItem("token")),
  isLoading: false,
  error: null,
  token: localStorage.getItem("token"),
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
        token: localStorage.getItem("token"),
      };
    case "LOGIN_ERROR":
    case "REGISTER_ERROR":
      return {
        ...state,
        isLoading: false,
        isAuthenticated: false,
        user: null,
        error: action.payload,
        token: null,
      };
    case "LOGOUT":
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        error: null,
        token: null,
      };
    case "UPDATE_PROFILE":
      return {
        ...state,
        user: action.payload,
        token: localStorage.getItem("token"),
      };
    default:
      return state;
  }
}

// Provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const login = async (email: string, password: string) => {
    try {
      dispatch({ type: "LOGIN_START" });
      const { user, token } = await authAPI.login(email, password);
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
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
      localStorage.setItem("user", JSON.stringify(user));
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
    localStorage.removeItem("user");
    dispatch({ type: "LOGOUT" });
  };

  const updateProfile = async (data: any) => {
    try {
      const { user } = await authAPI.updateProfile(data);
      localStorage.setItem("user", JSON.stringify(user));
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
