"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";

interface Booking {
  id: number;
  user_name: string;
  user_email: string;
  user_phone: string;
  property_name: string;
  address: string;
  place: string;
  check_in_date: string;
  check_out_date: string;
  number_of_months: number;
  rent_amount: number;
  total_amount: number;
  booking_status: string;
  payment_status: string;
  created_at: string;
}

export default function BookingDetailsPage() {
  const params = useParams();
const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const router = useRouter();

  const [booking, setBooking] = useState<Booking | null>(null);

  useEffect(() => {
    fetchBooking();
  }, []);

  const fetchBooking = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `https://pgthikana.in/api/booking/admin/bookings?id=${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      setBooking(data.bookings?.[0]);
    } catch (err) {
      console.error(err);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (!booking) {
    return (
      <div className="ml-[var(--sidebar-width)] p-10">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="ml-[var(--sidebar-width)] min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 p-8">

      {/* 🔙 BACK BUTTON */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 mb-6 text-gray-600 hover:text-black transition"
      >
        <ArrowLeft size={18} />
        Back
      </button>

      {/* 🔥 MAIN CARD */}
      <div className="bg-[#0D5F58] rounded-3xl p-8 shadow-xl text-white">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold">
            Booking Details
          </h1>

          <span className="px-4 py-1 rounded-full bg-green-200 text-green-900 text-sm">
            {booking.booking_status}
          </span>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* USER INFO */}
          <Card title="User Info">
            <Item label="Name" value={booking.user_name} />
            <Item label="Email" value={booking.user_email} />
            <Item label="Phone" value={booking.user_phone} />
          </Card>

          {/* PROPERTY INFO */}
          <Card title="Property Info">
            <Item label="Property" value={booking.property_name} />
            <Item label="Address" value={booking.address} />
            <Item label="City" value={booking.place} />
          </Card>

          {/* BOOKING INFO */}
          <Card title="Booking Info">
            <Item label="Check In" value={formatDate(booking.check_in_date)} />
            <Item label="Check Out" value={formatDate(booking.check_out_date)} />
            <Item label="Months" value={booking.number_of_months} />
            <Item label="Created At" value={formatDate(booking.created_at)} />
          </Card>

          {/* PAYMENT INFO */}
          <Card title="Payment Info">
            <Item label="Rent / Month" value={`₹${booking.rent_amount}`} />
            <Item label="Total Amount" value={`₹${booking.total_amount}`} />
            <Item label="Payment Status" value={booking.payment_status} />
          </Card>

        </div>

      </div>
    </div>
  );
}

/* 🔥 SMALL COMPONENTS */

function Card({ title, children }: any) {
  return (
    <div className="bg-[#0F766E] p-5 rounded-2xl">
      <h3 className="mb-3 font-semibold text-lg">{title}</h3>
      <div className="space-y-2 text-sm">{children}</div>
    </div>
  );
}

function Item({ label, value }: any) {
  return (
    <div className="flex justify-between border-b border-white/10 pb-1">
      <span className="text-gray-200">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}