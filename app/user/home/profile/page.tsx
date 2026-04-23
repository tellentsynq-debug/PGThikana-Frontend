"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/app/context/SnackbarContext";
import { ArrowLeft, Mail, Phone, MapPin, Home, Shield, Globe, MessageCircle, Building2, Heart } from "lucide-react";

const API_BASE = "https://pgthikana.in/api";

export default function ProfilePage() {
  const router = useRouter();

  const [user, setUser] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("userToken");

      if (!token) {
        router.replace("/user");
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
    localStorage.removeItem("userToken");
    localStorage.removeItem("user");

    router.replace("/");

    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50 text-gray-700">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* 🔥 HEADER (UNCHANGED) */}
      <div className="bg-teal-700 px-4 py-3 flex items-center gap-3">
        <button onClick={() => router.back()}>
          <ArrowLeft className="text-white w-6 h-6" />
        </button>
        <h1 className="text-lg font-semibold text-white">Profile</h1>
      </div>

      {/* 🔥 CONTENT */}
      <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">

        {/* 🔥 PROFILE CARD */}
        <div className="bg-white rounded-3xl shadow-md p-6 flex items-center gap-5">

          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center text-white text-2xl font-bold shadow">
            {user.profile_image ? (
              <img
                src={user.profile_image}
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              user.name?.[0]
            )}
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {user.name || "User"}
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              {user.email || "No email"}
            </p>
            <p className="text-gray-600 text-sm">
              {user.phone}
            </p>
          </div>

        </div>

        {/* 🔥 BASIC INFO */}
        <div className="bg-white rounded-3xl shadow-md p-5 space-y-5">

          <h3 className="text-lg font-semibold text-gray-900">
            Basic Information
          </h3>

          <Info icon={<Phone size={16} />} label="Phone" value={user.phone} />
          <Info icon={<Mail size={16} />} label="Email" value={user.email} />
          <Info icon={<MapPin size={16} />} label="City" value={user.place} />
          <Info icon={<Home size={16} />} label="Address" value={user.address} />
          <Info icon={<Shield size={16} />} label="Emergency" value={user.emergency_number} />

        </div>

 {/* 🔥 MOBILE NAVIGATION */}
<div className="bg-white rounded-3xl shadow-md overflow-hidden md:hidden">

  <ActionItem
    icon={<Home size={18} />}
    label="Home"
    onClick={() => router.push("/")}
  />

  <Divider />

  <ActionItem
    icon={<Heart size={18} />}
    label="Saved PGs"
    onClick={() => router.push("/user/home/saved")}
  />

  <Divider />

  <ActionItem
    icon={<Building2 size={18} />}
    label="Bookings"
    onClick={() => router.push("/user/home/bookings")}
  />

  <Divider />

  <ActionItem
    icon={<MessageCircle size={18} />}
    label="Chat"
    onClick={() => router.push("/user/home/chat")}
  />

</div>

        {/* 🔥 ACTIONS */}
        <div className="bg-white rounded-3xl shadow-md overflow-hidden">

          <ActionItem
            icon="✔"
            label="Document Verification"
            onClick={() => router.push("/user/home/profile/document")}
          />

          <Divider />

          <ActionItem
            icon={<Globe size={16} />}
            label="Change Language"
            onClick={() => toast("Language change modal")}
          />

        </div>

        {/* 🔥 LOGOUT */}
        <button
          onClick={logout}
          className="w-full py-3 rounded-2xl font-semibold text-red-600 border border-red-500 hover:bg-red-50 transition"
        >
          Logout
        </button>

      </div>
    </div>
  );
}

/* 🔹 INFO ROW */
function Info({ icon, label, value }: any) {
  if (!value) return null;

  return (
    <div className="flex items-center justify-between border-b last:border-none pb-3 last:pb-0">
      <div className="flex items-center gap-3 text-gray-600">
        {icon}
        <span>{label}</span>
      </div>
      <span className="text-gray-900 font-medium">{value}</span>
    </div>
  );
}

/* 🔹 ACTION ITEM */
function ActionItem({ icon, label, onClick }: any) {
  return (
    <div
      onClick={onClick}
      className="flex justify-between items-center px-5 py-4 cursor-pointer hover:bg-gray-50 transition"
    >
      <div className="flex items-center gap-3 text-gray-700">
        {icon}
        <span className="font-medium">{label}</span>
      </div>
      <span className="text-gray-400">›</span>
    </div>
  );
}

/* 🔹 DIVIDER */
function Divider() {
  return <div className="border-t" />;
}