"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/app/context/SnackbarContext";

export default function ReportComplaintPage() {
  const router = useRouter();

  // ✅ FIX: get param safely
  const [propertyId, setPropertyId] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setPropertyId(params.get("propertyId"));
  }, []);

  const [text, setText] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // 📸 HANDLE IMAGE PICK
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // 🚀 SUBMIT COMPLAINT
  const submitComplaint = async () => {
    if (!text.trim()) {
      toast("Please enter complaint");
      return;
    }

    const token = localStorage.getItem("userToken");

    if (!token) {
      toast("Login required");
      router.push("/user/create-account");
      return;
    }

    if (!propertyId) {
      toast("Invalid property");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("text", text);
      formData.append("propertyId", propertyId);

      if (image) {
        formData.append("image", image);
      }

      const res = await fetch(
        "https://pgthikana.in/api/complaint/create",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (res.status === 200 || res.status === 201) {
        toast("Complaint Submitted ✅");
        router.back();
      } else {
        toast("Failed to submit complaint");
      }
    } catch (err) {
      console.error(err);
      toast("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-xl mx-auto p-6">

        {/* HEADER */}
        <h1 className="text-2xl font-bold text-black mb-6">
          Report Complaint
        </h1>

        {/* CARD */}
        <div className="bg-white border rounded-2xl p-6 shadow-sm space-y-5">

          {/* TEXT INPUT */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Describe your issue
            </label>

            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={4}
              placeholder="Write your complaint..."
              className="w-full mt-2 p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-600 text-black"
            />
          </div>

          {/* IMAGE PREVIEW */}
          {preview && (
            <img
              src={preview}
              className="w-full h-40 object-cover rounded-xl"
            />
          )}

          {/* UPLOAD BUTTON */}
          <div>
            <label className="block">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />

              <div className="cursor-pointer border-2 border-dashed rounded-xl p-4 text-center text-black hover:bg-gray-50">
                Upload Image
              </div>
            </label>
          </div>

          {/* SUBMIT BUTTON */}
          <button
            onClick={submitComplaint}
            disabled={loading}
            className="w-full bg-teal-600 text-white py-3 rounded-xl font-semibold"
          >
            {loading ? "Submitting..." : "Submit Complaint"}
          </button>

        </div>
      </div>
    </div>
  );
}