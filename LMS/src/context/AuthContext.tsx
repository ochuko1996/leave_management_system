import { createContext, useContext, useState } from "react";
import { User } from "@/types";
import { authAPI } from "@/services/api";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthContextType {
  state: AuthState;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
  updateProfile: (data: any) => Promise<void>;
  user: User | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>(() => {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");
    const user = userStr ? (JSON.parse(userStr) as User) : null;
    return {
      user,
      token,
      isAuthenticated: !!token,
      isLoading: false,
      error: null,
    };
  });

  const login = async (email: string, password: string) => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      // Your login logic here
      const response = await authAPI.login(email, password);
      localStorage.setItem("token", response?.token);
      localStorage.setItem("user", JSON.stringify(response?.user));
      setState((prev) => ({
        ...prev,
        user: response.user,
        token: response.token,
        isAuthenticated: true,
        isLoading: false,
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: "Login failed",
        isLoading: false,
      }));
    }
  };

  const register = async (userData: any) => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      // Your register logic here
      const response = await authAPI.register(userData);
      localStorage.setItem("token", response.token as string);
      localStorage.setItem("user", JSON.stringify(response.user as User));
      setState((prev) => ({
        ...prev,
        user: response.user as User,
        token: response.token as string,
        isAuthenticated: true,
        isLoading: false,
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: "Registration failed",
        isLoading: false,
      }));
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  };

  const updateProfile = async (data: any) => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      // Your update profile logic here
      // const response = await authAPI.updateProfile(data)
      // localStorage.setItem('user', JSON.stringify(response.user))
      // setState(prev => ({ ...prev, user: response.user, isLoading: false }))
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: "Profile update failed",
        isLoading: false,
      }));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        state,
        login,
        register,
        logout,
        updateProfile,
        user: state.user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
