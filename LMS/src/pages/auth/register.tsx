import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  User,
  Building2,
  AlertCircle,
  UserCog,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { cn } from "@/lib/utils";

export function RegisterPage() {
  const navigate = useNavigate();
  const { register, state } = useAuth();
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    role: "staff",
    department: "",
  });
  const [formError, setFormError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    // Validation
    if (Object.values(formData).some((value) => !value)) {
      setFormError("Please fill in all fields");
      showToast("Error", "Please fill in all fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setFormError("Passwords do not match");
      showToast("Error", "Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setFormError("Password must be at least 6 characters");
      showToast("Error", "Password must be at least 6 characters");
      return;
    }

    try {
      await register({
        email: formData.email,
        password: formData.password,
        full_name: formData.fullName,
        department: formData.department,
        role: formData.role as "staff" | "hod" | "dean" | "admin",
      });
      if (!state.error) {
        showToast("Success", "Account created successfully!");
        navigate("/login");
      }
    } catch (error) {
      setFormError("Registration failed. Please try again.");
      showToast("Error", "Registration failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent to-accent/90 flex items-center justify-center p-4 w-[100vw]">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl font-bold text-primary">CP</span>
          </div>
          <h1 className="text-2xl font-semibold text-white">Create Account</h1>
          <p className="text-white/60 mt-2">Sign up for Citipolytechnic LMS</p>
        </div>

        {/* Registration Form */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-white">
                Full Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full px-10 py-2 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 text-white transition-all duration-300"
                  placeholder="Enter your full name"
                />
                <User className="absolute left-3 top-2.5 h-5 w-5 text-white/60" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Email</label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-10 py-2 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 text-white transition-all duration-300"
                  placeholder="Enter your email"
                />
                <Mail className="absolute left-3 top-2.5 h-5 w-5 text-white/60" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-white">
                Department
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="w-full px-10 py-2 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 text-white transition-all duration-300"
                  placeholder="Enter your department"
                />
                <Building2 className="absolute left-3 top-2.5 h-5 w-5 text-white/60" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Role</label>
              <div className="relative">
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-10 py-2 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 text-white transition-all duration-300"
                >
                  <option value="staff" className="bg-accent text-white">
                    Staff
                  </option>
                  <option value="hod" className="bg-accent text-white">
                    HOD
                  </option>
                  <option value="dean" className="bg-accent text-white">
                    Dean
                  </option>
                  <option value="admin" className="bg-accent text-white">
                    Admin
                  </option>
                </select>
                <UserCog className="absolute left-3 top-2.5 h-5 w-5 text-white/60" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Password</label>
              <div className="relative">
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-10 py-2 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 text-white transition-all duration-300"
                  placeholder="Create a password"
                />
                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-white/60" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-white">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-10 py-2 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 text-white transition-all duration-300"
                  placeholder="Confirm your password"
                />
                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-white/60" />
              </div>
            </div>

            {(state.error || formError) && (
              <div className="text-sm text-red-400 flex items-center gap-2">
                <AlertCircle size={16} />
                <span>{state.error || formError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={state.isLoading}
              className={cn(
                "w-full px-4 py-2 bg-primary text-white rounded-lg transition-all duration-300 hover:bg-primary/90 hover:scale-105 active:scale-95",
                state.isLoading && "opacity-50 cursor-not-allowed"
              )}
            >
              {state.isLoading ? "Creating account..." : "Create account"}
            </button>
          </form>
        </div>

        {/* Additional Links */}
        <div className="mt-6 text-center">
          <p className="text-white/60">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-primary hover:text-primary/80 font-medium"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
