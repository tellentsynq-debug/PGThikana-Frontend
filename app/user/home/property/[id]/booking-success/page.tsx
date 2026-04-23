"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";

// ✅ ANIMATED CHECKMARK SVG
function AnimatedCheck() {
  return (
    <div className="relative flex items-center justify-center w-24 h-24">
      <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-20 animate-ping" />
      <svg
        className="w-24 h-24"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="50" cy="50" r="44" stroke="#d1fae5" strokeWidth="6" fill="none" />
        <circle
          cx="50" cy="50" r="44"
          stroke="#16a34a" strokeWidth="6" fill="none"
          strokeLinecap="round" strokeDasharray="276" strokeDashoffset="0"
          style={{ transformOrigin: "center", animation: "drawCircle 0.8s ease-out forwards" }}
        />
        <polyline
          points="28,52 44,68 72,36"
          stroke="#16a34a" strokeWidth="7"
          strokeLinecap="round" strokeLinejoin="round"
          fill="none" strokeDasharray="60" strokeDashoffset="60"
          style={{ animation: "drawCheck 0.5s ease-out 0.7s forwards" }}
        />
      </svg>

      <style>{`
        @keyframes drawCircle {
          from { stroke-dashoffset: 276; }
          to   { stroke-dashoffset: 0; }
        }
        @keyframes drawCheck {
          from { stroke-dashoffset: 60; }
          to   { stroke-dashoffset: 0; }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeSlideRight {
          from { opacity: 0; transform: translateX(-16px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .fade-up   { animation: fadeSlideUp   0.5s ease-out forwards; opacity: 0; }
        .fade-right{ animation: fadeSlideRight 0.5s ease-out forwards; opacity: 0; }
        .delay-1 { animation-delay: 1.1s; }
        .delay-2 { animation-delay: 1.3s; }
        .delay-3 { animation-delay: 1.5s; }
        .delay-4 { animation-delay: 1.7s; }
        .delay-5 { animation-delay: 1.9s; }
        .delay-6 { animation-delay: 2.1s; }
      `}</style>
    </div>
  );
}

// ✅ ROW COMPONENT
function Row({
  label,
  value,
  highlight,
  delay,
}: {
  label: string;
  value: string;
  highlight?: boolean;
  delay: string;
}) {
  return (
    <div className={`flex justify-between items-start gap-4 fade-up ${delay}`}>
      <span className="text-gray-500 text-sm">{label}</span>
      <span className={`text-right text-sm font-semibold ${highlight ? "text-green-600" : "text-gray-900"}`}>
        {value}
      </span>
    </div>
  );
}

// ✅ FORMAT DATE
function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

