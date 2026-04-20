"use client";

import { toast } from "@/app/context/SnackbarContext";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function PropertyDetailsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [current, setCurrent] = useState(0);

  // ✅ LOAD PROPERTY
  useEffect(() => {
    const data = searchParams.get("data");

    if (data) {
      const parsed = JSON.parse(decodeURIComponent(data));
      setProperty(parsed);
    }
  }, [searchParams]);

  useEffect(() => {
  if (!property?.images?.length) return;

  const interval = setInterval(() => {
    setCurrent((prev) =>
      prev === property.images.length - 1 ? 0 : prev + 1
    );
  }, 3000);

  return () => clearInterval(interval);
}, [property]);

  // ✅ LOAD RAZORPAY SCRIPT
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  // ✅ CREATE BOOKING + PAYMENT FLOW
  const createBooking = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("userToken");

      if (!token) {
        toast("Login required");
        router.push("/user/create-account");
        return;
      }

      const res = await fetch("https://pgthikana.in/api/booking/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          propertyId: property.id,
          checkInDate: new Date().toISOString().split("T")[0],
          numberOfMonths: 1,
          rentAmount: Number(property.rent_per_month || 0),
        }),
      });

      const data = await res.json();

      if (res.status !== 200 && res.status !== 201) {
        toast(data.message || "Booking failed");
        return;
      }

      const bookingId = data.booking.id;
      const orderId = data.razorpay.orderId;
      const amount = data.razorpay.amount;

      // ✅ OPEN RAZORPAY
      const options = {
        key: "rzp_live_SPbWESdccLltRZ",
        amount: amount,
        currency: "INR",
        name: "PG Thikana",
        description: "PG Booking",
        order_id: orderId,

        handler: async function (response: any) {
          try {
            const verifyRes = await fetch(
              "https://pgthikana.in/api/booking/verify-payment",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                  bookingId: bookingId,
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpayOrderId: response.razorpay_order_id,
                  razorpaySignature: response.razorpay_signature,
                }),
              }
            );

            if (verifyRes.status === 200) {
              toast("Booking Confirmed 🎉");
           router.push(`/user/home/property/${property.id}/booking-success`);
            } else {
              toast("Payment verification failed");
            }
          } catch (err) {
            console.error(err);
            toast("Verification error");
          }
        },

        modal: {
          ondismiss: function () {
            toast("Payment cancelled");
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      toast("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // ✅ LOADING UI (AFTER ALL HOOKS)
  if (!property) {
    return (
      <div className="h-screen flex items-center justify-center text-black bg-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      {/* 🔥 HEADER */}
<div className="sticky top-0 z-20 bg-white px-4 py-3 flex items-center gap-3">

  {/* BACK BUTTON */}
  <button
    onClick={() => router.back()}
    className="w-10 h-10 flex items-center justify-center rounded-full bg-white text-black shadow"
  >
    ←
  </button>

  {/* TITLE */}
  <h1 className="text-white font-semibold text-lg">
    Property Details
  </h1>

</div>
      <div className="max-w-5xl mx-auto px-4 py-6">
        
        {/* IMAGE */}
        {/* 🔥 IMAGE SLIDER */}
<div className="relative">

<div className="relative overflow-hidden rounded-xl aspect-[16/9] md:aspect-[21/9]">

  <div
    className="flex transition-transform duration-500"
    style={{
      transform: `translateX(-${current * 100}%)`,
    }}
  >
    {(property.images || []).map((img: any, i: number) => (
      <img
        key={i}
        src={img?.image_url || img}
        className="w-full h-full object-cover flex-shrink-0"
      />
    ))}
  </div>

  {/* DOTS */}
  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
    {(property.images || []).map((_: any, i: number) => (
      <div
        key={i}
        className={`w-2 h-2 rounded-full ${
          current === i ? "bg-white" : "bg-white/50"
        }`}
      />
    ))}
  </div>

</div>



</div>

        {/* CONTENT */}
        <div className="mt-6 grid md:grid-cols-3 gap-6 items-start">
          
          {/* LEFT */}
          <div className="md:col-span-2">
  <div className="space-y-5 h-full">
            
            <div className="bg-white border p-5 rounded-xl">
              <h1 className="text-2xl font-bold text-black">
                {property.property_name}
              </h1>

              <p className="text-gray-600 mt-1">
                {property.address}
              </p>

              <p className="text-teal-600 font-bold text-lg mt-3">
                ₹{property.rent_per_month}/month
              </p>
            </div>

            <div className="bg-white border p-5 rounded-xl">
              <h2 className="font-semibold text-black mb-4">
                Property Details
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <Info label="Type" value={property.property_type} />
                <Info label="Sharing" value={property.sharing_type} />
                <Info label="Rooms" value={property.total_rooms} />
                <Info label="Available" value={property.available_rooms} />
                <Info label="Category" value={property.pg_category} />
                <Info label="Bathroom" value={property.bathroom_type} />
              </div>
            </div>

           
            <div className="bg-white border p-5 rounded-xl">
              <h2 className="font-semibold text-black mb-2">
                Description
              </h2>
              <p className="text-gray-700">
                {property.description || "No description"}
              </p>
            </div>

            <div className="bg-white border p-5 rounded-xl">
              <h2 className="font-semibold text-black mb-2">
                Rules
              </h2>
              <p className="text-gray-700">
                {property.rulesAndRegulations || "No rules"}
              </p>
            </div>
          </div>
          </div>
          {/* RIGHT */}
          <div className="h-fit">
            <div className="bg-white border p-5 rounded-xl space-y-4 sticky top-20">
              
              <h2 className="font-semibold text-black">
                Quick Actions
              </h2>

   <div className="relative">

  {/* ✅ ACTUAL DATA (LIKE FLUTTER) */}
  <div className="bg-white border p-4 rounded-xl shadow">

    <div className="flex justify-between mb-2">
      <span className="text-gray-500 text-sm">Name</span>
      <span className="font-semibold">
        {property.propertyManager?.managerName || "-"}
      </span>
    </div>

    <div className="flex justify-between">
      <span className="text-gray-500 text-sm">Phone</span>
      <span className="font-semibold">
        {property.propertyManager?.managerPhone || "-"}
      </span>
    </div>

  </div>

  {/* 🔥 BLUR OVERLAY (KEY PART) */}
  <div className="absolute inset-0 rounded-xl backdrop-blur-sm bg-white/70 flex items-center justify-center">

    <div className="text-center">
      <div className="text-teal-600 text-xl">🔒</div>
      <p className="text-teal-600 font-semibold text-sm mt-1">
        Book to unlock
      </p>
    </div>

  </div>

</div>

              <button
                onClick={createBooking}
                disabled={loading}
                className="w-full bg-teal-600 text-white py-3 rounded-lg font-semibold"
              >
                {loading ? "Processing..." : "Book Now"}
              </button>

              
            </div>

            {/* 🔥 AMENITIES CARD (MOVED RIGHT) */}
<div className="bg-white border p-5 rounded-xl">
  <h2 className="font-semibold text-black mb-3">
    Amenities
  </h2>

  <div className="flex flex-wrap gap-2">
    {(property.amenities || []).map((a: string, i: number) => (
      <span
        key={i}
        className="bg-gray-100 px-3 py-1 rounded-full text-sm text-black"
      >
        {a}
      </span>
    ))}
  </div>
</div>
          </div>

        </div>
      </div>
    </div>
  );
}

function Info({ label, value }: any) {
  return (
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="font-semibold text-black">{value || "-"}</p>
    </div>
  );
}