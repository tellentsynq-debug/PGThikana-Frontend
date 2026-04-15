"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "@/app/context/SnackbarContext";
export default function VendorOnboarding() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center px-6">

      {/* Main Card */}
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl flex overflow-hidden flex-col md:flex-row min-h-[550px]">

        {/* LEFT SIDE */}
        <div className="md:w-1/2 w-full bg-gradient-to-br from-[#0F766E] to-[#115E59] flex flex-col items-center justify-center p-10 text-center relative">

          {/* Glow Effect */}
          <div className="absolute w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>

          {/* Logo */}
          <div className="w-48 h-48 relative mb-6 z-10">
            <Image
              src="/pg_logo.png"
              alt="PG Logo"
              fill
              className="object-contain drop-shadow-xl"
            />
          </div>

          <h1 className="text-3xl font-bold text-white mb-2 z-10">
            PG Thikana Vendor
          </h1>

          <p className="text-gray-200 z-10">
            List your PG online and grow your business
          </p>
        </div>

        {/* RIGHT SIDE */}
        <div className="md:w-1/2 w-full flex flex-col justify-center p-10">

          <h2 className="text-3xl font-bold text-[#0F766E] mb-2">
            Get Started
          </h2>

          <p className="text-gray-500 mb-8">
            Manage your PG and reach more customers
          </p>

       <div className="flex flex-col gap-5">

  {/* Register */}
  <button
    onClick={() => router.push("/vendor/login")}
    className="w-full bg-[#0F766E] text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
  >
    Register PG
  </button>

  {/* Login */}
  <button
    onClick={() => router.push("/vendor/login")}
    className="w-full border-2 border-[#0F766E] text-[#0F766E] font-semibold py-4 rounded-xl hover:bg-[#0F766E] hover:text-white hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
  >
    Vendor Login
  </button>

</div>

          <p className="text-gray-400 text-sm mt-8">
            Reach thousands of potential customers effortlessly
          </p>
        </div>

      </div>
    </div>
  );
}