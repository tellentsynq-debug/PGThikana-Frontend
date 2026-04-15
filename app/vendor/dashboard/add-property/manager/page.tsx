"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getProperty, setProperty } from "@/app/model/propertyStore";
import { toast } from "@/app/context/SnackbarContext";

export default function ManagerPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  /* ✅ VALIDATION (MATCH FLUTTER) */
  const isValidEmail = (email: string) => {
    return /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);
  };

  const isFormFilled =
    name.trim() !== "" &&
    phone.trim() !== "" &&
    email.trim() !== "";

  /* ✅ HANDLE CONTINUE */
  const handleNext = () => {
    if (phone.length !== 10) {
      toast("Enter valid phone number");
      return;
    }

    if (!isValidEmail(email)) {
      toast("Enter valid email");
      return;
    }

    const prev = getProperty();

    const updated = {
      ...prev,
      managerName: name,
      managerPhone: phone,
      managerEmail: email,
    };

    setProperty(updated);

    /* ✅ SAME FLOW AS FLUTTER */
    if (prev.propertyType?.toLowerCase() === "pg") {
      router.push("/vendor/dashboard/add-property/add-food-menu/");
    } else {
      router.push("/vendor/dashboard/add-property/images");
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F0EB] flex justify-center px-4 py-8">
      <div className="w-full max-w-md">

        {/* 🔙 BACK */}
        <button onClick={() => router.back()} className="mb-4 text-xl">
          ←
        </button>

        {/* STEP */}
        <p className="text-sm text-[#555] font-medium mb-2">
          Step 4
        </p>

        {/* PROGRESS */}
        <div className="w-full h-2 bg-gray-200 rounded-full mb-6 overflow-hidden">
          <div className="h-full w-full bg-[#0F766E]" />
        </div>

        {/* TITLE */}
        <h1 className="text-2xl font-extrabold text-[#1A1A1A] mb-2">
          Property Manager
        </h1>

        <p className="text-sm text-[#888] mb-6">
          This information will be visible after booking
        </p>

        {/* NAME */}
        <Label>Manager Name</Label>
        <Input
          value={name}
          onChange={setName}
          placeholder="Example – Rajesh Sharma"
        />

        {/* PHONE */}
        <Label>Phone Number</Label>
        <Input
          value={phone}
          onChange={(val) => {
            const digits = val.replace(/\D/g, "");
            if (digits.length <= 10) setPhone(digits);
          }}
          placeholder="Example – 9876543210"
          type="tel"
        />

        {/* EMAIL */}
        <Label>Email Address</Label>
        <Input
          value={email}
          onChange={setEmail}
          placeholder="example@email.com"
          type="email"
        />

        {/* ERROR */}
        {!isFormFilled && (
          <p className="text-sm text-red-500 mt-2">
            Please fill all fields
          </p>
        )}

        {/* BUTTON */}
        <button
          onClick={handleNext}
          disabled={!isFormFilled}
          className="w-full mt-6 py-4 rounded-xl font-bold text-white transition bg-[#0F766E] hover:bg-[#0c6560] disabled:bg-[#0F766E]/40 disabled:cursor-not-allowed"
        >
          Continue
        </button>

      </div>
    </div>
  );
}

/* 🔹 LABEL */
function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-sm font-semibold text-[#1A1A1A] mb-2 mt-4">
      {children}
    </p>
  );
}

/* 🔹 INPUT */
function Input({
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  type?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full p-4 rounded-xl border border-[#E5E5E5] bg-white text-[#1A1A1A] focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/20 outline-none"
      placeholder={placeholder}
    />
  );
}