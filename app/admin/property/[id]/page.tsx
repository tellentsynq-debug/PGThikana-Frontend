"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminPropertiesPage() {
  const [loading, setLoading] = useState(false);
  const [properties, setProperties] = useState<any[]>([]);
  const [error, setError] = useState("");

  const router = useRouter();

  const fetchProperties = async () => {
    setLoading(true);
    setError("");

    const token = localStorage.getItem("adminToken");

    // ✅ ADMIN AUTH GUARD
    if (!token) {
      router.push("/admin");
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

      const text = await res.text();

      let data;
      try {
        data = JSON.parse(text);
      } catch {
        setError("Invalid server response");
        return;
      }

      if (!res.ok) {
        setError(data?.message || "Failed to fetch properties");
        setProperties([]);
        return;
      }

      setProperties(Array.isArray(data?.properties) ? data.properties : []);
    } catch (err) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Admin Properties
            </h1>
            <p className="text-gray-500 text-sm">
              Manage and monitor all properties
            </p>
          </div>

          {/* 🔥 SMALL CHANGE: ADMIN BADGE */}
          <span className="bg-[#0D5F58] text-white text-xs px-3 py-1 rounded-full">
            ADMIN PANEL
          </span>
        </div>

        {/* STATES */}
        {loading ? (
          <div className="text-center text-gray-600">
            Loading properties...
          </div>
        ) : error ? (
          <div className="text-center text-red-500 bg-red-100 py-3 rounded-lg">
            {error}
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center text-gray-500">
            No properties found
          </div>
        ) : null}

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {properties?.map((property) => (
            <div
              key={property.id}
              onClick={() =>
                router.push(`/admin/properties/${property.id}`)
              }
              className="bg-[#0D5F58] text-white rounded-2xl overflow-hidden shadow-lg hover:scale-[1.03] hover:shadow-2xl transition cursor-pointer"
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

                {/* Row 1 */}
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold truncate">
                    {property.propertyName}
                  </h2>

                  <span className="text-xs bg-white/20 px-3 py-1 rounded-full whitespace-nowrap">
                    {property.propertyType}
                  </span>
                </div>

                {/* Row 2 */}
                <p className="text-sm text-gray-300 mt-2">
                  📍 {property.place}
                </p>

                {/* 🔥 SMALL CHANGE: STATUS LINE */}
                <div className="mt-3 text-xs text-white/70">
                  {property.availableRooms} / {property.totalRooms} rooms available
                </div>

              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}