"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getProperty, setProperty } from "@/app/model/propertyStore";
import { toast } from "@/app/context/SnackbarContext";

export default function AmenitiesPage() {
  const router = useRouter();

  const [totalRooms, setTotalRooms] = useState("");
  const [availableRooms, setAvailableRooms] = useState("");
  const [bathroomType, setBathroomType] = useState<"private" | "shared">("private");
  const [amenities, setAmenities] = useState<string[]>([]);

  /* ✅ EXACT SAME KEYS AS FLUTTER */
  const amenitiesKeys = [
    "bed",
    "locker",
    "wifi",
    "food",
    "air_conditioner",
    "parking_2w",
    "clothes_hangers",
    "kitchen_platform",
    "house_keeping",
    "water_electricity_24_7",
    "cctv_security",
  ];

  /* ✅ LABEL MAPPING (LIKE l10n) */
  const amenityLabels: Record<string, string> = {
    bed: "Bed",
    locker: "Locker",
    wifi: "WiFi",
    food: "Food",
    air_conditioner: "AC",
    parking_2w: "Parking",
    clothes_hangers: "Hanger",
    kitchen_platform: "Kitchen",
    house_keeping: "Housekeeping",
    water_electricity_24_7: "24x7 Water/Electricity",
    cctv_security: "CCTV",
  };

  const toggle = (key: string) => {
    setAmenities((prev) =>
      prev.includes(key)
        ? prev.filter((i) => i !== key)
        : [...prev, key]
    );
  };

  const isValid =
    totalRooms &&
    availableRooms &&
    Number(availableRooms) <= Number(totalRooms);

  const handleNext = () => {
    const prev = getProperty();

    setProperty({
      ...prev,
      totalRooms: Number(totalRooms),
      availableRooms: Number(availableRooms),
      bathroomType,
      amenities,
    });

    router.push("/vendor/dashboard/add-property/manager");
  };

  return (
    <div className="min-h-screen bg-[#F5F0EB] flex justify-center px-4 py-8">
      <div className="w-full max-w-md">

        {/* 🔙 BACK */}
        <button
          onClick={() => router.back()}
          className="mb-4 text-xl"
        >
          ←
        </button>

        {/* 🔥 HEADER */}
        <p className="text-sm text-[#555] font-medium mb-2">
          Step 3
        </p>

        <div className="w-full h-2 bg-gray-200 rounded-full mb-6 overflow-hidden">
          <div className="h-full w-[60%] bg-[#0F766E]" />
        </div>

        <h1 className="text-2xl font-extrabold text-[#1A1A1A] mb-2">
          Rooms & Amenities
        </h1>

        <p className="text-sm text-[#888] mb-6">
          Add room details and facilities available
        </p>

        {/* TOTAL ROOMS */}
        <Label>Total Rooms</Label>
        <Input value={totalRooms} onChange={setTotalRooms} />

        {/* AVAILABLE ROOMS */}
        <Label>Available Rooms</Label>
        <Input value={availableRooms} onChange={setAvailableRooms} />

        {/* BATHROOM TYPE */}
        <Label>Bathroom Type</Label>
        <div className="flex gap-3 mb-6">
          <Option
            text="Private Bathroom"
            selected={bathroomType === "private"}
            onClick={() => setBathroomType("private")}
          />
          <Option
            text="Shared Bathroom"
            selected={bathroomType === "shared"}
            onClick={() => setBathroomType("shared")}
          />
        </div>

        {/* AMENITIES */}
        <Label>Amenities</Label>

        <div className="flex flex-wrap gap-2 mb-8">
          {amenitiesKeys.map((key) => {
            const selected = amenities.includes(key);

            return (
              <button
                key={key}
                onClick={() => toggle(key)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold border-2 transition ${
                  selected
                    ? "bg-[#FFF3E6] border-[#0F766E] text-[#0F766E]"
                    : "bg-white border-[#E0E0E0] text-[#444]"
                }`}
              >
                {amenityLabels[key]}
              </button>
            );
          })}
        </div>

        {/* ERROR */}
        {!isValid && (
          <p className="text-sm text-red-500 mb-4">
            Available rooms cannot exceed total rooms
          </p>
        )}

        {/* BUTTON */}
       <button
  onClick={handleNext}
  disabled={!isValid}
  className={`w-full py-4 rounded-xl font-bold text-white transition ${
    isValid
      ? "bg-[#0F766E] hover:bg-[#0c6560]"
      : "bg-[#0F766E]/40 cursor-not-allowed"
  }`}
>
  Complete Listing
</button>
      </div>
    </div>
  );
}

/* COMPONENTS */

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-sm font-semibold text-[#1A1A1A] mb-2 mt-4">
      {children}
    </p>
  );
}

function Input({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      type="number"
   className="w-full p-4 rounded-xl border border-[#E5E5E5] bg-white text-black font-semibold placeholder:text-gray-400 focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/20 outline-none"
      placeholder="Enter number"
    />
  );
}

function Option({
  text,
  selected,
  onClick,
}: {
  text: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 py-3 rounded-xl border-2 font-semibold transition ${
        selected
          ? "bg-[#FFF3E6] border-[#0F766E] text-[#0F766E]"
          : "bg-white border-[#E0E0E0] text-[#444]"
      }`}
    >
      {text}
    </button>
  );
}