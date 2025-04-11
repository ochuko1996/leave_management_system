import { AuthProvider } from "./AuthContext";
import { ToastContainer } from "./ToastContext";
import { LeaveProvider } from "./LeaveContext";
import { ThemeProvider } from "./ThemeContext";

interface AppProviderProps {
  children: React.ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <LeaveProvider>
          <ToastContainer>{children}</ToastContainer>
        </LeaveProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
