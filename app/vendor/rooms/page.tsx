"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { toast } from "@/app/context/SnackbarContext";
import { Suspense } from "react";

function RoomAmenitiesPage() {
  const router = useRouter();
  const params = useSearchParams();

  // 🔥 PREVIOUS DATA
  const phone = params.get("phone") || "";
  const otp = params.get("otp") || "";
  const firstName = params.get("firstName") || "";
  const lastName = params.get("lastName") || "";

  const place = params.get("place") || "";
  const propertyType = params.get("propertyType") || "";
  const sharingType = params.get("sharingType") || "";
  const rentType = params.get("rentType") || "";
  const pgType = params.get("pgType") || "";

  const name = params.get("name") || "";
  const address = params.get("address") || "";
  const description = params.get("description") || "";
  const rent = params.get("rent") || "";

  // 🔥 LOCAL STATE
  const [totalRooms, setTotalRooms] = useState("");
  const [availableRooms, setAvailableRooms] = useState("");
  const [bathroomType, setBathroomType] = useState<string>("private");
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  const amenitiesList = [
    "Bed",
    "Locker",
    "Wifi",
    "Food",
    "Air Conditioner",
    "Parking (2-Wheeler)",
    "Clothes Hangers",
    "Kitchen Platform",
    "House Keeping",
    "24/7 Water/Electricity",
    "CCTV Security",
  ];

  const isFormValid =
    totalRooms &&
    availableRooms &&
    Number(availableRooms) <= Number(totalRooms);

  const toggleAmenity = (item: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(item)
        ? prev.filter((i) => i !== item)
        : [...prev, item]
    );
  };

  // ✅ CORRECT: JUST NAVIGATE (NO API)
  const handleNext = () => {
    if (!isFormValid) return;

    router.push(
      `/vendor/manager?phone=${phone}&otp=${otp}&firstName=${firstName}&lastName=${lastName}&place=${place}&propertyType=${propertyType}&sharingType=${sharingType}&rentType=${rentType}&pgType=${pgType}&name=${name}&address=${address}&description=${description}&rent=${rent}&totalRooms=${totalRooms}&availableRooms=${availableRooms}&bathroomType=${bathroomType}&amenities=${encodeURIComponent(
        JSON.stringify(selectedAmenities)
      )}`
    );
  };

  return (
    <div className="min-h-screen bg-[#F5F0EB] flex justify-center px-4 py-6">
      <div className="w-full max-w-md">

        {/* BACK */}
        <button onClick={() => router.back()} className="mb-4 text-xl">
          ←
        </button>

        {/* LOGO */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 relative">
            <Image src="/pg_logo.png" alt="logo" fill />
          </div>
        </div>

        {/* STEP */}
        <p className="text-gray-600 text-sm mb-2">
          Step 6 / 8
        </p>

        {/* PROGRESS */}
        <div className="w-full h-2 bg-gray-300 rounded-full mb-6">
          <div className="w-[80%] h-full bg-[#0F766E] rounded-full"></div>
        </div>

        {/* TITLE */}
        <h2 className="text-2xl font-bold text-[#1A1A1A] mb-2">
          Rooms & Amenities 🏠
        </h2>

        <p className="text-gray-500 mb-6">
          Add facilities of your PG
        </p>

        {/* TOTAL ROOMS */}
        <Input label="Total Rooms" value={totalRooms} setValue={setTotalRooms} />

        {/* AVAILABLE ROOMS */}
        <Input label="Available Rooms" value={availableRooms} setValue={setAvailableRooms} />

        {/* BATHROOM */}
        <Label text="Bathroom Type" />
        <div className="flex gap-3 mb-6">
          <Option
            text="Private"
            selected={bathroomType === "private"}
            onClick={() => setBathroomType("private")}
          />
          <Option
            text="Shared"
            selected={bathroomType === "shared"}
            onClick={() => setBathroomType("shared")}
          />
        </div>

        {/* AMENITIES */}
        <Label text="Amenities" />
        <div className="flex flex-wrap gap-2 mb-6">
          {amenitiesList.map((item) => {
            const selected = selectedAmenities.includes(item);
            return (
              <button
                key={item}
                onClick={() => toggleAmenity(item)}
                className={`px-4 py-2 rounded-full border text-sm ${
                  selected
                    ? "bg-[#FFF3E6] border-[#0F766E] text-[#0F766E]"
                    : "bg-white border-gray-300 text-[#444]"
                }`}
              >
                {item}
              </button>
            );
          })}
        </div>

        {/* BUTTON */}
        <button
          onClick={handleNext}
          disabled={!isFormValid}
          className={`w-full py-4 rounded-xl font-semibold text-white ${
            isFormValid
              ? "bg-[#0F766E]"
              : "bg-gray-300 cursor-not-allowed"
          }`}
        >
          Continue →
        </button>

      </div>
    </div>
  );
}

/* COMPONENTS */

function Label({ text }: any) {
  return <p className="text-sm font-semibold text-[#1A1A1A] mb-2">{text}</p>;
}

function Input({ label, value, setValue }: any) {
  return (
    <>
      <Label text={label} />
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full mb-5 px-4 py-4 rounded-xl border border-gray-300 bg-white text-[#1A1A1A] outline-none focus:border-[#0F766E]"
      />
    </>
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
      <RoomAmenitiesPage />
    </Suspense>
  );
}