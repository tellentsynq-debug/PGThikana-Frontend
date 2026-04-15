"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

interface Booking {
  id: number;
  property_name: string;
  address: string;
  check_in_date: string;
  check_out_date: string;
  number_of_months: number;
  rent_amount: number;
  total_amount: number;
  booking_status?: string;
  payment_status?: string;
  documents?: any[];
document_status?: "approved" | "rejected" | "pending";
rejectionReason?: string;
  user: {
    name: string;
    phone: string;
    email: string;
    gender?: string;
    place?: string;
    address?: string;
    emergency_number?: string;
    profile_image?: string;
    aadhar_front?: string;
    aadhar_back?: string;
    pancard?: string;
  };
}

export default function VendorBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("vendorToken")
      : null;

      const [actionLoading, setActionLoading] = useState<number | null>(null);
const [rejectReason, setRejectReason] = useState<Record<number, string>>({});


const handleVerify = async (id: number, status: "approved" | "rejected") => {
  try {
    setActionLoading(id);

    const body: any = { status };

    if (status === "rejected") {
      if (!rejectReason[id]) {
        alert("Please enter rejection reason");
        return;
      }
      body.rejectionReason = rejectReason[id];
    }

    const res = await fetch(
      `https://pgthikana.in/api/booking/document/${id}/verify`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      }
    );

    const data = await res.json();

    if (data.success) {
      alert(data.message);
      fetchBookings(); // refresh
    }
  } catch (e) {
    console.error(e);
  } finally {
    setActionLoading(null);
  }
};

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await fetch(
        "https://pgthikana.in/api/booking/vendor-bookings",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (data.success) {
        setBookings(data.bookings);
      }
    } catch (e) {
      console.error("Booking error:", e);
    }

    setLoading(false);
  };

  const getStatusColor = (status?: string) => {
    if (status === "confirmed") return "bg-green-100 text-green-700";
    if (status === "pending") return "bg-yellow-100 text-yellow-800";
    if (status === "cancelled") return "bg-red-100 text-red-700";
    return "bg-gray-100 text-gray-700";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F0EB]">
        <div className="animate-spin h-8 w-8 border-4 border-[#0F766E] border-t-transparent rounded-full" />
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F0EB]">
        <p className="text-[#333] text-lg">No bookings found</p>
      </div>
    );
  }



  return (
    <div className="min-h-screen bg-[#F5F0EB] px-6 py-8">
      <div className="max-w-5xl mx-auto">

   <div className="flex items-center gap-3 mb-6">

  {/* 🔥 BACK BUTTON */}
  <button
    onClick={() => router.back()}
    className="w-9 h-9 flex items-center justify-center rounded-full bg-[#0F766E] text-white hover:bg-[#0c6560] transition"
  >
    <ArrowLeft size={18} />
  </button>

  <h1 className="text-2xl font-bold text-[#1A1A1A]">
    📋 Bookings
  </h1>

</div>
        <div className="space-y-6">
          {bookings.map((b) => {
  // ✅ DEFINE HERE (IMPORTANT FIX)
  const isVerified = b.booking_status === "confirmed"; // temp mapping
  const isRejected = false;

  return (
    <div
      key={b.id}
      className="bg-white rounded-2xl p-6 shadow-md border hover:shadow-lg transition"
    >

      {/* PROPERTY */}
      <h2 className="text-lg font-bold text-[#1A1A1A]">
        {b.property_name}
      </h2>
      <p className="text-sm text-[#444] mb-4">
        📍 {b.address}
      </p>

      {/* USER */}
      <div className="flex items-center gap-4 mb-5">
        <img
          src={b.user?.profile_image}
          onError={(e) => {
            e.currentTarget.src =
              "https://ui-avatars.com/api/?name=" + b.user?.name;
          }}
          className="w-14 h-14 rounded-full object-cover border"
        />

        <div>
          <p className="font-semibold text-[#111]">
            {b.user?.name}
          </p>
          <p className="text-sm text-[#333]">
            📞 {b.user?.phone}
          </p>
          <p className="text-xs text-gray-600">
            {b.user?.email}
          </p>
        </div>
      </div>

      {/* USER DETAILS */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm mb-5">
        <div>
          <p className="text-gray-500 text-xs">Gender</p>
          <p className="font-medium text-black">{b.user?.gender}</p>
        </div>

        <div>
          <p className="text-gray-500 text-xs">City</p>
          <p className="font-medium text-black">{b.user?.place}</p>
        </div>

        <div>
          <p className="text-gray-500 text-xs">Emergency</p>
          <p className="font-medium text-black">
            {b.user?.emergency_number}
          </p>
        </div>
      </div>

      {/* BOOKING DETAILS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-5">
        <div>
          <p className="text-gray-500 text-xs">Check-in</p>
          <p className="font-semibold text-black">
            {b.check_in_date?.substring(0, 10)}
          </p>
        </div>

        <div>
          <p className="text-gray-500 text-xs">Check-out</p>
          <p className="font-semibold text-black">
            {b.check_out_date?.substring(0, 10)}
          </p>
        </div>

        <div>
          <p className="text-gray-500 text-xs">Months</p>
          <p className="font-semibold text-black">
            {b.number_of_months}
          </p>
        </div>

        <div>
          <p className="text-gray-500 text-xs">Rent / Month</p>
          <p className="font-semibold text-[#0F766E]">
            ₹{b.rent_amount}
          </p>
        </div>

        <div>
          <p className="text-gray-500 text-xs">Total</p>
          <p className="font-bold text-[#0F766E]">
            ₹{b.total_amount}
          </p>
        </div>
      </div>

      {/* DOCUMENTS */}
      <div className="mb-5">
        <p className="text-sm font-semibold mb-3 text-black">
          Documents
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {b.user?.aadhar_front && (
            <div className="text-center">
              <p className="text-xs text-gray-500 mb-1">Aadhar Front</p>
              <img
                src={b.user.aadhar_front}
                onClick={() => window.open(b.user.aadhar_front, "_blank")}
                className="w-full h-24 object-cover rounded-lg border cursor-pointer hover:scale-105 transition"
              />
            </div>
          )}

          {b.user?.aadhar_back && (
            <div className="text-center">
              <p className="text-xs text-gray-500 mb-1">Aadhar Back</p>
              <img
                src={b.user.aadhar_back}
                onClick={() => window.open(b.user.aadhar_back, "_blank")}
                className="w-full h-24 object-cover rounded-lg border cursor-pointer hover:scale-105 transition"
              />
            </div>
          )}

          {b.user?.pancard && (
            <div className="text-center">
              <p className="text-xs text-gray-500 mb-1">PAN Card</p>
              <img
                src={b.user.pancard}
                onClick={() => window.open(b.user.pancard, "_blank")}
                className="w-full h-24 object-cover rounded-lg border cursor-pointer hover:scale-105 transition"
              />
            </div>
          )}
        </div>
      </div>

      {/* ACTIONS */}
      <div className="mt-4 border-t pt-4">

        {!isVerified && !isRejected && (
          <>
            <input
              type="text"
              placeholder="Enter rejection reason (if rejecting)"
              value={rejectReason[b.id] || ""}
              onChange={(e) =>
                setRejectReason((prev) => ({
                  ...prev,
                  [b.id]: e.target.value,
                }))
              }
              className="w-full mb-3 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
            />

            <div className="flex gap-3">
              <button
                disabled={actionLoading === b.id}
                onClick={() => handleVerify(b.id, "approved")}
                className="flex-1 bg-[#0F766E] text-white py-2 rounded-lg font-semibold hover:bg-[#0c6560] transition disabled:opacity-50"
              >
                {actionLoading === b.id ? "Processing..." : "Approve"}
              </button>

              <button
                disabled={actionLoading === b.id}
                onClick={() => handleVerify(b.id, "rejected")}
                className="flex-1 border border-red-500 text-red-600 py-2 rounded-lg font-semibold hover:bg-red-50 transition disabled:opacity-50"
              >
                Reject
              </button>
            </div>
          </>
        )}

        {isVerified && (
          <div className="text-green-600 font-semibold text-sm">
            ✅ Documents Approved
          </div>
        )}

        {isRejected && (
          <div className="text-red-600 text-sm font-semibold">
            ❌ Rejected: {b.rejectionReason || "No reason provided"}
          </div>
        )}

      </div>

      {/* STATUS */}
      <div className="flex gap-3 mt-3">
        {b.booking_status && (
          <span className={`px-3 py-1 text-xs rounded-full font-semibold ${getStatusColor(b.booking_status)}`}>
            {b.booking_status.toUpperCase()}
          </span>
        )}
        {b.payment_status && (
          <span className={`px-3 py-1 text-xs rounded-full font-semibold ${
            b.payment_status === "paid"
              ? "bg-green-100 text-green-700"
              : "bg-yellow-100 text-yellow-800"
          }`}>
            {b.payment_status.toUpperCase()}
          </span>
        )}
      </div>

    </div>
  );
})}</div></div></div>)}