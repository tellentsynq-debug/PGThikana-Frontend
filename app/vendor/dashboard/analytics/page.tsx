"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { ArrowLeft, CalendarDays, IndianRupee, TrendingUp, Building2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "@/app/context/SnackbarContext";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Booking {
  created_at: string;
  rent_amount: number;
  property_name: string;
}

type BookingFilter = "today" | "weekly" | "monthly" | "all";

interface ChartPoint {
  label: string;
  value: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const PRIMARY = "#0F766E";
const DAY_NAMES = ["", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MONTH_NAMES = [
  "",
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

// ─── Data Processing ─────────────────────────────────────────────────────────

function processGrowthData(bookings: Booking[], filter: BookingFilter): ChartPoint[] {
  const now = new Date();
  const grouped: Record<number, number> = {};

  for (const b of bookings) {
    const date = new Date(b.created_at);
    let key: number | undefined;

    if (filter === "today") {
      const sameDay =
        date.getFullYear() === now.getFullYear() &&
        date.getMonth() === now.getMonth() &&
        date.getDate() === now.getDate();
      if (sameDay) key = date.getHours();
    } else if (filter === "weekly") {
      key = date.getDay() === 0 ? 7 : date.getDay();
    } else {
      // monthly & all
      key = date.getMonth() + 1;
    }

    if (key !== undefined) grouped[key] = (grouped[key] ?? 0) + 1;
  }

  if (filter === "today") {
    return Object.keys(grouped)
      .map(Number)
      .sort((a, b) => a - b)
      .map((h) => ({ label: `${h}:00`, value: grouped[h] }));
  }

  if (filter === "weekly") {
    return Array.from({ length: 7 }, (_, i) => ({
      label: DAY_NAMES[i + 1],
      value: grouped[i + 1] ?? 0,
    }));
  }

  // monthly / all
  return Object.keys(grouped)
    .map(Number)
    .sort((a, b) => a - b)
    .map((m) => ({ label: MONTH_NAMES[m], value: grouped[m] }));
}

function processPropertyData(bookings: Booking[]): ChartPoint[] {
  const map: Record<string, number> = {};
  for (const b of bookings) {
    const name = b.property_name || "Unknown";
    map[name] = (map[name] ?? 0) + 1;
  }
  return Object.entries(map)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([label, value]) => ({ label, value }));
}

// ─── Custom Tooltip ───────────────────────────────────────────────────────────

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-lg px-4 py-2.5 text-sm">
      <p className="text-gray-500 text-xs mb-0.5">{label}</p>
      <p className="font-semibold text-[#0F766E] text-base">{payload[0].value}</p>
    </div>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({
  icon: Icon,
  value,
  label,
}: {
  icon: React.ElementType;
  value: string;
  label: string;
}) {
  return (
    <div className="bg-white rounded-2xl px-5 py-4 flex items-center gap-4 shadow-sm border border-black/5 hover:shadow-md transition-shadow duration-200">
      <div className="bg-[#0F766E]/10 rounded-xl w-11 h-11 flex items-center justify-center shrink-0">
        <Icon size={20} color={PRIMARY} strokeWidth={2} />
      </div>
      <div>
        <p className="text-xl font-bold text-[#1A1A1A] leading-tight">{value}</p>
        <p className="text-[12px] text-[#666] mt-0.5">{label}</p>
      </div>
    </div>
  );
}

// ─── Filter Dropdown ──────────────────────────────────────────────────────────

function FilterDropdown({
  value,
  onChange,
}: {
  value: BookingFilter;
  onChange: (v: BookingFilter) => void;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as BookingFilter)}
      className="text-[13px] text-[#1A1A1A] border border-gray-200 rounded-lg px-3 py-1.5 bg-white appearance-none cursor-pointer
        focus:outline-none focus:border-[#0F766E] focus:ring-1 focus:ring-[#0F766E]/20 transition-all"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23888' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right 10px center",
        paddingRight: "30px",
      }}
    >
      <option value="today">Today</option>
      <option value="weekly">Weekly</option>
      <option value="monthly">Monthly</option>
      <option value="all">All Time</option>
    </select>
  );
}

