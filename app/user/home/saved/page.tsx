"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowBigLeft, ArrowLeft } from "lucide-react";

const API_BASE = "https://pgthikana.in/api";

export default function SavedPropertiesPage() {
  const router = useRouter();

  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("userToken")
      : null;

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const res = await fetch(`${API_BASE}/property/favorites`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        setProperties(data.favorites || []);
      }

      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-white text-black">
        Loading...
      </div>
    );
  }

  /* ================= EMPTY ================= */
  if (!properties.length) {
    return (
      <div className="h-screen flex items-center justify-center bg-white text-gray-700 text-lg">
        No Saved Properties
      </div>
    );
  }

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-white">

      {/* 🔥 HEADER */}
      <div className="sticky top-0 z-20 bg-[#0F766E] px-4 py-3 flex items-center gap-3">
       <button onClick={() => router.back()}>
  <ArrowLeft className="text-white w-6 h-6" />
</button>

        <h1 className="text-lg font-semibold text-white">
          Saved Properties
        </h1>
      </div>

      {/* 🔥 LIST */}
      <div className="max-w-5xl mx-auto px-4 py-6 grid md:grid-cols-2 gap-6">

        {properties.map((property) => {
          const imageUrl =
            property.images?.[0]?.image_url ||
            "https://via.placeholder.com/400";

          return (
            <div
              key={property.property_id}
              onClick={() => {
                const convertedProperty = {
                  id: property.property_id,
                  property_name: property.property_name,
                  address: property.address,
                  rent_per_month: property.rent_per_month,
                  sharing_type: property.sharing_type,
                  bathroom_type: property.bathroom_type,
                  total_rooms: property.total_rooms,
                  available_rooms: property.available_rooms,
                  amenities: property.amenities || [],
                  rulesAndRegulations:
                    property.rulesAndRegulations || "",
                  images: property.images || [],
                };

                router.push(
                  `/user/home/property/${property.property_id}?data=${encodeURIComponent(
                    JSON.stringify(convertedProperty)
                  )}`
                );
              }}
              className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition cursor-pointer overflow-hidden"
            >
              {/* IMAGE */}
              <div className="h-44 overflow-hidden">
                <img
                  src={imageUrl}
                  className="w-full h-full object-cover hover:scale-105 transition duration-300"
                />
              </div>

              {/* DETAILS */}
              <div className="p-4">

                {/* NAME */}
                <h2 className="font-semibold text-lg text-gray-900">
                  {property.property_name}
                </h2>

                {/* ADDRESS */}
                <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                  {property.address}
                </p>

                {/* RENT */}
                <p className="text-teal-700 text-black font-bold mt-3">
                  ₹{property.rent_per_month}/month
                </p>
              </div>
            </div>
          );
        })}

      </div>
    </div>
  );
}