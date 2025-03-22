import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, AlertCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { cn } from "@/lib/utils";

export function LoginPage() {
  const navigate = useNavigate();
  const { login, state } = useAuth();
  const { showToast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!email || !password) {
      setFormError("Please fill in all fields");
      return;
    }

    try {
      await login(email, password);
      navigate("/");
      showToast("Success", "Welcome back!");
    } catch (error) {
      setFormError("Invalid credentials");
      showToast("Error", "Invalid email or password");
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
          <h1 className="text-2xl font-semibold text-white">Welcome Back</h1>
          <p className="text-white/60 mt-2">Sign in to your account</p>
        </div>

        {/* Login Form */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Email</label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={cn(
                    "w-full px-10 py-2 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 text-white transition-all duration-300",
                    state.error && "border-red-400 focus:ring-red-400/30"
                  )}
                  placeholder="Enter your email"
                />
                <Mail className="absolute left-3 top-2.5 h-5 w-5 text-white/60" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Password</label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={cn(
                    "w-full px-10 py-2 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 text-white transition-all duration-300",
                    state.error && "border-red-400 focus:ring-red-400/30"
                  )}
                  placeholder="Enter your password"
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
              {state.isLoading ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </div>

        {/* Additional Links */}
        <div className="mt-6 text-center">
          <p className="text-white/60">
            Don't have an account?{" "}
            <button
              onClick={() => navigate("/register")}
              className="text-primary hover:text-primary/80 font-medium"
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
