"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";


// ─── TYPES ───────────────────────────────────────────────────────────────────

interface Property {
  id: number;
  propertyName: string;
  address: string;
  rentPerMonth: number;
  sharingType: string;
  propertyType: string;
  pgCategory: string;
  amenities: string[];
  images: string[];
  availableRooms: number;
  propertyManager?: {
  managerName?: string;
  managerPhone?: string;
};
  description?: string;
  place?: string;
}

// ─── CONSTANTS ────────────────────────────────────────────────────────────────

const API_URL = "https://pgthikana.in/api/property/my-properties";

const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=500&q=75",
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500&q=75",
  "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=500&q=75",
  "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=500&q=75",
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=500&q=75",
  "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&q=75",
];

const HERO_SLIDES = [
  "/slide1.png",
  "/slide2.png",
  "/slide3.png",
];
const AMENITY_ICONS: Record<string, string> = {
  wifi: "📶",
  ac: "❄️",
  gym: "💪",
  food: "🍽️",
  parking: "🚗",
  laundry: "👕",
  security: "🔒",
  tv: "📺",
  "power backup": "⚡",
  water: "💧",
  cleaning: "🧹",
  cctv: "📷",
  lift: "🛗",
  kitchen: "🍳",
  fridge: "🧊",
  bed: "🛏️",
};

