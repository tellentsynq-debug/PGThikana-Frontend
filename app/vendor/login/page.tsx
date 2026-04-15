"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "@/app/context/SnackbarContext";

export default function PhonePage() {
  const router = useRouter();

  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const isValid = phone.length === 10;

const sendOtp = async () => {
  if (!isValid) return;

  setLoading(true);

  try {
    const res = await fetch(
      "https://pgthikana.in/api/vendor/send-otp",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phoneNumber: phone,
        }),
      }
    );

    const data = await res.json();

    // ✅ CASE 1: NEW USER
    if (
      res.status === 200 &&
      !data.message?.toLowerCase().includes("already")
    ) {
      router.push(`/vendor/otp?phone=${phone}`);
      return; // ✅ IMPORTANT
    }

    // ✅ CASE 2: ALREADY REGISTERED
    if (data.message?.toLowerCase().includes("already")) {
      const loginRes = await fetch(
        "https://pgthikana.in/api/vendor/login-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            phoneNumber: phone,
          }),
        }
      );

      const loginData = await loginRes.json();

      if (loginRes.status === 200) {
        router.push(`/vendor/otp?phone=${phone}`);
        return; // ✅ IMPORTANT
      } else {
        toast(loginData.message || "Login OTP failed");
      }
    } else {
      toast(data.message || "Failed to send OTP");
    }

  } catch (err) {
    console.error(err);
    toast("Network error. Please try again.");
  } finally {
    setLoading(false); // ✅ always runs
  }
};

  return (
    <div className="min-h-screen bg-[#F5F0EB] flex justify-center px-4 py-6">
      <div className="w-full max-w-md">

        {/* Back */}
        <button
          onClick={() => router.back()}
          className="text-xl mb-6"
        >
          ←
        </button>

        {/* Logo */}
        <div className="flex justify-center mb-4">
          <div className="w-20 h-20 relative">
            <Image
              src="/pg_logo.png"
              alt="logo"
              fill
              className="object-contain"
            />
          </div>
        </div>

        {/* Brand */}
        <h1 className="text-center text-2xl font-extrabold text-[#0F766E]">
          PG Thikana
        </h1>

        <p className="text-center text-gray-500 text-sm mb-6">
          Your trusted PG platform
        </p>

        {/* Step */}
        <p className="text-gray-600 text-sm mb-2 font-medium">
          Step 1 / 8
        </p>

        {/* Progress */}
        <div className="w-full h-2 bg-gray-300 rounded-full mb-6">
          <div className="w-[12%] h-full bg-[#0F766E] rounded-full"></div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold mb-2 text-[#0F766E]">
          Enter your mobile number
        </h2>

        <p className="text-gray-500 mb-6">
          We will send a 6-digit OTP to your number
        </p>

        {/* Phone Input */}
        <div className="flex items-center border-2 border-[#0F766E] rounded-xl overflow-hidden bg-white">
          <div className="px-4 font-semibold text-gray-700">
            +91
          </div>

          <div className="w-[1px] h-6 bg-gray-300"></div>

         <input
  type="text"
  value={phone}
  onChange={(e) =>
    setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
  }
  placeholder="Mobile number"
  className="flex-1 px-4 py-3 outline-none text-[#1A1A1A] font-medium placeholder:text-gray-400"
/>
        </div>

        {/* Dots */}
        <p className="text-gray-300 tracking-[6px] text-sm mt-2 mb-10">
          • • • • • • • • • •
        </p>

        {/* Button */}
        <button
          onClick={sendOtp}
          disabled={!isValid || loading}
          className={`w-full py-4 rounded-xl font-semibold text-white transition ${
            isValid
              ? "bg-[#0F766E] hover:opacity-90"
              : "bg-gray-300 cursor-not-allowed"
          }`}
        >
          {loading ? "Sending..." : "Proceed →"}
        </button>

        {/* Footer */}
        <p className="text-center text-xs text-gray-400 mt-4">
          By continuing, you agree to our terms of service
        </p>
      </div>
    </div>
  );
}