// ─── Chart Card Wrapper ───────────────────────────────────────────────────────

function ChartCard({
  title,
  subtitle,
  filterValue,
  onFilterChange,
  children,
}: {
  title: string;
  subtitle: string;
  filterValue: BookingFilter;
  onFilterChange: (v: BookingFilter) => void;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-black/5 shadow-sm">
      <div className="flex items-start justify-between gap-3 mb-5">
        <div>
          <h2 className="text-[15px] font-semibold text-[#1A1A1A]">{title}</h2>
          <p className="text-[12px] text-[#666] mt-0.5">{subtitle}</p>
        </div>
        <FilterDropdown value={filterValue} onChange={onFilterChange} />
      </div>
      {children}
    </div>
  );
}

// ─── Loading Skeleton ─────────────────────────────────────────────────────────

function Skeleton({ className }: { className?: string }) {
  return (
    <div className={`bg-gray-100 animate-pulse rounded-xl ${className ?? ""}`} />
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3.5">
        <Skeleton className="h-[74px]" />
        <Skeleton className="h-[74px]" />
      </div>
      <Skeleton className="h-[290px]" />
      <Skeleton className="h-[300px]" />
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AnalyticsPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [bookingFilter, setBookingFilter] = useState<BookingFilter>("weekly");
  const [propertyFilter, setPropertyFilter] = useState<BookingFilter>("all");
  const [lastRefreshed, setLastRefreshed] = useState<string>("");

  // Derived metrics
  const totalBookings = bookings.length;
  const totalRevenue = bookings.reduce((s, b) => s + (b.rent_amount ?? 0), 0);

  const growthData = useMemo(
    () => processGrowthData(bookings, bookingFilter),
    [bookings, bookingFilter]
  );

  const propertyData = useMemo(
    () => processPropertyData(bookings),
    [bookings]
  );

  const subtitleMap: Record<BookingFilter, string> = {
    today: "Bookings by hour today",
    weekly: "Bookings by day of week",
    monthly: "Bookings by month",
    all: "All-time bookings by month",
  };

  // ── Fetch ──────────────────────────────────────────────────────────────────

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    try {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("token") ?? ""
          : "";

      const res = await fetch("https://pgthikana.in/api/booking/vendor-bookings", {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setBookings(data.bookings ?? []);
    } catch {
      // API failed — show empty state, do not inject fake data
      setBookings([]);
    } finally {
      setLoading(false);
      setLastRefreshed(new Date().toLocaleTimeString());
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-[#F5F0EB]">

      {/* ── Header ── */}
      <header className="bg-[#0F766E] sticky top-0 z-20">
        <div className="max-w-[1100px] mx-auto px-5 h-14 flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="w-8 h-8 rounded-lg bg-white/15 hover:bg-white/25 transition-colors flex items-center justify-center shrink-0"
            aria-label="Go back"
          >
            <ArrowLeft size={18} color="white" strokeWidth={2.5} />
          </button>
          <span className="text-white font-semibold text-[17px] tracking-tight">Analytics</span>
          <div className="ml-auto flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
            <span className="text-white/75 text-[12px]">Live</span>
          </div>
        </div>
      </header>

      {/* ── Body ── */}
      <main className="max-w-[1100px] mx-auto px-5 py-6">

        {loading ? (
          <LoadingSkeleton />
        ) : (
          <div className="space-y-5">

            {/* ── Summary Cards ── */}
            <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-2">
              <StatCard
                icon={CalendarDays}
                value={totalBookings.toLocaleString("en-IN")}
                label="Total Bookings"
              />
              <StatCard
                icon={IndianRupee}
                value={`₹${totalRevenue.toLocaleString("en-IN")}`}
                label="Total Revenue"
              />
            </div>

            {/* ── Booking Growth Chart ── */}
            <ChartCard
              title="Booking Growth"
              subtitle={subtitleMap[bookingFilter]}
              filterValue={bookingFilter}
              onFilterChange={(v) => setBookingFilter(v)}
            >
              {growthData.length === 0 ? (
                <EmptyState message="No bookings for this period" />
              ) : (
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={growthData} margin={{ top: 4, right: 8, left: -18, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" vertical={false} />
                    <XAxis
                      dataKey="label"
                      tick={{ fontSize: 11, fill: "#888" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      allowDecimals={false}
                      tick={{ fontSize: 11, fill: "#888" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke={PRIMARY}
                      strokeWidth={2.5}
                      dot={{ fill: PRIMARY, r: 4, strokeWidth: 2, stroke: "#fff" }}
                      activeDot={{ r: 5, fill: PRIMARY }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </ChartCard>

            {/* ── Property Performance Chart ── */}
            <ChartCard
              title="Top Performing Properties"
              subtitle="Bookings per property"
              filterValue={propertyFilter}
              onFilterChange={(v) => setPropertyFilter(v)}
            >
              {propertyData.length === 0 ? (
                <EmptyState message="No property data available" />
              ) : (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart
                    data={propertyData}
                    margin={{ top: 4, right: 8, left: -18, bottom: 24 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" vertical={false} />
                    <XAxis
                      dataKey="label"
                      tick={{ fontSize: 10, fill: "#888" }}
                      axisLine={false}
                      tickLine={false}
                      angle={-25}
                      textAnchor="end"
                      interval={0}
                    />
                    <YAxis
                      allowDecimals={false}
                      tick={{ fontSize: 11, fill: "#888" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={48}>
                      {propertyData.map((_, i) => (
                        <Cell
                          key={i}
                          fill={i === 0 ? PRIMARY : `rgba(15,118,110,${0.9 - i * 0.08})`}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </ChartCard>

            {/* ── Quick Stats Row ── */}
            <QuickStats bookings={bookings} />

            {/* ── Footer ── */}
            <p className="text-center text-[11px] text-[#999] pt-1">
              {lastRefreshed ? `Last refreshed at ${lastRefreshed}` : ""}
            </p>

          </div>
        )}
      </main>
    </div>
  );
}

// ─── Quick Stats ──────────────────────────────────────────────────────────────

function QuickStats({ bookings }: { bookings: Booking[] }) {
  const now = new Date();

  const todayCount = bookings.filter((b) => {
    const d = new Date(b.created_at);
    return (
      d.getFullYear() === now.getFullYear() &&
      d.getMonth() === now.getMonth() &&
      d.getDate() === now.getDate()
    );
  }).length;

  const thisMonthCount = bookings.filter((b) => {
    const d = new Date(b.created_at);
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
  }).length;

  const avgRevenue =
    bookings.length > 0
      ? Math.round(bookings.reduce((s, b) => s + (b.rent_amount ?? 0), 0) / bookings.length)
      : 0;

  const uniqueProperties = new Set(bookings.map((b) => b.property_name)).size;

  const stats = [
    { icon: TrendingUp, label: "Today's Bookings", value: todayCount.toString() },
    { icon: CalendarDays, label: "This Month", value: thisMonthCount.toString() },
    { icon: IndianRupee, label: "Avg. Booking Value", value: `₹${avgRevenue.toLocaleString("en-IN")}` },
    { icon: Building2, label: "Active Properties", value: uniqueProperties.toString() },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {stats.map(({ icon: Icon, label, value }) => (
        <div
          key={label}
          className="bg-white rounded-xl px-4 py-3.5 border border-black/5 shadow-sm hover:shadow-md transition-shadow duration-200"
        >
          <div className="flex items-center gap-2 mb-2">
            <Icon size={14} color={PRIMARY} strokeWidth={2} />
            <span className="text-[11px] text-[#666] font-medium">{label}</span>
          </div>
          <p className="text-lg font-bold text-[#1A1A1A]">{value}</p>
        </div>
      ))}
    </div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyState({ message }: { message: string }) {
  return (
    <div className="h-[200px] flex flex-col items-center justify-center gap-2">
      <div className="w-10 h-10 rounded-full bg-[#0F766E]/10 flex items-center justify-center">
        <TrendingUp size={18} color={PRIMARY} />
      </div>
      <p className="text-[13px] text-[#888]">{message}</p>
    </div>
  );
}