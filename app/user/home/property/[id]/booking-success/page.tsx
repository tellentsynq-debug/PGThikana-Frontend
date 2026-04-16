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

          // ✅ Only if confirmed + paid
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
      <div className="h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F0EB] p-6">

      <div className="max-w-md mx-auto bg-white rounded-2xl shadow p-6">

        {/* ✅ ICON */}
        <div className="flex justify-center">
          <div className="text-green-500 text-6xl">✔</div>
        </div>

        {/* ✅ TITLE */}
        <h2 className="text-center text-xl font-bold mt-4">
          Booking Successful!
        </h2>

        {/* ✅ COUNTDOWN */}
        <p className="text-center text-gray-500 mt-1">
          Redirecting in {secondsLeft} sec...
        </p>

        {/* ✅ DETAILS */}
        <div className="mt-6 space-y-3 text-sm">

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
          />

        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: any) {
  return (
    <div className="flex justify-between">
      <span className="text-gray-600">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}