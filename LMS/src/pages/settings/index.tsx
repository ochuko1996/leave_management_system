import { User, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { useNavigate } from "react-router-dom";

export function SettingsPage() {
  const { state, updateProfile, logout } = useAuth();

  const { showToast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: state.user?.full_name || "",
    email: state.user?.email || "",
    department: state.user?.department || "",
  });

  useEffect(() => {
    setFormData({
      full_name: state.user?.full_name || "",
      email: state.user?.email || "",
      department: state.user?.department || "",
    });
  }, [state.user]);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    try {
      setIsLoading(true);
      await updateProfile(formData);
      showToast("Success", "Profile updated successfully");
    } catch (error) {
      showToast("Error", "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-full bg-card rounded-lg p-6">
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-foreground">Settings</h2>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-destructive/10 text-destructive rounded-lg hover:bg-destructive/20 transition-all duration-300"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-6">
            <div className="flex items-center gap-4 bg-accent p-4 rounded-lg border">
              <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center">
                <User size={32} className="text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-foreground capitalize">
                  {state.user?.full_name}
                </h3>
                <p className="text-sm text-muted-foreground capitalize">
                  {state.user?.department}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {state.user?.staff_id}
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <button className="w-full px-4 py-2 text-sm border text-foreground rounded-lg hover:bg-accent transition-all duration-300 text-left hover:translate-x-1">
                Profile Settings
              </button>
              <button className="w-full px-4 py-2 text-sm border text-foreground rounded-lg hover:bg-accent transition-all duration-300 text-left hover:translate-x-1">
                Security
              </button>
            </div>
          </div>

          <div className="md:col-span-2 space-y-6">
            <div className="bg-card rounded-lg border p-6 space-y-6">
              <h3 className="font-medium text-foreground">Profile Settings</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground transition-all duration-300"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground transition-all duration-300"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Department
                  </label>
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground transition-all duration-300"
                  />
                </div>
                <div className="pt-4">
                  <button
                    onClick={handleSaveProfile}
                    disabled={isLoading}
                    className="px-6 py-2 bg-primary text-primary-foreground rounded-lg transition-all duration-300 hover:bg-primary/90 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
                  >
                    {isLoading ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </div>
            </div>

            {/* Notification Settings - Commented out for future implementation
            <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 p-6 space-y-6">
              <h3 className="font-medium text-white">Notification Settings</h3>
              <div className="space-y-4">
                <label className="flex items-center gap-2 text-white cursor-pointer group">
                  <input
                    type="checkbox"
                    name="leaveRequests"
                    className="rounded border-white/20 bg-white/5 text-primary focus:ring-primary/20 transition-all duration-300"
                  />
                  <span className="text-sm transition-all duration-300 group-hover:translate-x-1">
                    Email notifications for leave requests
                  </span>
                </label>
                <label className="flex items-center gap-2 text-white cursor-pointer group">
                  <input
                    type="checkbox"
                    name="requestUpdates"
                    className="rounded border-white/20 bg-white/5 text-primary focus:ring-primary/20 transition-all duration-300"
                  />
                  <span className="text-sm transition-all duration-300 group-hover:translate-x-1">
                    Email notifications for request updates
                  </span>
                </label>
                <label className="flex items-center gap-2 text-white cursor-pointer group">
                  <input
                    type="checkbox"
                    name="browser"
                    className="rounded border-white/20 bg-white/5 text-primary focus:ring-primary/20 transition-all duration-300"
                  />
                  <span className="text-sm transition-all duration-300 group-hover:translate-x-1">
                    Browser notifications
                  </span>
                </label>
              </div>
            </div>
            */}
          </div>
        </div>
      </div>
    </div>
  );
}
