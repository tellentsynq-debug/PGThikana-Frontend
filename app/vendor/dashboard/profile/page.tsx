"use client";

import { useEffect, useState } from "react";

interface Vendor {
  id: number;
  name: string;
  email: string;
  phone: string;
}

export default function VendorProfilePage() {
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [loading, setLoading] = useState(true);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("vendorToken") : null;

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch(
        "https://pgthikana.in/api/vendor/profile",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (res.status === 200 && data.success) {
        setVendor(data.vendor);
      }
    } catch (e) {
      console.error(e);
    }

    setLoading(false);
  };

  const logout = () => {
    localStorage.removeItem("vendorToken");
    window.location.href = "/"; // redirect to welcome/login
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F0EB]">
        <div className="animate-spin h-8 w-8 border-4 border-[#0F766E] border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F0EB] px-6 py-8">
      <div className="max-w-3xl mx-auto">

        {/* HEADER */}
        <h1 className="text-2xl font-bold text-[#1A1A1A] mb-6">
          👤 Vendor Profile
        </h1>

        {/* PROFILE CARD */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6 flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-[#FFF3E6] flex items-center justify-center text-2xl text-[#0F766E]">
            👤
          </div>

          <div className="flex-1">
            <p className="text-lg font-bold text-[#1A1A1A]">
              {vendor?.name || ""}
            </p>
            <p className="text-sm text-[#555]">
              {vendor?.email || ""}
            </p>
          </div>

          <button className="bg-[#FFF3E6] p-2 rounded-lg text-[#0F766E]">
            ✏️
          </button>
        </div>

        {/* INFO CARDS */}
        <div className="space-y-3 mb-6">

          <InfoTile
            icon="📞"
            title="Phone Number"
            value={vendor?.phone}
          />

          <InfoTile
            icon="📧"
            title="Email"
            value={vendor?.email}
          />

          <InfoTile
            icon="🆔"
            title="Vendor ID"
            value={vendor?.id?.toString()}
          />

        </div>

        {/* LANGUAGE */}
        <div className="bg-white rounded-2xl p-4 mb-6 flex justify-between items-center">
          <p className="text-[#1A1A1A] font-medium">🌐 Language</p>

          <select className="border rounded-lg px-3 py-1 text-sm text-[#1A1A1A]">
            <option>English</option>
            <option>हिंदी</option>
          </select>
        </div>

        {/* ACTIONS */}
        <div className="bg-white rounded-2xl p-4">

          <button
            onClick={logout}
            className="w-full flex items-center justify-between text-[#0F766E] font-medium"
          >
            <span>🚪 Logout</span>
          </button>

        </div>

      </div>
    </div>
  );
}

// 🔹 REUSABLE TILE
function InfoTile({
  icon,
  title,
  value,
}: {
  icon: string;
  title: string;
  value?: string;
}) {
  return (
    <div className="bg-white rounded-xl p-4 flex items-center gap-3 shadow-sm">
      <div className="w-9 h-9 rounded-full bg-[#FFF3E6] flex items-center justify-center text-[#0F766E]">
        {icon}
      </div>

      <div>
        <p className="text-xs text-[#666]">{title}</p>
        <p className="text-[15px] font-semibold text-[#1A1A1A]">
          {value || "-"}
        </p>
      </div>
    </div>
  );
}