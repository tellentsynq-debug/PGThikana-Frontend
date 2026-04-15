"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";

export default function VendorsPage() {
  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

const [locationFilter, setLocationFilter] = useState("ALL");

const locationOptions = [
  { label: "All Locations", value: "ALL" },
  { label: "Kanpur", value: "KANPUR" },
  { label: "Lucknow", value: "LUCKNOW" },
  { label: "Delhi", value: "DELHI" },
];

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          router.push("/super-admin/login");
          return;
        }

        const res = await fetch(
          "https://pgthikana.in/api/vendor/superadmin/all-vendors",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();

        if (!res.ok) throw new Error(data.message);

        setVendors(data.vendors || []);
      } catch (err) {
        console.error("Error fetching vendors:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchVendors();
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 ml-[var(--sidebar-width)] px-10 py-8">

      {/* HEADER */}
     <div className="flex justify-between items-center mb-8">

  <div>
    <h1 className="text-3xl font-semibold text-gray-900">
      Select Vendor
    </h1>
    <p className="text-gray-500 text-sm">
      Choose a vendor to view dashboard
    </p>
  </div>

<div className="relative">

  <select
    value={locationFilter}
    onChange={(e) => setLocationFilter(e.target.value)}
    className="appearance-none px-4 py-2 pr-10 rounded-lg text-sm bg-[#0D5F58] text-white border border-white/20 shadow-sm focus:outline-none cursor-pointer"
  >
    {locationOptions.map((loc) => (
      <option key={loc.value} value={loc.value}>
        {loc.label}
      </option>
    ))}
  </select>

  {/* 🔥 CUSTOM ARROW */}
  <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white">
   <ChevronDown size={16} />
  </div>

</div>
</div>
      {/* LOADING */}
      {loading && (
        <p className="text-center text-gray-500">Loading vendors...</p>
      )}

      {/* EMPTY */}
      {!loading && vendors.length === 0 && (
        <p className="text-center text-gray-500">
          No vendors found
        </p>
      )}

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

       {vendors
  .filter((vendor: any) => {
    if (locationFilter === "ALL") return true;

    return (
      vendor.city?.toLowerCase() ===
      locationFilter.toLowerCase()
    );
  })
  .map((vendor: any) => (
          <div
            key={vendor.id}
            onClick={() =>
              router.push(
                `/super-admin/admin-dashboard?vendorId=${vendor.id}`
              )
            }
            className="bg-[#0D5F58] text-white p-6 rounded-2xl cursor-pointer hover:scale-[1.03] transition-all shadow-md"
          >

            {/* PROFILE */}
            <div className="flex items-center gap-4 mb-4">
              <img
                src={vendor.profile_image}
                onError={(e) => {
                  e.currentTarget.src =
                    "https://ui-avatars.com/api/?name=" +
                    vendor.name;
                }}
                className="w-16 h-16 rounded-full object-cover bg-gray-200"
              />

              <div>
                <h2 className="text-lg font-semibold capitalize">
                  {vendor.name}
                </h2>
                <p className="text-sm text-gray-200">
                  {vendor.email}
                </p>
              </div>
            </div>

            {/* STATS */}
            <div className="flex justify-between text-sm mt-3">

              <div>
                🏠{" "}
                <span className="font-semibold">
                  {vendor.properties_count}
                </span>{" "}
                properties
              </div>

              <div>
                💰{" "}
                <span className="font-semibold">
                  ₹{vendor.total_revenue || 0}
                </span>
              </div>

            </div>

          </div>
        ))}

      </div>
    </div>
  );
}