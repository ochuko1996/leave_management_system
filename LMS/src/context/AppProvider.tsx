import { AuthProvider } from "./AuthContext";
import { ToastContainer } from "./ToastContext";
import { LeaveProvider } from "./LeaveContext";

interface AppProviderProps {
  children: React.ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  return (
    <AuthProvider>
      <LeaveProvider>
        <ToastContainer>{children}</ToastContainer>
      </LeaveProvider>
    </AuthProvider>
  );
}
