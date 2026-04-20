"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/app/context/SnackbarContext";
import { ArrowBigLeftIcon, ArrowLeft } from "lucide-react";

const API_BASE = "https://pgthikana.in/api";

export default function ProfilePage() {
  const router = useRouter();

  const [user, setUser] = useState<any>({});
  const [loading, setLoading] = useState(true);

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("userToken")
      : null;

  useEffect(() => {
    fetchProfile();
  }, []);

const fetchProfile = async () => {
  try {
    const token = localStorage.getItem("userToken");

    if (!token) {
      router.replace("/user"); // not logged in
      return;
    }

    const res = await fetch(`${API_BASE}/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (data.success) {
      setUser(data.user);
    } else {
      toast("Failed to load profile");
    }

    setLoading(false);
  } catch (err) {
    console.error(err);
    setLoading(false);
  }
};

const logout = () => {
  // clear only auth-related data (safer)
  localStorage.removeItem("userToken");
  localStorage.removeItem("user");

  // optional: clear everything if you want
  // localStorage.clear();

  // redirect properly
  router.replace("/"); // or "/user/create-account"

  // force refresh so sidebar + state reset
  setTimeout(() => {
    window.location.reload();
  }, 100);
};

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-white text-black">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">

      {/* 🔥 HEADER */}
      <div className="bg-white border-b px-4 py-3 flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center shadow"
        >
          <ArrowLeft></ArrowLeft>
        </button>

        <h1 className="text-lg font-semibold text-black">
          Profile
        </h1>
      </div>

      {/* 🔥 CONTENT */}
      <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">

        {/* PROFILE CARD */}
        <div className="bg-white rounded-2xl shadow-sm p-6 text-center">

          <div className="w-20 h-20 mx-auto rounded-full bg-gray-100 overflow-hidden flex items-center justify-center">
            {user.profile_image ? (
              <img
                src={user.profile_image}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-2xl text-teal-700 font-bold">
                {user.name?.[0]}
              </span>
            )}
          </div>

          <h2 className="mt-3 text-xl font-bold text-gray-900">
            {user.name}
          </h2>

          <p className="text-gray-600">
            {user.phone}
          </p>
        </div>

        {/* BASIC INFO */}
        <div className="bg-white rounded-2xl shadow-sm p-5 space-y-4">

          <h3 className="font-semibold text-gray-900">
            Basic Information
          </h3>

          <Info label="Phone" value={user.phone} />
          <Info label="Email" value={user.email} />
          <Info label="City" value={user.place} />
          <Info label="Address" value={user.address} />
          <Info label="Emergency" value={user.emergency_number} />
          <Info label="Food Preference" value={user.food_preference} />

        </div>

        {/* DOCUMENT */}
        <div
          onClick={() => router.push("/user/home/profile/document")}
          className="bg-white rounded-2xl shadow-sm p-5 flex justify-between items-center cursor-pointer hover:bg-gray-50"
        >
          <div className="flex items-center gap-3">
            <span className="text-teal-700 text-lg">✔</span>
            <p className="text-gray-900 font-medium">
              Document Verification
            </p>
          </div>

          <span>›</span>
        </div>

        {/* SETTINGS */}
        <div className="bg-white rounded-2xl shadow-sm">

          <button
            className="w-full flex justify-between items-center px-5 py-4 hover:bg-gray-50"
            onClick={() => {
              toast("Language change modal (implement if needed)");
            }}
          >
            <div className="flex items-center gap-3">
              <span className="text-teal-700">🌐</span>
              <span className="text-gray-900">
                Change Language
              </span>
            </div>

            <span>›</span>
          </button>

        </div>

        {/* LOGOUT */}
        <button
          onClick={logout}
          className="w-full border border-red-500 text-red-600 py-3 rounded-xl font-semibold hover:bg-red-50"
        >
          Logout
        </button>

      </div>
    </div>
  );
}

/* 🔹 INFO COMPONENT */
function Info({ label, value }: any) {
  if (!value) return null;

  return (
    <div className="flex justify-between">
      <span className="text-gray-500">{label}</span>
      <span className="text-gray-900 font-medium">{value}</span>
    </div>
  );
}