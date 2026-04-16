"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useState } from "react";
import Image from "next/image";
import { toast } from "@/app/context/SnackbarContext";

export default function PreferencePage() {
  const router = useRouter();
const [phone, setPhone] = useState("");
const [otp, setOtp] = useState("");
const [gender, setGenderParam] = useState("");
const [firstName, setFirstNameParam] = useState("");
const [lastName, setLastNameParam] = useState("");

useEffect(() => {
  const params = new URLSearchParams(window.location.search);

  setPhone(params.get("phone") || "");
  setOtp(params.get("otp") || "");
  setGenderParam(params.get("gender") || "");
  setFirstNameParam(params.get("firstName") || "");
  setLastNameParam(params.get("lastName") || "");
}, []);
  const [place, setPlace] = useState<string | null>(null);
  const [propertyType, setPropertyType] = useState<string | null>(null);
  const [sharing, setSharing] = useState<string | null>(null);
  const [rentType, setRentType] = useState<string | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const isValid =
    place && propertyType && sharing && rentType && image;

  const places = ["Ahmedabad", "Surat", "Vadodara", "Rajkot"];

  // 📸 IMAGE PICK
  const handleImage = (e: any) => {
    if (e.target.files?.[0]) {
      setImage(e.target.files[0]);
    }
  };

  // 🔥 API CALL (MULTIPART)
  const signup = async () => {
    if (!isValid) return;

    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("phoneNumber", phone);
      formData.append("otp", otp);
      formData.append("name", `${firstName} ${lastName}`);
      formData.append("gender", gender);
      formData.append("place", place!);
      formData.append("foodPreference", "veg");

      if (image) {
        formData.append("profileImage", image);
      }

      const res = await fetch("https://pgthikana.in/api/signup", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.status === 200 || res.status === 201) {
        localStorage.setItem("userToken", data.token); // ✅ FIXED TOKEN KEY
        router.push("/user/home"); // ✅ FIXED ROUTE
      } else {
        toast(data.message || "Signup failed");
      }
    } catch (err) {
      console.error(err);
      toast("Network error");
    }

    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-[#F5F0EB] flex flex-col items-center py-10 px-4">

      {/* LOGO */}
      <div className="mb-6 text-center">
        <div className="bg-white p-4 rounded-2xl shadow-md inline-block">
          <Image src="/pg_logo.png" alt="logo" width={60} height={60} />
        </div>
        <h1 className="mt-3 text-xl font-bold text-[#0F766E]">
          PG Thikana
        </h1>
      </div>

      {/* CARD */}
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl p-8 space-y-6">

        <h2 className="text-2xl font-bold text-gray-900">
          Your Preferences ✨
        </h2>

        {/* LOCATION */}
        <div>
          <label className="font-semibold text-gray-700">
            Preferred Location
          </label>

          <select
            value={place || ""}
            onChange={(e) => setPlace(e.target.value)}
            className="w-full mt-2 p-3 rounded-xl border text-black bg-white"
          >
            <option value="">Select location</option>
            {places.map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
        </div>

        {/* PROPERTY TYPE */}
        <div>
          <label className="font-semibold text-gray-700">
            What are you looking for?
          </label>

          <div className="flex gap-3 mt-3">
            {["Hostel", "PG", "Room"].map((item) => (
              <button
                key={item}
                onClick={() => setPropertyType(item)}
                className={`flex-1 p-3 rounded-xl border-2
                ${
                  propertyType === item
                    ? "border-[#0F766E] text-[#0F766E]"
                    : "border-gray-300 text-gray-600"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* SHARING */}
        <div>
          <label className="font-semibold text-gray-700">
            Sharing Type
          </label>

          <select
            value={sharing || ""}
            onChange={(e) => setSharing(e.target.value)}
            className="w-full mt-2 p-3 rounded-xl border text-black bg-white"
          >
            <option value="">Select sharing</option>
            <option>Private</option>
            <option>2 Sharing</option>
            <option>3 Sharing</option>
            <option>4 Sharing</option>
            <option>5 Sharing</option>
          </select>
        </div>

        {/* RENT TYPE */}
        <div>
          <label className="font-semibold text-gray-700">
            Rent Type
          </label>

          <div className="flex gap-3 mt-3">
            {["room", "bed"].map((r) => (
              <button
                key={r}
                onClick={() => setRentType(r)}
                className={`flex-1 p-3 rounded-xl border-2
                ${
                  rentType === r
                    ? "border-[#0F766E] text-[#0F766E]"
                    : "border-gray-300 text-gray-600"
                }`}
              >
                {r === "room" ? "Full Room" : "Bed Only"}
              </button>
            ))}
          </div>
        </div>

        {/* IMAGE */}
        <div>
          <label className="font-semibold text-gray-700">
            Upload Profile Image
          </label>

          {/* 🔥 CUSTOM FILE UPLOAD */}
<label className="mt-2 block cursor-pointer">

  <input
    type="file"
    accept="image/*"
    onChange={handleImage}
    className="hidden"
  />

  <div className="w-full h-12 flex items-center justify-center rounded-xl border-2 border-dashed border-gray-300 text-gray-600 hover:border-[#0F766E] hover:text-[#0F766E] transition">
    Upload Profile Image
  </div>

</label>

          {image && (
            <img
              src={URL.createObjectURL(image)}
              className="mt-3 h-24 rounded-lg object-cover"
            />
          )}
        </div>

        {/* BUTTON */}
        <button
          onClick={signup}
          disabled={!isValid || loading}
          className={`w-full h-[56px] rounded-xl text-lg font-semibold
          ${
            isValid
              ? "bg-[#0F766E] text-white hover:bg-[#0d5f59]"
              : "bg-gray-300 text-gray-600"
          }`}
        >
          {loading ? "Creating Account..." : "Start"}
        </button>

      </div>
    </main>
  );
}