export default function BookingSuccessPage() {
  const router = useRouter();
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [secondsLeft, setSecondsLeft] = useState(5);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const token = localStorage.getItem("userToken");
        const res = await fetch("https://pgthikana.in/api/booking/my-bookings", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success && data.bookings.length > 0) {
          const latestBooking = data.bookings[0];
          setBooking(latestBooking);
          setLoading(false);
          startCountdown(latestBooking);
        }
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchBooking();
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  const startCountdown = (b: any) => {
    let seconds = 5;
    intervalRef.current = setInterval(() => {
      seconds--;
      setSecondsLeft(seconds);
      if (seconds <= 0) {
        clearInterval(intervalRef.current!);
        if (b.booking_status === "confirmed" && b.payment_status === "paid") {
          router.push(`/user/home/property/${b.property_id}/booking-success/verification?bookingId=${b.id}`);
        }
      }
    }, 1000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F0EB] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <svg className="w-10 h-10 animate-spin text-green-600" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
          <p className="text-gray-500 text-sm">Fetching your booking…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F0EB] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-3xl space-y-4">

        {/* ── TOP ROW: VENDOR (left) + SUCCESS HEADER (right) ── */}
        <div className="flex flex-col sm:flex-row gap-4">

          {/* ── VENDOR CARD (LEFT) ── */}
       <div className="fade-right delay-1 bg-white rounded-3xl shadow-sm p-6 flex flex-col sm:w-80 w-full flex-shrink-0">

  {/* Header */}
  <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-5">
    Property Owner
  </p>

  {/* Avatar + Name */}
  <div className="flex items-center gap-4 mb-5">
    <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-xl uppercase">
      {booking.vendor_name?.charAt(0) ?? "V"}
    </div>

    <div className="min-w-0">
      <p className="text-sm font-semibold text-gray-900 capitalize truncate">
        {booking.vendor_name}
      </p>
      <p className="text-xs text-gray-400 truncate">
        {booking.vendor_email}
      </p>
    </div>
  </div>

  {/* Divider */}
  <div className="border-t border-gray-100 mb-4" />

  {/* Contact Info */}
  <div className="space-y-3">

    {/* Phone */}
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center">
        <svg
          className="w-4 h-4 text-green-600"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.03 1.18 2 2 0 012 0h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 14.92z" />
        </svg>
      </div>

      <div>
        <p className="text-xs text-gray-400">Phone</p>
        <p className="text-sm font-semibold text-gray-900">
          {booking.vendor_phone}
        </p>
      </div>
    </div>

  </div>

  {/* Spacer pushes button down */}
  <div className="flex-1" />

  {/* Call Button */}
  <a
    href={`tel:${booking.vendor_phone}`}
    className="mt-5 w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold py-2.5 rounded-xl transition"
  >
    Call Owner
  </a>

</div>
          {/* ── SUCCESS HEADER CARD (RIGHT) ── */}
          <div className="bg-white rounded-3xl shadow-sm p-8 flex flex-col items-center justify-center text-center flex-1">
            <AnimatedCheck />

            <h2 className="fade-up delay-1 text-2xl font-bold text-gray-900 mt-5 tracking-tight">
              Booking Confirmed!
            </h2>
            <p className="fade-up delay-2 text-gray-500 text-sm mt-1">
              Your stay has been successfully booked.
            </p>

            {/* Countdown pill */}
            <div className="fade-up delay-3 mt-4 inline-flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-xs font-medium px-4 py-2 rounded-full">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Redirecting in {secondsLeft}s…
            </div>

            {/* Booking ID inline */}
            <p className="fade-up delay-4 mt-4 text-xs text-gray-400">
              Booking ID:{" "}
              <span className="font-mono font-semibold text-gray-500">#{booking.id}</span>
            </p>
          </div>
        </div>

        {/* ── BOOKING DETAILS CARD (FULL WIDTH BELOW) ── */}
        <div className="bg-white rounded-3xl shadow-sm p-6 space-y-3">
          <p className="fade-up delay-3 text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">
            Booking Details
          </p>
          <Row label="Property"  value={booking.property_name} delay="delay-3" />
          <div className="border-t border-dashed border-gray-100" />
          <Row
            label="Address"
            value={`${booking.address}${booking.place && booking.place !== booking.address ? `, ${booking.place}` : ""}`}
            delay="delay-3"
          />
          <div className="border-t border-dashed border-gray-100" />
          <Row label="Check-in"  value={formatDate(booking.check_in_date)}  delay="delay-4" />
          <div className="border-t border-dashed border-gray-100" />
          <Row label="Check-out" value={formatDate(booking.check_out_date)} delay="delay-4" />
          <div className="border-t border-dashed border-gray-100" />
          <Row
            label="Duration"
            value={`${booking.number_of_months} Month${booking.number_of_months > 1 ? "s" : ""}`}
            delay="delay-4"
          />
          <div className="border-t border-gray-100" />
          <Row
            label="Amount Paid"
            value={`₹${booking.total_amount.toLocaleString("en-IN")}`}
            highlight
            delay="delay-5"
          />
        </div>

      </div>
    </div>
  );
}