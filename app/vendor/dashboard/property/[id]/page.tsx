"use client";

import { toast } from "@/app/context/SnackbarContext";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function PropertyDetailPage() {
  const { id } = useParams();
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [images, setImages] = useState<File[]>([]);
  const [showEdit, setShowEdit] = useState(false);
const [formLoading, setFormLoading] = useState(false);
const [existingImages, setExistingImages] = useState<string[]>([]);

const [form, setForm] = useState({
  propertyName: "",
  address: "",
  description: "",
  rentPerMonth: "",
  totalRooms: "",
  availableRooms: "",
  bathroomType: "",
  rules: "",
});

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
    const token = localStorage.getItem("vendorToken");
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

  const openEdit = () => {
    setExistingImages(property.images || []);
setImages([]); // 🔥 reset new images
  setForm({
    propertyName: property.propertyName || "",
    address: property.address || "",
    description: property.description || "",
    rentPerMonth: property.rentPerMonth || "",
    totalRooms: property.totalRooms || "",
    availableRooms: property.availableRooms || "",
    bathroomType: property.bathroomType || "",
    rules: property.rulesAndRegulations || "",
  });

setExistingImages(property.images || []);
setShowEdit(true);
};

  const handleUnblock = async () => {
  const token = localStorage.getItem("vendorToken");

  try {
    const res = await fetch(
      `https://pgthikana.in/api/property/unblock/${id}`, // 🔥 your unblock API
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await res.json();
    console.log("Unblocked:", data);

    toast("Property Unblocked ✅");

    fetchProperty(); // 🔥 refresh UI
  } catch (err) {
    console.error(err);
  }
};

  const handleBlock = async () => {
  const token = localStorage.getItem("vendorToken");

  const reason = prompt("Enter reason for blocking:");

if (!reason) return;

  try {
    const res = await fetch(
      `https://pgthikana.in/api/property/block/${id}`, // ✅ ADD ID HERE
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reason: reason, // you can make dynamic later
        }),
      }
    );

    const data = await res.json();
    console.log("Blocked:", data);

    toast("Property Blocked ✅");
    fetchProperty();
  } catch (err) {
    console.error(err);
  }
};

const handleDelete = async () => {
  const token = localStorage.getItem("vendorToken");

  const reason = prompt("Enter reason for deletion:");

if (!reason) return;

  try {
    const res = await fetch(
      `https://pgthikana.in/api/property/remove/${id}`, // ✅ already correct API
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reason: reason
        }),
      }
    );

    const data = await res.json();
    console.log("Deleted:", data);
    fetchProperty();

    toast("Property Deleted 🗑");
  } catch (err) {
    console.error(err);
  }
};

