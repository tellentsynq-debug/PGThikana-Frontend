"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "@/app/context/SnackbarContext";

export default function LoginPage() {
  const router = useRouter();

  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const isValid = phone.length === 10;

  const sendOtp = async () => {
    if (!isValid) return;

    setLoading(true);

    try {
      const loginRes = await fetch("https://pgthikana.in/api/login-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phoneNumber: phone }),
      });

      if (loginRes.status === 200) {
        router.push(`/user/otp?phone=${phone}`);
        return;
      }

      const signupRes = await fetch("https://pgthikana.in/api/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phoneNumber: phone }),
      });

      if (signupRes.status === 200) {
        router.push(`/user/otp?phone=${phone}`);
      } else {
        const data = await signupRes.json();
        toast(data.message || "OTP Failed");
      }
    } catch (err) {
      console.error(err);
      toast("Network Error");
    }

    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-[#F5F0EB] flex items-center justify-center px-4">

      {/* 🔥 SINGLE CARD */}
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-10 border border-gray-100">

        {/* LOGO + BRAND */}
        <div className="flex flex-col items-center mb-6">
          <div className="bg-gray-50 rounded-2xl shadow-sm p-4">
            <Image
              src="/pg_logo.png"
              alt="PG Logo"
              width={70}
              height={70}
              priority
            />
          </div>

          <h1 className="mt-3 text-2xl font-bold text-[#0F766E]">
            PG Thikana
          </h1>
        </div>

        {/* HEADER */}
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">
            Enter Phone Number
          </h2>
          <p className="text-gray-500 mt-1 text-sm">
            We will send a 6-digit OTP
          </p>
        </div>

        {/* INPUT */}
        <div className="mt-6 flex items-center rounded-xl border-2 border-[#0F766E] bg-[#FAFAFA]">
          <div className="px-4 font-semibold text-gray-800">+91</div>
          <div className="w-[1px] h-6 bg-gray-300"></div>

          <input
            type="tel"
            value={phone}
            onChange={(e) =>
              setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
            }
            placeholder="Enter phone number"
            className="flex-1 px-4 py-4 bg-transparent outline-none text-gray-900"
          />
        </div>

        {/* BUTTON */}
        <button
          onClick={sendOtp}
          disabled={!isValid || loading}
          className={`w-full h-[56px] mt-6 rounded-xl text-lg font-semibold transition-all duration-150
          ${
            loading
              ? "bg-gray-400 text-white"
              : isValid
              ? "bg-[#0F766E] text-white hover:bg-[#0d5f59] shadow-md"
              : "bg-gray-300 text-gray-600"
          }`}
        >
          {loading ? "Sending OTP..." : "Continue"}
        </button>

      </div>
    </main>
  );
}