const DEMO_DATA: Property[] = [
  {
    id: 1,
    propertyName: "Green Valley PG",
    address: "12, MG Road, Koramangala, Bengaluru",
    rentPerMonth: 7500,
    sharingType: "2 Sharing",
    propertyType: "PG",
    pgCategory: "Working Professionals",
    amenities: ["WiFi", "AC", "Food", "Laundry", "Security"],
    images: [],
    availableRooms: 3,
    propertyManager: {
      managerName: "Ravi Kumar",
      managerPhone: "9999999999",
    },
    description: "A comfortable and well-maintained PG for working professionals.",
  },
  {
    id: 2,
    propertyName: "Sunrise Hostel",
    address: "45, HSR Layout, Sector 2, Bengaluru",
    rentPerMonth: 6000,
    sharingType: "3 Sharing",
    propertyType: "Hostel",
    pgCategory: "Students",
    amenities: ["WiFi", "Gym", "Parking", "CCTV"],
    images: [],
    availableRooms: 5,
    propertyManager: {
      managerName: "Priya Sharma",
      managerPhone: "9999999999",
    },
    description: "Budget-friendly hostel for students near top colleges.",
  },
  {
    id: 3,
    propertyName: "Metro PG for Men",
    address: "7, Sector 18, Noida, Uttar Pradesh",
    rentPerMonth: 9000,
    sharingType: "Single",
    propertyType: "PG",
    pgCategory: "Male Only",
    amenities: ["WiFi", "Food", "TV", "Power Backup", "Lift"],
    images: [],
    availableRooms: 2,
    propertyManager: {
      managerName: "Amit Singh",
      managerPhone: "9999999999",
    },
    description: "Premium single-occupancy PG with all modern amenities.",
  },
  {
    id: 4,
    propertyName: "Ladies Paradise PG",
    address: "22, Andheri West, Mumbai, Maharashtra",
    rentPerMonth: 12000,
    sharingType: "Double",
    propertyType: "PG",
    pgCategory: "Female Only",
    amenities: ["WiFi", "AC", "Kitchen", "Laundry", "Security"],
    images: [],
    availableRooms: 4,
    propertyManager: {
      managerName: "Kavya Nair",
      managerPhone: "9999999999",
    },
    description: "Safe and secure PG exclusively for ladies.",
  },
  {
    id: 5,
    propertyName: "City Center Stays",
    address: "3, Connaught Place, New Delhi",
    rentPerMonth: 15000,
    sharingType: "Single",
    propertyType: "Hostel",
    pgCategory: "Working Professionals",
    amenities: ["WiFi", "Food", "Security", "Cleaning", "Gym"],
    images: [],
    availableRooms: 0,
    propertyManager: {
      managerName: "Rajesh Gupta",
      managerPhone: "9999999999",
    },
    description: "Prime location hostel for professionals in the heart of Delhi.",
  },
  {
    id: 6,
    propertyName: "Elite Stay PG",
    address: "88, T Nagar, Chennai, Tamil Nadu",
    rentPerMonth: 8500,
    sharingType: "2 Sharing",
    propertyType: "PG",
    pgCategory: "Unisex",
    amenities: ["WiFi", "AC", "Gym", "Food", "Parking"],
    images: [],
    availableRooms: 6,
    propertyManager: {
      managerName: "Sneha Rao",
      managerPhone: "9999999999",
    },
    description: "Unisex PG with premium amenities and great community.",
  },
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function getAmenityIcon(amenity: string): string {
  const key = amenity.toLowerCase();
  for (const [k, v] of Object.entries(AMENITY_ICONS)) {
    if (key.includes(k)) return v;
  }
  return "✓";
}

function getImages(prop: Property): string[] {
  if (prop.images && prop.images.length > 0) return prop.images;
  const idx = Math.abs((prop.id || 0) % FALLBACK_IMAGES.length);
  return [FALLBACK_IMAGES[idx], FALLBACK_IMAGES[(idx + 1) % FALLBACK_IMAGES.length]];
}

function getInitials(name: any): string {
  if (typeof name !== "string") return "PM";

  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}
function formatRent(rent: number): string {
  return `₹${rent.toLocaleString("en-IN")}`;
}

// ─── ICONS ────────────────────────────────────────────────────────────────────

const HomeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0F766E" strokeWidth="2.2" strokeLinecap="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const SearchIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const MapPinIcon = ({ size = 12, color = "currentColor" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const StarIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

const FilterIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="8" y1="6" x2="21" y2="6" />
    <line x1="8" y1="12" x2="21" y2="12" />
    <line x1="8" y1="18" x2="21" y2="18" />
    <line x1="3" y1="6" x2="3.01" y2="6" />
    <line x1="3" y1="12" x2="3.01" y2="12" />
    <line x1="3" y1="18" x2="3.01" y2="18" />
  </svg>
);

const WhatsAppIcon = () => (
  <svg viewBox="0 0 32 32" fill="white" width="28" height="28" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 1C7.716 1 1 7.716 1 16c0 2.657.687 5.155 1.891 7.32L1 31l7.892-1.866A14.96 14.96 0 0016 31c8.284 0 15-6.716 15-15S24.284 1 16 1zm0 27.333a12.3 12.3 0 01-6.278-1.713l-.45-.267-4.685 1.108 1.13-4.564-.293-.468A12.323 12.323 0 013.667 16C3.667 9.19 9.19 3.667 16 3.667c6.81 0 12.333 5.523 12.333 12.333 0 6.81-5.522 12.333-12.333 12.333zm6.76-9.234c-.37-.185-2.19-1.08-2.528-1.203-.339-.124-.586-.185-.832.185-.247.37-.956 1.203-1.173 1.45-.216.247-.432.277-.802.093-.37-.185-1.563-.576-2.977-1.835-1.101-.982-1.844-2.193-2.06-2.563-.216-.37-.023-.57.163-.754.166-.165.37-.43.554-.647.185-.216.246-.37.37-.617.123-.247.061-.463-.031-.647-.093-.185-.832-2.005-1.14-2.745-.3-.722-.604-.624-.832-.636l-.709-.012c-.247 0-.648.093-.987.463-.339.37-1.296 1.265-1.296 3.085s1.327 3.58 1.512 3.826c.185.247 2.61 3.987 6.326 5.593.884.381 1.573.608 2.11.778.886.282 1.693.242 2.33.147.71-.106 2.19-.895 2.499-1.76.308-.864.308-1.604.216-1.76-.093-.154-.34-.247-.709-.432z" />
  </svg>
);


// ─── SKELETON CARD ────────────────────────────────────────────────────────────

const SkeletonCard = () => (
  <div style={{
    background: "white",
    borderRadius: 14,
    border: "1px solid #E5E7EB",
    padding: 16,
    display: "flex",
    gap: 16,
    overflow: "hidden",
  }}>
    <style>{`
      @keyframes shimmer {
        0% { background-position: -400px 0; }
        100% { background-position: 400px 0; }
      }
      .sk {
        background: linear-gradient(90deg, #F3F4F6 25%, #E5E7EB 50%, #F3F4F6 75%);
        background-size: 400px 100%;
        animation: shimmer 1.4s infinite;
        border-radius: 8px;
      }
    `}</style>
    <div className="sk" style={{ width: 220, flexShrink: 0, height: 160, borderRadius: 10 }} />
    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10, paddingTop: 4 }}>
      <div className="sk" style={{ width: "60%", height: 18 }} />
      <div className="sk" style={{ width: "50%", height: 14 }} />
      <div className="sk" style={{ width: "35%", height: 12 }} />
      <div className="sk" style={{ width: "80%", height: 14, marginTop: 8 }} />
      <div className="sk" style={{ width: "65%", height: 14 }} />
    </div>
  </div>
);

// ─── PROPERTY CARD ────────────────────────────────────────────────────────────

