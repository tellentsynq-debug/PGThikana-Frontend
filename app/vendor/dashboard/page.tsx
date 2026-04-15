"use client";

import { MessageCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "@/app/context/SnackbarContext";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Property {
  _id: string;
  propertyName: string;
  place: string;
  totalRooms: number;
  availableRooms: number;
  rentPerMonth: number;
  images?: string[];
  amenities?: string[];

  foodMenu?: any[]; // ✅ ADD THIS LINE
}
// ─── Main Page ────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const [myProperties, setMyProperties] = useState<Property[]>([]);
  const [vendorName, setVendorName] = useState("Vendor");
  const [totalRooms, setTotalRooms] = useState(0);
  const [totalOccupied, setTotalOccupied] = useState(0);
  const [totalBookings, setTotalBookings] = useState(0);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  const token =
    typeof window !== "undefined" ? localStorage.getItem("vendorToken") : null;

  useEffect(() => {
    fetchAll().finally(() => setLoading(false));
  }, []);

  const fetchAll = async () => {
    await Promise.all([fetchMyProperties(), fetchBookings(), fetchProfile()]);
  };

  const fetchMyProperties = async () => {
    try {
      const res = await fetch("https://pgthikana.in/api/property/my-properties", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setMyProperties(data.properties);
        let rooms = 0;
        let occupied = 0;
        data.properties.forEach((p: Property) => {
          const total = p.totalRooms || 0;
          const available = p.availableRooms || 0;
          rooms += total;
          occupied += total - available;
        });
        setTotalRooms(rooms);
        setTotalOccupied(occupied);
      }
    } catch (_) {}
  };

  const fetchBookings = async () => {
    try {
      const res = await fetch("https://pgthikana.in/api/booking/vendor-bookings", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setTotalBookings(data.count);
    } catch (_) {}
  };

  const fetchProfile = async () => {
    try {
      const res = await fetch("https://pgthikana.in/api/vendor/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setVendorName(data.vendor?.name || "Vendor");
    } catch (_) {}
  };

  const occupancyRate =
    totalRooms > 0 ? Math.round((totalOccupied / totalRooms) * 100) : 0;

  return (
    <div className="min-h-screen bg-[#F5F0EB]">
      <div className="mx-auto max-w-[1100px] px-6 py-8">

        {/* ── HEADER ─────────────────────────────────────────────────── */}
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div className="h-11 w-11 rounded-full bg-[#0F766E] flex items-center justify-center text-white font-bold text-lg shadow-sm select-none">
              {vendorName?.charAt(0)?.toUpperCase() || "V"}
            </div>
         <div
  onClick={() => router.push("/vendor/dashboard/profile")}
  className="cursor-pointer"
>
  <h1 className="text-[1.15rem] font-bold text-[#1A1A1A] leading-tight">
    {vendorName}
  </h1>
  <p className="text-sm text-[#666]">Property Manager</p>
</div>
          </div>
<button
  onClick={() => router.push("/vendor/dashboard/chat")}
  className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#0F766E] hover:bg-[#0c6560] text-white shadow-md transition-all active:scale-95"
>
  <MessageCircle size={18} />
  <span className="text-sm font-semibold">Chats</span>
</button>
        </header>

        {/* ── STATS GRID ─────────────────────────────────────────────── */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon="🏠"
            title="Properties"
            value={myProperties.length}
            sub="Active listings"
          />
          <StatCard
            icon="🛏️"
            title="Occupancy"
            value={`${totalOccupied}/${totalRooms}`}
            sub={`${occupancyRate}% filled`}
            badge={occupancyRate >= 80 ? "High" : undefined}
          />
          <StatCard
            icon="📋"
            title="Bookings"
            value={totalBookings}
            sub="Total requests"
            onClick={() => router.push("/vendor/dashboard/bookings")}
          />
          <StatCard
            icon="➕"
            title="Add Property"
            value="List Now"
            sub="Expand portfolio"
            accent
            onClick={() => router.push("/vendor/dashboard/add-property/details")}
          />
        </section>

        {/* ── QUICK ACTIONS ──────────────────────────────────────────── */}
        <section className="bg-white rounded-2xl px-6 py-5 shadow-sm mb-8">
          <p className="font-semibold text-[#1A1A1A] text-sm uppercase tracking-wide mb-5">
            Quick Actions
          </p>
          <div className="flex justify-center gap-30">
            <QuickAction
  icon="🍽️"
  label="Food Menu"
  onClick={() => {
    if (myProperties.length === 0) {
      toast("No property found");
      return;
    }

    const property = myProperties[0]; // 👉 you can improve later

    // 🔥 STORE DATA
    localStorage.setItem("propertyId", property._id);
    localStorage.setItem(
      "foodMenu",
      JSON.stringify(property.foodMenu || [])
    );

    // 🚀 NAVIGATE
    router.push("/vendor/dashboard/food-menu");
  }}
/>
            <QuickAction
  icon="📊"
  label="Analytics"
  onClick={() => router.push("/vendor/dashboard/analytics")}
/>

<QuickAction
  icon="⚠️"
  label="Complaints"
  onClick={() => router.push("/vendor/dashboard/complaints")}
/>
          </div>
        </section>

        {/* ── PROPERTIES ─────────────────────────────────────────────── */}
       <section>
  <div className="flex items-center justify-between mb-5">
    
    <p className="font-semibold text-[#1A1A1A] text-base">
      Your Properties
    </p>

    {myProperties.length > 0 && (
      <button
        onClick={() => router.push("/vendor/dashboard/all-property")}
        className="text-sm text-[#0F766E] font-medium hover:underline active:scale-95 transition"
      >
        View all →
      </button>
    )}

  </div>

  {loading ? (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {[1, 2].map((i) => (
        <div
          key={i}
          className="bg-white rounded-2xl overflow-hidden shadow-sm animate-pulse"
        >
          <div className="h-40 bg-gray-200" />
          <div className="p-4 space-y-3">
            <div className="h-4 bg-gray-200 rounded w-2/3" />
            <div className="h-3 bg-gray-100 rounded w-1/2" />
            <div className="h-2 bg-gray-100 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  ) : myProperties.length === 0 ? (
    <EmptyState />
  ) : (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {myProperties.slice(0, 2).map((p) => (
        <PropertyCard key={p._id} property={p} />
      ))}
    </div>
  )}
</section>
      </div>
    </div>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({
  icon,
  title,
  value,
  sub,
  accent,
  badge,
  onClick,
}: {
  icon: string;
  title: string;
  value: string | number;
  sub?: string;
  accent?: boolean;
  badge?: string;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={`rounded-2xl p-4 shadow-sm flex flex-col gap-1 transition-all duration-150
        ${accent
          ? "bg-[#FFF3E6] cursor-pointer hover:shadow-md hover:scale-[1.02]"
          : "bg-white hover:shadow-md hover:scale-[1.01]"
        }
        ${onClick ? "cursor-pointer" : ""}
      `}
    >
      <div className="flex items-center justify-between">
        <span className="text-xl">{icon}</span>
        {badge && (
          <span className="text-[10px] font-semibold bg-[#DCFCE7] text-[#166534] px-2 py-0.5 rounded-full">
            {badge}
          </span>
        )}
      </div>
      <p className="text-xs text-[#666] font-medium mt-1">{title}</p>
      <p className="text-2xl font-bold text-[#0F766E] leading-tight">{value}</p>
      {sub && <p className="text-[11px] text-[#888]">{sub}</p>}
    </div>
  );
}

// ─── Quick Action ─────────────────────────────────────────────────────────────

function QuickAction({
  icon,
  label,
  onClick,
}: {
  icon: string;
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-2 group cursor-pointer"
    >
      <div className="bg-[#FFF3E6] group-hover:bg-[#ffe4c4] transition-colors p-3 rounded-xl text-xl shadow-sm w-12 h-12 flex items-center justify-center">
        {icon}
      </div>
      <p className="text-xs font-medium text-[#444] group-hover:text-[#0F766E] transition-colors">
        {label}
      </p>
    </button>
  );
}

// ─── Property Card ────────────────────────────────────────────────────────────

function PropertyCard({ property }: { property: Property }) {
  const total = property.totalRooms || 0;
  const available = property.availableRooms || 0;
  const occupied = total - available;
  const progress = total === 0 ? 0 : (occupied / total) * 100;

  const progressColor =
    progress >= 80
      ? "bg-[#22c55e]"
      : progress >= 50
      ? "bg-[#0F766E]"
      : "bg-[#f59e0b]";

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:scale-[1.01] transition-all duration-200 cursor-pointer group">
      {/* Image */}
      <div className="relative h-40 bg-gray-100 overflow-hidden">
        {property.images?.[0] ? (
          <img
            src={property.images[0]}
            alt={property.propertyName}
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center bg-[#e8e0d8] text-4xl">
            🏠
          </div>
        )}

        {/* Price badge */}
        <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1.5 rounded-lg">
          ₹{property.rentPerMonth.toLocaleString("en-IN")}
          <span className="font-normal text-white/70">/mo</span>
        </div>

        {/* Availability badge */}
        <div
          className={`absolute top-2 right-2 text-[10px] font-semibold px-2 py-1 rounded-full ${
            available > 0
              ? "bg-[#DCFCE7] text-[#166534]"
              : "bg-[#FEE2E2] text-[#991B1B]"
          }`}
        >
          {available > 0 ? `${available} available` : "Full"}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <div>
          <p className="font-semibold text-[#1A1A1A] text-[0.95rem] leading-tight">
            {property.propertyName}
          </p>
          <p className="text-sm text-[#666] mt-0.5 flex items-center gap-1">
            <span>📍</span> {property.place}
          </p>
        </div>

        {/* Occupancy progress */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-xs">
            <span className="text-[#555] font-medium">Occupancy</span>
            <span className="text-[#1A1A1A] font-semibold">
              {occupied}/{total} rooms
            </span>
          </div>
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${progressColor}`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Amenities */}
        {property.amenities && property.amenities.length > 0 && (
          <div className="flex gap-1.5 flex-wrap">
            {property.amenities.slice(0, 4).map((a, i) => (
              <span
                key={i}
                className="text-[11px] bg-[#F5F0EB] text-[#555] font-medium px-2 py-1 rounded-md"
              >
                {a}
              </span>
            ))}
            {property.amenities.length > 4 && (
              <span className="text-[11px] text-[#0F766E] font-medium px-2 py-1">
                +{property.amenities.length - 4} more
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div className="bg-white rounded-2xl shadow-sm flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="text-5xl mb-4">🏗️</div>
      <h3 className="text-[#1A1A1A] font-semibold text-base mb-1">
        No properties yet
      </h3>
      <p className="text-[#666] text-sm mb-5 max-w-xs">
        List your first PG to start receiving bookings and managing tenants.
      </p>
      <button className="bg-[#0F766E] hover:bg-[#0c6560] text-white text-sm font-semibold px-5 py-2.5 rounded-lg shadow-sm transition-all active:scale-95 cursor-pointer">
        + Add Your First Property
      </button>
    </div>
  );
}