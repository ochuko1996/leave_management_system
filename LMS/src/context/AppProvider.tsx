import { ReactNode } from "react";
import { AuthProvider } from "./AuthContext";
import { LeaveProvider } from "./LeaveContext";

interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  return (
    <AuthProvider>
      <LeaveProvider>{children}</LeaveProvider>
    </AuthProvider>
  );
}
