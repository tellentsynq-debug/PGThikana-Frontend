"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function Page({ searchParams }: any) {
  const router = useRouter();

  const phone = searchParams?.phone || "";

  const [otp, setOtp] = useState(Array(6).fill(""));
  const inputsRef = useRef<HTMLInputElement[]>([]);

  const [seconds, setSeconds] = useState(174);
  const [loading, setLoading] = useState(false);

  const isFilled = otp.join("").length === 6;

  // TIMER
  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = () => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const handleChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: any, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const verifyOtp = async () => {
    if (!isFilled) return;

    setLoading(true);

    try {
      const res = await fetch("https://pgthikana.in/api/login-verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phoneNumber: phone,
          otp: otp.join(""),
        }),
      });

      const data = await res.json();

      if (res.status === 200) {
        localStorage.setItem("userToken", data.token);
        router.push("/user/home");
      } else if (res.status === 404) {
        router.push(`/user/name?phone=${phone}&otp=${otp.join("")}`);
      } else {
        alert(data.message || "OTP Failed");
      }
    } catch (err) {
      console.error(err);
      alert("Network Error");
    }

    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-[#F5F0EB] flex items-center justify-center">

      <div className="bg-white p-8 rounded-2xl shadow-xl w-[350px]">

        <h1 className="text-xl font-bold text-center text-[#0F766E]">
          Enter OTP
        </h1>

        <p className="text-center text-gray-500 text-sm mt-2">
          Sent to +91 {phone}
        </p>

        <p className="text-center text-gray-400 text-sm mt-1">
          Expires in {formatTime()}
        </p>

        <div className="flex justify-between mt-6">
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={(el) => {
                if (el) inputsRef.current[i] = el;
              }}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e.target.value, i)}
              onKeyDown={(e) => handleKeyDown(e, i)}
              className="w-10 h-12 text-center text-black font-bold border-2 border-gray-300 rounded-lg focus:border-[#0F766E] outline-none"
            />
          ))}
        </div>

        <button
          onClick={verifyOtp}
          disabled={!isFilled || loading}
          className={`w-full mt-6 h-12 rounded-lg font-semibold
          ${
            isFilled
              ? "bg-[#0F766E] text-white"
              : "bg-gray-300 text-gray-600"
          }`}
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>

      </div>
    </main>
  );
}