"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useState } from "react";
import Image from "next/image";

export default function NamePage() {
  const router = useRouter();
const [phone, setPhone] = useState("");
const [otp, setOtp] = useState("");

useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  setPhone(params.get("phone") || "");
  setOtp(params.get("otp") || "");
}, []);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState<string | null>(null);

  const isValid =
    firstName.trim() !== "" &&
    lastName.trim() !== "" &&
    gender !== null;

  const handleContinue = () => {
    if (!isValid) return;

    const genderForApi = gender === "Male" ? "male" : "female";

    router.push(
      `/user/preferences?phone=${encodeURIComponent(
        phone
      )}&otp=${encodeURIComponent(
        otp
      )}&gender=${genderForApi}&firstName=${encodeURIComponent(
        firstName
      )}&lastName=${encodeURIComponent(lastName)}`
    );
  };

  return (
    <main className="min-h-screen bg-[#F5F0EB] flex flex-col items-center justify-center px-4">

      {/* 🔥 LOGO */}
      <div className="mb-6 text-center">
        <div className="bg-white p-4 rounded-2xl shadow-md inline-block">
          <Image
            src="/pg_logo.png"
            alt="logo"
            width={70}
            height={70}
          />
        </div>

        <h1 className="mt-3 text-xl font-bold text-[#0F766E]">
          PG Thikana
        </h1>
      </div>

      {/* 🔥 CARD */}
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8">

        {/* HEADER */}
        <h2 className="text-2xl font-bold text-gray-900">
          Tell us your name
        </h2>

        <p className="text-gray-500 text-sm mt-1">
          This will be shown on your profile
        </p>

        {/* FIRST NAME */}
        <div className="mt-6">
          <label className="text-sm font-semibold text-gray-700">
            First Name
          </label>

          <input
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Enter first name"
            className="w-full mt-2 px-4 py-3 rounded-xl border border-gray-300 
                       focus:border-[#0F766E] outline-none text-black bg-white"
          />
        </div>

        {/* LAST NAME */}
        <div className="mt-5">
          <label className="text-sm font-semibold text-gray-700">
            Last Name
          </label>

          <input
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Enter last name"
            className="w-full mt-2 px-4 py-3 rounded-xl border border-gray-300 
                       focus:border-[#0F766E] outline-none text-black bg-white"
          />
        </div>

        {/* GENDER */}
        <div className="mt-5">
          <label className="text-sm font-semibold text-gray-700">
            Select Gender
          </label>

          <div className="flex gap-3 mt-3">
            {["Male", "Female"].map((g) => (
              <button
                key={g}
                onClick={() => setGender(g)}
                className={`flex-1 h-[50px] rounded-xl border-2 font-semibold transition
                  ${
                    gender === g
                      ? "border-[#0F766E] text-[#0F766E]"
                      : "border-gray-300 text-gray-600"
                  }
                `}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {/* BUTTON */}
        <button
          onClick={handleContinue}
          disabled={!isValid}
          className={`w-full h-[56px] mt-8 rounded-xl text-lg font-semibold
          ${
            isValid
              ? "bg-[#0F766E] text-white hover:bg-[#0d5f59]"
              : "bg-gray-300 text-gray-600"
          }`}
        >
          Continue
        </button>

        {/* BACK */}
        <p
          onClick={() => router.back()}
          className="text-center text-sm text-gray-500 mt-4 cursor-pointer hover:underline"
        >
          Go Back
        </p>
      </div>
    </main>
  );
}