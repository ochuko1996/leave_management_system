import { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { useRole } from "../../hooks/useRole";
import {
  LayoutDashboard,
  Calendar,
  FileText,
  History,
  Settings,
  Menu,
  X,
  Sun,
  Moon,
} from "lucide-react";

export function MainLayout() {
  const { user, logout } = useAuth();
  const { canManageRequests } = useRole();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navigationItems = [
    { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { path: "/leave", label: "Leave", icon: Calendar },
    { path: "/history", label: "History", icon: History },
    ...(canManageRequests
      ? [{ path: "/requests", label: "Requests", icon: FileText }]
      : []),
    { path: "/settings", label: "Settings", icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile menu button */}
      <div className="fixed top-0 left-0 right-0 z-50 lg:hidden">
        <div className="flex items-center justify-between p-4 bg-card border-b">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-lg hover:bg-accent"
          >
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <div className="font-semibold text-foreground">Citi LMS</div>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-accent"
          >
            {theme === "dark" ? <Sun size={24} /> : <Moon size={24} />}
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <div
        className={cn(
          "fixed top-0 left-0 h-screen w-64 bg-card border-r transition-all duration-300",
          "lg:translate-x-0",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-foreground">Citi LMS</h1>
            <p className="text-sm text-muted-foreground">
              Leave Management System
            </p>
          </div>

          <nav className="flex-1 px-4 space-y-1">
            {navigationItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.label}
                  onClick={() => {
                    navigate(item.path);
                    setIsSidebarOpen(false);
                  }}
                  className={cn(
                    "flex items-center w-full px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <item.icon className="w-4 h-4 mr-3" />
                  {item.label}
                </button>
              );
            })}
          </nav>

          <div className="p-4 border-t">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-foreground">
                  {user?.full_name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {user?.department}
                </p>
              </div>
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-accent"
              >
                {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
              </button>
            </div>
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all duration-200"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div
        className={cn(
          "min-h-screen pt-16 lg:pt-0 transition-all duration-300",
          "lg:ml-64",
          isSidebarOpen ? "ml-64" : "ml-0"
        )}
      >
        <div className="p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
