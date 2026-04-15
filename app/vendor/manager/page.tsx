"use client";

import { useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { toast } from "@/app/context/SnackbarContext";

export default function PropertyManagerPage() {
  const router = useRouter();
  const params = useSearchParams();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const phone = params.get("phone") || "";
  const otp = params.get("otp") || "";
  const firstName = params.get("firstName") || "";
  const lastName = params.get("lastName") || "";

  const [name, setName] = useState("");
  const [phoneInput, setPhoneInput] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  // ✅ VALIDATION
  const isValidEmail = (email: string) =>
    /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);

  const isFormValid =
    name &&
    phoneInput.length === 10 &&
    isValidEmail(email) &&
    image;

  // 📸 HANDLE IMAGE
  const handleImage = (e: any) => {
    const file = e.target.files[0];
    if (file) setImage(file);
  };

  // 🔥 FINAL SIGNUP API
  const signupVendor = async () => {
    if (!isFormValid) return;

    setLoading(true);

    try {
      const fullName = `${firstName} ${lastName}`;

      const formData = new FormData();
      formData.append("phoneNumber", phone);
      formData.append("otp", otp);
      formData.append("name", fullName);
      formData.append("email", email);

      if (image) {
        formData.append("profileImage", image);
      }

      const res = await fetch(
        "https://pgthikana.in/api/vendor/signup",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();

      if (res.status === 201 && data.success) {
        localStorage.setItem("token", data.token);

        toast("Signup successful 🎉");

        router.push("/vendor/images");
        return;
      }

      toast(data.message || "Signup failed");

    } catch (err) {
      toast("Network error");
    } finally {
      setLoading(false);
    }
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
        <p className="text-gray-600 text-sm mb-2">Step 7 / 8</p>

        {/* PROGRESS */}
        <div className="w-full h-2 bg-gray-300 rounded-full mb-6">
          <div className="w-[90%] h-full bg-[#0F766E] rounded-full"></div>
        </div>

        {/* TITLE */}
        <h2 className="text-2xl font-bold text-[#1A1A1A] mb-2">
          Property Manager Details 👤
        </h2>

        <p className="text-gray-500 mb-6">
          This info will be visible after booking
        </p>

        {/* NAME */}
        <Input label="Manager Name" value={name} setValue={setName} />

        {/* PHONE */}
        <Input
          label="Phone Number"
          value={phoneInput}
          setValue={(v: string) =>
            setPhoneInput(v.replace(/\D/g, "").slice(0, 10))
          }
        />

        {/* EMAIL */}
        <Input label="Email Address" value={email} setValue={setEmail} />

        {/* 🔥 CUSTOM FILE UPLOAD */}
        <p className="text-sm font-semibold text-[#1A1A1A] mb-2">
          Upload Selfie
        </p>

        <div
          onClick={() => fileInputRef.current?.click()}
          className="w-full h-32 border border-gray-300 rounded-xl bg-white flex items-center justify-center cursor-pointer hover:border-[#0F766E] transition mb-4"
        >
          {!image ? (
            <span className="text-gray-500 flex items-center gap-2">
              📷 Click to upload selfie
            </span>
          ) : (
            <img
              src={URL.createObjectURL(image)}
              className="w-full h-full object-cover rounded-xl"
            />
          )}
        </div>

        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          onChange={handleImage}
          className="hidden"
        />

        {/* REMOVE IMAGE */}
        {image && (
          <button
            onClick={() => setImage(null)}
            className="text-sm text-red-500 mb-4"
          >
            Remove image
          </button>
        )}

        {/* BUTTON */}
        <button
          onClick={signupVendor}
          disabled={!isFormValid || loading}
          className={`w-full py-4 rounded-xl font-semibold text-white transition ${
            isFormValid
              ? "bg-[#0F766E]"
              : "bg-gray-300 cursor-not-allowed"
          }`}
        >
          {loading ? "Submitting..." : "Complete Listing →"}
        </button>

      </div>
    </div>
  );
}

/* INPUT COMPONENT */

function Input({ label, value, setValue }: any) {
  return (
    <>
      <p className="text-sm font-semibold text-[#1A1A1A] mb-2">
        {label}
      </p>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full mb-5 px-4 py-4 rounded-xl border border-gray-300 bg-white text-[#1A1A1A] outline-none focus:border-[#0F766E]"
      />
    </>
  );
}