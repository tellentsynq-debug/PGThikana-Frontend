"use client";

import { useEffect, useState } from "react";
import { toast } from "@/app/context/SnackbarContext";

interface MenuItem {
  day_of_week: string;
  breakfast: string;
  lunch: string;
  dinner: string;
}

export default function FoodMenuPage() {
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(false);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const propertyId =
    typeof window !== "undefined"
      ? localStorage.getItem("propertyId")
      : null;

  // 🔥 FETCH EXISTING MENU (OPTIONAL)
  useEffect(() => {
    const storedMenu = localStorage.getItem("foodMenu");
    if (storedMenu) {
      setMenu(JSON.parse(storedMenu));
    }
  }, []);

  // ✏️ HANDLE CHANGE
  const handleChange = (
    index: number,
    field: keyof MenuItem,
    value: string
  ) => {
    const updated = [...menu];
    updated[index][field] = value;
    setMenu(updated);
  };

  // 🚀 UPDATE API
  const updateMenu = async () => {
    if (!token || !propertyId) return;

    setLoading(true);

    try {
      const res = await fetch(
        `https://pgthikana.in/api/vendor/property/update/${propertyId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            foodMenu: JSON.stringify(menu),
          }),
        }
      );

      const data = await res.json();

      if (res.status === 200) {
        toast("✅ Food menu updated successfully");
      } else {
        toast("❌ Failed to update");
      }
    } catch (err) {
      toast("Something went wrong");
    }

    setLoading(false);
  };

  // ❌ EMPTY STATE
  if (menu.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F0EB]">
        <p className="text-gray-500 text-lg">No food menu available</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F0EB] px-6 py-8">
      <div className="max-w-4xl mx-auto">

        {/* HEADER */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#1A1A1A]">
            🍽️ Food Menu Management
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Update daily meals for your tenants. This improves trust & bookings.
          </p>
        </div>

        {/* MENU LIST */}
        <div className="space-y-5">
          {menu.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition"
            >
              {/* DAY */}
              <p className="font-semibold text-[#0F766E] text-lg mb-4">
                {item.day_of_week}
              </p>

              {/* FIELDS */}
              <div className="grid md:grid-cols-3 gap-4">

                {/* BREAKFAST */}
                <div>
                  <label className="text-xs text-gray-500">
                    Breakfast
                  </label>
                  <input
                    value={item.breakfast}
                    onChange={(e) =>
                      handleChange(index, "breakfast", e.target.value)
                    }
                    className="w-full mt-1 px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
                  />
                </div>

                {/* LUNCH */}
                <div>
                  <label className="text-xs text-gray-500">
                    Lunch
                  </label>
                  <input
                    value={item.lunch}
                    onChange={(e) =>
                      handleChange(index, "lunch", e.target.value)
                    }
                    className="w-full mt-1 px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
                  />
                </div>

                {/* DINNER */}
                <div>
                  <label className="text-xs text-gray-500">
                    Dinner
                  </label>
                  <input
                    value={item.dinner}
                    onChange={(e) =>
                      handleChange(index, "dinner", e.target.value)
                    }
                    className="w-full mt-1 px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
                  />
                </div>

              </div>
            </div>
          ))}
        </div>

        {/* UPDATE BUTTON */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={updateMenu}
            disabled={loading}
            className={`px-6 py-3 rounded-xl text-white font-semibold transition ${
              loading
                ? "bg-gray-400"
                : "bg-[#0F766E] hover:bg-[#0c6560]"
            }`}
          >
            {loading ? "Updating..." : "💾 Update Menu"}
          </button>
        </div>

      </div>
    </div>
  );
}