"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getProperty, setProperty } from "@/app/model/propertyStore";
import { toast } from "@/app/context/SnackbarContext";

export default function FoodMenuPage() {
  const router = useRouter();

  const days = [
    "Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"
  ];

  const [menu, setMenu] = useState(
    days.map(() => ({
      breakfast: "",
      lunch: "",
      dinner: "",
    }))
  );

  const [startDate, setStartDate] = useState("");

  const updateMeal = (
    index: number,
    type: "breakfast" | "lunch" | "dinner",
    value: string
  ) => {
    const updated = [...menu];
    updated[index][type] = value;
    setMenu(updated);
  };

  const handleNext = () => {
    const prev = getProperty();

    const foodMenu = days.map((day, i) => ({
      day,
      breakfast: menu[i].breakfast,
      lunch: menu[i].lunch,
      dinner: menu[i].dinner,
    }));

    setProperty({
      ...prev,
      foodMenu,
      foodMenuFromDate: startDate,
    });

    router.push("/vendor/dashboard/add-property/images");
  };



  return (
    <div className="min-h-screen bg-[#F5F0EB] flex justify-center px-4 py-6">
      <div className="w-full max-w-md">

        {/* HEADER */}
        <div className="bg-[#0F766E] text-white px-4 py-3 rounded-xl mb-6 text-lg font-semibold shadow">
          Food Menu
        </div>

        {/* START DATE */}
        <Label>Food Menu Start Date</Label>
        <input
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          placeholder="YYYY-MM-DD"
          className="w-full p-3 rounded-xl bg-white border border-gray-300 text-gray-900 placeholder-gray-400 mb-6 outline-none focus:ring-2 focus:ring-[#0F766E]/20 focus:border-[#0F766E]"
        />

        {/* DAYS */}
        {days.map((day, index) => (
          <div
            key={day}
            className="bg-white rounded-2xl p-4 mb-5 shadow-sm border border-gray-100"
          >
            <p className="font-bold text-[15px] text-gray-900 mb-3">
              {day}
            </p>

            <MealInput
              placeholder="Breakfast"
              value={menu[index].breakfast}
              onChange={(v) => updateMeal(index, "breakfast", v)}
            />

            <MealInput
              placeholder="Lunch"
              value={menu[index].lunch}
              onChange={(v) => updateMeal(index, "lunch", v)}
            />

            <MealInput
              placeholder="Dinner"
              value={menu[index].dinner}
              onChange={(v) => updateMeal(index, "dinner", v)}
            />
          </div>
        ))}

        {/* BUTTON */}
        <button
          onClick={handleNext}
          className="w-full py-4 rounded-xl font-bold text-white bg-[#0F766E] hover:bg-[#0c6560] transition shadow"
        >
          Continue
        </button>

      </div>
    </div>
  );
}

/* LABEL */
function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-sm font-semibold text-gray-900 mb-2">
      {children}
    </p>
  );
}

/* INPUT */
function MealInput({
  placeholder,
  value,
  onChange,
}: {
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full p-3 mb-2 rounded-xl bg-white border border-gray-300 text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-[#0F766E]/20 focus:border-[#0F766E]"
    />
  );
}