"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { toast } from "@/app/context/SnackbarContext";
import { Suspense } from "react";
function OtpPage() {
  const router = useRouter();
  const params = useSearchParams();
  const phone = params.get("phone") || "";

  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
  const [seconds, setSeconds] = useState(174);
  const [loading, setLoading] = useState(false);

  const isOtpFilled = otp.join("").length === 6;

  // ⏱ TIMER
  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = () => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")} remaining`;
  };

  // 🔢 HANDLE INPUT
  const handleChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
    if (!value && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  // ✅ VERIFY OTP (SAME AS FLUTTER) :contentReference[oaicite:0]{index=0}
const verifyOtp = async () => {
  if (!isOtpFilled) return;

  setLoading(true);

  const fullOtp = otp.join("");

  try {
    const res = await fetch(
      "https://pgthikana.in/api/vendor/login-verify",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phoneNumber: phone,
          otp: fullOtp,
        }),
      }
    );

    const data = await res.json();

    // ✅ CASE 1: USER EXISTS (LOGIN SUCCESS)
  if (res.status === 200 && data.success) {
  localStorage.setItem("vendorToken", data.token);

  // 🔥 notify app
  window.dispatchEvent(new Event("authChanged"));

  // ✅ SHOW TOAST
  toast("Login Successful!");

  // ⏳ DELAY NAVIGATION
  setTimeout(() => {
    router.push("/vendor/dashboard");
  }, 1200);

  return;
}

    // ✅ CASE 2: USER NOT FOUND (SIGNUP FLOW)
    if (
      res.status === 404 ||
      data.message?.toLowerCase().includes("vendor not found")
    ) {
      router.push(`/vendor/name?phone=${phone}&otp=${fullOtp}`);
      return; // 🔥 VERY IMPORTANT
    }

    // ❌ OTHER ERRORS
    toast(data.message || "OTP verification failed");

  } catch (err) {
    console.error(err);
    toast("Network error. Please try again.");
  } finally {
    setLoading(false); // ✅ SAFE PLACE
  }
};

  return (
    <div className="min-h-screen bg-[#F5F0EB] flex justify-center px-4 py-6">
      <div className="w-full max-w-md">

        {/* Back */}
        <button onClick={() => router.back()} className="mb-4 text-xl">
          ←
        </button>

        {/* Logo */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 relative">
            <Image src="/pg_logo.png" alt="logo" fill />
          </div>
        </div>

        {/* Step */}
        <p className="text-sm text-gray-600 mb-2 font-medium">
          Step 2 / 8
        </p>

        {/* Progress */}
        <div className="w-full h-2 bg-gray-300 rounded-full mb-6">
          <div className="w-[40%] h-full bg-[#0F766E] rounded-full"></div>
        </div>

        {/* Title */}
        <h2 className="text-2xl text-[#0F766E] font-bold mb-2">
          Enter OTP
        </h2>

        <p className="text-gray-500 mb-2">
          Enter the 6-digit code sent to +91 {phone}
        </p>

        {/* Timer */}
        <p className="text-sm text-gray-400 mb-6">
          ⏱ {formatTime()}
        </p>

        {/* OTP BOXES */}
        <div className="flex justify-between mb-6">
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={(el) => {
  inputsRef.current[i] = el;
}}
              type="text"
              value={digit}
              onChange={(e) => handleChange(e.target.value, i)}
              maxLength={1}
             className="w-12 h-14 text-center text-xl font-bold text-[#1A1A1A] border-2 border-gray-300 rounded-xl focus:border-[#0F766E] outline-none"
            />
          ))}
        </div>

        {/* RESEND */}
        <button className="text-sm text-gray-600 mb-10">
          🔄 Resend OTP
        </button>

        {/* VERIFY BUTTON */}
        <button
          onClick={verifyOtp}
          disabled={!isOtpFilled || loading}
          className={`w-full py-4 rounded-xl font-semibold text-white ${
            isOtpFilled
              ? "bg-[#0F766E]"
              : "bg-gray-300 cursor-not-allowed"
          }`}
        >
          {loading ? "Verifying..." : "Verify"}
        </button>

        {/* CHANGE NUMBER */}
        <button
          onClick={() => router.back()}
          className="block mx-auto mt-6 text-sm text-gray-600"
        >
          Change number
        </button>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OtpPage />
    </Suspense>
  );
}