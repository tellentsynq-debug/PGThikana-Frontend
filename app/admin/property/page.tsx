"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminPropertiesPage() {
  const [loading, setLoading] = useState(false);
  const [properties, setProperties] = useState<any[]>([]);

  const router = useRouter();

  const fetchProperties = async () => {
    setLoading(true);

    const token = localStorage.getItem("adminToken");


    

    // ✅ AUTH GUARD
    if (!token) {
      console.error("Please login to continue");
      router.push("/login"); // redirect to login
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

      // 🔥 OPTIONAL: token expired → logout
      if (error.message.toLowerCase().includes("unauthorized")) {
        localStorage.removeItem("token");
        router.push("/admin");
      }
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
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Admin Properties
          </h1>
          <p className="text-gray-500 text-sm">
            Manage and view all properties (Admin Panel)
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center text-gray-600">
            Loading properties...
          </div>
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
              onClick={() =>
                router.push(`/admin/property/${property.id}`)
              }
              className="bg-[#0D5F58] text-white rounded-2xl overflow-hidden shadow-lg hover:scale-[1.02] transition cursor-pointer"
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

                {/* Row 1: Name + Type */}
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold truncate">
                    {property.propertyName}
                  </h2>

                  <span className="text-xs bg-white/20 px-3 py-1 rounded-full whitespace-nowrap">
                    {property.propertyType}
                  </span>
                </div>

                {/* Row 2: Location */}
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