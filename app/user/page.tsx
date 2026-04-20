"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Page() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-[#F5F0EB] flex items-center justify-center relative overflow-hidden px-6">

      {/* 🔶 SOFT BACKGROUND ACCENT */}
      <div className="absolute top-[-100px] left-[-100px] w-[300px] h-[300px] bg-[#0F766E]/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-120px] right-[-100px] w-[300px] h-[300px] bg-[#0F766E]/10 rounded-full blur-3xl"></div>

      {/* 🔹 MAIN CARD (ALL CONTENT MERGED) */}
      <div className="w-full max-w-md bg-white/90 backdrop-blur rounded-3xl shadow-xl p-8 border border-gray-100 relative z-10 flex flex-col items-center">

        {/* LOGO */}
        <div className="bg-white rounded-[28px] shadow-md px-8 py-5 flex items-center justify-center">
          <Image
            src="/pg_logo.png"
            alt="PG Logo"
            width={100}
            height={100}
            priority
          />
        </div>

        {/* TITLE */}
        <h1 className="mt-6 text-[34px] font-bold text-[#0F766E] tracking-tight">
          PG Thikana
        </h1>

        {/* SUBTITLE */}
        <p className="text-gray-500 mt-1 text-[14px]">
          Find your perfect stay
        </p>

        {/* TAGLINE */}
        <p className="text-gray-400 mt-2 text-sm text-center">
          Verified PGs • Easy Booking • Trusted Platform
        </p>

        {/* BUTTONS */}
        <div className="w-full mt-6">
          {/* CREATE ACCOUNT */}
          <button
            onClick={() => router.push("/user/create-account")}
            className="w-full h-[56px] bg-[#0F766E] text-white rounded-xl text-lg font-semibold 
                       hover:bg-[#0d5f59] active:scale-[0.98] transition-all duration-150 shadow-sm"
          >
            Create Account
          </button>

          {/* LOGIN */}
          <button
            onClick={() => router.push("/user/create-account")}
            className="w-full h-[56px] mt-4 border-2 border-[#0F766E] text-[#0F766E] rounded-xl text-lg font-semibold 
                       hover:bg-[#0F766E] hover:text-white transition-all duration-150"
          >
            Login
          </button>
        </div>

        {/* FOOTER */}
        <p className="text-center text-gray-400 text-sm mt-5">
          Discover PGs that feel like home
        </p>

      </div>
    </main>
  );
}