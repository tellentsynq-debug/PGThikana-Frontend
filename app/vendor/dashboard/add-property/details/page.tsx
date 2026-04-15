"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Select from "react-select";
import { setProperty } from "@/app/model/propertyStore";

export default function PreferencePage() {
  const router = useRouter();

  const [place, setPlace] = useState<any>(null);
  const [propertyType, setPropertyType] = useState("");
  const [sharingType, setSharingType] = useState("");
  const [rentType, setRentType] = useState("");
  const [pgCategory, setPgCategory] = useState("");

  const canContinue =
    place && propertyType && sharingType && rentType && pgCategory;

  const handleContinue = () => {
    setProperty({
      place: place.value,
      propertyType,
      sharingType,
      rentType,
      pgCategory,
    });

    router.push("/vendor/dashboard/add-property/property-info");
  };

  /* 🔥 INDIA CITY LIST (top cities + scalable) */
  const cityOptions = [
    "Delhi","Mumbai","Bangalore","Hyderabad","Chennai","Kolkata","Pune","Ahmedabad",
    "Jaipur","Lucknow","Kanpur","Nagpur","Indore","Bhopal","Surat","Vadodara",
    "Patna","Ranchi","Chandigarh","Coimbatore","Kochi","Visakhapatnam","Agra",
    "Varanasi","Meerut","Noida","Gurgaon","Ghaziabad"
  ].map(city => ({ label: city, value: city }));

  return (
    <div className="min-h-screen bg-[#F5F0EB] flex justify-center px-4 py-10">
      <div className="w-full max-w-2xl">

        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#1A1A1A]">
            Property Preferences
          </h1>
          <p className="text-[#666] mt-1">
            Step 1 of 4 — Setup your property basics
          </p>
        </div>

        {/* CARD */}
        <div className="bg-white rounded-3xl p-6 shadow-lg border border-[#eee] space-y-6">

          {/* LOCATION */}
          <div>
            <label className="text-sm font-semibold text-[#1A1A1A]">
              📍 Select City
            </label>

            <Select
              options={cityOptions}
              placeholder="Search your city..."
              value={place}
              onChange={(val) => setPlace(val)}
              className="mt-2"
              styles={{
                control: (base) => ({
                  ...base,
                  padding: "6px",
                  borderRadius: "12px",
                  borderColor: "#ddd",
                  boxShadow: "none",
                  "&:hover": { borderColor: "#0F766E" },
                }),
                option: (base, state) => ({
                  ...base,
                  backgroundColor: state.isFocused
                    ? "#0F766E"
                    : "white",
                  color: state.isFocused ? "white" : "#333",
                }),
              }}
            />
          </div>

          {/* PROPERTY TYPE */}
          <Section title="🏠 Property Type">
            <Option text="Hostel" selected={propertyType==="hostel"} onClick={()=>setPropertyType("hostel")} />
            <Option text="PG" selected={propertyType==="pg"} onClick={()=>setPropertyType("pg")} />
            <Option text="Room" selected={propertyType==="room"} onClick={()=>setPropertyType("room")} />
          </Section>

          {/* SHARING */}
          <Section title="👥 Sharing Type">
            {["1","2","3","4","5","6+"].map((s)=>(
              <Option key={s} text={`${s} Sharing`} selected={sharingType===s} onClick={()=>setSharingType(s)} />
            ))}
          </Section>

          {/* RENT TYPE */}
          <Section title="🛏️ Rent Type">
            <Option text="Full Room" selected={rentType==="room"} onClick={()=>setRentType("room")} />
            <Option text="Per Bed" selected={rentType==="bed"} onClick={()=>setRentType("bed")} />
          </Section>

          {/* PG CATEGORY */}
          <Section title="👨‍👩‍👧 PG Category">
            <Option text="Boys" selected={pgCategory==="boys"} onClick={()=>setPgCategory("boys")} />
            <Option text="Girls" selected={pgCategory==="girls"} onClick={()=>setPgCategory("girls")} />
            <Option text="Co-living" selected={pgCategory==="co"} onClick={()=>setPgCategory("co")} />
          </Section>

        </div>

        {/* CTA */}
        <button
          onClick={handleContinue}
          disabled={!canContinue}
          className={`w-full mt-6 py-4 rounded-2xl font-semibold text-white text-lg transition-all ${
            canContinue
              ? "bg-[#0F766E] hover:bg-[#0c6560] shadow-md hover:shadow-lg"
              : "bg-gray-300"
          }`}
        >
          Continue →
        </button>

      </div>
    </div>
  );
}

/* 🔹 SECTION */
function Section({ title, children }: any) {
  return (
    <div>
      <p className="text-sm font-semibold text-[#1A1A1A] mb-3">
        {title}
      </p>
      <div className="flex flex-wrap gap-3">{children}</div>
    </div>
  );
}

/* 🔹 OPTION */
function Option({ text, selected, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
        selected
          ? "bg-[#0F766E] text-white shadow-md scale-[1.03]"
          : "bg-[#fafafa] border border-[#ddd] text-[#444] hover:border-[#0F766E]"
      }`}
    >
      {text}
    </button>
  );
}