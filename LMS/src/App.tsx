import { Routes, Route, Navigate } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { DashboardPage } from "@/pages/dashboard";
import { CalendarPage } from "@/pages/calendar";
import { RequestsPage } from "@/pages/requests";
import { HistoryPage } from "@/pages/history";
import { SettingsPage } from "@/pages/settings";
import { LoginPage } from "@/pages/auth/login";
import { RegisterPage } from "@/pages/auth/register";
import { useAuth } from "@/context/AuthContext";
import { LeavePage } from "@/pages/leave";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { state } = useAuth();
  if (!state.isAuthenticated) {
    return <Navigate to="/login" />;
  }
  return <>{children}</>;
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/requests" element={<RequestsPage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/leave" element={<LeavePage />} />
      </Route>
    </Routes>
  );
}

export default App;
