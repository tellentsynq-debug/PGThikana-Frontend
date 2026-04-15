"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "@/app/context/SnackbarContext";
import Image from "next/image";
import { Suspense } from "react";
function VendorPreferences() {
  const router = useRouter();
  const params = useSearchParams();

  const phone = params.get("phone") || "";
  const otp = params.get("otp") || "";
  const firstName = params.get("firstName") || "";
  const lastName = params.get("lastName") || "";

  const [place, setPlace] = useState<string | null>(null);
  const [propertyType, setPropertyType] = useState<string | null>(null);
  const [sharingType, setSharingType] = useState<string | null>(null);
  const [rentType, setRentType] = useState<string | null>(null);
  const [pgType, setPgType] = useState<string | null>(null);

  const isFormValid =
    place && propertyType && sharingType && rentType && pgType;

  const handleNext = () => {
    if (!isFormValid) return;

    router.push(
      `/vendor/details?phone=${phone}&otp=${otp}&firstName=${firstName}&lastName=${lastName}&place=${place}&propertyType=${propertyType}&sharingType=${sharingType}&rentType=${rentType}&pgType=${pgType}`
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
        <p className="text-gray-600 text-sm mb-2 font-medium">
          Step 4 / 8
        </p>

        {/* Progress */}
        <div className="w-full h-2 bg-gray-300 rounded-full mb-6">
          <div className="w-[60%] h-full bg-[#0F766E] rounded-full"></div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-[#1A1A1A] mb-2">
          PG Details ✨
        </h2>

        <p className="text-gray-500 mb-6">
          Fill details about your PG
        </p>

        {/* LOCATION */}
        <Section title="Location">
      <select
  value={place || ""}
  onChange={(e) => setPlace(e.target.value)}
  className="w-full px-4 py-4 rounded-xl border border-gray-300 bg-white text-[#1A1A1A] outline-none focus:border-[#0F766E] appearance-none [&>option]:text-black"
>
  <option value="">Select city</option>
  <option>Ahmedabad</option>
  <option>Surat</option>
  <option>Vadodara</option>
  <option>Rajkot</option>
</select>
        </Section>

        {/* PROPERTY TYPE */}
        <Section title="What do you want to rent?">
          <OptionRow
            options={[
              ["Hostel", "hostel"],
              ["PG", "pg"],
              ["Room", "room"],
            ]}
            selected={propertyType}
            setSelected={setPropertyType}
          />
        </Section>

        {/* SHARING */}
        <Section title="Sharing Type">
          <select
  value={sharingType || ""}
  onChange={(e) => setSharingType(e.target.value)}
  className="w-full px-4 py-4 rounded-xl border border-gray-300 bg-white text-[#1A1A1A] outline-none focus:border-[#0F766E] appearance-none"
>
  <option value="" className="text-[#1A1A1A]">
    Select sharing
  </option>
  <option className="text-[#1A1A1A]">Private</option>
  <option className="text-[#1A1A1A]">2 Sharing</option>
  <option className="text-[#1A1A1A]">3 Sharing</option>
  <option className="text-[#1A1A1A]">4 Sharing</option>
  <option className="text-[#1A1A1A]">5 Sharing</option>
  <option className="text-[#1A1A1A]">6+ Sharing</option>
</select>
        </Section>

        {/* RENT TYPE */}
        <Section title="Rent Type">
          <OptionRow
            options={[
              ["Full Room", "room"],
              ["Bed Only", "bed"],
            ]}
            selected={rentType}
            setSelected={setRentType}
          />
        </Section>

        {/* PG TYPE */}
        <Section title="PG Type">
          <OptionRow
            options={[
              ["Boys", "boys"],
              ["Girls", "girls"],
              ["Co-Living", "co"],
            ]}
            selected={pgType}
            setSelected={setPgType}
          />
        </Section>

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
          List Your PG →
        </button>

      </div>
    </div>
  );
}

function Section({ title, children }: any) {
  return (
    <div className="mb-6">
      <h3 className="text-sm font-semibold text-[#1A1A1A] mb-2">
        {title}
      </h3>
      {children}
    </div>
  );
}

function OptionRow({
  options,
  selected,
  setSelected,
}: any) {
  return (
    <div className="flex gap-3">
      {options.map(([label, value]: any) => (
        <button
          key={value}
          onClick={() => setSelected(value)}
          className={`flex-1 py-3 rounded-xl border-2 text-sm font-semibold transition ${
            selected === value
              ? "border-[#0F766E] bg-[#FFF3E6] text-[#0F766E]"
              : "border-gray-300 bg-white text-[#444]"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VendorPreferences />
    </Suspense>
  );
}