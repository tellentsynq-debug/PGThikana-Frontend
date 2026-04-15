"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function PropertyDetailsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [property, setProperty] = useState<any>(null);

  useEffect(() => {
    const data = searchParams.get("data");

    if (data) {
      const parsed = JSON.parse(decodeURIComponent(data));
      setProperty(parsed);
    }
  }, []);

  if (!property) {
    return (
      <div className="h-screen flex items-center justify-center text-black bg-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">

      {/* 🔥 CENTER CONTAINER */}
      <div className="max-w-5xl mx-auto px-4 py-6">

        {/* 🔥 IMAGE */}
        <div className="relative">
          <img
            src={
              property.images?.[0]?.image_url ||
              property.images?.[0] ||
              "/pg_logo.png"
            }
            className="w-full h-[240px] md:h-[300px] object-cover rounded-xl"
          />

          <button
            onClick={() => router.back()}
            className="absolute top-4 left-4 bg-white text-black p-2 rounded-full shadow"
          >
            ←
          </button>
        </div>

        {/* 🔥 CONTENT */}
        <div className="mt-6 grid md:grid-cols-3 gap-6">

          {/* LEFT */}
          <div className="md:col-span-2 space-y-5">

            {/* TITLE */}
            <div className="bg-white border p-5 rounded-xl">
              <h1 className="text-2xl font-bold text-black">
                {property.property_name}
              </h1>

              <p className="text-gray-600 mt-1">
                {property.address}
              </p>

              <p className="text-teal-600 text-black font-bold text-lg mt-3">
                ₹{property.rent_per_month}/month
              </p>
            </div>

            {/* DETAILS */}
            <div className="bg-white border p-5 rounded-xl">
              <h2 className="font-semibold text-black mb-4">
                Property Details
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <Info label="Type" value={property.property_type} />
                <Info label="Sharing" value={property.sharing_type} />
                <Info label="Rooms" value={property.total_rooms} />
                <Info label="Available" value={property.available_rooms} />
                <Info label="Category" value={property.pg_category} />
                <Info label="Bathroom" value={property.bathroom_type} />
              </div>
            </div>

            {/* AMENITIES */}
            <div className="bg-white border p-5 rounded-xl">
              <h2 className="font-semibold text-black mb-3">
                Amenities
              </h2>

              <div className="flex flex-wrap gap-2">
                {(property.amenities || []).map((a: string, i: number) => (
                  <span
                    key={i}
                    className="bg-gray-100 text-black px-3 py-1 rounded-full text-sm"
                  >
                    {a}
                  </span>
                ))}
              </div>
            </div>

            {/* DESCRIPTION */}
            <div className="bg-white border p-5 rounded-xl">
              <h2 className="font-semibold text-black mb-2">
                Description
              </h2>
              <p className="text-gray-700">
                {property.description || "No description"}
              </p>
            </div>

            {/* RULES */}
            <div className="bg-white border p-5 rounded-xl">
              <h2 className="font-semibold text-black mb-2">
                Rules
              </h2>
              <p className="text-gray-700">
                {property.rulesAndRegulations || "No rules"}
              </p>
            </div>

          </div>

          {/* RIGHT */}
          <div className="sticky top-20 h-fit">

            <div className="bg-white border p-5 rounded-xl space-y-4">

              <h2 className="font-semibold text-black">
                Quick Actions
              </h2>

              <button className="w-full border border-teal-600 text-teal-600 text-black py-3 rounded-lg hover:bg-teal-50 transition">
                Call Owner
              </button>

              <button className="w-full bg-teal-600 text-white py-3 rounded-lg font-semibold">
                Book Now
              </button>

            </div>

          </div>

        </div>
      </div>
    </div>
  );
}

/* 🔹 INFO */
function Info({ label, value }: any) {
  return (
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="font-semibold text-black">{value || "-"}</p>
    </div>
  );
}