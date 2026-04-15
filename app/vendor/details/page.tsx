"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { toast } from "@/app/context/SnackbarContext";
import { Suspense } from "react";

function PgDetailsPage() {
  const router = useRouter();
  const params = useSearchParams();

  // 🔥 DATA FROM PREVIOUS STEPS
  const phone = params.get("phone") || "";
  const otp = params.get("otp") || "";
  const firstName = params.get("firstName") || "";
  const lastName = params.get("lastName") || "";
  const place = params.get("place") || "";
  const propertyType = params.get("propertyType") || "";
  const sharingType = params.get("sharingType") || "";
  const rentTypePrev = params.get("rentType") || "";
  const pgType = params.get("pgType") || "";

  // 🔥 LOCAL STATE
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [rent, setRent] = useState("");
  const [rentType, setRentType] = useState<string | null>(rentTypePrev || null);

  const isFormValid =
    name && address && description && rent && rentType;

  const handleNext = () => {
    if (!isFormValid) return;

    // 👉 Pass everything forward (FINAL STEP COMING NEXT)
    router.push(
      `/vendor/rooms?phone=${phone}&otp=${otp}&firstName=${firstName}&lastName=${lastName}&place=${place}&propertyType=${propertyType}&sharingType=${sharingType}&rentType=${rentType}&pgType=${pgType}&name=${name}&address=${address}&description=${description}&rent=${rent}`
    );
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
        <p className="text-gray-600 text-sm mb-2">
          Step 5 / 8
        </p>

        {/* Progress */}
        <div className="w-full h-2 bg-gray-300 rounded-full mb-6">
          <div className="w-[70%] h-full bg-[#0F766E] rounded-full"></div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-[#1A1A1A] mb-2">
          PG Information ✨
        </h2>

        <p className="text-gray-500 mb-6">
          Fill complete details about your PG
        </p>

        {/* NAME */}
        <Label text="PG / Hostel Name" />
        <Input value={name} setValue={setName} placeholder="e.g. Shree Krishna PG" />

        {/* ADDRESS */}
        <Label text="Address" />
        <Input value={address} setValue={setAddress} placeholder="Enter full address" />

        {/* DESCRIPTION */}
        <Label text="Description" />
        <Input
          value={description}
          setValue={setDescription}
          placeholder="Describe your PG"
          multiline
        />

        {/* RENT TYPE */}
        <Label text="Rent Type" />
        <div className="flex gap-3 mb-5">
          <Option
            text="Full Room"
            selected={rentType === "room"}
            onClick={() => setRentType("room")}
          />
          <Option
            text="Per Bed"
            selected={rentType === "bed"}
            onClick={() => setRentType("bed")}
          />
        </div>

        {/* RENT */}
        <Label text="Monthly Rent" />
        <Input
          value={rent}
          setValue={setRent}
          placeholder="₹ e.g. 5000"
          type="number"
        />

        {/* BUTTON */}
        <button
          onClick={handleNext}
          disabled={!isFormValid}
          className={`w-full mt-8 py-4 rounded-xl font-semibold text-white ${
            isFormValid
              ? "bg-[#0F766E]"
              : "bg-gray-300 cursor-not-allowed"
          }`}
        >
          Submit PG →
        </button>
      </div>
    </div>
  );
}

/* ---------- COMPONENTS ---------- */

function Label({ text }: { text: string }) {
  return (
    <p className="text-sm font-semibold text-[#1A1A1A] mb-2">
      {text}
    </p>
  );
}

function Input({
  value,
  setValue,
  placeholder,
  multiline = false,
  type = "text",
}: any) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder={placeholder}
      className="w-full mb-5 px-4 py-4 rounded-xl border border-gray-300 bg-white text-[#1A1A1A] outline-none focus:border-[#0F766E]"
      style={multiline ? { height: 100 } : {}}
    />
  );
}

function Option({ text, selected, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 py-3 rounded-xl border-2 text-sm font-semibold ${
        selected
          ? "border-[#0F766E] bg-[#FFF3E6] text-[#0F766E]"
          : "border-gray-300 bg-white text-[#444]"
      }`}
    >
      {text}
    </button>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PgDetailsPage />
    </Suspense>
  );
}