"use client";

import {
  LayoutDashboard,
  Folder,
  User,
  Settings,
  Shield,
  LogOut,
  Building
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");

  const iconGap = "15px";
  const iconSize = 18;

  // 🔥 Sync login state
  useEffect(() => {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");

    setIsLoggedIn(!!token);
    setUsername(username || "");
  }, [pathname]);

  // 🔥 CRITICAL FIX: Sync sidebar width globally
  useEffect(() => {
    const width = isOpen ? 260 : 60;

    document.documentElement.style.setProperty(
      "--sidebar-width",
      `${width}px`
    );
  }, [isOpen]);

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setUsername("");
    router.push("/super-admin/login");
  };

  const sidebarWidth = isOpen ? 260 : 60;

  return (
    <div
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      style={{
        width: sidebarWidth,
        height: "100vh",
        backgroundColor: "#0F766E",
        color: "white",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        position: "fixed",
        left: 0,
        top: 0,
        zIndex: 1000,
        transition: "0.3s"
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
      height: isOpen ? "70px" : "40px",
      width: "auto",
      objectFit: "contain",
      transition: "0.3s ease",
    }}
  />
</div>

      {/* MENU */}
      <div>
        <div style={{ display: "flex", flexDirection: "column", gap: isOpen ? iconGap : "30px" }}>
          
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <LayoutDashboard size={isOpen ? iconSize : 30} />
            <span style={{ display: isOpen ? "inline" : "none" }}>Dashboard</span>
          </div>

          <div
            onClick={() => router.push("/super-admin/admin-credentials")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              cursor: "pointer",
              background:
                pathname === "/super-admin/admin-credentials"
                  ? "rgba(255,255,255,0.15)"
                  : "transparent",
              borderRadius: "8px"
            }}
          >
            <Shield size={isOpen ? iconSize : 30} />
            <span style={{ display: isOpen ? "inline" : "none" }}>
              Admin Credential
            </span>
          </div>

          <div
            onClick={() => router.push("/super-admin/my-properties")}
            style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}
          >
            <Building size={isOpen ? iconSize : 30} />
            <span style={{ display: isOpen ? "inline" : "none" }}>
              My Properties
            </span>
          </div>
        </div>

        {/* OTHER */}
        <div style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: isOpen ? iconGap : "30px" }}>
          <div style={{ display: "flex", gap: "10px" }}>
            <Folder size={isOpen ? iconSize : 30} />
            <span style={{ display: isOpen ? "inline" : "none" }}>Projects</span>
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <User size={isOpen ? iconSize : 30} />
            <span style={{ display: isOpen ? "inline" : "none" }}>Profile</span>
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <Settings size={isOpen ? iconSize : 30} />
            <span style={{ display: isOpen ? "inline" : "none" }}>Settings</span>
          </div>
        </div>
      </div>

      {/* USER */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          backgroundColor: "#0D5F58",
          padding: "10px",
          borderRadius: "10px",
          opacity: isOpen ? 1 : 0
        }}
      >
        {isLoggedIn ? (
          <>
            <div style={{ width: "40px", height: "40px", borderRadius: "50%", backgroundColor: "#0EA5E9" }} />
            <div>
              <p>{username || "User"}</p>
              <p style={{ fontSize: "12px", color: "#94A3B8" }}>PG Admin</p>
            </div>
            <LogOut size={18} style={{ marginLeft: "auto", cursor: "pointer" }} onClick={handleLogout} />
          </>
        ) : (
          <div onClick={() => router.push("/super-admin/login")} style={{ cursor: "pointer" }}>
            <User size={18} />
          </div>
        )}
      </div>
    </div>
  );
}