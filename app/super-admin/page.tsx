"use client";

import { JSX, useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import Select from "react-select";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

/* ================= TYPES ================= */

type BookingStatus = "confirmed" | "pending" | "cancelled";

interface Booking {
  id: number;
  user_name: string;
  property_name: string;
  total_amount: number;
  booking_status: BookingStatus;
  created_at: string;
  place: string; // ✅ ADD THIS
}



/* ================= COMPONENT ================= */

export default function AdminDashboard(): JSX.Element {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [cityFilter, setCityFilter] = useState("");
  const [dateFilter, setDateFilter] = useState(
  new Date().toISOString().split("T")[0]
);

  const router = useRouter();

    useEffect(() => {
      localStorage.removeItem("adminToken");
  const token = localStorage.getItem("token");

  

  if (!token) {
    router.push("/super-admin/login");
  }
}, []);

  useEffect(() => {
  fetchData();
}, []);

useEffect(() => {
  fetchComplaintsCount();
}, [cityFilter, dateFilter]); // 🔥 IMPORTANT

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        "https://pgthikana.in/api/booking/admin/bookings",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();
      setBookings(data.bookings || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchComplaintsCount = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(
      "https://pgthikana.in/api/complaint/vendor",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await res.json();

    if (!res.ok) throw new Error(data.message);

    const filteredComplaints = (data.complaints || []).filter((c: any) => {
  const matchCity = cityFilter
    ? c.property?.place
        ?.toLowerCase()
        .includes(cityFilter.toLowerCase())
    : true;

  const matchDate = dateFilter
    ? new Date(c.created_at).toDateString() ===
      new Date(dateFilter).toDateString()
    : true;

  return matchCity && matchDate;
});

setTotalComplaints(filteredComplaints.length); // ✅ USE API COUNTsetTotalComplaints(data.count || 0);
  } catch (err) {
    console.error(err);
  }
};

  /* ================= FILTER LOGIC ================= */

  const filteredBookings = bookings.filter((b) => {
   const matchCity = cityFilter
  ? b.place?.toLowerCase().includes(cityFilter.toLowerCase())
  : true;

    const matchDate = dateFilter
      ? new Date(b.created_at).toDateString() ===
        new Date(dateFilter).toDateString()
      : true;

    return matchCity && matchDate;
  });

  /* ================= CALCULATIONS ================= */

  const totalRevenue = filteredBookings.reduce(
    (a, b) => a + b.total_amount,
    0
  );

  const totalBookings = filteredBookings.length;

  const confirmed = filteredBookings.filter(
    (b) => b.booking_status === "confirmed"
  ).length;

  const pending = filteredBookings.filter(
    (b) => b.booking_status === "pending"
  ).length;

  const cancelled = filteredBookings.filter(
    (b) => b.booking_status === "cancelled"
  ).length;

  // 🔥 HARDCODED (as you asked)
  const [totalComplaints, setTotalComplaints] = useState(0);

  // ⚠️ No property API → simulate for now
  const totalProperties = new Set(
    bookings.map((b) => b.property_name)
  ).size;

  /* ================= CHART DATA ================= */

  const revenueMap: Record<string, number> = {};

  filteredBookings.forEach((b) => {
    const month = new Date(b.created_at).toLocaleString("default", {
      month: "short",
    });
    revenueMap[month] = (revenueMap[month] || 0) + b.total_amount;
  });

  const chartData = Object.keys(revenueMap).map((month) => ({
    month,
    revenue: revenueMap[month],
  }));

  const pieData = [
    { name: "Confirmed", value: confirmed },
    { name: "Pending", value: pending },
    { name: "Cancelled", value: cancelled },
  ];

  const COLORS = ["#A5B4FC", "#FCD34D", "#F87171"];

const cityOptions = Array.from(
  new Set(
    bookings
      .map((b) => b.place)
      .filter((p) => p && p.trim().length > 0)
  )
)
  .map((city) => ({
    label: city,
    value: city,
  }))
  .sort((a, b) => a.label.localeCompare(b.label));

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 ml-[var(--sidebar-width)] px-10 py-8">

      {/* HEADER + FILTER */}
      <div className="flex justify-between items-center mb-10">

        <div>
          <p className="text-gray-500 text-sm">Welcome back 👋</p>
          <h1 className="text-3xl font-semibold text-gray-900">
            Super Admin Dashboard
          </h1>
        </div>

        {/* 🔥 FILTERS */}
<div className="flex gap-3">

<Select
  options={cityOptions}
  placeholder="Search City..."
  onChange={(selected) =>
    setCityFilter(selected ? selected.value : "")
  }
  isClearable
  styles={{
    control: (base) => ({
      ...base,
      backgroundColor: "#0D5F58",
      borderColor: "rgba(255,255,255,0.2)",
      color: "white",
      minWidth: "200px",
    }),
    singleValue: (base) => ({
      ...base,
      color: "white",
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: "#0D5F58",
      color: "white",
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isFocused ? "#0f766e" : "#0D5F58",
      color: "white",
      cursor: "pointer",
    }),
    input: (base) => ({
      ...base,
      color: "black"
    }),
    placeholder: (base) => ({
      ...base,
      color: "#cbd5e1",
    }),
  }}
/>

  <input
    type="date"
    value={dateFilter}
    onChange={(e) => setDateFilter(e.target.value)}
    className="
      px-4 py-2 rounded-lg text-sm
      bg-[#0D5F58] text-white
      border border-white/20
      outline-none
      focus:ring-2 focus:ring-white/40
      focus:border-white/40
      transition
    "
  />

</div>
      </div>

      {/* 🔥 TOP 4 CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">

        <div
  onClick={() => router.push("/super-admin/booking")}
  className="cursor-pointer hover:scale-[1.03] transition"
>
  <StatCard title="Bookings" value={totalBookings} />
</div>
        <StatCard title="Total Revenue" value={`₹${totalRevenue}`} />
        <div
  onClick={() => router.push("/super-admin/complaints")}
  className="cursor-pointer"
>
  <StatCard title="Complaints" value={totalComplaints} />
</div>
        <StatCard title="Total Property" value={totalProperties} />

      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-10">

        {/* AREA */}
        <div className="xl:col-span-2 bg-[#0D5F58] rounded-3xl p-6 shadow-lg">

          <h2 className="mb-4 font-semibold text-white">
            Revenue Trend
          </h2>

          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={chartData}>
              <XAxis dataKey="month" stroke="#E2E8F0" />
              <YAxis stroke="#E2E8F0" />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#A5B4FC"
                strokeWidth={3}
                fill="url(#gradient)"
              />
              <defs>
                <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#A5B4FC" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#A5B4FC" stopOpacity={0} />
                </linearGradient>
              </defs>
            </AreaChart>
          </ResponsiveContainer>

        </div>

        {/* PIE */}
        <div className="bg-[#0D5F58] rounded-3xl p-6 shadow-lg">

          <h2 className="mb-4 font-semibold text-white">
            Booking Health
          </h2>

          <div className="flex flex-col items-center">

            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={pieData} dataKey="value" innerRadius={70}>
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            <div className="text-center mt-2">
              <p className="text-2xl font-bold text-white">{totalBookings}</p>
              <p className="text-gray-200 text-sm">Total Bookings</p>
            </div>

          </div>

        </div>

      </div>

      {/* TABLE */}
      <div className="bg-[#0D5F58] rounded-3xl p-6 shadow-lg">

        <h2 className="mb-4 font-semibold text-white">
          Recent Bookings
        </h2>

       <table className="w-full text-sm table-fixed">
  <thead className="text-gray-200 border-b border-white/20">
    <tr>
      <th className="w-1/5 text-left py-3">User</th>
      <th className="w-1/5 text-left">Property</th>
      <th className="w-1/5 text-center">Amount</th>
      <th className="w-1/5 text-center">Date</th> {/* ✅ NEW */}
      <th className="w-1/5 text-center">Status</th>
      <th className="w-[60px]"></th> {/* ✅ ARROW */}
    </tr>
  </thead>

  <tbody>
    {filteredBookings.map((b) => {
      const formattedDate = new Date(b.created_at).toLocaleDateString(
        "en-GB",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }
      );

      return (
        <tr
          key={b.id}
          className="border-b border-white/10 hover:bg-white/5 transition"
        >
          {/* USER */}
          <td className="py-4 font-medium text-white text-left">
            {b.user_name}
          </td>

          {/* PROPERTY */}
          <td className="text-gray-200 text-left">
            {b.property_name}
          </td>

          {/* AMOUNT */}
          <td className="text-indigo-300 font-semibold text-center">
            ₹{b.total_amount}
          </td>

          {/* DATE ✅ */}
          <td className="text-gray-300 text-center">
            {formattedDate}
          </td>

          {/* STATUS */}
          <td className="text-center">
            <StatusBadge status={b.booking_status} />
          </td>

          {/* ARROW BUTTON ✅ */}
          <td className="text-center">
          <div
  onClick={() => router.push(`/super-admin/booking/${b.id}`)}
  className="p-2 rounded-full hover:bg-white/10 transition cursor-pointer inline-flex"
>
  <ArrowRight size={18} />
</div>
          </td>
        </tr>
      );
    })}
  </tbody>
</table>
      </div>

    </div>
  );
}

/* ================= COMPONENTS ================= */

function StatCard({
  title,
  value,
}: {
  title: string;
  value: number | string;
}) {
  return (
    <div className="bg-[#0D5F58] rounded-2xl p-5 shadow-md hover:shadow-lg transition">
      <p className="text-gray-200 text-sm">{title}</p>
      <h2 className="text-2xl font-bold text-white mt-2">{value}</h2>
    </div>
  );
}

function StatusBadge({ status }: { status: BookingStatus }) {
  const styles = {
    confirmed: "bg-green-200 text-green-900",
    pending: "bg-yellow-200 text-yellow-900",
    cancelled: "bg-red-200 text-red-900",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status]}`}
    >
      {status}
    </span>
  );
}