const handleEditSubmit = async () => {
  try {
    setFormLoading(true);

    const token = localStorage.getItem("vendorToken");

   const formData = new FormData();

// ✅ PROPERTY DETAILS
formData.append(
  "propertyDetails",
  JSON.stringify({
    propertyName: form.propertyName,
    address: form.address,
    description: form.description,
    rentPerMonth: Number(form.rentPerMonth),
  })
);

// ✅ ROOM INFO
formData.append(
  "roomInformation",
  JSON.stringify({
    totalRooms: Number(form.totalRooms),
    availableRooms: Number(form.availableRooms),
    bathroomType: form.bathroomType,
  })
);

// ✅ PROPERTY PREFERENCES (🔥 REQUIRED)
formData.append(
  "propertyPreferences",
  JSON.stringify({
    propertyType: property.propertyType,
    sharingType: property.sharingType,
    rentType: "bed",
    pgCategory: property.pgCategory,
    place: form.address,
  })
);

// ✅ AMENITIES (🔥 REQUIRED)
formData.append(
  "amenities",
  JSON.stringify(property.amenities || [])
);

formData.append(
  "existingImages",
  JSON.stringify(existingImages)
);
// ✅ PROPERTY MANAGER (🔥 REQUIRED)
if (property.propertyManager) {
  formData.append(
    "propertyManager",
    JSON.stringify({
      managerName: property.propertyManager.managerName,
      managerPhone: property.propertyManager.managerPhone,
    })
  );
}

// ✅ RULES
formData.append("rulesAndRegulations", form.rules);

// ✅ EDIT REASON
formData.append("editReason", "Updated from super admin panel");

// ✅ IMAGES (🔥🔥🔥 IMPORTANT)
images.forEach((file) => {
  formData.append("images", file);
});

    const res = await fetch(
      `https://pgthikana.in/api/vendor/property/update/${id}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );

    const data = await res.json();
    console.log(data);

    setShowEdit(false);
    fetchProperty();
  } catch (err) {
    console.error(err);
  } finally {
    setFormLoading(false);
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
    <div className="min-h-screen bg-gray-100 ml-[var(--sidebar-width)] transition-[margin] duration-200 ease-in-out">

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

   {/* EDIT HISTORY */}
{property.editHistory && (
  <Section title="Edit History">
    <div className="relative border border-gray-100 rounded-xl p-4 bg-gradient-to-br from-gray-50 to-white">

      {/* TOP ROW */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">

          {/* ICON */}
          <div className="w-8 h-8 rounded-full bg-[#0D5F58]/10 flex items-center justify-center text-[#0D5F58] text-sm font-bold">
            ✏️
          </div>

          {/* TITLE */}
          <div>
            <p className="text-sm font-semibold text-gray-800">
              Property Updated
            </p>
            <p className="text-[10px] text-gray-400 uppercase tracking-wide">
              {property.editHistory.editedByRole === "superadmin"
                ? "Super Admin"
                : property.editHistory.editedByRole}
            </p>
          </div>

        </div>

        {/* TIME */}
        <p className="text-xs text-gray-400 font-medium whitespace-nowrap">
          {new Date(property.editHistory.editedAt).toLocaleString("en-IN")}
        </p>
      </div>

      {/* DIVIDER */}
      <div className="h-px bg-gray-100 mb-3" />

      {/* REASON */}
      {property.editHistory.editReason && (
        <div className="flex gap-2">

          {/* LEFT STRIP */}
          <div className="w-1 rounded-full bg-[#0D5F58]" />

          {/* TEXT */}
          <p className="text-sm text-gray-700 leading-relaxed">
            {property.editHistory.editReason}
          </p>
        </div>
      )}

    </div>
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
                    <span className="text-xs font-medium text-gray-700">
  {item.day_of_week} - {item.breakfast}, {item.lunch}, {item.dinner}
</span>
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
  onClick={openEdit}
  className="fixed bottom-6 right-6 z-50 bg-[#0D5F58] text-white px-5 py-3 rounded-full shadow-lg hover:bg-[#0a4d48] transition flex items-center gap-2"
>
  ✏️ Edit
</button>

{showEdit && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

    <div className="bg-white w-[90vw] max-w-5xl max-h-[100vh] overflow-y-auto rounded-2xl p-6 shadow-2xl">

      <h2 className="text-xl font-semibold text-[#0D5F58] mb-4">
        Edit Property
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        <Input label="Property Name" value={form.propertyName} onChange={(v:any)=>setForm({...form,propertyName:v})}/>
        <Input label="Address" value={form.address} onChange={(v:any)=>setForm({...form,address:v})}/>

        <Input label="Rent" value={form.rentPerMonth} onChange={(v:any)=>setForm({...form,rentPerMonth:v})}/>
        <Input label="Total Rooms" value={form.totalRooms} onChange={(v:any)=>setForm({...form,totalRooms:v})}/>

        <Input label="Available Rooms" value={form.availableRooms} onChange={(v:any)=>setForm({...form,availableRooms:v})}/>
        <Input label="Bathroom Type" value={form.bathroomType} onChange={(v:any)=>setForm({...form,bathroomType:v})}/>

       <div className="col-span-2 flex flex-col gap-1">
  <label className="text-xs font-semibold text-[#0D5F58]">
    Rules & Regulations
  </label>

  <textarea
    value={form.rules}
    onChange={(e)=>setForm({...form,rules:e.target.value})}
    className="bg-white text-gray-900 border border-gray-300 rounded-lg px-3 py-2 focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/20 outline-none"
  />
</div>

        <div className="col-span-2">
  <label className="text-sm font-semibold text-gray-700 mb-2 block">
    Upload Property Images
  </label>

  <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-[#0F766E] hover:bg-gray-50 transition">
    
    <span className="text-sm text-gray-500">
      Click to upload or drag & drop
    </span>
    <span className="text-xs text-gray-400 mt-1">
      JPG, PNG (multiple allowed)
    </span>

    <input
      type="file"
      multiple
      onChange={(e: any) => setImages([...e.target.files])}
      className="hidden"
    />

    
  </label>

  {images.length > 0 && (
  <div className="col-span-2 mt-4">
    <p className="text-sm font-semibold text-gray-700 mb-2">
      New Images
    </p>

    <div className="flex flex-wrap gap-3">
      {images.map((file, i) => (
        <div
          key={i}
          className="relative w-20 h-20 rounded-lg overflow-hidden border"
        >
          <img
            src={URL.createObjectURL(file)}
            className="w-full h-full object-cover"
          />

          <button
            onClick={() =>
              setImages(images.filter((_, index) => index !== i))
            }
            className="absolute top-1 right-1 bg-black/70 text-white text-xs px-1.5 rounded hover:bg-red-500"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  </div>
)}

  {existingImages.length > 0 && (
  <div className="col-span-2 mt-4">
    <p className="text-sm font-semibold text-gray-700 mb-2">
      Existing Images
    </p>

    <div className="flex flex-wrap gap-3">
      {existingImages.map((img: string, i: number) => (
  <div
    key={i}
    className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200"
  >
    <img
      src={img}
      className="w-full h-full object-cover"
    />

    {/* ❌ REMOVE BUTTON */}
    <button
      onClick={() =>
        setExistingImages(existingImages.filter((_, index) => index !== i))
      }
      className="absolute top-1 right-1 bg-black/70 text-white text-xs px-1.5 rounded hover:bg-red-500"
    >
      ✕
    </button>
  </div>
))}
    </div>
  </div>
)}
</div>

      </div>

      <div className="flex justify-end gap-3 mt-6">

        <button
          onClick={()=>setShowEdit(false)}
          className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 bg-white hover:bg-gray-100 transition"
        >
          Cancel
        </button>

        <button
          onClick={handleEditSubmit}
          className="px-5 py-2 bg-[#0F766E] text-white rounded-lg"
        >
          {formLoading ? "Updating..." : "Save"}
        </button>

      </div>
    </div>
  </div>
)}
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

function Input({ label, value, onChange }: any) {
  return (
    <div className="flex flex-col gap-1 w-full">
      <label className="text-xs font-semibold text-[#0D5F58]">
        {label}
      </label>

      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-white text-gray-900 border border-gray-300 rounded-lg px-3 py-2 focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/20 outline-none"
      />
    </div>
  );
}