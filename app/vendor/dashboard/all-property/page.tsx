"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

/* ─── Types ─── */
interface Property {
  _id: string;
  propertyName: string;
  place: string;
  totalRooms: number;
  availableRooms: number;
  rentPerMonth: number;
  propertyType?: string; // ✅ ADD THIS LINE
  images?: string[];
  amenities?: string[];
}

export default function AllPropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [filtered, setFiltered] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  const router = useRouter();

  const token =
    typeof window !== "undefined" ? localStorage.getItem("vendorToken") : null;

  /* ─── FETCH ─── */
  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const res = await fetch(
        "https://pgthikana.in/api/property/my-properties",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();
      if (data.success) {
        setProperties(data.properties);
        setFiltered(data.properties);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /* ─── FILTER + SEARCH ─── */
  useEffect(() => {
    let temp = [...properties];

    if (search) {
      temp = temp.filter(
        (p) =>
          p.propertyName.toLowerCase().includes(search.toLowerCase()) ||
          p.place.toLowerCase().includes(search.toLowerCase())
      );
    }

   // 🔍 SEARCH
if (search) {
  temp = temp.filter(
    (p) =>
      p.propertyName.toLowerCase().includes(search.toLowerCase()) ||
      p.place.toLowerCase().includes(search.toLowerCase())
  );
}

// 🔥 TYPE FILTER (PG / Hostel / Room)
if (typeFilter) {
  temp = temp.filter(
    (p) => p.propertyType?.toLowerCase() === typeFilter
  );
}

setFiltered(temp);
}, [search, typeFilter, properties]);

  return (
    <div className="min-h-screen bg-[#F5F0EB]">
      <div className="max-w-[1200px] mx-auto px-6 py-8">

     <button
  onClick={() => router.back()}
  className="absolute top-6 left-6 z-50 flex items-center gap-2 bg-[#0F766E] text-white px-4 py-2 rounded-full shadow-lg hover:bg-[#0c6560] transition-all"
>
  <span className="text-white text-xl font-bold">
    ←
  </span>
  <span className="text-sm font-semibold text-white">
    Back
  </span>
</button>

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

          <div>
            <h1 className="text-2xl font-bold text-[#1A1A1A]">
              All Properties
            </h1>
            <p className="text-sm text-gray-600">
              Manage and view all your listings
            </p>
          </div>

          {/* SEARCH + SORT */}
          <div className="flex gap-3">

            <input
              placeholder="Search by name or city..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-4 py-2 rounded-xl border border-gray-300 text-black focus:outline-none focus:border-[#0F766E]"
            />

        <select
  value={typeFilter}
  onChange={(e) => setTypeFilter(e.target.value)}
  className="px-4 py-2 rounded-xl border border-gray-300 text-black"
>
  <option value="">All Types</option>
  <option value="pg">PG</option>
  <option value="hostel">Hostel</option>
  <option value="room">Room</option>
</select>

          </div>
        </div>

        {/* LOADING */}
        {loading ? (
          <p className="text-center text-gray-500">Loading properties...</p>
        ) : filtered.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

            {filtered.map((p) => (
              <PropertyCard
                key={p._id}
                property={p}
                onClick={() =>
                  router.push(`/vendor/dashboard/property/${p._id}`)
                }
              />
            ))}

          </div>
        )}
      </div>
    </div>
  );
}

/* ─── PROPERTY CARD ─── */
function PropertyCard({
  property,
  onClick,
}: {
  property: Property;
  onClick: () => void;
}) {
  const total = property.totalRooms || 0;
  const available = property.availableRooms || 0;
  const occupied = total - available;
  const progress = total === 0 ? 0 : (occupied / total) * 100;

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:scale-[1.02] transition cursor-pointer"
    >
      {/* IMAGE */}
      <div className="h-40 bg-gray-100 overflow-hidden">
        {property.images?.[0] ? (
          <img
            src={property.images[0]}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="h-full flex items-center justify-center text-3xl">
            🏠
          </div>
        )}
      </div>

      {/* CONTENT */}
      <div className="p-4 space-y-2">
        <h2 className="font-semibold text-[#1A1A1A]">
          {property.propertyName}
        </h2>

        <p className="text-sm text-gray-600">
          📍 {property.place}
        </p>

        <p className="text-sm font-semibold text-[#0F766E]">
          ₹{property.rentPerMonth}/month
        </p>

        {/* PROGRESS */}
        <div className="w-full h-2 bg-gray-200 rounded-full">
          <div
            className="h-full bg-[#0F766E] rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className="text-xs text-gray-500">
          {occupied}/{total} occupied
        </p>
      </div>
    </div>
  );
}

/* ─── EMPTY ─── */
function EmptyState() {
  return (
    <div className="text-center py-20">
      <h2 className="text-lg font-semibold text-gray-700">
        No properties found
      </h2>
      <p className="text-gray-500 text-sm mt-2">
        Try adding a new property
      </p>
    </div>
  );
}