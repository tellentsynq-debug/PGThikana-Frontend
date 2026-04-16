"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DocumentPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [showAadhar, setShowAadhar] = useState(false);
  const [showPan, setShowPan] = useState(false);

  const router = useRouter();

  // ✅ FETCH PROFILE (UPDATED)
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("userToken");

        const res = await fetch("https://pgthikana.in/api/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const json = await res.json();

        if (json.success) {
          setData(json); // ✅ store full response
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading || !data) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin w-6 h-6 border-2 border-teal-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  const { documents, documentSummary, verificationDetails } = data;

  // ✅ STATUS COLOR LOGIC
  const getStatusUI = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-700";
      case "rejected":
        return "bg-red-100 text-red-700";
      default:
        return "bg-orange-100 text-orange-700";
    }
  };

  const getStatusText = (status: string) => {
    if (status === "approved") return "Approved";
    if (status === "rejected") return "Rejected";
    return "Pending";
  };

  // ✅ OVERALL STATUS
  const overallStatus =
    documentSummary.approvalPercentage === 100
      ? "approved"
      : documentSummary.rejected > 0
      ? "rejected"
      : "pending";

  return (
    <div className="min-h-screen bg-[#F5F7F9]">

      {/* HEADER */}
      <div className="bg-white px-4 py-4 flex items-center gap-3">

  {/* BACK BUTTON */}
  <button
    onClick={() => router.back()}
    className="w-10 h-10 flex items-center justify-center rounded-full bg-black text-white shadow"
  >
    ←
  </button>

  {/* TITLE */}
  <h1 className="text-lg font-semibold text-white">
    Document Verification
  </h1>

</div>

      <div className="max-w-md mx-auto p-4 space-y-4">

        {/* 🔥 PROGRESS */}
        <div className="bg-white p-4 rounded-xl shadow">
          <p className="text-sm text-gray-600 mb-2">
            Completion: {documentSummary.completionPercentage}%
          </p>

          <div className="w-full bg-gray-200 h-2 rounded-full">
            <div
              className="bg-teal-600 h-2 rounded-full"
              style={{
                width: `${documentSummary.completionPercentage}%`,
              }}
            />
          </div>
        </div>

        {/* ================= AADHAAR ================= */}
        <Card
          title="Aadhaar Verification"
          status={documents.aadhar_front.status}
          expanded={showAadhar}
          onClick={() => setShowAadhar(!showAadhar)}
        >
          {documents.aadhar_front.exists && (
            <ImageBlock
              title="Aadhaar Front"
              url={documents.aadhar_front.url}
              status={documents.aadhar_front.status}
            />
          )}

          {documents.aadhar_back.exists && (
            <ImageBlock
              title="Aadhaar Back"
              url={documents.aadhar_back.url}
              status={documents.aadhar_back.status}
            />
          )}
        </Card>

        {/* ================= PAN ================= */}
        <Card
          title="PAN Verification"
          status={documents.pancard.status}
          expanded={showPan}
          onClick={() => setShowPan(!showPan)}
        >
          {documents.pancard.exists && (
            <ImageBlock
              title="PAN Card"
              url={documents.pancard.url}
              status={documents.pancard.status}
            />
          )}
        </Card>

        {/* ================= FINAL STATUS ================= */}
        <div className="bg-white p-5 rounded-2xl shadow text-center">
          <h2 className="font-semibold text-gray-800">
            Verification Status
          </h2>

          <div
            className={`mt-3 inline-flex px-4 py-1 rounded-full font-semibold text-sm ${getStatusUI(
              overallStatus
            )}`}
          >
            {getStatusText(overallStatus)}
          </div>

          <p className="text-gray-500 text-sm mt-3">
            {overallStatus === "approved"
              ? "Your documents are fully verified."
              : overallStatus === "rejected"
              ? verificationDetails?.rejectionReason || "Some documents rejected."
              : "Your documents are under review."}
          </p>
        </div>
      </div>
    </div>
  );
}

/* 🔹 CARD */
function Card({ title, status, expanded, onClick, children }: any) {
  const getColor = (status: string) => {
    if (status === "approved") return "bg-green-100 text-green-700";
    if (status === "rejected") return "bg-red-100 text-red-700";
    return "bg-orange-100 text-orange-700";
  };

  return (
    <div className="bg-white rounded-2xl shadow overflow-hidden">
      <div
        onClick={onClick}
        className="flex justify-between p-4 cursor-pointer"
      >
        <span className="font-semibold text-black">{title}</span>

        <div className="flex gap-2 items-center">
          <span className={`px-2 py-1 text-xs rounded-full ${getColor(status)}`}>
            {status}
          </span>
          <span>{expanded ? "▲" : "▼"}</span>
        </div>
      </div>

      {expanded && <div className="p-4">{children}</div>}
    </div>
  );
}

/* 🔹 IMAGE */
function ImageBlock({ title, url, status }: any) {
  return (
    <div className="mb-4">
      <p className="text-sm font-medium mb-1">{title}</p>

      <img
        src={url}
        className="w-full h-40 object-cover rounded-xl border"
      />

      <p className="text-xs mt-1 text-gray-500">Status: {status}</p>
    </div>
  );
}