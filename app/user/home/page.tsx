"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { User } from "lucide-react";

/* =========================
   TYPES
========================= */

type Property = {
  id: number;
  property_name: string;
  address: string;
  rent_per_month: number;
  images?: { image_url: string }[];
  place?: string;
  propertyType?: string;
  isFavorite?: boolean;
  rating?: number | null;
};

/* =========================
   API FUNCTIONS
========================= */

const API_BASE = "https://pgthikana.in/api";

async function fetchProperties(lat: number, lng: number) {
  const res = await fetch(
    `${API_BASE}/property/radius?latitude=${lat}&longitude=${lng}`
  );
  const data = await res.json();
  return data?.properties || [];
}

async function fetchFavorites(token: string) {
  const res = await fetch(`${API_BASE}/property/favorites`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) return [];

  const data = await res.json();
  return data.favorites.map((f: any) => f.property_id);
}

async function fetchRating(propertyId: number) {
  try {
    const res = await fetch(
      `${API_BASE}/property/${propertyId}/reviews`
    );
    const data = await res.json();

    const reviews = data.reviews || [];

    if (!reviews.length) return null;

    const avg =
      reviews.reduce((sum: number, r: any) => sum + (r.rating || 0), 0) /
      reviews.length;

    return avg;
  } catch {
    return null;
  }
}

async function toggleFavorite(propertyId: number, token: string) {
  await fetch(`${API_BASE}/property/favorite/${propertyId}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

/* =========================
   COMPONENT
========================= */

export default function Page() {
  const router = useRouter();

  const [properties, setProperties] = useState<Property[]>([]);
  const [allProperties, setAllProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState("Detecting location...");
  const [search, setSearch] = useState("");

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("userToken") || ""
      : "";

  /* =========================
     LOCATION
  ========================= */

  useEffect(() => {
  navigator.geolocation.getCurrentPosition(
    async (pos) => {
      const { latitude, longitude } = pos.coords;

      try {
        // 🔥 Reverse geocoding
        const geoRes = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
        );
        const geoData = await geoRes.json();

        const city =
          geoData.address?.city ||
          geoData.address?.town ||
          geoData.address?.village ||
          "Your Location";

        setLocation(city);

      } catch {
        setLocation("Unknown Location");
      }

      // fetch properties
      const props = await fetchProperties(latitude, longitude);

      const enriched = props.map((p: any) => ({
        ...p,
        isFavorite: false,
        rating: null,
      }));

      setProperties(enriched);
      setAllProperties(enriched);
      setLoading(false);

      if (token) {
        const favIds = await fetchFavorites(token);
        setProperties((prev) =>
          prev.map((p) => ({
            ...p,
            isFavorite: favIds.includes(p.id),
          }))
        );
      }
    },
    () => {
      setLocation("Location permission denied");
      setLoading(false);
    }
  );
}, []);

  /* =========================
     SEARCH
  ========================= */

  useEffect(() => {
    if (!search) {
      setProperties(allProperties);
      return;
    }

    const filtered = allProperties.filter((p) =>
      (p.property_name || "")
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      (p.address || "")
        .toLowerCase()
        .includes(search.toLowerCase())
    );

    setProperties(filtered);
  }, [search]);

  /* =========================
     FAVORITE (OPTIMISTIC)
  ========================= */

  const handleFavorite = async (id: number) => {
    setProperties((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, isFavorite: !p.isFavorite } : p
      )
    );

    try {
      await toggleFavorite(id, token);
    } catch {}
  };

  /* =========================
     UI
  ========================= */

 return (
  <main className="min-h-screen bg-[#F5F0EB] pb-20">

    {/* 🔥 HEADER */}
    <div className="bg-white px-6 py-5 shadow-sm sticky top-0 z-10">

      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-500 font-medium">
            {location}
          </p>

          <h2 className="font-bold text-2xl text-gray-900">
            Nearby PGs
          </h2>
        </div>

       <button
  onClick={() => router.push("/user/home/profile")}
  className="flex items-center justify-center w-11 h-11 rounded-full border border-gray-300 bg-white shadow-sm hover:shadow-md transition"
>
  <User size={20} className="text-gray-700" />
</button>
      </div>

      {/* SEARCH */}
      <div className="mt-4">
        <input
          placeholder="Search PG, hostel..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-3 rounded-xl bg-gray-100 outline-none text-black placeholder-gray-500"
        />
      </div>
    </div>

    {/* 🔥 CONTENT */}
    <div className="px-6 mt-6">

      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-64 bg-gray-200 animate-pulse rounded-2xl"
            />
          ))}
        </div>
      ) : properties.length === 0 ? (
        <div className="text-center text-gray-600 mt-20 text-lg">
          No PGs available
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

          {properties.map((p) => (
            <div
              key={p.id}
              onClick={() => router.push(
  `/user/home/property/${p.id}?data=${encodeURIComponent(JSON.stringify(p))}`
)}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-200 overflow-hidden cursor-pointer"
            >
              {/* IMAGE */}
              <div className="relative">
                <img
                  src={
                    p.images?.[0]?.image_url ||
                    "/pg_logo.png"
                  }
                  className="h-52 w-full object-cover"
                />

                {/* FAVORITE */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFavorite(p.id);
                  }}
                  className="absolute top-3 right-3 bg-white/90 backdrop-blur p-2 rounded-full shadow"
                >
                  {p.isFavorite ? "❤️" : "🤍"}
                </button>

                {/* RATING */}
                <div className="absolute bottom-3 left-3 bg-white px-3 py-1 rounded-full text-sm text-black font-semibold shadow">
                  ⭐{" "}
                  {p.rating
                    ? p.rating.toFixed(1)
                    : "New"}
                </div>
              </div>

              {/* DETAILS */}
              <div className="p-5">
                <h3 className="font-bold text-lg text-gray-900">
                  {p.property_name || "Unnamed PG"}
                </h3>

                <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                  {p.address || "Address not available"}
                </p>

                <p className="text-[#0F766E] font-bold mt-3 text-lg">
                  ₹{p.rent_per_month}/month
                </p>
              </div>
            </div>
          ))}

        </div>
      )}
    </div>

    
  </main>
);
}