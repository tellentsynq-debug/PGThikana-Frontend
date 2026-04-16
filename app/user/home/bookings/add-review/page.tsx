"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const API_BASE = "https://pgthikana.in/api";

export default function Page() {
  const router = useRouter();

  // ✅ store params manually
  const [propertyId, setPropertyId] = useState<string | null>(null);

  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("userToken")
      : null;

  // 🔥 FIX: read params from window (client only)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setPropertyId(params.get("propertyId"));
  }, []);

  const showToast = (msg: string) => {
    const el = document.createElement("div");
    el.innerText = msg;
    el.className =
      "fixed bottom-6 left-1/2 -translate-x-1/2 bg-black text-white px-4 py-2 rounded-lg shadow-lg text-sm z-50";
    document.body.appendChild(el);

    setTimeout(() => el.remove(), 2500);
  };

  const submitReview = async () => {
    if (rating === 0) {
      showToast("Please select a rating");
      return;
    }

    if (!review.trim()) {
      showToast("Please write a review");
      return;
    }

    if (!propertyId) {
      showToast("Invalid property");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/property/review`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          propertyId: Number(propertyId),
          rating,
          reviewText: review.trim(),
        }),
      });

      if (res.status === 201) {
        showToast("Review submitted successfully");
        setTimeout(() => router.back(), 800);
      } else {
        showToast("Failed to submit review");
      }
    } catch (e) {
      showToast("Something went wrong");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-white">

      {/* HEADER */}
      <div className="sticky top-0 z-10 bg-white border-b px-4 py-3 flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="w-10 h-10 rounded-full bg-gray-900 text-white flex items-center justify-center shadow"
        >
          ←
        </button>

        <h1 className="text-lg font-semibold text-gray-900">
          Add Review
        </h1>
      </div>

      {/* CONTENT */}
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-8">

        {/* RATING */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Rate your experience
          </h2>

          <div className="flex gap-2 mt-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
                className={`text-3xl ${
                  star <= (hover || rating)
                    ? "text-yellow-500"
                    : "text-gray-300"
                }`}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        {/* REVIEW */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Write your review
          </h2>

          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="Share your experience..."
            className="w-full mt-3 p-4 rounded-xl border border-gray-200 text-gray-900 outline-none focus:ring-2 focus:ring-teal-500"
            rows={5}
          />
        </div>

        {/* SUBMIT */}
        <button
          onClick={submitReview}
          disabled={loading}
          className="w-full h-12 bg-[#0F766E] text-white rounded-xl font-semibold"
        >
          {loading ? "Submitting..." : "Submit Review"}
        </button>

      </div>
    </div>
  );
}