const PropertyCard = ({ prop }: { prop: Property }) => {
  const images = getImages(prop);
  const [imgIdx, setImgIdx] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startCycle = () => {
    if (images.length <= 1) return;
    intervalRef.current = setInterval(() => {
      setImgIdx((prev) => (prev + 1) % images.length);
    }, 1500);
  };

  const stopCycle = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const amenities = (prop.amenities || []).slice(0, 5);
  const rent = prop.rentPerMonth ? formatRent(prop.rentPerMonth) : "On Request";
  
const managerName =
  typeof prop.propertyManager === "object"
    ? prop.propertyManager?.managerName
    : prop.propertyManager;

    const router = useRouter();

const safeManagerName = managerName || "Property Manager";
  return (
    <div
      style={{
        background: "white",
        borderRadius: 14,
        border: "1px solid #E5E7EB",
        overflow: "hidden",
        display: "flex",
        cursor: "pointer",
        transition: "box-shadow 0.25s, transform 0.25s",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 30px rgba(15,118,110,0.12)";
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
      }}
    >
      {/* Image Section */}
      <div
        style={{ width: 240, flexShrink: 0, position: "relative", overflow: "hidden", background: "#F3F4F6", minHeight: 180 }}
        onMouseEnter={startCycle}
        onMouseLeave={stopCycle}
      >
        {images.map((src, i) => (
          <img
            key={i}
            src={src}
            alt={prop.propertyName}
            loading="lazy"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity: i === imgIdx ? 1 : 0,
              transition: "opacity 0.6s ease",
            }}
          />
        ))}
        {/* Type badge */}
        <div style={{
          position: "absolute", top: 10, left: 10,
          background: "rgba(15,118,110,0.9)", color: "white",
          fontSize: 11, fontWeight: 500, padding: "4px 9px", borderRadius: 6,
        }}>
          {prop.propertyType || "PG"}
        </div>
        {/* Rooms badge */}
        {prop.availableRooms > 0 && (
          <div style={{
            position: "absolute", top: 10, right: 10,
            background: "rgba(255,255,255,0.92)", color: "#0D6B64",
            fontSize: 11, fontWeight: 600, padding: "4px 9px", borderRadius: 6,
          }}>
            {prop.availableRooms} rooms left
          </div>
        )}
        {/* Image dots */}
        {images.length > 1 && (
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0,
            display: "flex", justifyContent: "center", gap: 4, padding: 8,
            background: "linear-gradient(transparent, rgba(0,0,0,0.4))",
          }}>
            {images.map((_, i) => (
              <div
                key={i}
                onClick={(e) => { e.stopPropagation(); setImgIdx(i); }}
                style={{
                  width: i === imgIdx ? 18 : 5, height: 5,
                  borderRadius: i === imgIdx ? 3 : "50%",
                  background: i === imgIdx ? "white" : "rgba(255,255,255,0.6)",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Body */}
      <div style={{ flex: 1, padding: "16px 18px", display: "flex", flexDirection: "column" }}>
        {/* Name + Price */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, marginBottom: 6 }}>
          <div style={{ fontSize: 16, fontWeight: 600, color: "#111827", lineHeight: 1.3, flex: 1 }}>
            {prop.propertyName || "Unnamed Property"}
          </div>
          <div style={{ textAlign: "right", flexShrink: 0 }}>
            <div style={{ fontSize: 17, fontWeight: 700, color: "#0F766E" }}>{rent}</div>
            <div style={{ fontSize: 11, color: "#9CA3AF" }}>/month</div>
          </div>
        </div>

        {/* Address */}
        <div style={{ fontSize: 12.5, color: "#6B7280", marginBottom: 10, display: "flex", alignItems: "center", gap: 4 }}>
          <MapPinIcon size={12} />
          {prop.address || "Address not available"}
        </div>

        {/* Tags */}
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
          {prop.sharingType && (
            <span style={{ fontSize: 11.5, padding: "4px 10px", borderRadius: 6, fontWeight: 500, background: "#CCFBF1", color: "#0D6B64", border: "1px solid #A7F3D0" }}>
              {prop.sharingType}
            </span>
          )}
          {prop.pgCategory && (
            <span style={{ fontSize: 11.5, padding: "4px 10px", borderRadius: 6, fontWeight: 500, background: "#FFFBEB", color: "#92400E", border: "1px solid #FDE68A" }}>
              {prop.pgCategory}
            </span>
          )}
          {prop.availableRooms > 0 ? (
            <span style={{ fontSize: 11.5, padding: "4px 10px", borderRadius: 6, fontWeight: 500, background: "#F3F4F6", color: "#374151", border: "1px solid #D1D5DB" }}>
              Available Now
            </span>
          ) : (
            <span style={{ fontSize: 11.5, padding: "4px 10px", borderRadius: 6, fontWeight: 500, background: "#FEF2F2", color: "#991B1B", border: "1px solid #FECACA" }}>
              Fully Occupied
            </span>
          )}
        </div>

        {/* Amenities */}
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12, flex: 1 }}>
          {amenities.length > 0 ? amenities.map((a, i) => (
            <span key={i} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11.5, color: "#6B7280", background: "#F9FAFB", padding: "3px 8px", borderRadius: 5 }}>
              {getAmenityIcon(a)} {a}
            </span>
          )) : (
            <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11.5, color: "#6B7280", background: "#F9FAFB", padding: "3px 8px", borderRadius: 5 }}>
              ✓ Basic Amenities
            </span>
          )}
        </div>

        {/* Manager */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
          <div style={{
            width: 26, height: 26, borderRadius: "50%",
            background: "#CCFBF1", display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 10, fontWeight: 700, color: "#0D6B64", flexShrink: 0,
          }}>
            {getInitials(safeManagerName)}
          </div>
          <div style={{ fontSize: 12, color: "#6B7280" }}>
            Managed by <strong style={{ color: "#111827", fontWeight: 500 }}>{safeManagerName}</strong>
          </div>
        </div>

        {/* Buttons */}
        <div style={{ display: "flex", gap: 8, marginTop: "auto" }}>
          <button
  onClick={(e) => {
    e.stopPropagation();
    router.push("/user");
  }}
  style={{
    background: "#0F766E",
    color: "white",
    border: "none",
    padding: "9px 16px",
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    flex: 1,
    fontFamily: "inherit",
    transition: "background 0.2s",
  }}
  onMouseEnter={(e) =>
    (e.currentTarget.style.background = "#0D6B64")
  }
  onMouseLeave={(e) =>
    (e.currentTarget.style.background = "#0F766E")
  }
>
  Explore Property
</button>
          <button
             onClick={(e) => {
    e.stopPropagation();
    router.push("/user");
  }}
            style={{
              background: "transparent", color: "#0F766E",
              border: "1.5px solid #0F766E",
              padding: "9px 16px", borderRadius: 8, fontSize: 13, fontWeight: 600,
              cursor: "pointer", flex: 1, fontFamily: "inherit",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#CCFBF1"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── HERO SLIDER ──────────────────────────────────────────────────────────────

const HeroSlider = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  return (
<div style={{
width: "100%",
height: "420px",

  position: "relative",
  borderRadius: 20,
  overflow: "hidden",
  boxShadow: "0 30px 80px rgba(0,0,0,0.35)"
}}>
      {HERO_SLIDES.map((src, i) => (
        <img
          key={i}
          src={src}
          alt={`Slide ${i + 1}`}
          loading="lazy"
          style={{
            position: "absolute", inset: 0, width: "100%", height: "100%",
            objectFit: "cover", opacity: i === current ? 1 : 0,
            transition: "opacity 0.8s ease",
          }}
        />
      ))}
      <div style={{ position: "absolute", bottom: 10, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 5, zIndex: 2 }}>
        {HERO_SLIDES.map((_, i) => (
          <div
            key={i}
            onClick={() => setCurrent(i)}
            style={{
              width: i === current ? 20 : 6, height: 6,
              borderRadius: i === current ? 3 : "50%",
              background: i === current ? "white" : "rgba(255,255,255,0.5)",
              cursor: "pointer", transition: "all 0.3s",
            }}
          />
        ))}
      </div>
    </div>
  );
};

// ─── NAVBAR ───────────────────────────────────────────────────────────────────

const Navbar = ({ onSearch }: { onSearch: (q: string) => void }) => {
  const [query, setQuery] = useState("");
  const router = useRouter();
  

  const handleInput = useCallback(
    (() => {
      let t: ReturnType<typeof setTimeout>;
      return (val: string) => {
        setQuery(val);
        clearTimeout(t);
        t = setTimeout(() => onSearch(val), 300);
      };
    })(),
    [onSearch]
  );

  return (
    <nav style={{
      background: "#0F766E",
      padding: "0 1.5rem",
      height: 64,
      display: "flex",
      alignItems: "center",
      gap: "1rem",
      position: "sticky",
      top: 0,
      zIndex: 100,
      boxShadow: "0 2px 12px rgba(15,118,110,0.3)",
    }}>
      {/* Logo */}
      <a href="#" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none", flexShrink: 0 }}>
      <div style={{
  width: 50,
  height: 50,  
  borderRadius: 8,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  overflow: "hidden"
}}>
  <img
    src="/pg_logo.png"
    alt="PG Thikana Logo"
    style={{
      width: "70%",
      height: "70%",
      objectFit: "contain"
    }}
  />
</div>
        <span style={{ fontFamily: "'Georgia', serif", fontSize: 20, fontWeight: 700, color: "white", letterSpacing: "-0.3px" }}>
          PG Thikana
        </span>
      </a>

      {/* Search */}
      <div style={{
        flex: 1, maxWidth: 480, margin: "0 auto",
        display: "flex", background: "rgba(255,255,255,0.15)",
        borderRadius: 8, overflow: "hidden", border: "1px solid rgba(255,255,255,0.25)",
      }}>
        <input
          type="text"
          placeholder="Search by locality, city, property name..."
          value={query}
          onChange={(e) => handleInput(e.target.value)}
          style={{
            flex: 1, background: "transparent", border: "none", outline: "none",
            padding: "8px 12px", color: "white", fontSize: 14, fontFamily: "inherit",
          }}
        />
        <button style={{
          background: "white", border: "none", padding: "8px 14px",
          cursor: "pointer", color: "#0F766E", fontWeight: 600, fontSize: 13,
          fontFamily: "inherit", display: "flex", alignItems: "center", gap: 4,
        }}>
          <SearchIcon /> Search
        </button>
      </div>

      {/* Nav buttons */}
      <div style={{ display: "flex", gap: 8, marginLeft: "auto", flexShrink: 0 }}>
        {["Login", "List Property"].map((label) => (
          <button key={label} 
          onClick={() => router.push("/vendor")}
          style={{
            background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)",
            color: "white", padding: "7px 14px", borderRadius: 7,
            fontSize: 13, fontFamily: "inherit", fontWeight: 500, cursor: "pointer",
            
            
          }}>
            {label}
            
          </button>
        ))}
      </div>
    </nav>
  );
};

// ─── HERO ─────────────────────────────────────────────────────────────────────

const Hero = () => {
  const router = useRouter();

  return (
    <section style={{
      background: "linear-gradient(135deg, #0F766E 0%, #0d9488 60%, #0f766e 100%)",
      padding: "3rem 1.5rem",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "4rem",
      minHeight: 320,
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Dot pattern overlay */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)",
        backgroundSize: "30px 30px",
      }} />

      {/* Content */}
      <div style={{ position: "relative", zIndex: 1, maxWidth: "700px" }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.25)",
          color: "white", fontSize: 12, fontWeight: 500,
          padding: "5px 12px", borderRadius: 100, marginBottom: "1.2rem",
        }}>
          <StarIcon /> Trusted by 10,000+ tenants
        </div>

        <h1 style={{
          fontFamily: "'Georgia', serif",
          fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
          fontWeight: 700, color: "white",
          lineHeight: 1.15, marginBottom: "1rem",
        }}>
          Skip the queue.<br />
          <span style={{ color: "#A7F3D0" }}>Book your Room</span><br />
          today.
        </h1>

        <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 15, lineHeight: 1.6, marginBottom: "1.5rem", maxWidth: 480 }}>
          Find verified PGs, hostels & flats near you — with real photos, fair pricing, and zero brokerage.
        </p>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button style={{
            background: "white", color: "#0F766E", fontWeight: 600, fontSize: 14,
            padding: "11px 22px", borderRadius: 8, border: "none", cursor: "pointer",
          }}>
            Explore Listings
          </button>

          <button
            onClick={() => router.push("/vendor")}
            style={{
              background: "transparent",
              color: "white",
              fontWeight: 500,
              fontSize: 14,
              padding: "11px 22px",
              borderRadius: 8,
              border: "1.5px solid rgba(255,255,255,0.5)",
              cursor: "pointer",
            }}
          >
            Add Property
          </button>
        </div>
      </div>

      <div className="hero-slider-wrap" style={{ flex: 1 }}>
        <HeroSlider />
      </div>

      <style>{`
        .hero-slider-wrap { position: relative; z-index: 1; }
        @media (max-width: 768px) { .hero-slider-wrap { display: none; } }
      `}</style>
    </section>
  );
};

