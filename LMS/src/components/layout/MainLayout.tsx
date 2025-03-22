import { ReactNode } from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import {
  Calendar,
  LayoutDashboard,
  FileText,
  Settings,
  Clock,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function MainLayout() {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const menuItems = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      path: "/",
    },
    {
      title: "Leave Calendar",
      icon: Calendar,
      path: "/calendar",
    },
    {
      title: "Requests",
      icon: FileText,
      path: "/requests",
    },
    {
      title: "History",
      icon: Clock,
      path: "/history",
    },
    {
      title: "Leave",
      icon: Calendar,
      path: "/leave",
    },
  ];

  return (
    <div className="flex h-screen bg-background w-[100vw]">
      {/* Sidebar */}
      <aside className="w-64 bg-accent/95 backdrop-blur-sm border-r border-white/10">
        {/* Logo Section */}
        <div className="p-6 border-b border-white/10">
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center mb-3">
              <span className="text-xl font-bold text-primary">CP</span>
            </div>
            <h3 className="text-sm font-medium text-white/80">
              Citipolytechnic Abuja
            </h3>
            <h1 className="text-base font-semibold text-white mt-1">
              Leave Management System
            </h1>
          </div>
        </div>

        {/* Navigation */}
        <div className="p-4">
          <nav className="space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300",
                  isActive(item.path)
                    ? "bg-primary text-white shadow-md shadow-primary/20 translate-x-2"
                    : "text-white/60 hover:text-white hover:bg-white/5 hover:translate-x-1"
                )}
              >
                <item.icon size={20} className="shrink-0" />
                <span>{item.title}</span>
                {isActive(item.path) && (
                  <ChevronRight size={16} className="ml-auto" />
                )}
              </Link>
            ))}
          </nav>
        </div>

        {/* Settings */}
        <div className="absolute bottom-0 w-64 p-4 border-t border-white/10 bg-accent/95 backdrop-blur-sm">
          <Link
            to="/settings"
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300",
              isActive("/settings")
                ? "bg-primary text-white shadow-md shadow-primary/20 translate-x-2"
                : "text-white/60 hover:text-white hover:bg-white/5 hover:translate-x-1"
            )}
          >
            <Settings size={20} className="shrink-0" />
            <span>Settings</span>
            {isActive("/settings") && (
              <ChevronRight size={16} className="ml-auto" />
            )}
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-accent p-4">
        <div className="h-full max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
