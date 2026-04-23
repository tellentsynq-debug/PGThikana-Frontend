"use client";

import {
  LayoutDashboard,
  ShieldCheck,
  LogOut,
  Building2,
  MessageSquare,
  MessageSquareMore,
  Siren,
  UserCog,
  Store,
  User,
  Heart
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false); // ✅ NEW
  const [role, setRole] = useState<"superadmin" | "admin" | "user" | null>(null);
  const [username, setUsername] = useState("");

  const isUserRoute = pathname.startsWith("/user");

  const iconSize = 18;

useEffect(() => {
  const checkAuth = () => {
    const superToken = localStorage.getItem("token");
    const adminToken = localStorage.getItem("adminToken");
    const userToken = localStorage.getItem("userToken");

    const user = localStorage.getItem("user");

    if (user) {
      try {
        const parsed = JSON.parse(user);
        setUsername(parsed.username);
      } catch {
        setUsername("");
      }
    }

    if (superToken) setRole("superadmin");
    else if (adminToken) setRole("admin");
    else if (userToken) setRole("user");
    else setRole(null);
  };

  checkAuth(); // run once

  // 🔥 listen for login/logout
  window.addEventListener("authChanged", checkAuth);

  return () => {
    window.removeEventListener("authChanged", checkAuth);
  };
}, []);

useEffect(() => {
  const checkMobile = () => {
    setIsMobile(window.innerWidth <= 768);
  };

  checkMobile(); // run once

  window.addEventListener("resize", checkMobile);
  return () => window.removeEventListener("resize", checkMobile);
}, []);

useEffect(() => {
  // 🚫 DO NOT affect layout on mobile
  if (isMobile) {
    document.documentElement.style.setProperty("--sidebar-width", `0px`);
    return;
  }

  const width = isOpen ? 260 : 60;
  document.documentElement.style.setProperty("--sidebar-width", `${width}px`);
}, [isOpen, isMobile]);

  const handleLogout = () => {
    localStorage.clear();
    setRole(null);
    router.push("/");
  };

  const superAdminMenu = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/super-admin/" },
    { name: "Admin Dashboard", icon: ShieldCheck, path: "/super-admin/admin-dashboard" },
    { name: "Admin Chat", icon: MessageSquareMore, path: "/super-admin/admin-chat" },
    { name: "Vendor Chat", icon: MessageSquare, path: "/super-admin/vendor-chat" },
    { name: "User Complaints", icon: Siren, path: "/super-admin/complaints" },
    { name: "Admin Credentials", icon: ShieldCheck, path: "/super-admin/admin-credentials" },
    { name: "Vendor Credentials", icon: UserCog, path: "/super-admin/vendor-credentials" },
    { name: "My Properties", icon: Building2, path: "/super-admin/my-properties" },
  ];

  const adminMenu = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/admin/property" },
    { name: "Vendor Dashboard", icon: Store, path: "/admin/vendor-dashboard" },
    { name: "Vendor Chat", icon: MessageSquare, path: "/admin/vendor-chat" },
    { name: "Properties", icon: Building2, path: "/admin/property" },
    { name: "User Complaints", icon: Siren, path: "/admin/property/complaints" },
    { name: "Vendor Credentials", icon: UserCog, path: "/admin/vendor-credentials" },
  ];

  const userMenu = [
  { name: "Home", icon: LayoutDashboard, path: "/" },
  { name: "Saved PGs", icon: Heart, path: "/user/home/saved" },
  { name: "Bookings", icon: Building2, path: "/user/home/bookings" },
  { name: "Chat", icon: MessageSquare, path: "/user/home/chat" },
  { name: "Profile", icon: User, path: "/user/home/profile" },
];

 const menu =
  role === "superadmin"
    ? superAdminMenu
    : role === "admin"
    ? adminMenu
    : userMenu;

  const sidebarWidth = isOpen ? 260 : 60;

  return (
    <>
      {/* ✅ MOBILE TOGGLE BUTTON */}
      {isMobile && !isUserRoute && (
        <button
          onClick={() => setIsOpen(!isOpen)}
          style={{
            position: "fixed",
top: 20,
right: 20,
boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
            zIndex: 10000,
            background: "#0F766E",
            color: "white",
            border: "none",
            padding: "10px",
            borderRadius: "8px",
          }}
        >
          ☰
        </button>
      )}

      {/* ✅ OVERLAY */}
      {isMobile && isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.4)",
            zIndex: 9998,
          }}
        />
      )}

      {/* ✅ SIDEBAR */}
      <div
        onMouseEnter={() => !isMobile && setIsOpen(true)}
        onMouseLeave={() => !isMobile && setIsOpen(false)}
        style={{
          width: isMobile && isUserRoute ? 0 : isMobile ? 260 : sidebarWidth,
          height: "100vh",
          backgroundColor: "#0F766E",
          color: "white",
          padding: "20px 10px",
          display: "flex",
          flexDirection: "column",
          position: "fixed",
          left: isMobile ? (isOpen ? 0 : -260) : 0, // ✅ KEY FIX
          top: 0,
          zIndex: 9999,
          transition: "all 0.3s ease",
          overflow: "hidden",
        }}
      >
        {/* LOGO */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "80px",
          }}
        >
          <img
            src="/pg_logo.png"
            alt="Logo"
            style={{
              height: isOpen || isMobile ? "70px" : "40px",
              transition: "0.3s ease",
            }}
          />
        </div>

        {/* MENU */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: "14px",
          }}
        >
          {menu.map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                key={index}
                onClick={() => {
                  router.push(item.path);
                  if (isMobile) setIsOpen(false); // ✅ close on click
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent:
                    isOpen || isMobile ? "flex-start" : "center",
                  width: "100%",
                  maxWidth: "200px",
                  gap: "10px",
                  cursor: "pointer",
                  background:
                    pathname === item.path
                      ? "rgba(255,255,255,0.15)"
                      : "transparent",
                  borderRadius: "8px",
                  padding: "10px",
                }}
              >
                <Icon size={isOpen || isMobile ? iconSize : 24} />
                <span style={{ display: isOpen || isMobile ? "inline" : "none" }}>
                  {item.name}
                </span>
              </div>
            );
          })}
        </div>

        {/* USER */}
     {/* USER (HIDE FOR NORMAL USER) */}
{role !== "user" && (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: "10px",
      backgroundColor: "#0D5F58",
      padding: "10px",
      borderRadius: "10px",
      opacity: isOpen || isMobile ? 1 : 0,
    }}
  >
    {role ? (
      <>
        <div
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            backgroundColor: "#0EA5E9",
          }}
        />
      <div>
  <p style={{ fontSize: "14px", fontWeight: "600" }}>
    {username}
  </p>
  <p style={{ fontSize: "12px", color: "#94A3B8" }}>
    {role === "superadmin"
      ? "Super Admin"
      : role === "admin"
      ? "Admin"
      : ""}
  </p>
</div>
        <LogOut
          size={18}
          style={{ marginLeft: "auto", cursor: "pointer" }}
          onClick={handleLogout}
        />
      </>
    ) : (
      <div
        onClick={() => router.push("/")}
        style={{ cursor: "pointer" }}
      >
        <User size={18} />
      </div>
    )}
  </div>
)}
     
      </div>
    </>
  );
}