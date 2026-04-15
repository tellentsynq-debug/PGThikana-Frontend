"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

const API_BASE = "https://pgthikana.in/api";

export default function MyBookingsPage() {
  const router = useRouter();

  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("userToken")
      : null;

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await fetch(`${API_BASE}/booking/my-bookings`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        const confirmed = (data.bookings || []).filter(
          (b: any) => b.booking_status === "confirmed"
        );
        setBookings(confirmed);
      }

      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const formatDate = (date: string) => {
    const d = new Date(date);
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
  };

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-white text-black">
        Loading...
      </div>
    );
  }

  /* ================= EMPTY ================= */
  if (!bookings.length) {
    return (
      <div className="h-screen flex items-center justify-center bg-white text-gray-700 text-lg">
        No Confirmed Bookings
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">

      {/* 🔥 HEADER */}
      <div className="sticky top-0 z-20 bg-white border-b px-4 py-3 flex items-center gap-3">
<button
  onClick={() => router.back()}
  className="w-10 h-10 flex items-center justify-center rounded-full 
             bg-gray-900 text-black shadow-md 
             hover:bg-black transition"
>
  <ArrowLeft size={20} />
</button>

        <h1 className="text-lg font-semibold text-gray-900">
          My Bookings
        </h1>
      </div>

      {/* 🔥 LIST */}
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-5">

        {bookings.map((booking) => (
          <div
            key={booking.id}
            className="bg-white border rounded-2xl p-5 shadow-sm hover:shadow-md transition"
          >

            {/* 🔥 TOP */}
            <h2 className="text-xl font-bold text-gray-900">
              {booking.property_name}
            </h2>

            <p className="text-gray-600 mt-1">
              {booking.address}
            </p>

            {/* 🔥 DATES */}
            <div className="mt-4 space-y-2 text-sm text-gray-800">

              <div className="flex items-center gap-2">
                <span className="text-teal-600 font-medium">Check-in:</span>
                {formatDate(booking.check_in_date)}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-teal-600 font-medium">Check-out:</span>
                {formatDate(booking.check_out_date)}
              </div>

            </div>

            {/* 🔥 PRICE */}
            <div className="mt-4 flex justify-between items-center">
              <p className="text-teal-700 text-black font-bold text-lg">
                ₹{booking.rent_per_month}/month
              </p>
            </div>

            <div className="my-4 border-t" />

            {/* 🔥 MANAGER */}
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-900">
                Property Manager
              </h3>

              <p className="text-gray-700">
                👤 {booking.vendor_name}
              </p>

              <p className="text-gray-700">
                📞 {booking.vendor_phone}
              </p>
            </div>

            {/* 🔥 ACTIONS */}
            <div className="mt-5 space-y-3">

              {/* ADD REVIEW */}
              <button
                onClick={() => {
                  router.push(
                    `/user/home/bookings/add-review?propertyId=${booking.property_id}`
                  );
                }}
                className="w-full bg-[#0F766E] text-white py-3 rounded-xl font-semibold hover:bg-teal-700 transition"
              >
                Add Review
              </button>

              {/* REPORT */}
              <button
                onClick={() => {
                  router.push(
                    `/user/report?propertyId=${booking.property_id}`
                  );
                }}
                className="w-full border border-red-500 text-red-600 py-3 rounded-xl font-semibold hover:bg-red-50 transition"
              >
                Report Complaint
              </button>

              {/* CHAT */}
              <button
                onClick={async () => {
                  try {
                    const res = await fetch(
                      `${API_BASE}/room/conversation`,
                      {
                        method: "POST",
                        headers: {
                          Authorization: `Bearer ${token}`,
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                          recipientId: booking.vendor_id,
                          recipientType: "vendor",
                        }),
                      }
                    );

                    const data = await res.json();

                    if (res.ok) {
                      router.push(
                        `/user/chat?conversationId=${data.conversationId}&name=${booking.vendor_name}`
                      );
                    } else {
                      alert("Failed to open chat");
                    }
                  } catch (err) {
                    console.error(err);
                  }
                }}
                className="w-full bg-[#0F766E] text-white py-3 rounded-xl font-semibold hover:bg-teal-700 transition"
              >
                Chat with Manager
              </button>

            </div>
          </div>
        ))}

      </div>
    </div>
  );
}