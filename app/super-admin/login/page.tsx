"use client";

import { useState } from "react";
import Link from "next/link";
import { LogIn, Mail, Lock, AlertCircle, Home, Shield, Eye, EyeOff } from "lucide-react";
import { Input } from "@/app/components/Input";

// Orange and Dark Blue Theme
const themeColors = {
  darkBlue: "#082f49",
  orange: "#f97316",
  orange2: "#fb923c",
  lightOrange: "#fed7aa",
};

type FormFields = "username" | "password";

type FieldErrors = Partial<Record<FormFields, string>>;

export default function SuperAdminLoginPage() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [globalError, setGlobalError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear field error on change
    setFieldErrors((prev) => ({ ...prev, [name as FormFields]: undefined }));
    setGlobalError("");
  };

  const validateForm = (): boolean => {
    const errors: FieldErrors = {};

    if (!formData.username.trim()) {
      errors.username = "Username is required";
    }

    if (!formData.password) {
      errors.password = "Password is required";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setGlobalError("");

    if (!validateForm()) return;

    setLoading(true);

    try {
      const response = await fetch("https://pgthikana.in/api/super-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.username.trim(),
          password: formData.password,
        }),
      });

      console.log('Login Response:', response.status, response.statusText);

      const data = await response.json();
      console.log('Login Response Data:', data);

      if (!response.ok) {
        if (data.field && data.message) {
          setFieldErrors({ [data.field]: data.message });
        } else {
          setGlobalError(data.message || "Something went wrong. Please try again.");
        }
        return;
      }

      setSuccess(true);
      // Handle successful login (redirect or store token)
      console.log('Login successful:', data);
    } catch (error) {
      console.error('Network error:', error);
      setGlobalError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const borderColor = (field: FormFields) => {
    if (fieldErrors[field]) return "#dc2626"; // red-600
    return themeColors.lightOrange;
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: themeColors.darkBlue }}>
        <div
          className="w-full max-w-md rounded-2xl shadow-2xl p-8 text-center"
          style={{ backgroundColor: "white" }}
        >
          <div
            className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center border-4"
            style={{ backgroundColor: "white", borderColor: themeColors.darkBlue }}
          >
            <Shield className="w-8 h-8" style={{ color: themeColors.orange }} />
          </div>
          <h2 className="text-2xl font-bold mb-2" style={{ color: themeColors.darkBlue }}>
            Login Successful! 🎯
          </h2>
          <p style={{ color: themeColors.darkBlue }}>
            Welcome back, Super Admin. Redirecting to dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: themeColors.darkBlue }}>
      <div className="w-full max-w-md">
        {/* Header */}
        <div
          className="rounded-2xl shadow-2xl p-8 text-center"
          style={{ backgroundColor: themeColors.orange, borderColor: themeColors.darkBlue }}
        >
          <div
            className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center border-4"
            style={{ backgroundColor: "white", borderColor: themeColors.darkBlue }}
          >
            <Shield className="w-8 h-8" style={{ color: themeColors.orange }} />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">
            Super Admin Login
          </h1>
          <p className="text-orange-50 text-lg">
            {getGreeting()}, Super Admin
          </p>

          {/* Global Error */}
          {globalError && (
            <div className="mt-4 p-4 border-2 rounded-lg" style={{ backgroundColor: "#fee2e2", borderColor: "#dc2626" }}>
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <span className="text-sm text-red-800">{globalError}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
            {/* Username */}
            <div className="space-y-1">
              <label className="block text-sm font-semibold text-white">
                <div className="flex items-center gap-2 mb-2">
                  <Mail className="w-4 h-4" />
                  Username
                </div>
              </label>
              <Input
                type="text"
                name="username"
                placeholder="Enter your username"
                value={formData.username}
                onChange={handleChange}
                disabled={loading}
                className="border-2 focus:border-orange-500 focus:ring-2 focus:ring-orange-300"
                style={{ borderColor: borderColor("username") }}
              />
              {fieldErrors.username && (
                <p className="text-xs text-red-600 flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3 h-3" /> {fieldErrors.username}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="block text-sm font-semibold text-white">
                <div className="flex items-center gap-2 mb-2">
                  <Lock className="w-4 h-4" />
                  Password
                </div>
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={loading}
                  className="border-2 focus:border-orange-500 focus:ring-2 focus:ring-orange-300 pr-10"
                  style={{ borderColor: borderColor("password") }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {fieldErrors.password && (
                <p className="text-xs text-red-600 flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3 h-3" /> {fieldErrors.password}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full text-base font-bold rounded-lg py-3 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
              style={{ backgroundColor: "white", color: themeColors.orange }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = themeColors.lightOrange)}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "white")}
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Logging in...
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Login
                </>
              )}
            </button>
          </form>

          {/* Links */}
          <div className="mt-6 text-center space-y-2">
            <p className="text-orange-50 text-sm">
              Don&apos;t have an account?{" "}
              <Link
                href="/super-admin/signup"
                className="font-semibold hover:underline transition-colors"
                style={{ color: "white" }}
              >
                Sign up here
              </Link>
            </p>
            <p className="text-orange-50 text-sm">
              <Link
                href="/"
                className="font-semibold hover:underline transition-colors flex items-center justify-center gap-1"
                style={{ color: "white" }}
              >
                <Home className="w-4 h-4" />
                Back to Home
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}