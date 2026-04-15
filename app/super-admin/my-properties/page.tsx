"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
  const [loading, setLoading] = useState(false);
  const [properties, setProperties] = useState<any[]>([]);
  const [locationFilter, setLocationFilter] = useState("");
const [typeFilter, setTypeFilter] = useState("");

  const router = useRouter();

  const fetchProperties = async () => {
    setLoading(true);

    const token = localStorage.getItem("token");



    if (!token) {
      console.error("Please login to continue");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(
        "https://pgthikana.in/api/property/my-properties",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch properties");
      }

      setProperties(data.properties || []);
    } catch (error: any) {
      console.error("Error fetching properties:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const filteredProperties = properties.filter((p) => {
  const matchesLocation =
    !locationFilter ||
    p.place?.toLowerCase().includes(locationFilter.toLowerCase());

  const matchesType =
    !typeFilter ||
    p.propertyType?.toLowerCase() === typeFilter.toLowerCase();

  return matchesLocation && matchesType;
});

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-teal-50 px-6 py-6 ml-[var(--sidebar-width)] transition-[margin] duration-200 ease-in-out">
      
      <div className="max-w-7xl mx-auto">
      
        <div className="flex items-start justify-between mb-6">

  {/* LEFT: TITLE */}
  <div>
    <h1 className="text-3xl font-bold text-gray-800">My Properties</h1>
    <p className="text-gray-500 text-sm">
      Manage and view all your listed properties
    </p>
  </div>

  {/* RIGHT: FILTERS */}
<div className="flex gap-3 items-center">

  {/* LOCATION */}
  <input
    type="text"
    placeholder="Search location..."
    value={locationFilter}
    onChange={(e) => setLocationFilter(e.target.value)}
    className="px-4 py-2 rounded-xl 
    bg-white text-gray-800
    border border-gray-300
    shadow-md
    text-sm w-56
    focus:outline-none focus:ring-2 focus:ring-teal-500"
  />

  {/* TYPE */}
  <select
    value={typeFilter}
    onChange={(e) => setTypeFilter(e.target.value)}
    className="px-4 py-2 rounded-xl 
    bg-white text-gray-800
    border border-gray-300
    shadow-md
    text-sm
    focus:outline-none focus:ring-2 focus:ring-teal-500"
  >
    <option value="">All</option>
    <option value="PG">PG</option>
    <option value="Hostel">Hostel</option>
    <option value="Room">Room</option>
  </select>

</div>
</div>

        {/* Loading */}
        {loading && (
          <div className="text-center text-gray-600">Loading properties...</div>
        )}

        {/* Empty */}
        {!loading && properties.length === 0 && (
          <div className="text-center text-gray-500">
            No properties found
          </div>
        )}

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {properties.map((property) => (
            <div
              key={property.id}
              onClick={() => router.push(`/super-admin/my-properties/${property.id}`)}
              className="bg-[#0D5F58] text-white rounded-2xl overflow-hidden shadow-lg hover:scale-[1.02] transition"
            >
              {/* Image */}
              <div className="h-32 w-full overflow-hidden">
                <img
                  src={property.images?.[0]}
                  alt="property"
                  className="w-full h-full object-cover"
                  onError={(e: any) => {
                    e.target.src =
                      "https://via.placeholder.com/400x300?text=No+Image";
                  }}
                />
              </div>

              {/* Content */}
              <div className="p-4">

                {/* ✅ Row 1: Name + Type */}
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold truncate">
                    {property.propertyName}
                  </h2>

                  <span className="text-xs bg-white/20 px-3 py-1 rounded-full whitespace-nowrap">
                    {property.propertyType}
                  </span>
                </div>

                {/* ✅ Row 2: Location */}
                <p className="text-sm text-gray-300 mt-2">
                  📍 {property.place}
                </p>

              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}