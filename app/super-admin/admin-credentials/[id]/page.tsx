"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Shield,
  User,
  Calendar,
  Ban,
} from "lucide-react";

export default function AdminDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const [admin, setAdmin] = useState<any>(null);

  useEffect(() => {
    fetchAdmin();
  }, []);

  const fetchAdmin = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        "https://pgthikana.in/api/admin/list",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      const selected = data.admins.find((a: any) => a.id == id);

      setAdmin(selected);
    } catch (err) {
      console.error(err);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (!admin) {
    return <div className="p-10 ml-[var(--sidebar-width)]">Loading...</div>;
  }

  return (
    <div className="ml-[var(--sidebar-width)] min-h-screen bg-gradient-to-br from-gray-50 to-teal-50 p-8">

      {/* BACK */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 mb-6 text-gray-600 hover:text-black"
      >
        <ArrowLeft size={18} />
        Back
      </button>

      {/* MAIN CARD */}
      <div className="bg-[#0D5F58] text-white p-8 rounded-3xl shadow-2xl">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold">Admin Details</h1>

          <span
            className={`px-4 py-1 rounded-full text-sm ${
              admin.is_blocked === 0
                ? "bg-green-300 text-green-900"
                : "bg-red-300 text-red-900"
            }`}
          >
            {admin.is_blocked === 0 ? "ACTIVE" : "BLOCKED"}
          </span>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* BASIC */}
          <Card title="Basic Info">
            <Item icon={<User size={16} />} label="Name" value={admin.name} />
            <Item icon={<Shield size={16} />} label="Username" value={admin.username} />
            <Item icon={<Mail size={16} />} label="Email" value={admin.email} />
          </Card>

          {/* LOCATION */}
          <Card title="Location">
            <Item icon={<MapPin size={16} />} label="City" value={admin.location} />
          </Card>

          {/* SYSTEM */}
          <Card title="System Info">
            <Item label="Admin ID" value={admin.id} />
            <Item label="Created By" value={admin.created_by} />
            <Item icon={<Calendar size={16} />} label="Created At" value={formatDate(admin.created_at)} />
          </Card>

          {/* STATUS */}
          <Card title="Status">
            <Item label="Role" value={admin.role} />
            <Item label="Active" value={admin.is_active ? "Yes" : "No"} />
            <Item
              icon={<Ban size={16} />}
              label="Blocked"
              value={admin.is_blocked ? "Yes" : "No"}
            />
            {admin.block_reason && (
              <Item label="Block Reason" value={admin.block_reason} />
            )}
          </Card>

        </div>
      </div>
    </div>
  );
}

/* 🔥 UI COMPONENTS */

function Card({ title, children }: any) {
  return (
    <div className="bg-[#0F766E] p-5 rounded-2xl shadow-md">
      <h3 className="mb-3 font-semibold text-lg">{title}</h3>
      <div className="space-y-2 text-sm">{children}</div>
    </div>
  );
}

function Item({ icon, label, value }: any) {
  return (
    <div className="flex justify-between items-center border-b border-white/10 pb-1">
      <div className="flex items-center gap-2 text-gray-200">
        {icon}
        <span>{label}</span>
      </div>
      <span className="font-medium">{value}</span>
    </div>
  );
}