// ─── FILTERS ──────────────────────────────────────────────────────────────────

interface FiltersProps {
  localities: string[];
  categories: string[];
  sharingTypes: string[];
  budgets: number[];
  activeType: string;
  filters: Record<string, string>; // ✅ ADD THIS
  onTypeChange: (t: string) => void;
  onFilterChange: (key: string, value: string) => void;
}
const Filters = ({
  localities,
  categories,
  sharingTypes,
  budgets,
  activeType,
  filters, // ✅ ADD THIS
  onTypeChange,
  onFilterChange
}: FiltersProps) => {
  const selectStyle: React.CSSProperties = {
    appearance: "none" as const,
    background: "#F9FAFB",
    border: "1px solid #E5E7EB",
    borderRadius: 8,
    padding: "7px 28px 7px 12px",
    fontSize: 13,
    fontFamily: "inherit",
    color: "#111827",
    cursor: "pointer",
    flexShrink: 0,
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 8px center",
  };



  return (
    <div style={{
      background: "white",
      borderBottom: "1px solid #E5E7EB",
      padding: "0 1.5rem",
      position: "sticky",
      top: 64,
      zIndex: 90,
      boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
    }}>
      <div style={{
        display: "flex", alignItems: "center", gap: 10,
        padding: "12px 0", overflowX: "auto", scrollbarWidth: "none",
        minHeight: 56,
      }}>
        {/* Type toggle */}
        <div style={{ display: "flex", background: "#F3F4F6", borderRadius: 8, padding: 3, flexShrink: 0 }}>
          <select
  style={selectStyle}
  value={activeType || ""}
  onChange={(e) => onTypeChange(e.target.value)}
>
  <option value="PG">PG</option>
  <option value="Hostel">Hostel</option>
  <option value="Room">Room</option>
</select>
        </div>

        <div style={{ width: 1, height: 24, background: "#E5E7EB", flexShrink: 0 }} />

       {/* 🔥 FILTER DROPDOWNS (FULL FIXED + CONSISTENT) */}
<div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>

  {/* Locality */}
  <select
    style={selectStyle}
    value={filters.locality || ""}
    onChange={(e) => onFilterChange("locality", e.target.value)}
  >
    <option value="">Locality</option>
    {localities.map((loc) => (
      <option key={loc} value={loc}>
        {loc}
      </option>
    ))}
  </select>

  {/* Budget */}
  <select
    style={selectStyle}
    value={filters.budget || ""}
    onChange={(e) => onFilterChange("budget", e.target.value)}
  >
    <option value="">Budget</option>
    {budgets.map((b) => (
      <option key={b} value={b}>
        Under ₹{b}
      </option>
    ))}
  </select>

  {/* Category (Gender) */}
  <select
    style={selectStyle}
    value={filters.gender || ""}
    onChange={(e) => onFilterChange("gender", e.target.value)}
  >
    <option value="">Category</option>
    {categories.map((cat) => (
      <option key={cat} value={cat}>
        {cat}
      </option>
    ))}
  </select>

  {/* Sharing */}
  <select
    style={selectStyle}
    value={filters.sharing || ""}
    onChange={(e) => onFilterChange("sharing", e.target.value)}
  >
    <option value="">Sharing Type</option>
    {sharingTypes.map((s) => (
      <option key={s} value={s}>
        {s}
      </option>
    ))}
  </select>

</div>
       
      </div>

      <style>{`
        div::-webkit-scrollbar { display: none; }
        select:focus { outline: 2px solid #0F766E; }
      `}</style>
    </div>
  );
};

