"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "@/app/components/Sidebar";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [hasUserToken, setHasUserToken] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem("userToken");
      setHasUserToken(!!token);
    };

    checkToken();

    window.addEventListener("storage", checkToken);
    return () => window.removeEventListener("storage", checkToken);
  }, []);

  // ✅ ROUTES WHERE SIDEBAR SHOULD NOT SHOW
  const hideSidebarRoutes = ["/"];

  // ✅ FINAL LOGIC
  const showSidebar =
    hasUserToken && !hideSidebarRoutes.includes(pathname);

  return (
    <div>
      {/* ✅ SIDEBAR */}
      {showSidebar && <Sidebar />}

      {/* ✅ MAIN CONTENT */}
      <div
        style={{
          marginLeft: showSidebar ? "var(--sidebar-width)" : "0px",
          transition: "margin-left 0.3s ease",
          minHeight: "100vh",
          background: "#F8FAFC",
        }}
      >
        {children}
      </div>
    </div>
  );
}