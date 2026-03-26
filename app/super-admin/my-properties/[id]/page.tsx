"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function PropertyDetailPage() {
  const { id } = useParams();
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!property?.images?.length) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) =>
        prev === property.images.length - 1 ? 0 : prev + 1
      );
    }, 3000);
    return () => clearInterval(interval);
  }, [property]);

  const nextImage = () =>
    setCurrentIndex((prev) =>
      prev === property.images.length - 1 ? 0 : prev + 1
    );

  const prevImage = () =>
    setCurrentIndex((prev) =>
      prev === 0 ? property.images.length - 1 : prev - 1
    );

  const fetchProperty = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(
        "https://pgthikana.in/api/property/my-properties",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      const found = data.properties.find((p: any) => p.id === Number(id));
      setProperty(found);
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperty();
  }, []);

  if (loading)
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-4 border-[#0D5F58] border-t-transparent animate-spin" />
          <p className="text-[#0D5F58] font-semibold tracking-widest text-xs uppercase">
            Loading…
          </p>
        </div>
      </div>
    );

  if (!property)
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-500 text-lg">Property not found.</p>
      </div>
    );

  const occupancyPercent = property.totalRooms
  ? Math.round(
      ((property.totalRooms - property.availableRooms) / property.totalRooms) * 100
    )
  : 0;

  return (
    <div className="min-h-screen bg-gray-100 pl-[80px] md:pl-[60px]">

      {/* ══════════════════════════════════════
          HERO — full-width image slider
      ═══════════════════════════════════════ */}
      <div className="relative w-full h-[40vh] min-h-[260px] overflow-hidden">
        <img
          key={currentIndex}
          src={property.images?.[currentIndex]}
          alt={property.propertyName}
          className="w-full h-full object-cover transition-opacity duration-700"
        />

        {/* dark gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />

        {/* Prev / Next arrows */}
        {property.images?.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm text-white flex items-center justify-center text-xl hover:bg-black/60 transition"
            >
              ‹
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm text-white flex items-center justify-center text-xl hover:bg-black/60 transition"
            >
              ›
            </button>
          </>
        )}

        {/* Dot indicators */}
        {property.images?.length > 1 && (
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-1.5">
            {property.images.map((_: any, i: number) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`h-[3px] rounded-full transition-all duration-300 ${
                  i === currentIndex ? "w-8 bg-white" : "w-4 bg-white/40"
                }`}
              />
            ))}
          </div>
        )}

        {/* Bottom hero content */}
        <div className="absolute bottom-0 left-0 right-0 px-5 pb-6">
          {/* Type badges */}
          <div className="flex flex-wrap gap-2 mb-3">
            {[property.propertyType, property.sharingType, property.pgCategory]
              .filter(Boolean)
              .map((tag: string, i: number) => (
                <span
                  key={i}
                  className="text-[10px] font-bold uppercase tracking-widest text-white border border-white/35 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white leading-tight mb-1">
            {property.propertyName}
          </h1>
          <p className="text-white/65 text-sm flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
              <circle cx="12" cy="9" r="2.5" />
            </svg>
            {property.address}, {property.place}
          </p>
        </div>
      </div>

      {/* ══════════════════════════════════════
          PRICE + AVAILABILITY BANNER
      ═══════════════════════════════════════ */}
     
<div className="bg-[#0D5F58] relative">
  <div className="max-w-5xl mx-auto px-5 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">

    {/* Rent */}
    <div>
      <p className="text-white/50 text-[10px] uppercase tracking-widest font-semibold mb-0.5">
        Monthly Rent
      </p>
      <p className="text-white text-2xl font-bold">
        ₹{Number(property.rentPerMonth).toLocaleString("en-IN")}
        <span className="text-white/45 text-sm font-normal ml-1">/ month</span>
      </p>
    </div>

    {/* Divider */}
    <div className="hidden sm:block w-px h-10 bg-white/20" />

    {/* Rooms */}
    <div>
      <p className="text-white/50 text-[10px] uppercase tracking-widest font-semibold mb-0.5">
        Rooms Available
      </p>
      <p className="text-white text-xl font-bold">
        {property.availableRooms}
        <span className="text-white/45 text-sm font-normal">
          {" "} / {property.totalRooms} total
        </span>
      </p>
    </div>

    {/* Divider */}
    <div className="hidden sm:block w-px h-10 bg-white/20" />

    {/* Occupancy */}
    <div className="flex-1 min-w-[200px] flex flex-col gap-3">

  {/* TOP ROW (label + buttons) */}
  <div className="flex items-center justify-between gap-3">

    {/* Occupancy label */}
    <div className="flex justify-between w-full text-[10px] text-white/50 font-semibold uppercase tracking-wide">
      <span>Occupancy</span>
      <span>{occupancyPercent}% filled</span>
    </div>

 
  </div>

  {/* PROGRESS BAR */}
  <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
    <div
      className="h-full bg-green-400 rounded-full transition-all duration-700"
      style={{ width: `${occupancyPercent}%` }}
    />
  </div>

</div>

  </div>

  {/* ACTION BUTTONS (EXTREME RIGHT) */}
<div className="absolute right-5 top-1/2 -translate-y-1/2 flex gap-2">

  <button className="text-[10px] px-3 py-1 rounded-full bg-yellow-400 text-black font-semibold hover:bg-yellow-300 transition">
    🚫 Block
  </button>

  <button className="text-[10px] px-3 py-1 rounded-full bg-red-500 text-white font-semibold hover:bg-red-600 transition">
    🗑 Delete
  </button>

</div>
</div>
      

      {/* ══════════════════════════════════════
          MAIN CONTENT — 2-col grid
      ═══════════════════════════════════════ */}
      <div className="max-w-5xl mx-auto px-4 py-7 grid md:grid-cols-3 gap-6">

        {/* ── LEFT column ── */}
        <div className="md:col-span-2 space-y-5">

          {/* DESCRIPTION */}
          <Section title="About this Property">
            <p className="text-gray-500 text-sm leading-relaxed">
              {property.description || "No description provided."}
            </p>
          </Section>

          {/* AMENITIES */}
          {property.amenities?.length > 0 && (
            <Section title="Amenities">
              <div className="flex flex-wrap gap-2">
                {property.amenities.map((item: string, i: number) => (
                  <span
                    key={i}
                    className="flex items-center gap-1.5 text-xs font-medium text-[#0D5F58] px-3 py-1.5 rounded-full border border-[#0D5F58]/25"
                    style={{ background: "rgba(13,95,88,0.06)" }}
                  >
                    <svg className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    {item}
                  </span>
                ))}
              </div>
            </Section>
          )}

          {/* RULES */}
          {property.rulesAndRegulations && (
            <Section title="Rules & Regulations">
              <p className="text-gray-500 text-sm leading-relaxed whitespace-pre-line pl-3 border-l-2 border-[#0D5F58]">
                {property.rulesAndRegulations}
              </p>
            </Section>
          )}

          {/* FOOD MENU */}
          {property.propertyType === "PG" && property.foodMenu?.length > 0 && (
            <Section title="Food Menu">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {property.foodMenu.map((item: any, i: number) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-xl px-3 py-2.5"
                  >
                    <span className="text-base shrink-0">🍽</span>
                    <span className="text-xs font-medium text-gray-700 truncate">{item}</span>
                  </div>
                ))}
              </div>
            </Section>
          )}
        </div>

        {/* ── RIGHT column ── */}
        <div className="space-y-5">

          {/* PROPERTY DETAILS */}
       <div className="space-y-5">

  {/* ✅ MANAGER (TOP PRIORITY NOW) */}
  {property.propertyManager && (
    <Section title="Property Manager">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-11 h-11 rounded-full bg-[#0D5F58]/10 flex items-center justify-center text-[#0D5F58] font-bold text-lg">
          {property.propertyManager.managerName?.[0]?.toUpperCase() ?? "M"}
        </div>

        <div>
          <p className="font-semibold text-gray-800 text-sm">
            {property.propertyManager.managerName}
          </p>
          <p className="text-[10px] text-gray-400 uppercase tracking-widest">
            Manager
          </p>
        </div>
      </div>

      <a
        href={`tel:${property.propertyManager.managerPhone}`}
        className="flex items-center justify-center gap-2 w-full bg-[#0D5F58] text-white text-xs font-bold uppercase tracking-wide px-4 py-2.5 rounded-xl hover:bg-[#0a4d48] transition"
      >
        📞 {property.propertyManager.managerPhone}
      </a>
    </Section>
  )}

  {/* PROPERTY DETAILS BELOW */}
  <Section title="Property Details">
    <div className="divide-y divide-gray-100">
      <DetailRow label="Property Type" value={property.propertyType} />
      <DetailRow label="Sharing Type" value={property.sharingType} />
      <DetailRow label="PG Category" value={property.pgCategory} />
      <DetailRow label="Total Rooms" value={property.totalRooms} />
      <DetailRow
        label="Available Rooms"
        value={`${property.availableRooms} rooms`}
      />
    </div>
  </Section>

</div>

          {/* MANAGER */}
         

        </div>
      </div>
      {/* ✏️ FLOATING EDIT BUTTON */}
<button
  className="fixed bottom-6 right-6 z-50 bg-[#0D5F58] text-white px-5 py-3 rounded-full shadow-lg hover:bg-[#0a4d48] transition flex items-center gap-2"
>
  ✏️ Edit
</button>
    </div>
  );
}

/* ─────────────────────────────────────────
   Reusable sub-components
───────────────────────────────────────── */

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm">
      {/* Section header */}
      <div className="flex items-center gap-3 mb-4">
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#0D5F58] whitespace-nowrap">
          {title}
        </h3>
        <div className="flex-1 h-px bg-gray-100" />
      </div>
      {children}
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value?: any }) {
  if (!value && value !== 0) return null;
  return (
    <div className="flex justify-between items-center py-3 first:pt-0 last:pb-0">
      <span className="text-[11px] text-gray-400 font-semibold uppercase tracking-wide">
        {label}
      </span>
      <span className="text-sm text-gray-800 font-semibold text-right">
        {value}
      </span>
    </div>
  );
}