"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { toast } from "@/app/context/SnackbarContext";

export default function NamePage() {
  const router = useRouter();
  const params = useSearchParams();

  const phone = params.get("phone") || "";
  const otp = params.get("otp") || "";

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const isFormFilled = firstName.trim() !== "" && lastName.trim() !== "";

  const handleNext = () => {
    if (!isFormFilled) return;

    // 👉 Move to next step (preferences or API call later)
    router.push(
      `/vendor/preferences?phone=${phone}&otp=${otp}&firstName=${firstName}&lastName=${lastName}`
    );
  };

  return (
    <div className="min-h-screen bg-[#F5F0EB] flex justify-center px-4 py-6">
      <div className="w-full max-w-md">

        {/* Back */}
        <button
          onClick={() => router.back()}
          className="mb-4 text-xl"
        >
          ←
        </button>

        {/* Logo */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 relative">
            <Image src="/pg_logo.png" alt="logo" fill />
          </div>
        </div>

        {/* Step */}
        <p className="text-sm text-gray-600 mb-2">
          Step 3 / 8
        </p>

        {/* Progress */}
        <div className="w-full h-2 bg-gray-300 rounded-full mb-6">
          <div className="w-[50%] h-full bg-[#0F766E] rounded-full"></div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold mb-2 text-[#0F766E]">
          Tell us your name
        </h2>

        <p className="text-gray-500 mb-6">
          This will appear on your profile
        </p>

        {/* First Name */}
        <label className="text-sm font-semibold mb-2 block text-[#0F766E]">
          First Name
        </label>

        <input
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="Enter your first name"
          className="w-full mb-5 px-4 py-4 rounded-xl border border-gray-300 bg-white outline-none focus:border-[#0F766E] text-[#1A1A1A]"
        />

        {/* Last Name */}
        <label className="text-sm font-semibold mb-2 block text-[#0F766E]">
          Last Name
        </label>

        <input
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          placeholder="Enter your last name"
          className="w-full mb-10 px-4 py-4 rounded-xl border border-gray-300 bg-white outline-none focus:border-[#0F766E] text-[#1A1A1A]"
        />

        {/* Button */}
        <button
          onClick={handleNext}
          disabled={!isFormFilled}
          className={`w-full py-4 rounded-xl font-semibold text-white transition ${
            isFormFilled
              ? "bg-[#0F766E]"
              : "bg-gray-300 cursor-not-allowed"
          }`}
        >
          Continue →
        </button>

        {/* Back */}
        <button
          onClick={() => router.back()}
          className="block mx-auto mt-6 text-sm text-gray-600"
        >
          Go Back
        </button>

      </div>
    </div>
  );
}