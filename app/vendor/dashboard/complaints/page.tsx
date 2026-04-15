"use client";

import { useEffect, useState } from "react";

export default function ComplaintsPage() {
  const [complaints, setComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const token = localStorage.getItem("vendorToken");

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

        setComplaints(data.complaints || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 ml-[var(--sidebar-width)] px-10 py-8">

      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-900">
          Complaints
        </h1>
        <p className="text-gray-500 text-sm">
          Manage all user complaints
        </p>
      </div>

      {/* LOADING */}
      {loading && (
        <p className="text-center text-gray-500">
          Loading complaints...
        </p>
      )}

      {/* EMPTY */}
      {!loading && complaints.length === 0 && (
        <p className="text-center text-gray-500">
          No complaints found
        </p>
      )}

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

        {complaints.map((c: any) => (
          <div
            key={c.id}
            className="bg-[#0D5F58] text-white p-5 rounded-2xl shadow-md"
          >

            {/* TOP */}
            <div className="flex justify-between items-center mb-3">

              <span className="text-xs bg-white/20 px-3 py-1 rounded-full capitalize">
                {c.status}
              </span>

              <span className="text-xs text-gray-200">
                {new Date(c.created_at).toDateString()}
              </span>

            </div>

            {/* IMAGE */}
            {c.image_url && (
              <div className="h-36 w-full mb-3 overflow-hidden rounded-lg">
                <img
                  src={c.image_url}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* TEXT */}
            <p className="text-sm mb-4">
              {c.complaint_text}
            </p>

            {/* PROPERTY */}
            <div className="text-sm text-gray-200 mb-2">
              <span className="font-semibold">Property:</span>{" "}
              {c.property?.propertyName} — {c.property?.place}
            </div>

            {/* USER */}
            <div className="text-sm text-gray-200 mb-2">
              <span className="font-semibold">User:</span>{" "}
              {c.user?.name} ({c.user?.phone})
            </div>

            {/* VENDOR */}
            <div className="text-sm text-gray-200 mb-4">
              <span className="font-semibold">Vendor:</span>{" "}
              {c.vendor?.name}
            </div>

            {/* REPLY */}
            {c.vendor_reply ? (
              <div className="bg-white/10 p-3 rounded-lg text-sm">
                <span className="font-semibold">Vendor Reply:</span>{" "}
                {c.vendor_reply}
              </div>
            ) : (
              <div className="text-xs text-red-200">
                No reply from vendor yet
              </div>
            )}

          </div>
        ))}

      </div>
    </div>
  );
}