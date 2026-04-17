"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function BookingSuccessPage() {
  const router = useRouter();

  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [secondsLeft, setSecondsLeft] = useState(3);

  // ✅ FETCH BOOKING
  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const token = localStorage.getItem("userToken");

        const res = await fetch(
          "https://pgthikana.in/api/booking/my-bookings",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();

        if (data.success && data.bookings.length > 0) {
          const latestBooking = data.bookings[0];

          setBooking(latestBooking);
          setLoading(false);

          if (
            latestBooking.booking_status === "confirmed" &&
            latestBooking.payment_status === "paid"
          ) {
            startCountdown(latestBooking);
          }
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchBooking();
  }, []);

  // ✅ COUNTDOWN
  const startCountdown = (booking: any) => {
    let seconds = 3;

    const interval = setInterval(() => {
      seconds--;
      setSecondsLeft(seconds);

      if (seconds <= 0) {
        clearInterval(interval);

        router.push(
          `/user/home/property/${booking.property_id}/booking-success/verification?bookingId=${booking.id}`
        );
      }
    }, 1000);
  };

  // ✅ LOADING
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-900">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F0EB] flex items-center justify-center px-4">

      <div className="w-full max-w-md bg-white rounded-3xl shadow-lg p-6 sm:p-8">

        {/* ✅ ICON */}
        <div className="flex justify-center">
          <div className="w-16 h-16 flex items-center justify-center rounded-full bg-green-100 text-green-600 text-3xl font-bold shadow-sm">
            ✓
          </div>
        </div>

        {/* ✅ TITLE */}
        <h2 className="text-center text-2xl font-bold text-gray-900 mt-5">
          Booking Successful!
        </h2>

        {/* ✅ COUNTDOWN */}
        <p className="text-center text-gray-700 mt-2">
          Redirecting in{" "}
          <span className="font-semibold text-gray-900">
            {secondsLeft}s
          </span>
        </p>

        {/* ✅ DIVIDER */}
        <div className="my-6 border-t border-gray-200"></div>

        {/* ✅ DETAILS */}
        <div className="space-y-4 text-sm">
          <Row label="Property" value={booking.property_name} />
          <Row label="Address" value={booking.address} />
          <Row label="Check-in" value={booking.check_in_date} />
          <Row
            label="Duration"
            value={`${booking.number_of_months} Month`}
          />
          <Row
            label="Amount Paid"
            value={`₹${booking.total_amount}`}
            highlight
          />
        </div>
      </div>
    </div>
  );
}

// ✅ ROW COMPONENT
function Row({ label, value, highlight }: any) {
  return (
    <div className="flex justify-between items-start gap-4">
      <span className="text-gray-700">{label}</span>
      <span
        className={`text-right font-semibold ${
          highlight ? "text-green-600" : "text-gray-900"
        }`}
      >
        {value}
      </span>
    </div>
  );
}