"use client";

import { useState } from "react";
import Link from "next/link";
import { UserPlus, Mail, Lock, AlertCircle, Home, Shield, Eye, EyeOff, LogIn } from "lucide-react";
import Image from "next/image";
import { Input } from "@/app/components/Input";

// Orange and Dark Blue Theme
const themeColors = {
  darkBlue: "#082f49",
  orange: "#f97316",
  orange2: "#fb923c",
  lightOrange: "#fed7aa",
};

type FormFields = "username" | "password" | "otp";

type FieldErrors = Partial<Record<FormFields, string>>;

type Step = "signup" | "otp";

export default function SignupPage() {
  const [step, setStep] = useState<Step>("signup");
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    otp: "",
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

  const validateSignup = (): boolean => {
    const errors: FieldErrors = {};

    if (!formData.username.trim()) {
      errors.username = "Username is required";
    } else if (formData.username.length < 3) {
      errors.username = "Username must be at least 3 characters";
    }

    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateOtp = (): boolean => {
    const errors: FieldErrors = {};

    if (!formData.otp.trim()) {
      errors.otp = "OTP is required";
    } else if (formData.otp.length !== 6 || !/^\d{6}$/.test(formData.otp)) {
      errors.otp = "OTP must be 6 digits";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSignupSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setGlobalError("");

    if (!validateSignup()) return;

    setLoading(true);

    try {
      const response = await fetch("https://pgthikana.in/api/super-signup/otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.username.trim(),
          password: formData.password,
        }),
      });

      console.log('OTP Send Response:', response.status, response.statusText);

      const data = await response.json();
      console.log('OTP Send Response Data:', data);

      if (!response.ok) {
        if (data.field && data.message) {
          setFieldErrors({ [data.field]: data.message });
        } else {
          setGlobalError(data.message || "Something went wrong. Please try again.");
        }
        return;
      }

      // OTP sent successfully to mobile number
      setStep("otp");
    } catch (error) {
      console.error('Network error:', error);
      setGlobalError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setGlobalError("");

    if (!validateOtp()) return;

    setLoading(true);

    try {
      const response = await fetch("https://pgthikana.in/api/super-signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.username.trim(),
          password: formData.password,
          otp: formData.otp.trim(),
        }),
      });

      console.log('OTP Verify Response:', response.status, response.statusText);

      const data = await response.json();
      console.log('OTP Verify Response Data:', data);

      if (!response.ok) {
        if (data.field && data.message) {
          setFieldErrors({ [data.field]: data.message });
        } else {
          setGlobalError(data.message || "Something went wrong. Please try again.");
        }
        return;
      }

      setSuccess(true);
      setFormData({ username: "", password: "", otp: "" });
    } catch (error) {
      console.error('Network error:', error);
      setGlobalError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  // Helper: border color based on field error state
  const borderColor = (field: FormFields) =>
    fieldErrors[field] ? "#dc2626" : themeColors.lightOrange;

  if (success) {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-4"
        style={{ backgroundColor: themeColors.darkBlue }}
      >
        <div
          className="rounded-2xl shadow-2xl p-8 text-center max-w-md w-full border-4"
          style={{ backgroundColor: "white", borderColor: themeColors.orange }}
        >
          <div
            className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
            style={{ backgroundColor: themeColors.orange }}
          >
            <UserPlus className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold mb-2" style={{ color: themeColors.darkBlue }}>
            {getGreeting()}, Super Admin! 🎉
          </h2>
          <p style={{ color: themeColors.darkBlue }}>
            Super admin account created successfully. Redirecting to login...
          </p>
          <Link
            href="/auth/login"
            className="mt-4 inline-block font-bold hover:underline"
            style={{ color: themeColors.orange }}
          >
            Go to Login →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: themeColors.darkBlue }}
    >
      <div className="w-full max-w-6xl">
        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">

          {/* LEFT SIDE - IMAGE SECTION */}
          <div className="hidden lg:flex items-center justify-center">
            <div className="relative w-full max-w-sm">
              <div
                className="w-96 h-96 rounded-full flex items-center justify-center mx-auto shadow-2xl border-8"
                style={{ backgroundColor: themeColors.orange, borderColor: themeColors.darkBlue }}
              >
                <div className="text-center">
                  <Image
                    src="/pg-icon.svg"
                    alt="PG House"
                    width={200}
                    height={200}
                    className="mx-auto mb-4"
                    priority
                  />
                  <p className="text-white text-2xl font-bold">Welcome</p>
                  <p className="text-orange-100 text-sm mt-2"><span className="font-bold">Super</span> Admin</p>
                  <p className="text-orange-100 text-sm mt-2 font-bold">Pgthikana</p>
                </div>
              </div>
              <div
                className="absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-20"
                style={{ backgroundColor: themeColors.orange }}
              />
              <div
                className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full opacity-10"
                style={{ backgroundColor: "white" }}
              />
            </div>
          </div>

          {/* RIGHT SIDE - FORM */}
          <div>
            {/* Toggle Buttons */}
            <div className="flex gap-3 mb-6 bg-white rounded-lg p-1 shadow-lg">
              <Link
                href="/auth/login"
                className="flex-1 py-3 px-6 rounded-md font-semibold transition-all text-center"
                style={{
                  backgroundColor: "transparent",
                  color: themeColors.darkBlue,
                }}
              >
                <LogIn className="w-4 h-4 inline mr-2" />
                Login
              </Link>
              <button
                disabled
                className="flex-1 py-3 px-6 rounded-md font-semibold transition-all"
                style={{
                  backgroundColor: themeColors.orange,
                  color: "white",
                }}
              >
                <UserPlus className="w-4 h-4 inline mr-2" />
                Sign Up
              </button>
            </div>
            {/* Header */}
            <div
              className="text-center mb-8 rounded-3xl p-8 border-4"
              style={{ backgroundColor: themeColors.orange, borderColor: themeColors.darkBlue }}
            >
              <div
                className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center border-4"
                style={{ backgroundColor: "white", borderColor: themeColors.darkBlue }}
              >
                {step === "signup" ? (
                  <Home className="w-8 h-8" style={{ color: themeColors.orange }} />
                ) : (
                  <Shield className="w-8 h-8" style={{ color: themeColors.orange }} />
                )}
              </div>
              <h1 className="text-4xl font-bold text-white mb-2">
                {step === "signup" ? "Create Account pgthikana" : "Verify Mobile OTP"}
              </h1>
              <p className="text-orange-50 text-lg">
                {step === "signup" ? "Super Admin Registration" : "Enter the 6-digit OTP sent to your mobile"}
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

              {step === "signup" ? (
                <form onSubmit={handleSignupSubmit} className="mt-6 space-y-4" noValidate>
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
                        placeholder="Min. 6 characters"
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
                    {fieldErrors.password ? (
                      <p className="text-xs text-red-600 flex items-center gap-1 mt-1">
                        <AlertCircle className="w-3 h-3" /> {fieldErrors.password}
                      </p>
                    ) : (
                      <p className="text-xs font-medium mt-1" style={{ color: themeColors.darkBlue }}>
                        Must be at least 6 characters long
                      </p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full text-base font-bold rounded-lg py-3 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
                        Sending OTP...
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-5 h-5" />
                        Send OTP
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleOtpSubmit} className="mt-6 space-y-4" noValidate>
                  {/* OTP */}
                  <div className="space-y-1">
                    <label className="block text-sm font-semibold text-white">
                      <div className="flex items-center gap-2 mb-2">
                        <Shield className="w-4 h-4" />
                        OTP Code
                      </div>
                    </label>
                    <Input
                      type="text"
                      name="otp"
                      placeholder="Enter 6-digit OTP"
                      value={formData.otp}
                      onChange={handleChange}
                      disabled={loading}
                      className="border-2 focus:border-orange-500 focus:ring-2 focus:ring-orange-300 text-center text-2xl tracking-widest"
                      style={{ borderColor: borderColor("otp") }}
                      maxLength={6}
                    />
                    {fieldErrors.otp && (
                      <p className="text-xs text-red-600 flex items-center gap-1 mt-1">
                        <AlertCircle className="w-3 h-3" /> {fieldErrors.otp}
                      </p>
                    )}
                    <p className="text-xs font-medium mt-1" style={{ color: themeColors.darkBlue }}>
                      OTP will be sent to your registered mobile number
                    </p>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full text-base font-bold rounded-lg py-3 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
                        Verifying...
                      </>
                    ) : (
                      <>
                        <Shield className="w-5 h-5" />
                        Verify & Sign Up
                      </>
                    )}
                  </button>

                  {/* Back to Signup */}
                  <button
                    type="button"
                    onClick={() => {
                      setStep("signup");
                      setFieldErrors({});
                      setGlobalError("");
                      setFormData(prev => ({ ...prev, otp: "" }));
                    }}
                    disabled={loading}
                    className="w-full text-sm font-medium rounded-lg py-2 transition-all hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ color: themeColors.darkBlue, backgroundColor: "transparent" }}
                  >
                    ← Back to Registration
                  </button>
                </form>
              )}
            </div>

            {/* Footer — single instance, visible on all screen sizes */}
            <p className="text-sm text-center font-semibold mt-6" style={{ color: themeColors.orange }}>
              Super Admin Portal - Professional Registration
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}