// ─── MAP PANEL ────────────────────────────────────────────────────────────────

const MapPanel = ({ selectedProperty }: { selectedProperty?: Property }) => {
  const address = selectedProperty?.address || "Ahmedabad";

  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`;

  const openMap = () => {
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`);
  };

  return (
    <div
      style={{
        background: "white",
        borderLeft: "1px solid #E5E7EB",
        position: "sticky",
        top: 120,
        height: "calc(100vh - 120px)",
        overflow: "hidden",
      }}
    >
      {/* MAP */}
      <iframe
        src={mapSrc}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        loading="lazy"
      />

      {/* BUTTON */}
      <button
        onClick={openMap}
        style={{
          position: "absolute",
          bottom: 20,
          left: "50%",
          transform: "translateX(-50%)",
          background: "#0F766E",
          color: "white",
          border: "none",
          padding: "10px 18px",
          borderRadius: 8,
          fontSize: 13,
          fontWeight: 600,
          cursor: "pointer",
        }}
      >
        Open in Google Maps
      </button>
    </div>
  );
};

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────

export default function Page() {
  const [allProperties, setAllProperties] = useState<Property[]>([]);
  const [filtered, setFiltered] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [localities, setLocalities] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeType, setActiveType] = useState("PG");
  const [filters, setFilters] = useState({
  locality: "",
  budget: "",
  gender: "",
  sharing: "",
}); 

    const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
    const [categories, setCategories] = useState<string[]>([]);
    const [sharingTypes, setSharingTypes] = useState<string[]>([]);
    const [budgets, setBudgets] = useState<number[]>([]);

    const router = useRouter();

  useEffect(() => {
  const vendorToken = localStorage.getItem("vendorToken");
  const adminToken = localStorage.getItem("adminToken");
  const superAdminToken = localStorage.getItem("token");
  const userToken = localStorage.getItem("userToken");

  if (vendorToken) {
    router.replace("/vendor/dashboard");
  } else if (adminToken) {
    router.replace("/admin"); // or your admin route
  }else if(superAdminToken){
     router.replace("/super-admin")
  }
  else if (userToken) {
    router.replace("/user/home"); // or your user route
  }
}, []);

  // Fetch
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        
        let props: Property[] = [];
        if (Array.isArray(data)) props = data;
        else if (data.properties) props = data.properties;
        else if (data.data) props = Array.isArray(data.data) ? data.data : [data.data];
        else if (data.property) props = [data.property];
        else props = [data];

        const valid = props.filter(Boolean);
        const uniqueCategories = [...new Set(valid.map(p => p.pgCategory).filter(Boolean))];
        const uniqueSharing = [...new Set(valid.map(p => p.sharingType).filter(Boolean))];
        const uniqueBudgets = [...new Set(valid.map(p => p.rentPerMonth).filter(Boolean))]
        .sort((a, b) => a - b);

        setBudgets(uniqueBudgets);
        setSharingTypes(uniqueSharing);
        setCategories(uniqueCategories);
        setAllProperties(valid);
        setFiltered(valid);
        populateLocalities(valid);
      } catch {
        setError(true);
        setAllProperties(DEMO_DATA);
        setFiltered(DEMO_DATA);
        populateLocalities(DEMO_DATA);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const populateLocalities = (props: Property[]) => {
    const seen = new Set<string>();
    props.forEach((p) => {
      if (!p.address) return;
      const parts = p.address.split(",");
      const loc = (parts[1] || parts[0] || "").trim();
      if (loc) seen.add(loc);
    });
    setLocalities(Array.from(seen));
  };

  const FilterButton = ({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    style={{
      padding: "6px 14px",
      borderRadius: 8,
      fontSize: 13,
      fontWeight: 500,
      border: active ? "1px solid #0F766E" : "1px solid #E5E7EB",
      background: active ? "#0F766E" : "white",
      color: active ? "white" : "#374151",
      cursor: "pointer",
      transition: "all 0.2s",
    }}
  >
    {label}
  </button>
);

  // Filter logic
  useEffect(() => {
    let result = [...allProperties];

    // 🔥 TYPE FILTER (PG / HOSTEL / ROOM)
if (activeType) {
  result = result.filter(
    (p) =>
      p.propertyType?.toLowerCase() === activeType.toLowerCase()
  );
}
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter((p) =>
        (p.propertyName + p.address + p.pgCategory + p.place)
  .toLowerCase()
  .includes(q)
      );
    }
    if (filters.budget) {
      result = result.filter((p) => p.rentPerMonth <= parseInt(filters.budget));
    }
    if (filters.locality) {
      result = result.filter((p) =>
        (p.address || "").toLowerCase().includes(filters.locality.toLowerCase())
      );
    }
    if (filters.gender) {
      result = result.filter((p) =>
        p.pgCategory === filters.gender
      );
    }
    if (filters.sharing) {
      result = result.filter((p) =>
        p.sharingType === filters.sharing
      );
    }
    setFiltered(result);
}, [allProperties, searchQuery, filters, activeType]);

  const handleSearch = useCallback((q: string) => setSearchQuery(q), []);

  const handleFilterChange = useCallback((key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  return (
    <div style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif", background: "#F0FDF9", minHeight: "100vh", color: "#111827" }}>
      {/* Google Fonts */}
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet" />

      <Navbar onSearch={handleSearch} />
      <Hero />
<Filters
  localities={localities}
  activeType={activeType}
  filters={filters} // ✅ ADD THIS
  onTypeChange={setActiveType}
  onFilterChange={handleFilterChange}
  categories={categories}
  sharingTypes={sharingTypes}
  budgets={budgets}
/>
      {/* Main 2-column layout */}
      <div style={{ maxWidth: 1280, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 380px" }} className="main-layout">
        {/* List Panel */}
        <div style={{ padding: "1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.2rem" }}>
            <h2 style={{ fontSize: 18, fontWeight: 600 }}>Available Properties</h2>
            <span style={{
              fontSize: 13, background: "#CCFBF1", color: "#0D6B64",
              padding: "4px 10px", borderRadius: 100, fontWeight: 500,
            }}>
              {loading ? "Loading…" : `${filtered.length} ${filtered.length === 1 ? "property" : "properties"}`}
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {loading ? (
              <>
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
              </>
            ) : filtered.length === 0 ? (
              <div style={{ textAlign: "center", padding: "3rem", color: "#6B7280" }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>🏠</div>
                <h3 style={{ fontSize: 18, fontWeight: 600, color: "#111827", marginBottom: 8 }}>No properties found</h3>
                <p>Try adjusting your filters or search query.</p>
              </div>
            ) : (
             filtered.map((prop) => (
  <div key={prop.id} onClick={() => setSelectedProperty(prop)}>
    <PropertyCard prop={prop} />
  </div>
))
            )}
          </div>
        </div>

        {/* Map Panel */}
        <div className="map-col">
         <MapPanel selectedProperty={selectedProperty || filtered[0] || null} />
        </div>
      </div>

      {/* WhatsApp FAB */}
      <a
        href="https://wa.me/919999999999"
        target="_blank"
        rel="noreferrer"
        title="Chat on WhatsApp"
        style={{
          position: "fixed", bottom: 24, right: 24,
          width: 54, height: 54, background: "#25D366",
          borderRadius: "50%", display: "flex",
          alignItems: "center", justifyContent: "center",
          cursor: "pointer", boxShadow: "0 4px 20px rgba(37,211,102,0.4)",
          zIndex: 200, textDecoration: "none",
          transition: "transform 0.2s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
      >
        <WhatsAppIcon />
      </a>

      {/* Footer */}
<footer
  style={{
    background: "#0F766E",
    color: "white",
    marginTop: "3rem",
    padding: "3rem 1.5rem 1.5rem",
  }}
>
  <div
    style={{
      maxWidth: 1200,
      margin: "0 auto",
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
      gap: "2rem",
    }}
  >
    {/* 🔥 BRAND */}
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <img src="/pg_logo.png" style={{ width: 40 }} />
        <h2 style={{ fontSize: 20, fontWeight: 700 }}>PG Thikana</h2>
      </div>

      <p style={{ marginTop: 10, color: "rgba(255,255,255,0.75)", fontSize: 14 }}>
        Find verified PGs, hostels & flats near you with zero brokerage.
      </p>
    </div>

    {/* 🔥 QUICK LINKS */}
    <div>
      <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 10 }}>
        Quick Links
      </h3>

      {["Home", "Explore", "Saved", "Bookings"].map((item) => (
        <p
          key={item}
          style={{
            fontSize: 14,
            color: "rgba(255,255,255,0.7)",
            marginBottom: 6,
            cursor: "pointer",
          }}
        >
          {item}
        </p>
      ))}
    </div>

    {/* 🔥 SUPPORT */}
    <div>
      <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 10 }}>
        Support
      </h3>

      <p style={{ fontSize: 14, color: "rgba(255,255,255,0.7)" }}>
        📧 support@pgthikana.in
      </p>

      <p style={{ fontSize: 14, color: "rgba(255,255,255,0.7)" }}>
        📞 +91 99999 99999
      </p>
    </div>

    {/* 🔥 CTA */}
    <div>
      <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 10 }}>
        For Owners
      </h3>

      <button
        onClick={() => window.location.href = "/vendor"}
        style={{
          background: "white",
          color: "#0F766E",
          border: "none",
          padding: "10px 16px",
          borderRadius: 8,
          fontWeight: 600,
          cursor: "pointer",
        }}
      >
        List Your Property
      </button>
    </div>
  </div>

  {/* 🔥 BOTTOM BAR */}
  <div
    style={{
      marginTop: "2rem",
      borderTop: "1px solid rgba(255,255,255,0.2)",
      paddingTop: "1rem",
      display: "flex",
      justifyContent: "space-between",
      flexWrap: "wrap",
      gap: 10,
      fontSize: 13,
      color: "rgba(255,255,255,0.7)",
    }}
  >
    <span>© 2025 PG Thikana. All rights reserved.</span>

    <div style={{ display: "flex", gap: 15 }}>
      <span style={{ cursor: "pointer" }}>Privacy</span>
      <span style={{ cursor: "pointer" }}>Terms</span>
      <span style={{ cursor: "pointer" }}>Cookies</span>
    </div>
  </div>
</footer>

      {/* Global responsive styles */}
      <style>{`
        * { box-sizing: border-box; }
        body { margin: 0; }
        input { font-family: inherit; }
        button { font-family: inherit; }
        @media (max-width: 1024px) {
          .main-layout { grid-template-columns: 1fr !important; }
          .map-col { display: none; }
        }
        @media (max-width: 640px) {
          .property-card { flex-direction: column !important; }
          .card-image-wrap { width: 100% !important; height: 200px; }
        }
      `}</style>
    </div>
  );
}