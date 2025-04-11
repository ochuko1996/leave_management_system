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
    <div className="min-h-screen bg-background flex items-center justify-center p-4 w-[100vw]">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl font-bold text-primary">CP</span>
          </div>
          <h1 className="text-2xl font-semibold text-foreground">
            Create Account
          </h1>
          <p className="text-muted-foreground mt-2">
            Sign up for Citipolytechnic LMS
          </p>
        </div>

        {/* Registration Form */}
        <div className="bg-card rounded-lg border p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Full Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full px-10 py-2 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground transition-all duration-300"
                  placeholder="Enter your full name"
                />
                <User className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-10 py-2 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground transition-all duration-300"
                  placeholder="Enter your email"
                />
                <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Department
              </label>
              <div className="relative">
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="w-full px-10 py-2 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground transition-all duration-300"
                >
                  <option value="" className="bg-background text-foreground">
                    Select your department
                  </option>
                  <option
                    value="Computer Science"
                    className="bg-background text-foreground"
                  >
                    Computer Science
                  </option>
                  <option
                    value="Mass Communication"
                    className="bg-background text-foreground"
                  >
                    Mass Communication
                  </option>
                  <option
                    value="Computer Engineering"
                    className="bg-background text-foreground"
                  >
                    Computer Engineering
                  </option>
                  <option
                    value="Business Administration"
                    className="bg-background text-foreground"
                  >
                    Business Administration
                  </option>
                </select>
                <Building2 className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Role
              </label>
              <div className="relative">
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-10 py-2 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground transition-all duration-300"
                >
                  <option
                    value="staff"
                    className="bg-background text-foreground"
                  >
                    Staff
                  </option>
                  <option value="hod" className="bg-background text-foreground">
                    HOD
                  </option>
                  <option
                    value="dean"
                    className="bg-background text-foreground"
                  >
                    Dean
                  </option>
                  <option
                    value="admin"
                    className="bg-background text-foreground"
                  >
                    Admin
                  </option>
                </select>
                <UserCog className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-10 py-2 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground transition-all duration-300"
                  placeholder="Create a password"
                />
                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-10 py-2 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground transition-all duration-300"
                  placeholder="Confirm your password"
                />
                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
              </div>
            </div>

            {formError && (
              <div className="flex items-center gap-2 text-sm text-destructive">
                <AlertCircle className="h-4 w-4" />
                <span>{formError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all duration-300"
            >
              Create Account
            </button>
          </form>
        </div>

        {/* Additional Links */}
        <div className="mt-6 text-center">
          <p className="text-muted-foreground">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-primary hover:text-primary/80"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
