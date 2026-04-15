"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/app/context/SnackbarContext";

export default function PropertyImagesPage() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement | null>(null);

  const [images, setImages] = useState<File[]>([]);
  const [rules, setRules] = useState("");
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState("");

  const [propertyData, setPropertyData] = useState<any>(null);

   const [token, setToken] = useState<string | null>(null);


useEffect(() => {
  if (typeof window === "undefined") return;

  const data = localStorage.getItem("propertyData");
  const token = localStorage.getItem("vendorToken");

  if (data) {
    setPropertyData(JSON.parse(data));
  }

  setToken(token);
}, []);


  const handleImages = (e: any) => {
    const files = Array.from(e.target.files) as File[];
    setImages((prev) => [...prev, ...files]);
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

const getLocation = () => {
  setLocationLoading(true);

  navigator.geolocation.getCurrentPosition(
    async (pos) => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;

      setLatitude(lat);
      setLongitude(lng);

      try {
        // 🔥 Reverse geocoding (OpenStreetMap FREE)
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
        );

        const data = await res.json();

        // 👉 Extract readable address
        const displayAddress = data.display_name || "";

        setAddress(displayAddress);
      } catch (err) {
        console.error("Failed to fetch address");
      }

      setLocationLoading(false);
    },
    () => {
      toast("Location permission denied");
      setLocationLoading(false);
    }
  );
};

  const canSubmit =
    images.length > 0 && latitude && longitude && rules.trim() !== "";
const createProperty = async () => {
  if (!canSubmit) return;

  if (!token) {
  toast("No token found");
  return;
}

  setLoading(true);

  try {
    const formData = new FormData();

    const headers: any = {
      Authorization: `Bearer ${token}`,
    };

    // 🔥 GET DATA FROM PREVIOUS SCREEN
    const stored = localStorage.getItem("propertyData");
    if (!stored) {
      toast("Missing property data");
      setLoading(false);
      return;
    }

    const propertyData = JSON.parse(stored);

    // ✅ IMAGES
    images.forEach((img) => {
      formData.append("images", img);
    });

    // ✅ PROPERTY PREFERENCES (use real data)
    formData.append(
      "propertyPreferences",
      JSON.stringify({
        propertyType: "pg",
        sharingType: "2",
        rentType: propertyData.rentType,
        pgCategory: "boys",
        place: propertyData.address, // 🔥 dynamic
      })
    );

    // ✅ PROPERTY DETAILS (NO MORE HARDCODE)
    formData.append(
      "propertyDetails",
      JSON.stringify({
        propertyName: propertyData.propertyName,
        address: address || propertyData.address,
        description: propertyData.description,
        rentPerMonth: Number(propertyData.rent),
        rentType: propertyData.rentType,
      })
    );

    // (keeping your existing static for now)
    formData.append(
      "roomInformation",
      JSON.stringify({
        totalRooms: 10,
        availableRooms: 5,
        bathroomType: "private",
      })
    );

    formData.append("amenities", JSON.stringify(["Wifi", "Food"]));

    formData.append(
      "propertyManager",
      JSON.stringify({
        managerName: "Manager",
        managerPhone: "9876543210",
      })
    );

    formData.append("rulesAndRegulations", rules);

    formData.append("latitude", latitude!.toString());
    formData.append("longitude", longitude!.toString());

    const res = await fetch(
      "https://pgthikana.in/api/property/create",
      {
        method: "POST",
        headers,
        body: formData,
      }
    );

    const text = await res.text();

    if (res.status === 200 || res.status === 201) {
      toast("Property Created Successfully 🎉");

      // 🔥 OPTIONAL: clear storage
      localStorage.removeItem("propertyData");

      router.push("/vendor/dashboard");
    } else {
      toast("Error: " + text);
    }
  } catch (err) {
    toast("Something went wrong");
  }

  setLoading(false);
};
  return (
    <div className="min-h-screen bg-[#F5F0EB] flex justify-center px-4 py-6">
      <div className="w-full max-w-md">

        {/* HEADER */}
        <h2 className="text-2xl font-bold text-[#1A1A1A] mb-2">
          Final Step 🎉
        </h2>
        <p className="text-gray-500 mb-6 text-sm">
          Complete your listing by adding rules, photos, and location. This helps tenants trust your property.
        </p>

        {/* RULES SECTION */}
        <div className="mb-6">
          <p className="font-semibold text-[#1A1A1A] mb-1">
            Rules & Regulations
          </p>
          <p className="text-xs text-gray-500 mb-2">
            Example: No smoking, No loud music after 10 PM, No pets
          </p>

          <textarea
            value={rules}
            onChange={(e) => setRules(e.target.value)}
            placeholder="Enter property rules..."
            className="w-full px-4 py-3 rounded-xl border bg-white text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
          />
        </div>

        {/* IMAGE SECTION */}
        <div className="mb-6">
          <p className="font-semibold text-[#1A1A1A] mb-1">
            Property Photos ({images.length})
          </p>
          <p className="text-xs text-gray-500 mb-3">
            Upload clear images of rooms, bathrooms, and exterior for better bookings
          </p>

          <div
            onClick={() => fileRef.current?.click()}
            className="w-full h-28 border-2 border-dashed rounded-xl bg-white flex flex-col items-center justify-center cursor-pointer mb-3 hover:border-[#0F766E]"
          >
            <span className="text-lg">📷</span>
            <span className="text-sm text-gray-500">Click to upload photos</span>
          </div>

          <input
            ref={fileRef}
            type="file"
            multiple
            onChange={handleImages}
            className="hidden"
          />

          <div className="grid grid-cols-3 gap-2">
            {images.map((img, i) => (
              <div key={i} className="relative">
                <img
                  src={URL.createObjectURL(img)}
                  className="h-24 w-full object-cover rounded-lg"
                />
                <button
                  onClick={() => removeImage(i)}
                  className="absolute top-1 right-1 bg-black/60 text-white rounded-full px-1 text-xs"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* LOCATION SECTION */}
        <div className="mb-6">
          <p className="font-semibold text-[#1A1A1A] mb-1">
            Location
          </p>
          <p className="text-xs text-gray-500 mb-3">
            Helps users find your property on map
          </p>

          <button
            onClick={getLocation}
            className="w-full py-3 bg-[#0F766E] text-white rounded-xl hover:bg-[#0c6560]"
          >
            {locationLoading ? "Fetching location..." : "📍 Use Current Location"}
          </button>

         {latitude && (
  <div className="mt-3">
    <p className="text-green-600 text-sm mb-2">
      ✔ Location fetched successfully
    </p>

    <input
      value={address}
      onChange={(e) => setAddress(e.target.value)}
      placeholder="Edit your location"
      className="w-full px-4 py-3 rounded-xl border bg-white text-black focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
    />
  </div>
)}
        </div>

        {/* SUBMIT */}
        <button
          onClick={createProperty}
          disabled={!canSubmit || loading}
          className={`w-full py-4 rounded-xl text-white font-semibold transition-all ${
            canSubmit
              ? "bg-[#0F766E] hover:bg-[#0c6560]"
              : "bg-gray-300 cursor-not-allowed"
          }`}
        >
          {loading ? "Publishing..." : "🚀 Publish Property"}
        </button>

      </div>
    </div>
  );
}