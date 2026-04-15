"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Select from "react-select";

export default function AdminPropertiesPage() {
  const [loading, setLoading] = useState(false);
  const [properties, setProperties] = useState<any[]>([]);

  const [cityFilter, setCityFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  const router = useRouter();

  /* ================= FETCH ================= */

  const fetchProperties = async () => {
    setLoading(true);

    const token = localStorage.getItem("adminToken");

    if (!token) {
      router.push("/admin");
      return;
    }

    try {
      const res = await fetch(
        "https://pgthikana.in/api/property/my-properties",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      setProperties(data.properties || []);
    } catch (err: any) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  /* ================= FILTER ================= */

  const filteredProperties = properties.filter((p) => {
    const matchCity = cityFilter
      ? p.place?.toLowerCase().includes(cityFilter.toLowerCase())
      : true;

    const matchDate = dateFilter
      ? new Date(p.createdAt).toDateString() ===
        new Date(dateFilter).toDateString()
      : true;

    return matchCity && matchDate;
  });

  /* ================= STATS ================= */

  const totalProperties = filteredProperties.length;

  const totalCities = new Set(
    filteredProperties.map((p) => p.place)
  ).size;

  const totalTypes = new Set(
    filteredProperties.map((p) => p.propertyType)
  ).size;

  const totalRooms = filteredProperties.reduce(
    (acc, p) => acc + (p.totalRooms || 0),
    0
  );

  /* ================= CITY OPTIONS ================= */

  const cityOptions = Array.from(
    new Set(properties.map((p) => p.place))
  )
    .filter(Boolean)
    .map((city) => ({
      label: city,
      value: city,
    }));

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 ml-[var(--sidebar-width)] px-10 py-8 transition-[margin] duration-200 ease-in-out">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">

        <div>
          <h1 className="text-3xl font-semibold text-gray-900">
            Admin Properties
          </h1>
          <p className="text-gray-500 text-sm">
            Manage all your properties
          </p>
        </div>

        {/* FILTERS */}
        <div className="flex gap-3">

       

          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-4 py-2 rounded-lg text-sm bg-[#0D5F58] text-white border border-white/20"
          />

        </div>
      </div>

      {/* 🔥 STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">

        <StatCard title="Total Properties" value={totalProperties} />
        <StatCard title="Cities" value={totalCities} />
        <StatCard title="Property Types" value={totalTypes} />
        <StatCard title="Total Rooms" value={totalRooms} />

      </div>

      {/* LOADING */}
      {loading && (
        <p className="text-center text-gray-600">
          Loading properties...
        </p>
      )}

      {/* EMPTY */}
      {!loading && filteredProperties.length === 0 && (
        <p className="text-center text-gray-500">
          No properties found
        </p>
      )}

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

        {filteredProperties.map((property) => (
          <div
            key={property.id}
            onClick={() =>
              router.push(`/admin/property/${property.id}`)
            }
            className="bg-[#0D5F58] text-white rounded-2xl overflow-hidden shadow-lg hover:scale-[1.02] transition cursor-pointer"
          >

            {/* IMAGE */}
            <div className="h-36 w-full overflow-hidden">
              <img
                src={property.images?.[0]}
                alt="property"
                className="w-full h-full object-cover"
              />
            </div>

            {/* CONTENT */}
            <div className="p-4">

              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold truncate">
                  {property.propertyName}
                </h2>

                <span className="text-xs bg-white/20 px-3 py-1 rounded-full">
                  {property.propertyType}
                </span>
              </div>

              <p className="text-sm text-gray-300 mt-2">
                📍 {property.place}
              </p>

            </div>

          </div>
        ))}

      </div>

    </div>
  );
}

/* ================= COMPONENT ================= */

function StatCard({
  title,
  value,
}: {
  title: string;
  value: number | string;
}) {
  return (
    <div className="bg-[#0D5F58] rounded-2xl p-5 shadow-md">
      <p className="text-gray-200 text-sm">{title}</p>
      <h2 className="text-2xl font-bold text-white mt-2">
        {value}
      </h2>
    </div>
  );
}