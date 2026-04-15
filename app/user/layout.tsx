"use client";

import { useEffect } from "react";
import Sidebar from "@/app/components/Sidebar";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  // ✅ Ensure sidebar spacing works like admin
  useEffect(() => {
    const setInitialWidth = () => {
      const isMobile = window.innerWidth < 768;
      const width = isMobile ? 0 : 60; // collapsed sidebar default

      document.documentElement.style.setProperty(
        "--sidebar-width",
        `${width}px`
      );
    };

    setInitialWidth();
    window.addEventListener("resize", setInitialWidth);

    return () => window.removeEventListener("resize", setInitialWidth);
  }, []);

  return (
    <div className="flex">

      {/* 🔥 SIDEBAR */}
      <Sidebar />

      {/* 🔥 MAIN CONTENT (NO OVERLAP FIX) */}
      <div
        className="flex-1 min-h-screen bg-[#F8FAFC]"
        style={{
          marginLeft: "var(--sidebar-width)",
          transition: "margin-left 0.3s ease",
        }}
      >
        {children}
      </div>
    </div>
  );
}