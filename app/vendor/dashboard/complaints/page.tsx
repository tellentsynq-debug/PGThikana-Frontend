"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function ComplaintsPage() {
  const [complaints, setComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  const [replyText, setReplyText] = useState<{ [key: number]: string }>({});
const [replyLoading, setReplyLoading] = useState<{ [key: number]: boolean }>({});

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


  const handleReply = async (complaintId: number) => {
  try {
    const token = localStorage.getItem("vendorToken");

    if (!replyText[complaintId]) return alert("Enter reply first");

    setReplyLoading((prev) => ({ ...prev, [complaintId]: true }));

    const res = await fetch(
      `https://pgthikana.in/api/complaint/${complaintId}/reply`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          reply: replyText[complaintId],
        }),
      }
    );

    const data = await res.json();

    if (!res.ok) throw new Error(data.message);

    // update UI instantly
    setComplaints((prev) =>
      prev.map((c) =>
        c.id === complaintId
          ? { ...c, vendor_reply: replyText[complaintId] }
          : c
      )
    );

    // clear input
    setReplyText((prev) => ({ ...prev, [complaintId]: "" }));

  } catch (err) {
    console.error(err);
    alert("Failed to send reply");
  } finally {
    setReplyLoading((prev) => ({ ...prev, [complaintId]: false }));
  }
};

  return (
    <div className="min-h-screen bg-gray-50 ml-[var(--sidebar-width)] px-10 py-8">

      {/* HEADER */}
     <div className="flex items-center gap-3 mb-8">

  {/* BACK BUTTON */}
  <button
    onClick={() => router.back()}
    className="w-9 h-9 flex items-center justify-center rounded-full bg-[#0D5F58] text-white hover:bg-[#0a4c47] transition"
  >
    <ArrowLeft size={18} />
  </button>

  <div>
    <h1 className="text-3xl font-semibold text-gray-900">
      Complaints
    </h1>
    <p className="text-gray-500 text-sm">
      Manage all user complaints
    </p>
  </div>

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
  <div>
    <textarea
  placeholder="Write your reply..."
  rows={2}
  value={replyText[c.id] || ""}
  onChange={(e) =>
    setReplyText((prev) => ({
      ...prev,
      [c.id]: e.target.value,
    }))
  }
  className="w-full p-2 rounded-lg text-sm mb-2 
             bg-white/90 text-gray-800 
             border border-white/30 
             focus:outline-none focus:ring-2 focus:ring-white 
             placeholder:text-gray-400"
/>

    <button
      onClick={() => handleReply(c.id)}
      disabled={replyLoading[c.id]}
      className="bg-white text-[#0D5F58] px-4 py-1 rounded-lg text-sm font-medium hover:bg-gray-200 transition"
    >
      {replyLoading[c.id] ? "Sending..." : "Reply"}
    </button>
  </div>
)}

          </div>
        ))}

      </div>
    </div>
  );
}