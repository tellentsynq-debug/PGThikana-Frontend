"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

type FormType = {
  propertyName: string;
  address: string;
  description: string;
  rent: string;
  rentType: "room" | "bed" | null;
  securityDeposit: string;
  takesSecurity: boolean | null;
};

export default function AddPropertyDetails() {
  const [form, setForm] = useState<FormType>({
    propertyName: "",
    address: "",
    description: "",
    rent: "",
    rentType: null,
    securityDeposit: "",
    takesSecurity: null,
  });

  const router = useRouter();

  const isFormFilled =
    form.propertyName &&
    form.address &&
    form.description &&
    form.rent &&
    form.rentType &&
    (form.takesSecurity === false ||
      (form.takesSecurity === true && form.securityDeposit));

  const update = (key: keyof FormType, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-[#F5F0EB] flex justify-center px-4 py-8">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-8">

        {/* HEADER */}
        <div className="flex items-center gap-3 mb-6">
          <button className="text-gray-700 text-xl">←</button>
          <h1 className="text-lg text-gray-600 font-medium">
            Step 2
          </h1>
        </div>

        {/* PROGRESS */}
        <div className="w-full h-2 bg-gray-200 rounded-full mb-8">
          <div className="w-[40%] h-full bg-[#0F766E] rounded-full" />
        </div>

        {/* TITLE */}
        <h2 className="text-2xl font-bold text-gray-900 mb-1">
          Property Information
        </h2>
        <p className="text-gray-500 mb-6">
          Enter details about your property
        </p>

        {/* FORM */}
        <div className="space-y-5">

          <Input
            label="PG / Hostel Name"
            value={form.propertyName}
            onChange={(v:any) => update("propertyName", v)}
            placeholder="Example – Shree Krishna PG"
          />

          <Input
            label="Address"
            value={form.address}
            onChange={(v:any) => update("address", v)}
          />

          <Textarea
            label="Description"
            value={form.description}
            onChange={(v:any) => update("description", v)}
          />

          {/* RENT TYPE */}
          <div>
            <label className="text-sm font-semibold text-gray-700">
              Rent Type
            </label>

            <div className="flex gap-3 mt-2">
              <OptionButton
                text="Full Room"
                selected={form.rentType === "room"}
                onClick={() => update("rentType", "room")}
              />
              <OptionButton
                text="Per Bed"
                selected={form.rentType === "bed"}
                onClick={() => update("rentType", "bed")}
              />
            </div>
          </div>

          <Input
            label="Rent per Month"
            value={form.rent}
            onChange={(v: any) => update("rent", v)}
            placeholder="₹ 5000"
          />

          {/* SECURITY */}
          <div>
            <label className="text-sm font-semibold text-gray-700">
              Do you take security deposit?
            </label>

            <div className="flex gap-3 mt-2">
              <OptionButton
                text="Yes"
                selected={form.takesSecurity === true}
                onClick={() => update("takesSecurity", true)}
              />
              <OptionButton
                text="No"
                selected={form.takesSecurity === false}
                onClick={() => {
                  update("takesSecurity", false);
                  update("securityDeposit", "");
                }}
              />
            </div>
          </div>

          {form.takesSecurity === true && (
            <Input
              label="Security Deposit Amount"
              value={form.securityDeposit}
              onChange={(v: any) => update("securityDeposit", v)}
            />
          )}

          {/* INFO BOX */}
          <div className="bg-orange-50 p-3 rounded-lg flex gap-2 text-sm">
            <span>ℹ️</span>
            <p className="text-gray-700">
              Security deposits are not handled through this platform. Any such amount must be discussed and settled directly between you and the tenant offline.
            </p>
          </div>
        </div>

        {/* BUTTON */}
<button
  onClick={() => {
    if (!isFormFilled) return;
    localStorage.setItem("propertyData", JSON.stringify(form));
    router.push("/vendor/dashboard/add-property/amenties"); // 🔥 change this route
  }}
  className={`w-full mt-8 h-14 rounded-xl font-semibold transition
  ${
    isFormFilled
      ? "bg-[#0F766E] text-white hover:bg-[#0d5f58]"
      : "bg-[#0F766E]/40 text-white cursor-not-allowed"
  }`}
>
  Next
</button>
      </div>
    </div>
  );
}

/* ================= COMPONENTS ================= */

function Input({
  label,
  value,
  onChange,
  placeholder,
}: any) {
  return (
    <div>
      <label className="text-sm font-semibold text-gray-700">
        {label}
      </label>
      <input
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full mt-1 px-4 py-3 rounded-lg border border-gray-300 
        bg-white text-gray-900 placeholder:text-gray-400
        focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/20 outline-none"
      />
    </div>
  );
}

function Textarea({ label, value, onChange }: any) {
  return (
    <div>
      <label className="text-sm font-semibold text-gray-700">
        {label}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full mt-1 px-4 py-3 rounded-lg border border-gray-300 
        bg-white text-gray-900 placeholder:text-gray-400
        focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/20 outline-none min-h-[100px]"
      />
    </div>
  );
}

function OptionButton({ text, selected, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 h-12 rounded-lg border-2 font-semibold transition
      ${
        selected
          ? "border-[#0F766E] bg-orange-50 text-[#0F766E]"
          : "border-gray-300 bg-white text-gray-600"
      }`}
    >
      {text}
    </button>
  );
}